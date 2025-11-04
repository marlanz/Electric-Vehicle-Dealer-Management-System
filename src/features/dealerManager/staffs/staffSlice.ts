// src/features/dealerManager/staffs/staffSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { DMStaff, CreateStaffBody, UpdateStaffBody } from "./types";

const API = {
  list:   "/api/v1/dealer-staffs",
  create: "/api/v1/dealer-staffs",
  detail: (id: string) => `/api/v1/dealer-staffs/${id}`,
  update: (id: string) => `/api/v1/dealer-staffs/${id}`,
  remove: (id: string) => `/api/v1/dealer-staffs/${id}`,
};

type State = {
  items: DMStaff[];
  loading: boolean;
  error: string | null;
  detail: Record<string, DMStaff | undefined>;
  detailLoading: boolean;
};
const initial: State = { items: [], loading: false, error: null, detail: {}, detailLoading: false };

export const fetchDMStaffs = createAsyncThunk<DMStaff[]>(
  "dmStaffs/fetch",
  async () => (await http.get<{ success: boolean; data: { staffs: DMStaff[] } }>(API.list)).data.data.staffs
);

export const fetchDMStaffById = createAsyncThunk<DMStaff, { id: string }>(
  "dmStaffs/fetchById",
  async ({ id }) => (await http.get<{ success: boolean; data: { staff: DMStaff } }>(API.detail(id))).data.data.staff
);

export const createDMStaff = createAsyncThunk<DMStaff, CreateStaffBody>(
  "dmStaffs/create",
  async (body) => (await http.post<{ success: boolean; data: { staff: DMStaff } }>(API.create, body)).data.data.staff
);

export const updateDMStaff = createAsyncThunk<DMStaff, { id: string; body: UpdateStaffBody }>(
  "dmStaffs/update",
  async ({ id, body }) => (await http.put<{ success: boolean; data: { staff: DMStaff } }>(API.update(id), body)).data.data.staff
);

export const deleteDMStaff = createAsyncThunk<string, { id: string }>(
  "dmStaffs/delete",
  async ({ id }) => { await http.delete(API.remove(id)); return id; }
);

const slice = createSlice({
  name: "dmStaffs",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDMStaffs.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchDMStaffs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchDMStaffs.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed to load"; });

    b.addCase(fetchDMStaffById.pending, (s) => { s.detailLoading = true; });
    b.addCase(fetchDMStaffById.fulfilled, (s, a) => { s.detailLoading = false; s.detail[a.payload.id] = a.payload; });
    b.addCase(fetchDMStaffById.rejected, (s) => { s.detailLoading = false; });

    b.addCase(createDMStaff.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateDMStaff.fulfilled, (s, a) => {
      s.items = s.items.map(x => x.id === a.payload.id ? a.payload : x);
      s.detail[a.payload.id] = a.payload;
    });
    b.addCase(deleteDMStaff.fulfilled, (s, a: PayloadAction<string>) => {
      s.items = s.items.filter(x => x.id !== a.payload);
      delete s.detail[a.payload];
    });
  }
});

export default slice.reducer;

export const selectDMStaffs = (s: RootState) => s.dmStaffs.items;
export const selectDMStaffsLoading = (s: RootState) => s.dmStaffs.loading;
export const selectDMStaffDetail = (id: string) => (s: RootState) => s.dmStaffs.detail[id];
export const selectDMStaffDetailLoading = (s: RootState) => s.dmStaffs.detailLoading;
