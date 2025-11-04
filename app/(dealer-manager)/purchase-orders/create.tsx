// app/(dealer-manager)/purchase-orders/create.tsx
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchOEMCatalog, selectOEMCatalog, selectOEMCatalogLoading } from "@/src/features/dealerManager/catalog/oemCatalogSlice";
import { createDMOrder } from "@/src/features/dealerManager/orders/dmOrdersSlice";

export default function DMOrderCreate() {
  const d = useAppDispatch();
  const items = useAppSelector(selectOEMCatalog);
  const loading = useAppSelector(selectOEMCatalogLoading);
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({}); // vehicle_id -> qty

  useEffect(() => { d(fetchOEMCatalog()); }, [d]);

  const add = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  const sub = (id: string) => setCart(prev => {
    const n = (prev[id] ?? 0) - 1; const next = { ...prev }; if (n <= 0) delete next[id]; else next[id] = n; return next;
  });

  const filtered = q
    ? items.filter(i => (i.model + " " + (i.version ?? "")).toLowerCase().includes(q.toLowerCase()))
    : items;

  const canSubmit = Object.keys(cart).length > 0;

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "New Purchase Order" }} />
      <View className="p-4">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-3">
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search model/version…"
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="flex-1 text-white"
          />
          <Pressable onPress={() => d(fetchOEMCatalog({ search: q }))} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
            <Text className="text-white">Search</Text>
          </Pressable>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const qty = cart[item.id] ?? 0;
            return (
              <View className="rounded-2xl p-4 bg-white/5 border border-white/10">
                <Text className="text-white font-semibold">{item.model} {item.version ? `• ${item.version}`: ""}</Text>
                <Text className="text-white/70 mt-1">{item.color ?? "—"} {item.year ? `• ${item.year}`: ""}</Text>
                <View className="flex-row gap-3 mt-3">
                  <Pressable onPress={() => sub(item.id)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"><Text className="text-white">-</Text></Pressable>
                  <View className="px-3 py-2 rounded-lg bg-blue-600"><Text className="text-white font-semibold">Qty: {qty}</Text></View>
                  <Pressable onPress={() => add(item.id)} className="px-3 py-2 rounded-lg bg-emerald-600/90"><Text className="text-white font-semibold">+</Text></Pressable>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <View className="absolute left-0 right-0 bottom-0 p-4 bg-[#0B1220] border-t border-white/10">
        <Pressable
          disabled={!canSubmit}
          onPress={async () => {
            const items = Object.entries(cart).map(([vehicle_id, qty]) => ({ vehicle_id, qty }));
            await d(createDMOrder({ items }));
            router.replace("/(dealer-manager)/purchase-orders");
          }}
          className={`px-4 py-3 rounded-xl ${canSubmit ? "bg-blue-600" : "bg-white/10"}`}
        ><Text className="text-white font-semibold text-center">Create Purchase Order</Text></Pressable>
      </View>
    </View>
  );
}
