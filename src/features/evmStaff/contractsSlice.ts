// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "@/src/store";
// import { http } from "@/src/services/http";

// export type ContractBody = {
//   order_id: string;
//   quotation_id: string;
//   effective_date: string; // ISO
//   expiry_date?: string;
//   terms?: string;
// };

// type ContractsState = { creating: boolean; error?: string; };

// const initial: ContractsState = { creating:false };

// export const createContract = createAsyncThunk("contracts/create", async (body: ContractBody, { rejectWithValue }) => {
//   try {
//     const res = await http.post("/api/v1/contracts", body);
//     return res.data?.data?.contract;
//   } catch (e:any) { return rejectWithValue(e?.message || "Create contract failed"); }
// });

// const slice = createSlice({
//   name: "evmContracts",
//   initialState: initial,
//   reducers: {},
//   extraReducers: b=>{
//     b.addCase(createContract.pending, (s)=>{ s.creating=true; s.error=undefined; });
//     b.addCase(createContract.fulfilled, (s)=>{ s.creating=false; });
//     b.addCase(createContract.rejected, (s,a)=>{ s.creating=false; s.error=String(a.payload||a.error.message); });
//   }
// });

// export default slice.reducer;
// export const selectContractCreating = (st:RootState)=> st.evmContracts.creating;
