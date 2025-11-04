// src/features/dealerManager/inventory/inventorySlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState, ThunkExtra } from "../../../store";

// ===== Types =====
export type InventoryItem = {
  id: string;                     // inventory row id
  vehicle_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  created_at: string;
  updated_at: string;
  vehicle?: {
    id: string;
    model: string;
    version?: string | null;
    color?: string | null;
    msrp?: number | null;
    image_url?: string | null;
  };
};

export type VehicleDetail = {
  id: string;
  model: string;
  version?: string | null;
  color?: string | null;
  msrp?: number | null;
  features?: { motor?: string; seats?: number; battery?: string; drivetrain?: string };
  status?: "ACTIVE" | "INACTIVE" | string;
  year?: number | null;
  description?: string | null;
  image_url?: string | null;
  gallery?: string[] | null;
  specs?: { id: string; spec_name: string; spec_value: string }[] | null;
};

type ListState = {
  items: InventoryItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  search?: string;
};

type DetailState = {
  data: VehicleDetail | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
};

type State = {
  list: ListState;
  detail: DetailState;
  stats: {
    data: Stats | null;
    loading: boolean;
    error: string | null;
  };
  lowStock: {
    items: LowStockItem[];
    loading: boolean;
    error: string | null;
  };
};
type Stats = {
  total_models: number;
  total_quantity: number;
  total_reserved: number;
  total_available: number;
};

type LowStockItem = {
  id: string;              // inventory id
  vehicle_id: string;
  available_quantity: number;
  threshold?: number | null;
  vehicle?: { id: string; model: string; version?: string | null; color?: string | null };
};
const initialState: State = {
  list: { items: [], loading: false, refreshing: false, error: null, search: "" },
  detail: { data: null, loading: false, saving: false, deleting: false, error: null },
  stats: { data: null, loading: false, error: null },
  lowStock: { items: [], loading: false, error: null },
};

// ===== Thunks (API) =====
// GET /inventory
export const fetchInventory = createAsyncThunk<InventoryItem[], void, { extra: ThunkExtra }>(
  "dmInventory/fetchInventory",
  async (_, { extra: { http } }) => {
    const res = await http.get<{ success: true; data: { inventory: InventoryItem[] } }>("/inventory");
    return res.data.data.inventory ?? [];
  }
);

// GET /vehicles/:id  (lấy detail xe đầy đủ)
export const fetchVehicleDetail = createAsyncThunk<VehicleDetail, string, { extra: ThunkExtra }>(
  "dmInventory/fetchVehicleDetail",
  async (vehicleId, { extra: { http } }) => {
    const res = await http.get<{ success: true; data: { vehicle: VehicleDetail } }>(`/vehicles/${vehicleId}`);
    return res.data.data.vehicle;
  }
);

// PUT /vehicles/:id  (sửa thông tin xe)
export const updateVehicle = createAsyncThunk<
  VehicleDetail,
  { vehicleId: string; body: Partial<VehicleDetail> },
  { extra: ThunkExtra }
>(
  "dmInventory/updateVehicle",
  async ({ vehicleId, body }, { extra: { http } }) => {
    const res = await http.put<{ success: true; data: { vehicle: VehicleDetail } }>(`/vehicles/${vehicleId}`, body);
    return res.data.data.vehicle;
  }
);

// POST /vehicles  (tạo xe mới)
export const createVehicle = createAsyncThunk<VehicleDetail, Partial<VehicleDetail>, { extra: ThunkExtra }>(
  "dmInventory/createVehicle",
  async (body, { extra: { http } }) => {
    const res = await http.post<{ success: true; data: { vehicle: VehicleDetail } }>("/vehicles", body);
    return res.data.data.vehicle;
  }
);

// DELETE /vehicles/:id
export const deleteVehicle = createAsyncThunk<{ vehicleId: string }, string, { extra: ThunkExtra }>(
  "dmInventory/deleteVehicle",
  async (vehicleId, { extra: { http } }) => {
    await http.delete(`/vehicles/${vehicleId}`);
    return { vehicleId };
  }
);
// GET /inventory/statistics
export const fetchInventoryStats = createAsyncThunk<Stats, void, { extra: ThunkExtra }>(
  "dmInventory/fetchInventoryStats",
  async (_, { extra: { http } }) => {
    const res = await http.get<{ success: true; data: Stats }>("/inventory/statistics");
    return res.data.data;
  }
);

