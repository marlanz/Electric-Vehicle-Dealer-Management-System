import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchDMStaffs, selectDMStaffs, selectDMStaffsLoading } from "@/src/features/dealerManager/staffs/staffSlice";

export default function DM_Tab_Staffs() {
  const d = useAppDispatch();
  const items = useAppSelector(selectDMStaffs);
  const loading = useAppSelector(selectDMStaffsLoading);

  useEffect(() => { d(fetchDMStaffs()); }, [d]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen
        options={{
          title: "Staffs",
          headerRight: () => (
            <Pressable onPress={() => router.push("/(dealer-manager)/staffs/create")} className="px-3 py-2 rounded-xl bg-blue-600">
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
              onPress={() => router.push(`/(dealer-manager)/staffs/${item.id}` as const)}
              className="rounded-2xl p-4 bg-white/5 border border-white/10"
            >
              <Text className="text-white font-semibold">{item.full_name}</Text>
              <Text className="text-white/70 mt-1">{item.email}{item.phone ? ` • ${item.phone}` : ""}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text className="text-white/70 text-center py-16">No staff</Text>}
        />
      )}
    </View>
  );
}
