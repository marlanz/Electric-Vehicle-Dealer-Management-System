// src/features/customers/customersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { CustomerLite, CustomerCreatePayload } from "./type";

export type FetchParams = { search?: string; limit?: number; offset?: number };

type CustomersState = {
  items: CustomerLite[];
  total: number | null;
  loading: boolean;
  error: string | null;
  // UI params (để có thể “remember” query giữa các màn)
  params: FetchParams;
};

const initialState: CustomersState = {
  items: [],
  total: null,
  loading: false,
  error: null,
  params: { search: "", limit: 50, offset: 0 },
};

export const fetchCustomers = createAsyncThunk<
  { customers: CustomerLite[]; total?: number | null; params: FetchParams },
  FetchParams | void,
  { state: RootState }
>("customers/fetch", async (maybeParams, { getState, rejectWithValue }) => {
  try {
    const state = getState().customers;
    const p: FetchParams = {
      search: maybeParams?.search ?? state.params.search ?? "",
      limit: maybeParams?.limit ?? state.params.limit ?? 50,
      offset: maybeParams?.offset ?? state.params.offset ?? 0,
    };

    const qs = new URLSearchParams();
    if (p.search) qs.set("search", p.search.trim());
    if (p.limit != null) qs.set("limit", String(p.limit));
    if (p.offset != null) qs.set("offset", String(p.offset));

    const res = await http.get("/customers?" + qs.toString());
    const data = res.data?.data;
    return {
      customers: data?.customers ?? [],
      total: data?.total ?? null,
      params: p,
    };
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Fetch customers failed");
  }
});

export const createCustomer = createAsyncThunk<
  { customer: CustomerLite },
  CustomerCreatePayload
>("customers/create", async (body, { rejectWithValue }) => {
  try {
    const res = await http.post("/customers", {
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      id_no: body.id_no,
      dob: body.dob,
      notes: body.notes,
    });
    // API trả: { customerId, fullName, phone, email }
    const c = res.data?.data?.customer;
    const normalized: CustomerLite = {
      customerId: c.customerId,
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
    };
    return { customer: normalized };
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Create customer failed");
  }
});

const slice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<Partial<FetchParams>>) {
      state.params = { ...state.params, ...action.payload };
    },
    clearCustomers(state) {
      state.items = [];
      state.total = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCustomers.pending, (s, a) => {
      s.loading = true;
      s.error = null;
      // nếu gọi với params mới, cập nhật luôn
      const arg = a.meta.arg;
      if (arg) s.params = { ...s.params, ...arg };
    });
    b.addCase(fetchCustomers.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload.customers;
      s.total = a.payload.total ?? null;
      s.params = a.payload.params;
    });
    b.addCase(fetchCustomers.rejected, (s, a) => {
      s.loading = false;
      s.error = String(a.payload ?? a.error.message ?? "Error");
    });

    b.addCase(createCustomer.fulfilled, (s, a) => {
      // optionally unshift để thấy ngay
      s.items = [a.payload.customer, ...s.items];
      if (typeof s.total === "number") s.total += 1;
    });
  },
});

export const { setParams, clearCustomers } = slice.actions;
export default slice.reducer;

// Selectors
export const selectCustomersState = (s: RootState) => s.customers;
export const selectCustomers = (s: RootState) => s.customers.items;
export const selectCustomersLoading = (s: RootState) => s.customers.loading;
export const selectCustomersParams = (s: RootState) => s.customers.params;
export const selectCustomersError = (s: RootState) => s.customers.error;
