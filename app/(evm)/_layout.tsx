// app/(evm)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function EVMRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // để Tabs tự control header
        contentStyle: { backgroundColor: "#0B1220" }, // nền đồng nhất
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="user" options={{ headerShown: false }} />
    </Stack>
  );
}
