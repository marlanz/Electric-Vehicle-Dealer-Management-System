import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "@/src/features/auth/authSlice";
import vehiclesReducer from "@/src/features/vehicles/vehiclesSlice";
import quotationsReducer from "@/src/features/quotations/quotationsSlice";
import tempSelection from "@/src/features/selections/tempSelectionsSlice";
import customers from "@/src/features/customers/customerSlice";
import dmStaffs      from "@/src/features/dealerManager/staffs/staffSlice";
import dmInventory   from "@/src/features/dealerManager/inventory/inventorySlice";
import dmOrders      from "@/src/features/dealerManager/orders/dmOrdersSlice";
import oemCatalog    from "@/src/features/dealerManager/catalog/oemCatalogSlice";
import evmOrders    from "@/src/features/evmStaff/ordersSlice";
import { http } from "@/src/services/http";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    quotations: quotationsReducer,
    tempSelection,
    customers,
    dmStaffs,
    dmInventory,
    dmOrders,
    oemCatalog,
    evmOrders,
  },
  middleware: (gDM) =>
    gDM({
      thunk: { extraArgument: { http } },
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkExtra = { http: typeof http };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
