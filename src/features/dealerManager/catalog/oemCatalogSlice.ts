// src/features/dealerManager/catalog/oemCatalogSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";

export type OEMVehicle = {
  id: string;
  model: string;
  version?: string | null;
  color?: string | null;
  msrp?: string | null;
  year?: number | null;
  status?: string | null;
  image_url?: string | null;
};

type State = { items: OEMVehicle[]; loading: boolean; error: string | null; };
const initial: State = { items: [], loading: false, error: null };

export const fetchOEMCatalog = createAsyncThunk<OEMVehicle[], { search?: string } | void>(
  "oemCatalog/fetch",
  async (params) => {
    const p = new URLSearchParams();
    if (params?.search) p.set("search", params.search);
    // lấy all vehicles (hoặc status=ACTIVE nếu BE hỗ trợ)
    const url = `/api/v1/vehicles${p.size ? `?${p.toString()}` : ""}`;
    const res = await http.get<{ success: boolean; data: { vehicles: OEMVehicle[] } }>(url);
    return res.data.data.vehicles ?? [];
  }
);

const slice = createSlice({
  name: "oemCatalog",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOEMCatalog.pending,   (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchOEMCatalog.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchOEMCatalog.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed"; });
  }
});

export default slice.reducer;
export const selectOEMCatalog = (s: RootState) => s.oemCatalog.items;
export const selectOEMCatalogLoading = (s: RootState) => s.oemCatalog.loading;
