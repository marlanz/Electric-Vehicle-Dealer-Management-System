// app/(evm-staff)/(tabs)/promotions.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

type Voucher = {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  qty: number;
};

const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io/vouchers";
const BG = "#0B1220";

export default function EvmPromotionsList() {
  const [items, setItems] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // filters
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [threshold, setThreshold] = useState("10"); // qty <= threshold

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data: Voucher[] = await res.json();
      setItems(data);
    } catch (e) {
      console.warn("Load vouchers error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(API);
      const data: Voucher[] = await res.json();
      setItems(data);
    } catch (e) {
      console.warn("Refresh vouchers error:", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    const th = Number.isFinite(Number(threshold)) ? Number(threshold) : 10;
    return items.filter(v => {
      const byName = !q.trim() || v.name.toLowerCase().includes(q.toLowerCase());
      const byQty  = !onlyLow || v.qty <= th;
      return byName && byQty;
    });
  }, [items, q, onlyLow, threshold]);

  const confirmDelete = (id: string) => {
    Alert.alert("Xoá promotion?", "Thao tác này không thể khôi phục.", [
      { text: "Huỷ", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => doDelete(id) },
    ]);
  };

  const doDelete = async (id: string) => {
    try {
      // Optimistic UI
      const prev = items;
      setItems(prev.filter(x => x.id !== id));

      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    } catch (e) {
      console.warn("Delete error:", e);
      // fallback: reload
      fetchAll();
    }
  };

  const Header = (
    <View style={{ }}>
      {/* Topbar */}
      <View className="px-4 pt-4 pb-2 " style={{ marginTop: 30 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold">Promotions</Text>
          <Pressable
            onPress={() => router.push("/(evm-staff)/promotions/create" as const)}
            className="px-3 py-2 rounded-xl bg-white"
          >
            <Text className="text-[#0B1220] font-semibold">+ New</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <View className="mt-3">
          <View className="bg-white/10 rounded-2xl border border-white/15 px-3 py-2">
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search by name…"
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="text-white"
              returnKeyType="search"
            />
          </View>

          <View className="flex-row items-center mt-2">
            <Pressable
              onPress={() => setOnlyLow(x => !x)}
              className={`px-3 py-2 rounded-xl border ${onlyLow ? "bg-amber-400 border-amber-300" : "bg-white/10 border-white/15"}`}
            >
              <Text className={`${onlyLow ? "text-[#0B1220]" : "text-white"}`}>Low stock only</Text>
            </Pressable>

            <View className="w-3" />
            <View className="flex-row items-center bg-white/10 border border-white/15 rounded-xl px-3 py-2">
              <Text className="text-white/80">≤</Text>
              <View className="w-2" />
              <TextInput
                value={threshold}
                onChangeText={setThreshold}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white min-w-[40px]"
              />
              <View className="w-2" />
              <Text className="text-white/60">qty</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading promotions…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
          ListHeaderComponent={Header}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(evm-staff)/promotions/${item.id}` as const)}
              onLongPress={() => confirmDelete(item.id)}
              className="rounded-2xl p-4 bg-[#141C2C] border border-white/10"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-semibold" numberOfLines={1}>{item.name}</Text>
                <Text className="text-white/80">{item.discountPercentage}%</Text>
              </View>
              <Text className="text-white/60 mt-1" numberOfLines={2}>{item.description}</Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text className={`text-xs px-2 py-1 rounded-lg ${item.qty <= Number(threshold || 10) ? "bg-amber-400/20 text-amber-200" : "bg-white/10 text-white/80"}`}>
                  Qty: {item.qty}
                </Text>
                <Pressable onPress={() => confirmDelete(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-400/30">
                  <Text className="text-red-200 text-xs">Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text className="text-white/60 text-center py-16">No promotions</Text>
          }
        />
      )}
    </View>
  );
}
