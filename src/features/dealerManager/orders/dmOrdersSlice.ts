// src/features/dm/orders/dmOrdersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { CreateDMOrderBody, DMOrder, UpdateDMOrderStatusBody, UploadPaymentBody } from "./types";

const API = {
  list:   "/api/v1/dealer/orders",
  create: "/api/v1/dealer/orders",
  detail: (id: string) => `/api/v1/dealer/orders/${id}`,
  status: (id: string) => `/api/v1/dealer/orders/${id}/status`,
  pay:    (id: string) => `/api/v1/dealer/orders/${id}/payments`,
  receive:(id: string) => `/api/v1/dealer/orders/${id}/receive`,
  addToInventory: (id: string) => `/api/v1/dealer/orders/${id}/add-to-inventory`,
};

type State = {
  items: DMOrder[];
  loading: boolean;
  error: string | null;

  detail: Record<string, DMOrder | undefined>;
  detailLoading: boolean;
};
const initial: State = { items: [], loading: false, error: null, detail: {}, detailLoading: false };

export const fetchDMOrders = createAsyncThunk<DMOrder[]>(
  "dmOrders/fetch",
  async () => (await http.get<{ success: boolean; data: { orders: DMOrder[] } }>(API.list)).data.data.orders
);

export const fetchDMOrderById = createAsyncThunk<DMOrder, { id: string }>(
  "dmOrders/fetchById",
  async ({ id }) => (await http.get<{ success: boolean; data: { order: DMOrder } }>(API.detail(id))).data.data.order
);

export const createDMOrder = createAsyncThunk<DMOrder, CreateDMOrderBody>(
  "dmOrders/create",
  async (body) => (await http.post<{ success: boolean; data: { order: DMOrder } }>(API.create, body)).data.data.order
);

// EVM duyệt & trả quote -> Dealer Manager accept/reject bằng update status
export const updateDMOrderStatus = createAsyncThunk<DMOrder, { id: string; body: UpdateDMOrderStatusBody }>(
  "dmOrders/updateStatus",
  async ({ id, body }) => (await http.post<{ success: boolean; data: { order: DMOrder } }>(API.status(id), body)).data.data.order
);

export const uploadDMPayment = createAsyncThunk<DMOrder, { id: string; body: UploadPaymentBody }>(
  "dmOrders/uploadPayment",
  async ({ id, body }) => (await http.post<{ success: boolean; data: { order: DMOrder } }>(API.pay(id), body)).data.data.order
);

// Mark received (khi hàng đã tới)
export const markDMOrderReceived = createAsyncThunk<DMOrder, { id: string }>(
  "dmOrders/receive",
  async ({ id }) => (await http.post<{ success: boolean; data: { order: DMOrder } }>(API.receive(id), {})).data.data.order
);

// Convert order items -> inventory
export const addDMOrderToInventory = createAsyncThunk<{ count: number }, { id: string }>(
  "dmOrders/addToInventory",
  async ({ id }) => (await http.post<{ success: boolean; data: { count: number } }>(API.addToInventory(id), {})).data.data
);

const slice = createSlice({
  name: "dmOrders",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDMOrders.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchDMOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchDMOrders.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed"; });

    b.addCase(fetchDMOrderById.pending, (s) => { s.detailLoading = true; });
    b.addCase(fetchDMOrderById.fulfilled, (s, a) => { s.detailLoading = false; s.detail[a.payload.id] = a.payload; });
    b.addCase(fetchDMOrderById.rejected, (s) => { s.detailLoading = false; });

    // mutate list & cache on actions
    const upsert = (s: any, order: DMOrder) => {
      s.items = [order, ...s.items.filter((x: DMOrder) => x.id !== order.id)];
      s.detail[order.id] = order;
    };

    b.addCase(createDMOrder.fulfilled, (s, a) => upsert(s, a.payload));
    b.addCase(updateDMOrderStatus.fulfilled, (s, a) => upsert(s, a.payload));
    b.addCase(uploadDMPayment.fulfilled, (s, a) => upsert(s, a.payload));
    b.addCase(markDMOrderReceived.fulfilled, (s, a) => upsert(s, a.payload));
  }
});

export default slice.reducer;
export const selectDMOrders = (s: RootState) => s.dmOrders.items;
export const selectDMOrdersLoading = (s: RootState) => s.dmOrders.loading;
export const selectDMOrderDetail = (id: string) => (s: RootState) => s.dmOrders.detail[id];
export const selectDMOrderDetailLoading = (s: RootState) => s.dmOrders.detailLoading;