// GET /inventory/low-stock
export const fetchLowStock = createAsyncThunk<LowStockItem[], void, { extra: ThunkExtra }>(
  "dmInventory/fetchLowStock",
  async (_, { extra: { http } }) => {
    const res = await http.get<{ success: true; data: { items: LowStockItem[] } }>("/inventory/low-stock");
    return res.data.data.items ?? [];
  }
);

// ===== Slice =====
const slice = createSlice({
  name: "dmInventory",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.list.search = action.payload;
    },
    resetDetail(state) {
      state.detail = { data: null, loading: false, saving: false, deleting: false, error: null };
    },
  },
  extraReducers: (b) => {
    // List
    b.addCase(fetchInventory.pending, (s) => { s.list.loading = s.list.items.length === 0; s.list.refreshing = s.list.items.length > 0; s.list.error = null; });
    b.addCase(fetchInventory.fulfilled, (s, a) => { s.list.loading = false; s.list.refreshing = false; s.list.items = a.payload; });
    b.addCase(fetchInventory.rejected, (s, a) => { s.list.loading = false; s.list.refreshing = false; s.list.error = a.error.message ?? "Failed"; });

    // Detail
    b.addCase(fetchVehicleDetail.pending, (s) => { s.detail.loading = true; s.detail.error = null; });
    b.addCase(fetchVehicleDetail.fulfilled, (s, a) => { s.detail.loading = false; s.detail.data = a.payload; });
    b.addCase(fetchVehicleDetail.rejected, (s, a) => { s.detail.loading = false; s.detail.error = a.error.message ?? "Failed"; });

    // Update
    b.addCase(updateVehicle.pending, (s) => { s.detail.saving = true; s.detail.error = null; });
    b.addCase(updateVehicle.fulfilled, (s, a) => { s.detail.saving = false; s.detail.data = a.payload; });
    b.addCase(updateVehicle.rejected, (s, a) => { s.detail.saving = false; s.detail.error = a.error.message ?? "Failed"; });

    // Create
    b.addCase(createVehicle.fulfilled, (s, a) => {
      // không tự push vào inventory list vì API /inventory trả item khác (có quantity)
      // điều hướng về detail sau khi tạo (thực hiện ở screen)
      s.detail.data = a.payload;
    });

    // Delete
    b.addCase(deleteVehicle.pending, (s) => { s.detail.deleting = true; s.detail.error = null; });
    b.addCase(deleteVehicle.fulfilled, (s) => { s.detail.deleting = false; s.detail.data = null; });
    b.addCase(deleteVehicle.rejected, (s, a) => { s.detail.deleting = false; s.detail.error = a.error.message ?? "Failed"; });

    // Stats
    b.addCase(fetchInventoryStats.pending, (s) => { s.stats.loading = true; s.stats.error = null; });
    b.addCase(fetchInventoryStats.fulfilled, (s, a) => { s.stats.loading = false; s.stats.data = a.payload; });
    b.addCase(fetchInventoryStats.rejected, (s, a) => { s.stats.loading = false; s.stats.error = a.error.message ?? "Failed"; });

    // Low stock
    b.addCase(fetchLowStock.pending, (s) => { s.lowStock.loading = true; s.lowStock.error = null; });
    b.addCase(fetchLowStock.fulfilled, (s, a) => { s.lowStock.loading = false; s.lowStock.items = a.payload; });
    b.addCase(fetchLowStock.rejected, (s, a) => { s.lowStock.loading = false; s.lowStock.error = a.error.message ?? "Failed"; });
  }
});

export default slice.reducer;
export const { setSearch, resetDetail } = slice.actions;

// Selectors
export const selectDmInvItems      = (s: RootState) => s.dmInventory.list.items;
export const selectDmInvLoading    = (s: RootState) => s.dmInventory.list.loading;
export const selectDmInvRefreshing = (s: RootState) => s.dmInventory.list.refreshing;
export const selectDmInvSearch     = (s: RootState) => s.dmInventory.list.search ?? "";

export const selectDmInvDetail     = (s: RootState) => s.dmInventory.detail.data;
export const selectDmInvDetailLoading  = (s: RootState) => s.dmInventory.detail.loading;
export const selectDmInvDetailSaving   = (s: RootState) => s.dmInventory.detail.saving;
export const selectDmInvDetailDeleting = (s: RootState) => s.dmInventory.detail.deleting;

export const selectDmInvStats       = (s: RootState) => s.dmInventory.stats.data;
export const selectDmInvStatsLoad   = (s: RootState) => s.dmInventory.stats.loading;
export const selectDmInvLowStock    = (s: RootState) => s.dmInventory.lowStock.items;
export const selectDmInvLowStockLoad= (s: RootState) => s.dmInventory.lowStock.loading;