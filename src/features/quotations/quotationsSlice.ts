import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState, ThunkExtra } from "@/src/store";

export type Quotation = {
  _id: string;
  customerId: string;
  variantId: string;
  finalPrice: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string;
};

type State = {
  items: Quotation[];
  loading: boolean;
  error: string | null;
};

const initialState: State = { items: [], loading: false, error: null };

export const createQuotation = createAsyncThunk<Quotation, Partial<Quotation>, { extra: ThunkExtra }>(
  "quotations/create",
  async (body, { extra: { http } }) => (await http.post<Quotation>("/quotations", body)).data
);

export const listQuotations = createAsyncThunk<Quotation[], void, { extra: ThunkExtra }>(
  "quotations/list",
  async (_, { extra: { http } }) => (await http.get<{ items: Quotation[] }>("/quotations")).data.items
);

const slice = createSlice({
  name: "quotations",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(listQuotations.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(listQuotations.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(listQuotations.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? "Failed"; });
    b.addCase(createQuotation.fulfilled, (s, a) => { s.items.unshift(a.payload); });
  }
});

export default slice.reducer;
export const selectQuotations = (s: RootState) => s.quotations?.items ?? [];
