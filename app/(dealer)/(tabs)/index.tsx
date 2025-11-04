// app/(dealer)/(tabs)/index.tsx  (DealerHome)
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";

type QuoteLite = {
  id: string;
  status: string;
  base_price?: string;
  final_price?: string;
  customer_name?: string;
  vehicle_model?: string;
};
type QuotesRes = { success: boolean; data?: { quotes?: QuoteLite[] } };

type VehiclesRes = {
  success: boolean;
  data?: { vehicles?: any[]; total?: number; page?: number; limit?: number };
};

type OrdersRes = { success: boolean; data?: { orders?: any[] } };

type TestDriveLite = {
  id: string;
  customer_name: string;
  vehicle_label?: string;
  start_time?: string; // ISO datetime
};
type TestDrivesRes = { success: boolean; data?: { testdrives?: TestDriveLite[] } };

// ---- Config route tới đúng tab group
const ROUTES = {
  profile: "/(dealer)/(tabs)/profile" as Href,
  quotations: "/(dealer)/(tabs)/quotations" as Href,
  orders: "/(dealer)/(tabs)/orders" as Href,
  testdrives: "/(shared)/testdrives" as Href, // nếu bạn có tab riêng thì đổi lại
} as const;

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  pressable: { transform: [{ scale: 1 }] },
});

// tiện ích header auth
function authHeaders(token?: string) {
  return {
    accept: "*/*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
function fmtVNDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}
function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DealerHome() {
  const { token } = useAppSelector(selectAuth);

  // Stats
  const [quotesCount, setQuotesCount] = useState<number | null>(null);
  const [stockCount, setStockCount] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [appts, setAppts] = useState<TestDriveLite[] | null>(null);

  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const q = fetch(`https://electric-vehicle-dealer-management.onrender.com/api/v1/quotes`, {
        headers: authHeaders(token ?? undefined),
      }).then(async (r) => {
        const j: QuotesRes = await r.json();
        // backend chưa có total → tạm thời đếm length
        setQuotesCount(j?.data?.quotes?.length ?? 0);
      }).catch(() => setQuotesCount(0));

      const v = fetch(
        `https://electric-vehicle-dealer-management.onrender.com/api/v1/vehicles?status=ACTIVE&limit=1&offset=0`,
        { headers: authHeaders(token ?? undefined) }
      ).then(async (r) => {
        const j: VehiclesRes = await r.json();
        setStockCount(j?.data?.total ?? (j?.data?.vehicles?.length ?? 0));
      }).catch(() => setStockCount(0));

      const o = fetch(
        `https://electric-vehicle-dealer-management.onrender.com/api/v1/orders?status=PENDING`,
        { headers: authHeaders(token ?? undefined) }
      ).then(async (r) => {
        // Nếu API chưa có → có thể trả 404. Bắt lỗi để không vỡ UI
        if (!r.ok) throw new Error("orders endpoint not ready");
        const j: OrdersRes = await r.json();
        setPendingOrders(j?.data?.orders?.length ?? 0);
      }).catch(() => setPendingOrders(0));

      const d = fetch(
        `https://electric-vehicle-dealer-management.onrender.com/api/v1/testdrives?date=${todayISODate()}&limit=3`,
        { headers: authHeaders(token ?? undefined) }
      ).then(async (r) => {
        if (!r.ok) throw new Error("testdrives endpoint not ready");
        const j: TestDrivesRes = await r.json();
        setAppts(j?.data?.testdrives ?? []);
      }).catch(() => setAppts([]));

      await Promise.allSettled([q, v, o, d]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const stats = useMemo(
    () => [
      { value: quotesCount, label: "My Total Quotations", icon: "file-text" as const },
      { value: stockCount,  label: "Total Cars in Stock", icon: "car" as const },
      { value: pendingOrders, label: "Pending Orders", icon: "shopping-bag" as const },
      { value: appts?.length ?? 0, label: "Test Drives Today", icon: "calendar" as const },
    ],
    [quotesCount, stockCount, pendingOrders, appts]
  );

  return (
    <ScrollView className="flex-1 bg-[#0B1220]" contentContainerStyle={{ padding: 16 }}>
      {/* Reload */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white/80">Overview</Text>
        <Pressable
          onPress={loadAll}
          className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15"
        >
          <Text className="text-white/80 text-xs">Reload</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View className="flex-row flex-wrap -mx-1">
        {stats.map((s, i) => (
          <View key={i} className="w-1/2 px-1 mb-2">
            <View style={styles.card} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <View className="flex-row items-center justify-between">
                <View className="rounded-xl bg-white/10 p-2">
                  {/* <Feather name={s.icon} size={16} color="#CFE2FF" /> */}
                </View>
                <Text className="text-white/50 text-xs">{s.label}</Text>
              </View>
              <View className="mt-3 min-h-[28px]">
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white text-2xl font-bold">
                    {typeof s.value === "number" ? s.value : "—"}
                  </Text>
                )}
              </View>
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
          icon="navigation-2"
          title="Schedule Test Drive"
          subtitle="Book a time for customer"
          onPress={() => router.push(ROUTES.testdrives)}
        />
      </View>

      {/* Appointments */}
      <SectionHeader
        title="My Test Drive Appointments"
        actionText="See all"
        onAction={() => router.push(ROUTES.testdrives)}
      />
      <View className="gap-2">
        {loading ? (
          <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <ActivityIndicator />
            <Text className="text-white/70 mt-2">Loading test drives…</Text>
          </View>
        ) : appts && appts.length > 0 ? (
          appts.map((a) => (
            <View key={a.id} style={styles.card} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-white font-semibold">
                    {a.customer_name ?? "—"}
                  </Text>
                  <Text className="text-white/70 text-sm mt-1">
                    {a.vehicle_label ?? "—"}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <Feather name="clock" size={14} color="#A9B4C4" />
                    <Text className="text-white/60 text-xs">
                      {fmtVNDateTime(a.start_time)}
                    </Text>
                  </View>
                </View>
                <View className="rounded-xl bg-white/10 p-3">
                  <Feather name="chevron-right" size={16} color="#E7EEF7" />
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-white/60 py-8 text-center">No test drives today</Text>
        )}
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
