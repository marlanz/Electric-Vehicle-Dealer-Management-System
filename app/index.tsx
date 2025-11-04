// app/index.tsx
import { Redirect, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";

export default function Index() {
  const { user, token } = useAppSelector(selectAuth);
  const rootNav = useRootNavigationState();

  // Chưa sẵn sàng: KHÔNG render Redirect, chỉ splash
  if (!rootNav?.key) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1220]">
        <ActivityIndicator />
        <Text className="text-white/70 mt-2">Preparing layout…</Text>
      </View>
    );
  }

  // Chưa đăng nhập
  if (!token) return <Redirect href="/(auth)/auth" />;

  // Điều hướng theo role
  const r:any = user?.role;
  if (r === "DEALER")        return <Redirect href="/(dealer)/(tabs)" />;
  if (r === "EVM_STAFF")     return <Redirect href="/(evm)/(tabs)" />;
  if (r === "DEALER_MANAGER")return <Redirect href="/(dealer-manager)/(tabs)" />;

  // Fallback: về login
  return <Redirect href="/(auth)/auth" />;
}
