// app/index.tsx
import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import { router, useRootNavigationState } from "expo-router";

export default function Index() {
  const { user, token } = useAppSelector(selectAuth);
  const navState = useRootNavigationState();
  const ready = !!navState?.key;

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/(auth)/auth");
      return;
    }
    // Điều hướng theo role
    const r = user?.role ?? "";
    if (r.startsWith("DEALER")) {
      router.replace("/(dealer)/(tabs)");
    } else if (r.startsWith("EVM")) {
      router.replace("/(evm)/(tabs)");
    } else {
      router.replace("/(dealer)/(tabs)"); // fallback
    }
  }, [ready, token, user?.role]);

  return (
    <View className="flex-1 items-center justify-center bg-[#0B1220]">
      <ActivityIndicator />
      <Text className="text-white/70 mt-2">Routing…</Text>
    </View>
  );
}
