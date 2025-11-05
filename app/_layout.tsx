// app/_layout.tsx
import { bootstrapAuth, logout, selectAuthLoading, setTokens } from "@/src/features/auth/authSlice";
import { store, useAppDispatch, useAppSelector } from "@/src/store";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";
import "./global.css";
import { setAuthToken, setOnAuthFail, setOnTokenRefreshed } from "@/src/services/http";

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
    useEffect(() => {
    dispatch(bootstrapAuth());

    setOnAuthFail(() => {
      console.log("🔒 Token expired — logging out user");
      dispatch(logout());
    });

    // ✅ khi refresh thành công: update Redux + axios header (đã làm) + storage (đã làm trong http)
    setOnTokenRefreshed((token, refreshToken) => {
      dispatch(setTokens({ token, refreshToken }));
      setAuthToken(token);
    });
  }, [dispatch]);
  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1220]">
        <ActivityIndicator />
        <Text className="text-white mt-2">Loading…</Text>
      </View>
    );
  }
  return <>{children}</>;
}

export default function Root() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
        <BootstrapGate>
        <Slot />
      </BootstrapGate>
    </Provider>
  );
}
