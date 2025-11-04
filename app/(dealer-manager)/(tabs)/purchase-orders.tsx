import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchDMOrders, selectDMOrders, selectDMOrdersLoading } from "@/src/features/dealerManager/orders/dmOrdersSlice";

function currencyVND(s?: string) {
  if (!s) return "—";
  const n = Number(s); if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function DM_Tab_PurchaseOrders() {
  const d = useAppDispatch();
  const items = useAppSelector(selectDMOrders);
  const loading = useAppSelector(selectDMOrdersLoading);

  useEffect(() => { d(fetchDMOrders()); }, [d]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          title: "Purchase Orders",
          headerRight: () => (
            <Pressable onPress={() => router.push("/(dealer-manager)/purchase-orders/create")} className="px-3 py-2 rounded-xl bg-blue-600">
              <Text className="text-white font-semibold">New</Text>
            </Pressable>
          ),
        }}
      />
      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator/><Text className="text-white/70 mt-2">Loading…</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding:16, paddingBottom:24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(dealer-manager)/purchase-orders/${item.id}` as const)}
              className="rounded-2xl p-4 bg-white/5 border border-white/10"
            >
              <Text className="text-white font-semibold">Order #{item.id.slice(0,8)}</Text>
              <Text className="text-white/70 mt-1">
                Status: {item.status} • Items: {item.items.length} • Total: {currencyVND(item.total)}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text className="text-white/70 text-center py-16">No orders</Text>}
        />
      )}
    </View>
  );
}
