import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { DMStaff, CreateStaffBody, UpdateStaffBody } from "./types";

const API = {
  list:   "/users",
  detail: (id: string) => `/users/${id}`,
  create: "/users",
  update: (id: string) => `/users/${id}`,
  remove: (id: string) => `/users/${id}`,
};

type State = {
  items: DMStaff[];
  loading: boolean;
  error: string | null;
  detail: Record<string, DMStaff | undefined>;
  detailLoading: boolean;
};

const initial: State = { items: [], loading: false, error: null, detail: {}, detailLoading: false };

// --- GET all dealer staffs ---
export const fetchDMStaffs = createAsyncThunk<DMStaff[]>(
  "dmStaffs/fetch",
  async () => {
    const res = await http.get<{ success: boolean; data: { users: DMStaff[] } }>(
      `${API.list}?role=DEALER_STAFF&limit=50&offset=0`
    );
    return res.data.data.users;
  }
);

// --- GET staff by ID ---
export const fetchDMStaffById = createAsyncThunk<DMStaff, { id: string }>(
  "dmStaffs/fetchById",
  async ({ id }) => {
    const res = await http.get<{ success: boolean; data: { user: DMStaff } }>(API.detail(id));
    return res.data.data.user;
  }
);

// --- CREATE staff ---
export const createDMStaff = createAsyncThunk<DMStaff, CreateStaffBody>(
  "dmStaffs/create",
  async (body) => {
    const res = await http.post<{ success: boolean; data: { user: DMStaff } }>(API.create, body);
    return res.data.data.user;
  }
);

// 🔁 PATCH
export const updateDMStaff = createAsyncThunk<DMStaff, { id: string; body: UpdateStaffBody }>(
  "dmStaffs/update",
  async ({ id, body }) =>
    (await http.patch<{ success: boolean; data: { user: DMStaff } }>(API.update(id), body)).data.data.user
);

// --- DELETE staff ---
export const deleteDMStaff = createAsyncThunk<string, { id: string }>(
  "dmStaffs/delete",
  async ({ id }) => {
    await http.delete(API.remove(id));
    return id;
  }
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
  },
});

export default slice.reducer;

export const selectDMStaffs = (s: RootState) => s.dmStaffs.items;
export const selectDMStaffsLoading = (s: RootState) => s.dmStaffs.loading;
export const selectDMStaffDetail = (id: string) => (s: RootState) => s.dmStaffs.detail[id];
export const selectDMStaffDetailLoading = (s: RootState) => s.dmStaffs.detailLoading;
