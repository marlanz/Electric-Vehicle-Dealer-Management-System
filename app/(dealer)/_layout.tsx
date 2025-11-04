// app/(dealer)/_layout.tsx
import { Stack } from "expo-router";

export default function DealerRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B1220" },
      }}
    >
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Pages ngoài Tabs (detail/create…) */}
      <Stack.Screen name="(vehicles)" options={{ headerShown: false }} />
      <Stack.Screen name="customers/create" options={{ presentation: "card" }} />
      <Stack.Screen name="orders/create" options={{ presentation: "card" }} />
      <Stack.Screen name="quotations/create" options={{ presentation: "card" }} />
      <Stack.Screen name="promotions/index" />
      <Stack.Screen name="promotions/[id]" />
      <Stack.Screen name="quotations/[id]" />
      <Stack.Screen name="orders/[id]" />
      <Stack.Screen name="temp-selection" options={{ presentation: "card" }} />
    </Stack>
  );
}
