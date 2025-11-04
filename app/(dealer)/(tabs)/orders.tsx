import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import type { OrderLite } from "@/src/features/orders/type";

type ApiListRes = { success: boolean; data: { orders: OrderLite[] } };

function currencyVND(s?: string) {
  if (!s) return "—";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function OrdersListScreen() {
  const { token } = useAppSelector(selectAuth);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderLite[]>([]);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://electric-vehicle-dealer-management.onrender.com/api/v1/orders", {
        headers: {
          accept: "*/*",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json: ApiListRes = await res.json();
      setOrders(json?.data?.orders ?? []);
    } catch (e) {
      console.warn("Fetch orders error:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          title: "Orders",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(dealer)/orders/create")}
              className="px-3 py-2 rounded-xl bg-blue-600"
            >
              <Text className="text-white font-semibold">New</Text>
            </Pressable>
          ),
        }}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading orders…</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <View className="rounded-2xl p-4 bg-white/5 border border-white/10">
              <Text className="text-white font-semibold" numberOfLines={1}>
                {item.customer_name ?? "—"} • {item.vehicle_model ?? "—"} {item.vehicle_version ? `• ${item.vehicle_version}` : ""}
              </Text>
              <Text className="text-white/70 mt-1" numberOfLines={1}>
                Base: {currencyVND(item.base_price)} • Final: {currencyVND(item.final_price)}
              </Text>
              <Text className="text-white/60 mt-1" numberOfLines={1}>
                Status: {item.status}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text className="text-white/70 text-center py-16">No orders</Text>}
        />
      )}
    </View>
  );
}
