// src/features/evmStaff/ordersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store";
import { http } from "@/src/services/http";
import { FIXED_DEALER_ID } from "@/src/utils/dealer";

export type OrderDto = {
  id: string;
  dealer_id: string;
  customer_id: string;
  vehicle_id: string;
  promotion_id?: string | null;
  quote_id?: string | null;
  payment_method?: string | null;
  price?: number | null;
  status: string;
  note?: string | null;
  order_date?: string | null;
  created_at: string;
  updated_at: string;
  vin?: string | null;
  handover_date?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  vehicle_model?: string | null;
  vehicle_version?: string | null;
  vehicle_color?: string | null;
  dealer_name?: string | null;
  dealer_code?: string | null;
  promotion_name?: string | null;
  promotion_type?: string | null;
  promotion_value?: number | null;
};

export type OrdersQuery = {
  dealer_id?: string;
  customer_id?: string;
  status?: string;
  status_group?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;                     // <-- có 'search'
  sort_by?: "created_at" | "order_date";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

type OrdersState = {
  items: OrderDto[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error?: string;
  query: OrdersQuery;
  hasMore: boolean;

  // ---- Detail state (thêm mới)
  detail?: OrderDto | null;
  detailLoading: boolean;
};

const initial: OrdersState = {
  items: [],
  loading: false,
  refreshing: false,
  loadingMore: false,
  query: {
    page: 1,
    limit: 20,
    sort_by: "created_at",
    sort_order: "desc",
    dealer_id: FIXED_DEALER_ID,
    search: "",
  },
  hasMore: true,

  // ---- Detail
  detail: null,
  detailLoading: false,
};

// ============ LIST ============
export const fetchEvmOrders = createAsyncThunk<OrderDto[], void, { state: RootState }>(
  "evmOrders/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { query } = getState().evmOrders;
      const res = await http.get("/orders", { params: query }); // baseURL KHÔNG nên có /api/v1 lặp
      return res.data?.data?.orders ?? [];
    } catch (e: any) {
      return rejectWithValue(e?.message || "Fetch orders failed");
    }
  }
);

export const refreshEvmOrders = createAsyncThunk<OrderDto[], void, { state: RootState }>(
  "evmOrders/refresh",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { query } = getState().evmOrders;
      const res = await http.get("/orders", { params: { ...query, page: 1 } });
      return res.data?.data?.orders ?? [];
    } catch (e: any) {
      return rejectWithValue(e?.message || "Refresh failed");
    }
  }
);

export const loadMoreEvmOrders = createAsyncThunk<OrderDto[], void, { state: RootState }>(
  "evmOrders/loadMore",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { query } = getState().evmOrders;
      const nextPage = (query.page ?? 1) + 1;
      const res = await http.get("/orders", { params: { ...query, page: nextPage } });
      return res.data?.data?.orders ?? [];
    } catch (e: any) {
      return rejectWithValue(e?.message || "Load more failed");
    }
  }
);

// ============ DETAIL (thêm mới) ============
export const fetchEvmOrderDetail = createAsyncThunk<OrderDto, string>(
  "evmOrders/detail/fetch",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await http.get(`/orders/${orderId}`);
      // BE trả về { data: { order: {...} } } hoặc { data: order }
      const data = res.data?.data?.order ?? res.data?.data ?? res.data;
      return data as OrderDto;
    } catch (e: any) {
      return rejectWithValue(e?.message || "Fetch order detail failed");
    }
  }
);

export const refreshEvmOrderDetail = createAsyncThunk<OrderDto, string>(
  "evmOrders/detail/refresh",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await http.get(`/orders/${orderId}`);
      const data = res.data?.data?.order ?? res.data?.data ?? res.data;
      return data as OrderDto;
    } catch (e: any) {
      return rejectWithValue(e?.message || "Refresh order detail failed");
    }
  }
);

const slice = createSlice({
  name: "evmOrders",
  initialState: initial,
  reducers: {
    setOrdersQuery(s, a: PayloadAction<Partial<OrdersQuery>>) {
      s.query = { ...s.query, ...a.payload, page: 1 };
      s.hasMore = true;
    },
    setOrdersPage(s, a: PayloadAction<number>) {
      s.query.page = a.payload;
    },
    clearOrders(s) {
      s.items = [];
      s.hasMore = true;
    },
    // Detail helpers
    clearOrderDetail(s) {
      s.detail = null;
    },
  },
  extraReducers: (b) => {
    // LIST
    b.addCase(fetchEvmOrders.pending,    (s) => { s.loading = true; s.error = undefined; });
    b.addCase(fetchEvmOrders.fulfilled,  (s, a) => {
      s.loading = false;
      s.items = a.payload;
      const limit = s.query.limit ?? 50;
      s.hasMore = a.payload.length >= limit;
      s.query.page = 1;
    });
    b.addCase(fetchEvmOrders.rejected,   (s, a) => { s.loading = false; s.error = String(a.payload || a.error.message); });

    b.addCase(refreshEvmOrders.pending,  (s) => { s.refreshing = true; });
    b.addCase(refreshEvmOrders.fulfilled,(s, a) => {
      s.refreshing = false;
      s.items = a.payload;
      const limit = s.query.limit ?? 50;
      s.hasMore = a.payload.length >= limit;
      s.query.page = 1;
    });
    b.addCase(refreshEvmOrders.rejected, (s) => { s.refreshing = false; });

    b.addCase(loadMoreEvmOrders.pending,  (s) => { s.loadingMore = true; });
    b.addCase(loadMoreEvmOrders.fulfilled, (s, a) => {
      s.loadingMore = false;
      if (a.payload.length === 0) { s.hasMore = false; return; }
      s.items = s.items.concat(a.payload);
      s.query.page = (s.query.page ?? 1) + 1;
      const limit = s.query.limit ?? 50;
      if (a.payload.length < limit) s.hasMore = false;
    });
    b.addCase(loadMoreEvmOrders.rejected, (s) => { s.loadingMore = false; });

    // DETAIL
    b.addCase(fetchEvmOrderDetail.pending,   (s) => { s.detailLoading = true; });
    b.addCase(fetchEvmOrderDetail.fulfilled, (s, a) => { s.detailLoading = false; s.detail = a.payload; });
    b.addCase(fetchEvmOrderDetail.rejected,  (s) => { s.detailLoading = false; });

    b.addCase(refreshEvmOrderDetail.pending,   (s) => { s.detailLoading = true; });
    b.addCase(refreshEvmOrderDetail.fulfilled, (s, a) => { s.detailLoading = false; s.detail = a.payload; });
    b.addCase(refreshEvmOrderDetail.rejected,  (s) => { s.detailLoading = false; });
  },
});

export const {
  setOrdersQuery, setOrdersPage, clearOrders,
  clearOrderDetail,
} = slice.actions;

export default slice.reducer;

// SELECTORS
export const selectEvmOrders            = (st: RootState) => st.evmOrders.items;
export const selectEvmOrdersLoading     = (st: RootState) => st.evmOrders.loading;
export const selectEvmOrdersRefreshing  = (st: RootState) => st.evmOrders.refreshing;
export const selectEvmOrdersLoadingMore = (st: RootState) => st.evmOrders.loadingMore;
export const selectEvmOrdersQuery       = (st: RootState) => st.evmOrders.query;
export const selectEvmOrdersHasMore     = (st: RootState) => st.evmOrders.hasMore;

// ---- Detail selectors (thêm mới)
export const selectEvmOrderDetail       = (st: RootState) => st.evmOrders.detail;
export const selectEvmOrderDLoading     = (st: RootState) => st.evmOrders.detailLoading;
