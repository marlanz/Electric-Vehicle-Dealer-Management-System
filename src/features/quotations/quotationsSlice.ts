// src/features/quotations/quotationSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "@/src/services/http";
import type { RootState } from "@/src/store";
import type { QuoteDetail, QuoteLite } from "./type";

type ListResponse = { success: boolean; data: { quotes: QuoteLite[] } };
type DetailResponse = { success: boolean; data: { quote: QuoteDetail } };

type Params = {
  dealer_id?: string;
  customer_id?: string;
  status?: string;
};

type State = {
  items: QuoteLite[];
  loading: boolean;
  error: string | null;

  params: Params;

  // cache detail theo id
  detailById: Record<string, QuoteDetail | undefined>;
  detailLoading: boolean;
  detailError: string | null;
};

const initialState: State = {
  items: [],
  loading: false,
  error: null,
  params: {},
  detailById: {},
  detailLoading: false,
  detailError: null,
};

export const fetchQuotes = createAsyncThunk<
  QuoteLite[],
  Partial<Params> | void
>(
  "quotations/fetchQuotes",
  async (maybeParams) => {
    const p = new URLSearchParams();
    const params = maybeParams ?? {};
    if (params.dealer_id)   p.set("dealer_id", params.dealer_id);
    if (params.customer_id) p.set("customer_id", params.customer_id);
    if (params.status)      p.set("status", params.status);

    const url = `/quotes${p.toString() ? `?${p.toString()}` : ""}`;
    const res = await http.get<ListResponse>(url);
    return res.data.data.quotes ?? [];
  }
);

export const fetchQuoteById = createAsyncThunk<
  QuoteDetail,
  { id: string }
>(
  "quotations/fetchQuoteById",
  async ({ id }) => {
    const res = await http.get<DetailResponse>(`/api/v1/quotes/${id}`);
    return res.data.data.quote;
  }
);

const slice = createSlice({
  name: "quotations",
  initialState,
  reducers: {
    setQuoteParams(state, action: PayloadAction<Partial<Params>>) {
      state.params = { ...state.params, ...action.payload };
    },
    // optional: clear list
    clearQuotes(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (b) => {
    // LIST
    b.addCase(fetchQuotes.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchQuotes.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchQuotes.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed to load quotes"; });

    // DETAIL
    b.addCase(fetchQuoteById.pending, (s) => { s.detailLoading = true; s.detailError = null; });
    b.addCase(fetchQuoteById.fulfilled, (s, a) => {
      s.detailLoading = false;
      s.detailById[a.payload.id] = a.payload;
    });
    b.addCase(fetchQuoteById.rejected, (s, a) => {
      s.detailLoading = false;
      s.detailError = a.error.message ?? "Failed to load quote detail";
    });
  }
});

export const { setQuoteParams, clearQuotes } = slice.actions;
export default slice.reducer;

// Selectors
export const selectQuotes         = (s: RootState) => s.quotations.items;
export const selectQuotesLoading  = (s: RootState) => s.quotations.loading;
export const selectQuotesParams   = (s: RootState) => s.quotations.params;

export const selectQuoteDetail = (id: string) => (s: RootState) => s.quotations.detailById[id];
export const selectQuoteDetailLoading = (s: RootState) => s.quotations.detailLoading;
export const selectQuoteDetailError   = (s: RootState) => s.quotations.detailError;
