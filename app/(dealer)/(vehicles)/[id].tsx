// app/vehicles/[id].tsx (hoặc file VehicleDetailScreen bạn đang dùng)
import { selectAuth } from "@/src/features/auth/authSlice";
import { addTempVehicle, removeTempVehicle, selectTempVehicles } from "@/src/features/selections/tempSelectionsSlice";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { Feather, MaterialCommunityIcons as MCI } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

type Spec = { id: string; spec_name: string; spec_value: string };
type VehicleDetail = {
  vehicle_id: string;
  model: string;
  version?: string | null;
  color?: string | null;
  msrp?: string | number | null;
  features?: { motor?: string; seats?: number; battery?: string; drivetrain?: string };
  status?: string;
  year?: number | null;
  description?: string | null;
  image_url?: string | null;
  gallery?: string[] | null;
  specs?: Spec[] | null;
};

function currencyVND(v?: any) {
  if (v == null) return "—";
  if (typeof v === "object") return fmt(v); // phòng msrp trả object (hiếm)
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return String(v);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}
  function fmt(v: any): string {
    if (v == null) return "—";
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) return v.map(fmt).join(", ");
    // object -> "key: val • key2: val2"
    try {
      return Object.entries(v)
        .map(([k, val]) => `${k}: ${fmt(val)}`)
        .join(" • ");
    } catch {
      return String(v);
    }
  }
  function fmtMotor(m: any): string {
    if (!m) return "—";
    if (typeof m !== "object") return fmt(m);
    const parts: string[] = [];
    if (m.power != null)  parts.push(`${m.power} kW`);
    if (m.torque != null) parts.push(`${m.torque} Nm`);
    if (m.type)          parts.push(String(m.type));
    return parts.length ? parts.join(" • ") : fmt(m);
  }
  function fmtBattery(b: any): string {
    if (!b) return "—";
    if (typeof b !== "object") return fmt(b);
    const parts: string[] = [];
    if (b.capacity_kwh != null) parts.push(`${b.capacity_kwh} kWh`);
    if (b.range_km != null)     parts.push(`${b.range_km} km`);
    if (b.type)                 parts.push(String(b.type));
    return parts.length ? parts.join(" • ") : fmt(b);
  }
  export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAppSelector(selectAuth);
  const tempVehicles = useAppSelector(selectTempVehicles);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<VehicleDetail | null>(null);
  console.log("VehicleDetailScreen data:", data);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<{ visible: boolean; index: number }>({ visible: false, index: 0 });

  const inTemp = !!tempVehicles.find(v => v.id === id);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://electric-vehicle-dealer-management.onrender.com/api/v1/vehicles/${id}`,
        {
          headers: {
            accept: "*/*",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      setData(json?.data?.vehicle ?? null);
    } catch (e) {
      console.warn("Fetch vehicle detail error:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const images = useMemo(() => {
    const arr = [
      ...(data?.image_url ? [data.image_url] : []),
      ...(data?.gallery ?? []),
    ];
    return arr;
  }, [data?.image_url, data?.gallery]);

  const openViewer = (index: number) => setViewer({ visible: true, index });
  const closeViewer = () => setViewer({ visible: false, index: 0 });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1220]">
        <ActivityIndicator />
        <Text className="text-white/70 mt-2">Loading vehicle…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1220] p-6">
        <Text className="text-white font-semibold mb-2">Vehicle not found</Text>
        <Pressable onPress={() => router.back()} style={[ { flexDirection: "row", alignItems: "center" }]}>
          <Feather name="arrow-left" size={16} color="#E7EEF7" />
          <Text className="text-white ml-2">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const title = `${data.model}${data.version ? " " + data.version : ""}`;

  const toggleTempVehicle = () => {
    if (!data) return;
    if (inTemp) {
      dispatch(removeTempVehicle(data.vehicle_id));
    } else {
      dispatch(addTempVehicle({
        id: data.vehicle_id,
        model: data.model,
        version: data.version ?? null,
        color: data.color ?? null,
      }));
    }
  };

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header custom: Back + Title + (+) add-to-temp / remove */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#0B1220" }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>

          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
            {!!data.msrp && <Text numberOfLines={1} style={styles.headerSub}>From {currencyVND(data.msrp)}</Text>}
          </View>

          <Pressable
            onPress={toggleTempVehicle}
            hitSlop={8}
            style={[
              styles.headerIconBtn,
              inTemp
                ? { backgroundColor: "#065f46", borderColor: "rgba(255,255,255,0.12)" } // xanh rêu: đang có trong Temp
                : { backgroundColor: "#1e3a8a", borderColor: "rgba(255,255,255,0.12)" }, // xanh dương: thêm vào Temp
            ]}
          >
            <Feather name={inTemp ? "check" : "plus"} size={18} color="#E7EEF7" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Nội dung */}
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Gallery */}
        <View style={{ borderRadius: 24, overflow: "hidden" }} className="m-4">
          <Image
            source={{ uri: images[0] || "https://tse1.mm.bing.net/th/id/OIP.BNr7COrS5-hwntskpdYHpQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" }}
            style={{ width: "100%", height: 240 }}
            contentFit="cover"
          />
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10, gap: 10 }}
              style={{ backgroundColor: "rgba(255,255,255,0.02)", paddingHorizontal: 12 }}
            >
              {images.map((uri, idx) => (
                <Pressable key={uri + idx} onPress={() => openViewer(idx)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <Image source={{ uri }} style={{ width: 80, height: 60, borderRadius: 12 }} contentFit="cover" />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Viewer full-screen */}
        <ImageViewing
          images={images.map((u) => ({ uri: u }))}
          imageIndex={viewer.index}
          visible={viewer.visible}
          onRequestClose={closeViewer}
          presentationStyle="fullScreen"
        />

        {/* Detail */}
        <View className="px-5">
          <Text className="text-white text-[22px] font-extrabold" numberOfLines={2}>{title}</Text>

          <View className="flex-row items-center gap-2 mt-2">
            <Feather name="tag" size={16} color="#E8EEF7" />
            <Text className="text-white text-[18px] font-bold">{currencyVND(data.msrp)}</Text>
          </View>

          {/* Color • Year • Status */}
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1">
              <MCI name="palette" size={16} color="#C9D4E3" />
              <Text className="text-white/90">{data.color ?? "—"}</Text>
            </View>
            <Text className="text-white/30">•</Text>
            <View className="flex-row items-center gap-1">
              <Feather name="calendar" size={16} color="#C9D4E3" />
              <Text className="text-white/90">{data.year ?? "—"}</Text>
            </View>
            <Text className="text-white/30">•</Text>
            <View className="flex-row items-center gap-1">
              <Feather name={data.status === "ACTIVE" ? "check-circle" : "slash"} size={16} color="#C9D4E3" />
              <Text className="text-white/90">{data.status ?? "—"}</Text>
            </View>
          </View>

          {/* Quick specs */}
          <View className="mt-14 mb-3">
            <Text className="text-white/80 font-semibold mb-2">Quick specs</Text>
            <View className="flex-row flex-wrap gap-x-6 gap-y-8">
              {!!data.features?.motor && (
                <SpecItem
                  icon={<Feather name="zap" size={18} color="#9FB3C8" />}
                  label="Motor"
                  value={fmtMotor(data.features.motor)}
                />
              )}
              {data.features?.seats != null && (
                <SpecItem
                  icon={<Feather name="users" size={18} color="#9FB3C8" />}
                  label="Seats"
                  value={String(data.features.seats)}
                />
              )}
              {!!data.features?.battery && (
                <SpecItem
                  icon={<MCI name="battery-high" size={18} color="#9FB3C8" />}
                  label="Battery"
                  value={fmtBattery(data.features.battery)}
                />
              )}
              {!!data.features?.drivetrain && (
                <SpecItem
                  icon={<Feather name="settings" size={18} color="#9FB3C8" />}
                  label="Drivetrain"
                  value={fmt(data.features.drivetrain)}
                />
              )}
            </View>
          </View>

          {/* Specs table */}
          {!!data.specs?.length && (
            <View className="mt-2">
              <Text className="text-white/80 font-semibold mb-2">Detailed specs</Text>
              <View className="rounded-2xl overflow-hidden" style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                {data.specs.map((s, i) => (
                  <View
                    key={s.id}
                    className="flex-row items-center justify-between px-4 py-3"
                    style={{ backgroundColor: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}
                  >
                    <Text className="text-white/80">{fmt(s.spec_name)}</Text>
                    <Text className="text-white font-medium" numberOfLines={1}>
                      {fmt(s.spec_value)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {!!data.description && (
            <View className="mt-6">
              <Text className="text-white/80 font-semibold mb-2">Description</Text>
              <Text className="text-white/80 leading-6">{data.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar (đã BỎ nút Add-to-Temp). Hai nút này là nền đặc, rõ ràng */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomWrap}>
        <View style={styles.bottomBar}>
          <Pressable
            onPress={() => data?.vehicle_id && router.push({ pathname: "/(dealer)/testdrives/create", params: { vehicleId: data.vehicle_id } })}
            style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.9 }]}
          >
            <Feather name="navigation-2" size={16} color="#fff" />
            <Text style={styles.btnSecondaryText}>Book Test Drive</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/quotations" as const)}
            style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.95 }]}
          >
            <Feather name="file-plus" size={16} color="#fff" />
            <Text style={styles.btnPrimaryText}>Create Quotation</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode; // <- đổi sang ReactNode
}) {
  return (
    <View className="w-[46%]">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-white/70">{label}</Text>
      </View>
      {/* value giờ có thể là string/number/ReactNode đã format */}
      <Text className="text-white font-semibold mt-1">{value as any}</Text>
    </View>
  );
}

const BLUE = "#2563eb";      // xanh sáng hơn
const INDIGO = "#3b82f6";    // nút phụ
const BG = "#0B1220";

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BG,
  },
  headerIconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: { color: "white", fontWeight: "700", fontSize: 16 },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 12 },

  bottomWrap: { backgroundColor: BG },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  btnSecondary: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: INDIGO,             // << đổi từ xanh rất đậm sang xanh rõ ràng
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  btnSecondaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  // solid outline-like button (nền xanh đậm, border nhạt, chữ trắng)
  btnOutlineSolid: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#1f3d8b",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnOutlineSolidText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

   btnPrimary: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: BLUE,               // << sáng, nổi bật
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
