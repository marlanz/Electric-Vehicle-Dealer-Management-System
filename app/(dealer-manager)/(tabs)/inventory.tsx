// app/(dealer-manager)/(tabs)/inventory
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View, Modal } from "react-native";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import {
  fetchInventory,
  selectDmInvItems,
  selectDmInvLoading,
  selectDmInvRefreshing,
  selectDmInvSearch,
  setSearch,
} from "../../../src/features/dealerManager/inventory/inventorySlice";

const BG = "#0A0F1A";

export default function DMInventoryList() {
  const dispatch   = useAppDispatch();
  const items      = useAppSelector(selectDmInvItems);
  const loading    = useAppSelector(selectDmInvLoading);
  const refreshing = useAppSelector(selectDmInvRefreshing);
  const search     = useAppSelector(selectDmInvSearch);

  // === Derive EVERYTHING locally ===
  // Low-stock: available_quantity < 5
  const lowStock = useMemo(
    () => items.filter(it => (it?.available_quantity ?? 0) < 5),
    [items]
  );

  // Statistics: models, quantity, reserved, available (tự tính)
  const stats = useMemo(() => {
    // đếm model theo vehicle.id (ổn định hơn so với chỉ model name)
    const modelSet = new Set<string>();
    let quantity = 0, reserved = 0, available = 0;

    for (const it of items) {
      if (it?.vehicle?.id) modelSet.add(it.vehicle.id);
      quantity  += Number(it?.quantity ?? 0);
      reserved  += Number(it?.reserved_quantity ?? 0);
      available += Number(it?.available_quantity ?? 0);
    }

    return {
      total_models: modelSet.size,
      total_quantity: quantity,
      total_reserved: reserved,
      total_available: available,
    };
  }, [items]);

  const [lsOpen, setLsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchInventory());
  };
  const onChangeSearch = (t: string) => dispatch(setSearch(t));

  const Header = (
    <View>
      {/* Top bar + Create */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold">Dealer Inventory</Text>
          <Pressable
            onPress={() => router.push("/(dealer-manager)/inventory/create")}
            className="px-3 py-2 rounded-xl bg-blue-600"
          >
            <Text className="text-white font-semibold">+ New Vehicle</Text>
          </Pressable>
        </View>
        <View className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-3">
          <TextInput
            value={search}
            onChangeText={onChangeSearch}
            placeholder="Search by model..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="text-white"
            onSubmitEditing={() => dispatch(fetchInventory())}
          />
        </View>
      </View>
      <View className="px-4 mt-3">
        <LowStockBanner
          loading={false}
          count={lowStock.length}
          onPress={() => setLsOpen(true)}
        />
      </View>
      {/* Statistics widget (derived) */}
      <View className="px-4 mt-2">
        <View className="flex-row flex-wrap -mx-1">
          {[
            { label: "Models",    value: stats.total_models },
            { label: "Quantity",  value: stats.total_quantity },
            { label: "Reserved",  value: stats.total_reserved },
            { label: "Available", value: stats.total_available },
          ].map((it, i) => (
            <View key={i} className="w-1/2 px-1 mb-2">
              <View className="rounded-2xl bg-white/5 border border-white/10 p-4 items-center">
                <Text className="text-white text-[20px] font-extrabold">
                  {it.value}
                </Text>
                <Text className="text-white/70 mt-1 text-[12px] tracking-wide">
                  {it.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      
    </View>
  );

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter(it => (it?.vehicle?.model ?? "").toLowerCase().includes(q));
  }, [items, search]);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor="#fff" onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={Header}
        renderItem={({ item }) => {
          const v = item.vehicle;
          const title = v ? `${v.model}${v.version ? " • " + v.version : ""}` : "(No vehicle)";
          return (
            <Pressable
              onPress={() => v?.id && router.push(`/(dealer-manager)/inventory/${v.id}` as const)}
              className="rounded-2xl p-4 bg-white/5 border border-white/10"
            >
              <Text className="text-white font-semibold" numberOfLines={1}>{title}</Text>
              <Text className="text-white/80 mt-1" numberOfLines={1}>
                Qty: {item.quantity} • Reserved: {item.reserved_quantity} • Avail: {item.available_quantity}
              </Text>
              {!!v?.msrp && (
                <Text className="text-white/70 mt-1">
                  MSRP: {new Intl.NumberFormat("vi-VN").format(v.msrp)}₫
                </Text>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          loading
            ? (
              <View className="flex-1 items-center justify-center py-24">
                <ActivityIndicator />
                <Text className="text-white/70 mt-2">Loading inventory…</Text>
              </View>
            )
            : <Text className="text-white/60 text-center py-16">No inventory</Text>
        }
      />

      {/* Low-stock modal (derived) */}
      <Modal visible={lsOpen} animationType="slide" onRequestClose={() => setLsOpen(false)}>
        <View style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-lg">Low-stock models</Text>
              <Pressable
                onPress={() => setLsOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15"
              >
                <Text className="text-white">Close</Text>
              </Pressable>
            </View>
            <Text className="text-white/60 text-xs mt-1">
              Items with available quantity &lt; 5
            </Text>
          </View>

          <FlatList
            data={lowStock}
            keyExtractor={(it) => it.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            ListEmptyComponent={
              <Text className="text-white/80 px-1 py-4">No low-stock items 🎉</Text>
            }
            renderItem={({ item }) => (
              <LowStockItem
                item={item}
                onPress={() => {
                  if (item.vehicle?.id) {
                    setLsOpen(false);
                    router.push(`/(dealer-manager)/inventory/${item.vehicle.id}` as const);
                  }
                }}
              />
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

function LowStockBanner({
  loading,
  count,
  onPress,
}: {
  loading: boolean;
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl px-4 py-3 border"
      style={{
        backgroundColor: "rgba(245, 158, 11, 0.22)",
        borderColor: "rgba(251, 191, 36, 0.75)",
      }}
    >
      {loading ? (
        <Text className="text-white font-medium">Checking low stock…</Text>
      ) : (
        <Text className="text-white font-semibold" numberOfLines={2}>
          Low stock: <Text className="text-amber-200">{count}</Text>{" "}
          model{count !== 1 ? "s" : ""} — tap to view
        </Text>
      )}
    </Pressable>
  );
}

function LowStockItem({
  item,
  onPress,
}: {
  item: {
    id: string;
    quantity: number;
    reserved_quantity: number;
    available_quantity: number;
    vehicle?: { id?: string; model?: string; version?: string | null; msrp?: number | null };
  };
  onPress: () => void;
}) {
  const v = item.vehicle;
  const title = v ? `${v.model ?? "—"}${v.version ? " • " + v.version : ""}` : "(No vehicle)";
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4 bg-white/5 border border-white/10"
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <Text className="text-white font-semibold" numberOfLines={1}>{title}</Text>
      <Text className="text-white/80 mt-1" numberOfLines={1}>
        Qty: {item.quantity} • Reserved: {item.reserved_quantity} • Avail: {item.available_quantity}
      </Text>
      {!!v?.msrp && (
        <Text className="text-white/70 mt-1">
          MSRP: {new Intl.NumberFormat("vi-VN").format(v.msrp!)}₫
        </Text>
      )}
    </Pressable>
  );
}
