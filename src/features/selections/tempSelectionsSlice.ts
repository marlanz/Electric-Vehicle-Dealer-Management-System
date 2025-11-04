// src/features/tempSelection/tempSelectionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store";

export type TempCustomer = { customerId: string; fullName: string; phone?: string; email?: string };
export type TempVehicle  = { id: string; model: string; version?: string | null; color?: string | null };

type TempSelectionState = {
  customers: TempCustomer[];
  vehicles: TempVehicle[];
};

const initialState: TempSelectionState = { customers: [], vehicles: [] };

const tempSelectionSlice = createSlice({
  name: "tempSelection",
  initialState,
  reducers: {
    addCustomer(state, action: PayloadAction<TempCustomer>) {
      const exists = state.customers.some(c => c.customerId === action.payload.customerId);
      if (!exists) state.customers.unshift(action.payload);
    },
    removeCustomer(state, action: PayloadAction<string>) {
      state.customers = state.customers.filter(c => c.customerId !== action.payload);
    },
    clearCustomers(state) { state.customers = []; },

    addVehicle(state, action: PayloadAction<TempVehicle>) {
      const exists = state.vehicles.some(v => v.id === action.payload.id);
      if (!exists) state.vehicles.unshift(action.payload);
    },
    removeVehicle(state, action: PayloadAction<string>) {
      state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
    },
    clearVehicles(state) { state.vehicles = []; },
  },
});

export const {
  addCustomer, removeCustomer, clearCustomers,
  addVehicle,  removeVehicle,  clearVehicles,
} = tempSelectionSlice.actions;

export default tempSelectionSlice.reducer;

export const selectTempCustomers = (s: RootState) => s.tempSelection.customers;
export const selectTempVehicles  = (s: RootState) => s.tempSelection.vehicles;
export const addTempCustomer    = addCustomer;
export const removeTempCustomer = removeCustomer;
export const clearTempCustomers = clearCustomers;

export const addTempVehicle     = addVehicle;
export const removeTempVehicle  = removeVehicle;
export const clearTempVehicles  = clearVehicles;