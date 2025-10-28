import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "@/src/features/auth/authSlice";
import vehiclesReducer from "@/src/features/vehicles/vehiclesSlice";
import quotationsReducer from "@/src/features/quotations/quotationsSlice";
import { http } from "@/src/services/http";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    quotations: quotationsReducer,
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
