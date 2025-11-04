// app/(dealer)/temp-selection.tsx
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  clearTempCustomers,
  clearTempVehicles,
  removeTempCustomer,
  removeTempVehicle,
  selectTempCustomers,
  selectTempVehicles,
  TempCustomer,
} from "@/src/features/selections/tempSelectionsSlice";

const BG = "#0B1220";

export default function TempSelectionsScreen() {
  const customers = useAppSelector(selectTempCustomers);
  const vehicles = useAppSelector(selectTempVehicles);
  const dispatch = useAppDispatch();

  const counts = useMemo(
    () => ({ c: customers.length, v: vehicles.length }),
    [customers.length, vehicles.length]
  );

  const confirmClearAll = () => {
    if (!counts.c && !counts.v) return;
    Alert.alert(
      "Clear all?",
      "Remove all selected customers and vehicles?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            dispatch(clearTempCustomers());
            dispatch(clearTempVehicles());
          },
        },
      ]
    );
  };

  const goToCreateQuote = () => {
    // Tiêu chí tối thiểu: có ít nhất 1 customer & 1 vehicle để prefill
    if (!counts.c || !counts.v) {
      Alert.alert(
        "Missing selection",
        !counts.c
          ? "Please add a customer to temp list."
          : "Please add a vehicle to temp list."
      );
      return;
    }
    // Prefill nên đọc trực tiếp từ slice trong màn create (đỡ phải pass params)
    router.push("/(dealer)/quotations/create" as const);
  };

  const goPickCustomers = () => router.push("/(dealer)/(tabs)/customers" as const);
  const goPickVehicles  = () => router.push("/(dealer)/(tabs)/vehicles" as const);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      <Stack.Screen options={{ title: "Temp Selections" }} />

      {/* Top actions */}
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <Text className="text-white/80">
          {counts.c} customers • {counts.v} vehicles
        </Text>
        <Pressable
          onPress={confirmClearAll}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/15"
        >
          <Text className="text-white/80">Clear all</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Customers */}
        <SectionTitle title="Customers" actionLabel="Pick" onAction={goPickCustomers} />
        {customers.length === 0 ? (
          <Empty hint="No temp customers" action="Pick customers" onPress={goPickCustomers} />
        ) : (
          customers.map((c: TempCustomer) => (
            <Card key={c.customerId}>
              <Text className="text-white font-semibold" numberOfLines={1}>
                {c.fullName}
              </Text>
              <Text className="text-white/70" numberOfLines={1}>
                {c.phone}{c.email ? ` • ${c.email}` : ""}
              </Text>

              <View className="flex-row gap-10 mt-3">
                <Btn
                  label="Remove"
                  tone="danger"
                  onPress={() => dispatch(removeTempCustomer(c.customerId))}
                />
              </View>
            </Card>
          ))
        )}

        {/* Vehicles */}
        <SectionTitle title="Vehicles" actionLabel="Pick" onAction={goPickVehicles} />
        {vehicles.length === 0 ? (
          <Empty hint="No temp vehicles" action="Pick vehicles" onPress={goPickVehicles} />
        ) : (
          vehicles.map((v) => (
            <Card key={v.id}>
              <Text className="text-white font-semibold" numberOfLines={1}>
                {v.model}{v.version ? ` • ${v.version}` : ""}
              </Text>
              {/* <Text className="text-white/70" numberOfLines={1}>
                {v.color ?? "—"}{v.year ? ` • ${v.year}` : ""}
              </Text> */}

              <View className="flex-row gap-10 mt-3">
                <Btn
                  label="Remove"
                  tone="danger"
                  onPress={() => dispatch(removeTempVehicle(v.id))}
                />
                <Btn
                  label="Open"
                  onPress={() =>
                    router.push({ pathname: "/(dealer)/(vehicles)/[id]", params: { id: v.id } })
                  }
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Bottom primary actions */}
      <BottomBar>
        <Btn label="Create quotation from temp" tone="primary" onPress={goToCreateQuote} />
      </BottomBar>
    </SafeAreaView>
  );
}

/* ---------- tiny UI helpers ---------- */

function SectionTitle({
  title,
  actionLabel,
  onAction,
}: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-2">
      <Text className="text-white text-lg font-bold">{title}</Text>
      {!!actionLabel && (
        <Pressable onPress={onAction} className="px-3 py-2 rounded-xl bg-white/10 border border-white/15">
          <Text className="text-white/80">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-2xl p-4 bg-white/5 border border-white/10 mb-3">
      {children}
    </View>
  );
}

function Empty({ hint, action, onPress }: { hint: string; action: string; onPress: () => void }) {
  return (
    <View className="items-start gap-3 mb-6">
      <Text className="text-white/60">{hint}</Text>
      <Pressable onPress={onPress} className="px-4 py-2 rounded-xl bg-blue-600">
        <Text className="text-white font-semibold">{action}</Text>
      </Pressable>
    </View>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        position: "absolute",
        left: 0, right: 0, bottom: 0,
        backgroundColor: BG,
        paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
        borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)",
      }}
    >
      <View className="flex-row items-center justify-start gap-10">
        {children}
      </View>
    </SafeAreaView>
  );
}

function Btn({
  label,
  onPress,
  tone = "neutral",
}: {
  label: string;
  onPress: () => void;
  tone?: "neutral" | "primary" | "danger";
}) {
  const styleByTone =
    tone === "primary"
      ? "bg-blue-600"
      : tone === "danger"
      ? "bg-rose-600/90"
      : "bg-white/10 border border-white/15";
  const textColor = tone === "neutral" ? "text-white" : "text-white";

  return (
    <Pressable onPress={onPress} className={`px-4 py-2 rounded-xl ${styleByTone}`}>
      <Text className={`${textColor} font-semibold`}>{label}</Text>
    </Pressable>
  );
}
