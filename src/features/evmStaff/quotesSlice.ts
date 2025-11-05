// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "@/src/store";
// import { http } from "@/src/services/http";

// export type QuoteBody = {
//   order_id: string;
//   items?: Array<{ vehicle_id: string; unit_price: number; quantity: number }>;
//   discount?: number;
//   notes?: string;
// };

// type QuotesState = {
//   creating: boolean;
//   error?: string;
// };

// const initial: QuotesState = { creating: false };

// export const createQuotation = createAsyncThunk("quotes/create", async (body: QuoteBody, { rejectWithValue }) => {
//   try {
//     const res = await http.post("/api/v1/quotations", body);
//     return res.data?.data?.quotation;
//   } catch (e:any) { return rejectWithValue(e?.message || "Create quote failed"); }
// });

// const slice = createSlice({
//   name: "evmQuotes",
//   initialState: initial,
//   reducers: {},
//   extraReducers: b=>{
//     b.addCase(createQuotation.pending, (s)=>{ s.creating=true; s.error=undefined; });
//     b.addCase(createQuotation.fulfilled, (s)=>{ s.creating=false; });
//     b.addCase(createQuotation.rejected, (s,a)=>{ s.creating=false; s.error=String(a.payload||a.error.message); });
//   }
// });

// export default slice.reducer;
// export const selectQuoteCreating = (st:RootState)=> st.evmQuotes.creating;
