import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchDMStaffs, selectDMStaffs, selectDMStaffsLoading } from "@/src/features/dealerManager/staffs/staffSlice";

const BG = "#0B1220";

export default function DM_Tab_Staffs() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectDMStaffs);
  const loading = useAppSelector(selectDMStaffsLoading);

  useEffect(() => { dispatch(fetchDMStaffs()); }, [dispatch]);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <Stack.Screen
        options={{
          title: "Dealer Staffs",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(dealer-manager)/staffs/create" as const)}
              className="px-3 py-2 rounded-xl bg-blue-600"
            >
              <Text className="text-white font-semibold">New</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length > 0}
            onRefresh={() => dispatch(fetchDMStaffs())}
            tintColor="#fff"
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 24, flexGrow: 1 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(dealer-manager)/staffs/${item.id}` as const)}
            className="rounded-2xl p-4 bg-white/5 border border-white/10"
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <Text className="text-white font-semibold" numberOfLines={1}>{item.full_name}</Text>
            <Text className="text-white/70 mt-1" numberOfLines={1}>
              {item.email}{item.phone ? ` • ${item.phone}` : ""}
            </Text>

            <View className="flex-row gap-2 mt-3">
              <Badge tone="indigo" text={item.role ?? "—"} />
              <Badge tone={item.status === "ACTIVE" ? "emerald" : "rose"} text={item.status ?? "—"} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center py-24">
              <ActivityIndicator />
              <Text className="text-white/70 mt-2">Loading…</Text>
            </View>
          ) : (
            <Text className="text-white/70 text-center py-16">No staff</Text>
          )
        }
      />
    </View>
  );
}


function Badge({ text, tone = "indigo" }: { text: string; tone?: "indigo" | "emerald" | "rose" }) {
  const map = {
    indigo: { bg: "bg-indigo-500/15", border: "border-indigo-400/30", text: "text-indigo-200" },
    emerald:{ bg: "bg-emerald-500/15", border: "border-emerald-400/30", text: "text-emerald-200" },
    rose:   { bg: "bg-rose-500/15",    border: "border-rose-400/30",    text: "text-rose-200" },
  }[tone];
  return (
    <View className={`px-2.5 py-1 rounded-lg border ${map.bg} ${map.border}`}>
      <Text className={`${map.text} text-xs font-semibold`}>{text}</Text>
    </View>
  );
}
