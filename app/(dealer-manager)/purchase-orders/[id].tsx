// app/(dealer-manager)/purchase-orders/[id].tsx
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  addDMOrderToInventory,
  fetchDMOrderById,
  markDMOrderReceived,
  selectDMOrderDetail,
  selectDMOrderDetailLoading,
  updateDMOrderStatus,
  uploadDMPayment
} from "@/src/features/dealerManager/orders/dmOrdersSlice";

function currencyVND(s?: string) {
  if (!s) return "—";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function DMOrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = useAppDispatch();
  const item = useAppSelector(selectDMOrderDetail(id!));
  const loading = useAppSelector(selectDMOrderDetailLoading);

  useEffect(() => { if (id) d(fetchDMOrderById({ id })); }, [id, d]);

  const canAccept  = item?.status === "QUOTED";
  const canPay     = item?.status === "ACCEPTED";
  const canReceive = item?.status === "SHIPPED";
  const canAddInv  = item?.status === "RECEIVED";

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "Purchase Order Detail" }} />
      {loading && !item ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator/><Text className="text-white/70 mt-2">Loading…</Text></View>
      ) : !item ? (
        <View className="flex-1 items-center justify-center"><Text className="text-white">Not found</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding:16, paddingBottom:24 }}>
          <View className="rounded-2xl p-4 bg-white/5 border border-white/10">
            <Text className="text-white font-bold text-lg">Order #{item.id.slice(0,8)}</Text>
            <Text className="text-white/70 mt-1">Status: {item.status}</Text>
          </View>

          <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mt-4">
            <Text className="text-white/80 font-semibold mb-2">Items</Text>
            {item.items.map(i => (
              <View key={i.id} className="flex-row items-center justify-between py-2">
                <Text className="text-white" numberOfLines={1}>{i.model} {i.version ? `• ${i.version}`:""} {i.color ? `• ${i.color}`:""}</Text>
                <Text className="text-white/80">x{i.qty}</Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mt-4">
            <Text className="text-white/80 font-semibold mb-2">Quote</Text>
            <Text className="text-white/70">Quote total: {currencyVND(item.quote_total ?? item.total)}</Text>
            {!!item.quote_note && <Text className="text-white/70 mt-1">{item.quote_note}</Text>}
          </View>

          <View className="flex-row flex-wrap gap-3 mt-6">
            {canAccept && (
              <>
                <Button onPress={() => d(updateDMOrderStatus({ id: id!, body: { status: "ACCEPTED" } }))} title="Accept Quote" tone="blue" />
                <Button onPress={() => d(updateDMOrderStatus({ id: id!, body: { status: "CANCELLED" } }))} title="Reject / Cancel" tone="rose" />
              </>
            )}

            {canPay && (
              <Button
                onPress={() => d(uploadDMPayment({ id: id!, body: { amount: Number(item.quote_total ?? item.total), proof_url: "https://..." } }))}
                title="Mark as Paid"
                tone="emerald"
              />
            )}

            {canReceive && (
              <Button onPress={() => d(markDMOrderReceived({ id: id! }))} title="Mark Received" tone="amber" />
            )}

            {canAddInv && (
              <Button onPress={() => d(addDMOrderToInventory({ id: id! }))} title="Add to Inventory" tone="purple" />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Button({ title, onPress, tone="blue" }: { title: string; onPress: () => void; tone?: "blue"|"rose"|"emerald"|"amber"|"purple" }) {
  const map: any = {
    blue: "bg-blue-600",
    rose: "bg-rose-600/90",
    emerald: "bg-emerald-600/90",
    amber: "bg-amber-500/90",
    purple: "bg-purple-600/90",
  };
  return (
    <Pressable onPress={onPress} className={`px-4 py-3 rounded-xl ${map[tone]}`}>
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}
