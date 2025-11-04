// app/(dealer)/quotations/[id].tsx
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  fetchQuoteById,
  selectQuoteDetail,
  selectQuoteDetailError,
  selectQuoteDetailLoading
} from "@/src/features/quotations/quotationsSlice";
import type { QuoteDetail } from "@/src/features/quotations/type";
import { Feather } from "@expo/vector-icons";

function currencyVND(s?: string) {
  if (!s) return "—";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

function Badge({ tone = "blue", children }: { tone?: "blue"|"green"|"amber"|"rose"|"gray"; children: React.ReactNode }) {
  const bg: Record<string, string> = {
    blue:  "bg-blue-600/90",
    green: "bg-emerald-600/90",
    amber: "bg-amber-500/90",
    rose:  "bg-rose-600/90",
    gray:  "bg-gray-500/80",
  };
  return (
    <View className={`px-3 py-1.5 rounded-full ${bg[tone]} border border-white/10`}>
      <Text className="text-white font-semibold text-xs">{children}</Text>
    </View>
  );
}

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const detail   = useAppSelector(selectQuoteDetail(id!));
  const loading  = useAppSelector(selectQuoteDetailLoading);
  const error    = useAppSelector(selectQuoteDetailError);

  useEffect(() => {
    if (id && !detail) dispatch(fetchQuoteById({ id }));
  }, [id, detail, dispatch]);

  const toneByStatus: Record<string, "blue"|"green"|"amber"|"rose"|"gray"> = {
    DRAFT: "gray",
    SENT: "blue",
    ACCEPTED: "green",
    REJECTED: "rose",
  };

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Quote Detail",
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#E7EEF7",
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={() => router.push("/(dealer)/quotations/create")} className="px-3 py-2 rounded-xl bg-blue-600">
              <Text className="text-white font-semibold">New</Text>
            </Pressable>
          ),
        }}
      />

      {loading && !detail ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading quote…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white font-semibold mb-2">Failed to load quote</Text>
          <Text className="text-white/70">{error}</Text>
        </View>
      ) : !detail ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white font-semibold">Quote not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          {/* Header Box */}
          <View className="rounded-2xl p-4 bg-white/5 border border-white/10">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-bold" numberOfLines={1}>
                {detail.customer_name ?? "—"}
              </Text>
              <Badge tone={toneByStatus[detail.status] ?? "blue"}>{detail.status}</Badge>
            </View>
            <Text className="text-white/70 mt-1" numberOfLines={1}>
              {detail.customer_phone ?? "—"} {detail.customer_email ? `• ${detail.customer_email}` : ""}
            </Text>
          </View>

          {/* Vehicle box */}
          <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mt-4">
            <Text className="text-white/80 font-semibold mb-2">Vehicle</Text>
            <Text className="text-white" numberOfLines={1}>
              {detail.vehicle_model ?? "—"} {detail.vehicle_version ? `• ${detail.vehicle_version}` : ""}
            </Text>
            <Text className="text-white/70 mt-1" numberOfLines={1}>
              Color: {detail.vehicle_color ?? "—"}
            </Text>
          </View>

          {/* Pricing box */}
          <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mt-4">
            <Text className="text-white/80 font-semibold mb-3">Pricing</Text>
            <Row label="Base price" value={currencyVND(detail.base_price)} />
            <Row
              label="Promotion"
              value={
                detail.promotion_name
                  ? `${detail.promotion_name} ${detail.discount_type === "PERCENT" && detail.discount_value ? `(-${detail.discount_value}% )` : ""}`
                  : "—"
              }
            />
            <View className="h-[1px] bg-white/10 my-8" />
            <RowStrong label="Final price" value={currencyVND(detail.final_price)} />
          </View>

          {/* Dealer / Meta */}
          <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mt-4">
            <Text className="text-white/80 font-semibold mb-3">Dealer & Meta</Text>
            <Row label="Dealer" value={`${detail.dealer_name ?? "—"} ${detail.dealer_code ? `(${detail.dealer_code})` : ""}`} />
            <Row label="Created by" value={detail.created_by_name ?? "—"} />
            <Row label="Created at" value={new Date(detail.created_at).toLocaleString()} />
            <Row label="Updated at" value={detail.updated_at ? new Date(detail.updated_at).toLocaleString() : "—"} />
            <Row label="Valid until" value={detail.valid_until ? new Date(detail.valid_until).toLocaleDateString() : "—"} />
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={() => router.push("/(dealer)/orders/create")}
              className="px-4 py-3 rounded-xl bg-blue-600 flex-row items-center gap-2"
            >
              <Feather name="shopping-cart" size={16} color="#fff" />
              <Text className="text-white font-semibold">Create Order</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(dealer)/quotations/create")}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 flex-row items-center gap-2"
            >
              <Feather name="copy" size={16} color="#E7EEF7" />
              <Text className="text-white">Duplicate Quote</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-white/70">{label}</Text>
      <Text className="text-white font-medium ml-4" numberOfLines={1}>{value}</Text>
    </View>
  );
}

function RowStrong({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-white/80 font-semibold">{label}</Text>
      <Text className="text-white font-extrabold text-lg ml-4" numberOfLines={1}>{value}</Text>
    </View>
  );
}
