// src/features/dealerManager/inventory/inventorySlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { DMInventoryItem, CreateInventoryBody, UpdateInventoryBody } from "./types";

const API = {
  list:   "/api/v1/dealer/inventory",
  create: "/api/v1/dealer/inventory",
  detail: (id: string) => `/api/v1/dealer/inventory/${id}`,
  update: (id: string) => `/api/v1/dealer/inventory/${id}`,
  remove: (id: string) => `/api/v1/dealer/inventory/${id}`,
};

type State = {
  items: DMInventoryItem[];
  loading: boolean;
  error: string | null;
  detail: Record<string, DMInventoryItem | undefined>;
};
const initial: State = { items: [], loading: false, error: null, detail: {} };

export const fetchDMInventory = createAsyncThunk<DMInventoryItem[]>(
  "dmInventory/fetch",
  async () => (await http.get<{ success: boolean; data: { items: DMInventoryItem[] } }>(API.list)).data.data.items
);

export const fetchDMInventoryById = createAsyncThunk<DMInventoryItem, { id: string }>(
  "dmInventory/fetchById",
  async ({ id }) => (await http.get<{ success: boolean; data: { item: DMInventoryItem } }>(API.detail(id))).data.data.item
);

export const createDMInventory = createAsyncThunk<DMInventoryItem, CreateInventoryBody>(
  "dmInventory/create",
  async (body) => (await http.post<{ success: boolean; data: { item: DMInventoryItem } }>(API.create, body)).data.data.item
);

export const updateDMInventory = createAsyncThunk<DMInventoryItem, { id: string; body: UpdateInventoryBody }>(
  "dmInventory/update",
  async ({ id, body }) => (await http.put<{ success: boolean; data: { item: DMInventoryItem } }>(API.update(id), body)).data.data.item
);

export const deleteDMInventory = createAsyncThunk<string, { id: string }>(
  "dmInventory/delete",
  async ({ id }) => { await http.delete(API.remove(id)); return id; }
);

const slice = createSlice({
  name: "dmInventory",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDMInventory.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchDMInventory.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchDMInventory.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed"; });

    b.addCase(fetchDMInventoryById.fulfilled, (s, a) => { s.detail[a.payload.id] = a.payload; });
    b.addCase(createDMInventory.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateDMInventory.fulfilled, (s, a) => {
      s.items = s.items.map(x => x.id === a.payload.id ? a.payload : x);
      s.detail[a.payload.id] = a.payload;
    });
    b.addCase(deleteDMInventory.fulfilled, (s, a: PayloadAction<string>) => {
      s.items = s.items.filter(x => x.id !== a.payload);
      delete s.detail[a.payload];
    });
  }
});

export default slice.reducer;
export const selectDMInventory = (s: RootState) => s.dmInventory.items;
export const selectDMInventoryLoading = (s: RootState) => s.dmInventory.loading;
