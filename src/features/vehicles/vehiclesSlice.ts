import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import { Vehicle, VehiclesQuery, VehiclesState } from "./type";


const initialState: VehiclesState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  loading: false,
  refreshing: false,
  error: null,
  filters: {},
};

export const fetchVehicles = createAsyncThunk<
  { vehicles: Vehicle[]; total: number; page: number; limit: number; append: boolean },
  { initial?: boolean; refresh?: boolean; append?: boolean; mode?: "silent" } | undefined,
  { state: RootState }
>("vehicles/fetch", async (arg, { getState }) => {
  const { vehicles } = getState();
  const { filters, page, limit } = vehicles;
  const nextPage = arg?.append ? page + 1 : 1;
  const offset = (nextPage - 1) * limit;

  const params: VehiclesQuery = {
    ...filters,
    limit,
    offset,
  };

  const res = await http.get("/vehicles", { params });
  // API trả: { success, data: { vehicles, total, page, limit } }
  const data = res.data?.data ?? {};
  return {
    vehicles: (data.vehicles ?? []) as Vehicle[],
    total: data.total ?? 0,
    page: data.page ?? nextPage,
    limit: data.limit ?? limit,
    append: !!arg?.append,
  };
});

const slice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setFilters(state, action: { payload: VehiclesState["filters"] }) {
      state.filters = action.payload;
      state.page = 1;
    },
    setSearch(state, action: { payload: string }) {
      state.filters.search = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    setLimit(state, action: { payload: number }) {
      state.limit = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchVehicles.pending, (s, a) => {
      const append = (a.meta.arg as any)?.append;
      s.error = null;
      s.loading = !append;
      s.refreshing = !!append; // dùng làm “đang tải trang sau”
    });
    b.addCase(fetchVehicles.fulfilled, (s, a) => {
      s.loading = false;
      s.refreshing = false;
      s.total = a.payload.total;
      s.page = a.payload.page;
      s.limit = a.payload.limit;
      s.items = a.payload.append ? [...s.items, ...a.payload.vehicles] : a.payload.vehicles;
    });
    b.addCase(fetchVehicles.rejected, (s, a) => {
      s.loading = false;
      s.refreshing = false;
      s.error = a.error.message ?? "Failed to load vehicles";
    });
  },
});

export const { setFilters, setSearch, resetFilters, setLimit } = slice.actions;
export default slice.reducer;

// selectors
export const selectVehicles = (s: RootState) => s.vehicles.items;
export const selectVehiclesLoading = (s: RootState) => s.vehicles.loading;
export const selectVehiclesRefreshing = (s: RootState) => s.vehicles.refreshing;
export const selectVehiclesMeta = (s: RootState) => ({
  total: s.vehicles.total,
  page: s.vehicles.page,
  limit: s.vehicles.limit,
  filters: s.vehicles.filters,
});
