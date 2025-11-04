import { Stack } from "expo-router";
import React from "react";

export default function DealerManagerRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,                          // Tabs tự điều khiển header
        contentStyle: { backgroundColor: "#0B1220" }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Các nhánh con (CRUD chi tiết) đã có sẵn trong cấu trúc của bạn */}
      <Stack.Screen name="staffs" options={{ headerShown: false }} />
      <Stack.Screen name="inventory" options={{ headerShown: false }} />
      <Stack.Screen name="purchase-orders" options={{ headerShown: false }} />
      <Stack.Screen name="oem-contracts" options={{ headerShown: false }} />
    </Stack>
  );
}
