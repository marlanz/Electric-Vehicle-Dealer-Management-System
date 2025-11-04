// app/(dealer)/(tabs)/quotations.tsx
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchQuotes, selectQuotes, selectQuotesLoading } from "@/src/features/quotations/quotationsSlice";
import type { QuoteLite } from "@/src/features/quotations/type";

function currencyVND(s?: string) {
  if (!s) return "—";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function QuotesListScreen() {
  const dispatch = useAppDispatch();
  const items    = useAppSelector(selectQuotes);
  const loading  = useAppSelector(selectQuotesLoading);

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          title: "Quotations",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(dealer)/quotations/create")}
              className="px-3 py-2 rounded-xl bg-blue-600"
            >
              <Text className="text-white font-semibold">New</Text>
            </Pressable>
          ),
        }}
      />

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading quotes…</Text>
        </View>
      ) : (
        <FlatList<QuoteLite>
          data={items}
          keyExtractor={(q) => q.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(dealer)/quotations/${item.id}` as const)}
              className="rounded-2xl p-4 bg-white/5 border border-white/10"
            >
              <Text className="text-white font-semibold" numberOfLines={1}>
                {item.customer_name ?? "—"} • {item.vehicle_model ?? "—"} {item.vehicle_version ? `• ${item.vehicle_version}` : ""}
              </Text>
              <Text className="text-white/70 mt-1" numberOfLines={1}>
                Base: {currencyVND(item.base_price)}
                {item.promotion_name ? ` • Promo: ${item.promotion_name}` : ""} • Final: {currencyVND(item.final_price)}
              </Text>
              <Text className="text-white/60 mt-1" numberOfLines={1}>Status: {item.status}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text className="text-white/70 text-center py-16">No quotes</Text>}
        />
      )}
    </View>
  );
}
