import { bootstrapAuth, selectAuthLoading } from "@/src/features/auth/authSlice";
import RoleGateway from "@/src/navigation/role-gateway";
import { store, useAppDispatch, useAppSelector } from "@/src/store";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Provider } from "react-redux";

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  useEffect(() => { dispatch(bootstrapAuth()); }, []);
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f1115]">
        <ActivityIndicator /><Text className="text-white mt-2">Loading…</Text>
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
        <RoleGateway>
          <Slot />
        </RoleGateway>
      </BootstrapGate>
    </Provider>
  );
}
