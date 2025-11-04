// app/index.tsx
import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import { router, useRootNavigationState } from "expo-router";

export default function Index() {
  const { user, token } = useAppSelector(selectAuth);
  const navState = useRootNavigationState();

  // ready = true khi Root Layout đã mount
  const ready = !!navState?.key;

  useEffect(() => {
    if (!ready) return; // 🚫 chưa sẵn sàng thì không navigate

    if (!token) {
      router.replace("/(auth)/auth");
      return;
    }

    // Điều hướng theo role sau khi ready
    const r:any = user?.role || "UNKNOWN";
    switch (r) {
      case "DEALER":
        router.replace("/(dealer)/(tabs)");
        break;
      case "EVM_STAFF":
        router.replace("/(evm)/(tabs)");
        break;
      case "DEALER_MANAGER":
        router.replace("/(dealer-manager)/(tabs)");
        break;
      default:
        router.replace("/(auth)/auth");
        break;
    }
  }, [ready, token, user?.role]);

  // hiển thị trong lúc đợi RootLayout mount hoặc redirect
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1220]">
      <ActivityIndicator />
      <Text className="text-white/70 mt-2">
        {ready ? "Routing…" : "Preparing layout…"}
      </Text>
    </View>
  );
}
