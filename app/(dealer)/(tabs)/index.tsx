import { router, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View, Image, StyleSheet } from "react-native";
import Avatar from "@/src/components/ui/Avatar";
import { Feather } from "@expo/vector-icons";

const ROUTES = {
  profile: "/profile" as Href,
  quotations: "/quotations" as Href,
  orders: "/orders" as Href,
  testdrives: "/testdrives" as Href,
};

export default function DealerHome() {
  const stats = [
    { value: 38, label: "My Total Quotations", icon: "file-text" as const },
    { value: 12, label: "Total Cars in Stock", icon: "car" as const },
    { value: 9,  label: "Pending Orders",      icon: "shopping-bag" as const },
    { value: 3,  label: "Test Drives Today",   icon: "calendar" as const },
  ];

  const appts = [
    { name: "John D. Robbin", model: "Cybertruck – Long Range • Blue Navy", time: "Oct 28, 2025, 10:30 AM" },
    { name: "Mira T.",       model: "Model 3 – RWD • White",                time: "Oct 28, 2025, 01:15 PM" },
    { name: "Ken P.",        model: "BYD Seal – AWD • Grey",                time: "Oct 28, 2025, 04:00 PM" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0B1220]" contentContainerStyle={{ padding: 16 }}>
      {/* Stats */}
      <View className="flex-row flex-wrap -mx-1">
        {stats.map((s, i) => (
          <View key={i} className="w-1/2 px-1 mb-2">
            <View style={styles.card} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <View className="flex-row items-center justify-between">
                <View className="rounded-xl bg-white/10 p-2">
                  <Feather name={s.icon} size={16} color="#CFE2FF" />
                </View>
                <Text className="text-white/50 text-xs">{s.label}</Text>
              </View>
              <Text className="text-white text-2xl font-bold mt-3">{s.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View className="gap-3">
        <ActionTile
          icon="file-plus"
          title="Create Quotation"
          subtitle="Price & offer to customer"
          onPress={() => router.push(ROUTES.quotations)}
        />
        <ActionTile
          icon="shopping-cart"
          title="Create Order"
          subtitle="Convert quotation to sale"
          onPress={() => router.push(ROUTES.orders)}
        />
        <ActionTile
          icon="navigation-2"  // thay cho steering-wheel
          title="Schedule Test Drive"
          subtitle="Book a time for customer"
          onPress={() => router.push(ROUTES.testdrives)}
        />
      </View>

      {/* Appointments */}
      <SectionHeader title="My Test Drive Appointments" actionText="See all" onAction={() => router.push(ROUTES.testdrives)} />
      <View className="gap-2">
        {appts.map((a, i) => (
          <View key={i} style={styles.card} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-white font-semibold">{a.name}</Text>
                <Text className="text-white/70 text-sm mt-1">{a.model}</Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <Feather name="clock" size={14} color="#A9B4C4" />
                  <Text className="text-white/60 text-xs">{a.time}</Text>
                </View>
              </View>
              <View className="rounded-xl bg-white/10 p-3">
                <Feather name="chevron-right" size={16} color="#E7EEF7" />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="h-16" />
    </ScrollView>
  );
}

function SectionHeader({ title, actionText, onAction }: { title: string; actionText?: string; onAction?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mt-6 mb-3">
      <Text className="text-white font-semibold text-lg">{title}</Text>
      {!!actionText && (
        <Pressable onPress={onAction} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <Text className="text-[#9EC5FE] text-sm">{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}

function ActionTile({
  icon,
  title,
  subtitle,
  onPress,
}: { icon: React.ComponentProps<typeof Feather>["name"]; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, styles.pressable]}>
      <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-white/10 p-3">
            <Feather name={icon} size={18} color="#CFE2FF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold">{title}</Text>
            <Text className="text-white/70 text-xs mt-0.5">{subtitle}</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#E7EEF7" />
        </View>
      </View>
    </Pressable>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
      <Text className="text-white/80 text-[11px]">{children}</Text>
    </View>
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
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pressable: {
    transform: [{ scale: 1 }],
  },
});
