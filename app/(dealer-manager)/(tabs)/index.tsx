import React from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function DM_Dashboard() {
  const actions = [
    { icon: "user-plus" as const, title: "Create Staff",      sub: "Add dealer staff",   to: "/(dealer-manager)/staffs/create" },
    { icon: "package-plus" as const, title: "Add Inventory",  sub: "Add car to stock",   to: "/(dealer-manager)/inventory/create" },
    { icon: "shopping-cart" as const, title: "New Purchase Order", sub: "Order from OEM", to: "/(dealer-manager)/purchase-orders/create" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0B1220]" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-white text-xl font-bold mb-3">Quick Actions</Text>
      <View className="gap-3">
        {actions.map((a) => (
          <Pressable key={a.title} onPress={() => router.push(a.to as any)} style={[styles.card]}>
            <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <View className="flex-row items-center gap-3">
                <View className="rounded-2xl bg-white/10 p-3">
                  {/* <Feather name={a.icon} size={18} color="#CFE2FF" /> */}
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold">{a.title}</Text>
                  <Text className="text-white/70 text-xs mt-0.5">{a.sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#E7EEF7" />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <Text className="text-white text-xl font-bold mt-6 mb-3">Shortcuts</Text>
      <View className="gap-3">
        <RowLink title="Manage Staffs"    to="/(dealer-manager)/staffs"          icon="users" />
        <RowLink title="Manage Inventory" to="/(dealer-manager)/inventory"       icon="package" />
        <RowLink title="Purchase Orders"  to="/(dealer-manager)/purchase-orders" icon="shopping-cart" />
      </View>

      <View className="h-16" />
    </ScrollView>
  );
}

function RowLink({ title, to, icon }: { title: string; to: string; icon: React.ComponentProps<typeof Feather>["name"] }) {
  return (
    <Pressable onPress={() => router.push(to as any)} style={[styles.card]}>
      <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-white/10 p-3"><Feather name={icon} size={18} color="#CFE2FF" /></View>
          <Text className="text-white font-semibold flex-1">{title}</Text>
          <Feather name="chevron-right" size={16} color="#E7EEF7" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
});
