import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchDMInventory, selectDMInventory, selectDMInventoryLoading } from "@/src/features/dealerManager/inventory/inventorySlice";

export default function DM_Tab_Inventory() {
  const d = useAppDispatch();
  const items = useAppSelector(selectDMInventory);
  const loading = useAppSelector(selectDMInventoryLoading);

  useEffect(() => { d(fetchDMInventory()); }, [d]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          title: "Inventory",
          headerRight: () => (
            <Pressable onPress={() => router.push("/(dealer-manager)/inventory/create")} className="px-3 py-2 rounded-xl bg-blue-600">
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
              onPress={() => router.push(`/(dealer-manager)/inventory/${item.id}` as const)}
              className="rounded-2xl p-4 bg-white/5 border border-white/10"
            >
              <Text className="text-white font-semibold">
                {item.model}{item.version ? ` • ${item.version}` : ""}{item.color ? ` • ${item.color}` : ""}
              </Text>
              <Text className="text-white/70 mt-1">Status: {item.status}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text className="text-white/70 text-center py-16">No items</Text>}
        />
      )}
    </View>
  );
}
