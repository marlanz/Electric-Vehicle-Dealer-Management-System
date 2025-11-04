import { selectAuth } from "@/src/features/auth/authSlice";
import { addTempVehicle } from "@/src/features/selections/tempSelectionsSlice";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { Feather, MaterialCommunityIcons as MCI } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams, type Href } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

type Spec = { id: string; spec_name: string; spec_value: string };
type VehicleDetail = {
  id: string;
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

function currencyVND(v?: string | number | null) {
  if (v == null) return "—";
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return String(v);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<{ visible: boolean; index: number }>({ visible: false, index: 0 });

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

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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
  const normalizedStatus: "ACTIVE" | "INACTIVE" =
  data.status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
  const title = `${data.model}${data.version ? " " + data.version : ""}`;

  return (
    <View className="flex-1 bg-[#0B1220]">
      {/* Ẩn header mặc định, dùng header custom bên dưới */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header custom (back + title + price nhỏ) */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#0B1220" }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
            {!!data.msrp && (
              <Text numberOfLines={1} style={styles.headerSub}>From {currencyVND(data.msrp)}</Text>
            )}
          </View>
          <Pressable onPress={() => {}} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="share-2" size={18} color="#E7EEF7" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Nội dung */}
      <ScrollView contentContainerStyle={{ paddingBottom: 96 /* chừa chỗ cho bottom bar */ }}>
        {/* Gallery lớn + thumbnails */}
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

        {/* Thông tin chi tiết */}
        <View className="px-5">
          <Text className="text-white text-[22px] font-extrabold" numberOfLines={2}>{title}</Text>

          <View className="flex-row items-center gap-2 mt-2">
            <Feather name="tag" size={16} color="#E8EEF7" />
            <Text className="text-white text-[18px] font-bold">
              {currencyVND(data.msrp)}
            </Text>
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

          {/* Specs nhanh */}
          <View className="mt-14 mb-3">
            <Text className="text-white/80 font-semibold mb-2">Quick specs</Text>
            <View className="flex-row flex-wrap gap-x-6 gap-y-8">
              {!!data.features?.motor && (
                <SpecItem icon={<Feather name="zap" size={18} color="#9FB3C8" />} label="Motor" value={data.features.motor} />
              )}
              {data.features?.seats != null && (
                <SpecItem icon={<Feather name="users" size={18} color="#9FB3C8" />} label="Seats" value={String(data.features.seats)} />
              )}
              {/* {!!data.features?.drivetrain && (<View></View>
                // <SpecItem icon={<MCI name="all-wheel-drive" size={18} color="#9FB3C8" />} label="Drivetrain" value={data.features.drivetrain} />
              )} */}
              {!!data.features?.battery && (
                <SpecItem icon={<MCI name="battery-high" size={18} color="#9FB3C8" />} label="Battery" value={data.features.battery} />
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
                    <Text className="text-white/80">{s.spec_name}</Text>
                    <Text className="text-white font-medium">{s.spec_value}</Text>
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

      {/* Bottom Action Bar */}
        <SafeAreaView edges={["bottom"]} style={styles.bottomWrap}>
        <View style={styles.bottomBar}>
            <Pressable
            onPress={() => router.push("/testdrives" as const)}
            style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.85 }]}
            >
            <Feather name="navigation-2" size={16} color="#9EC5FE" />
            <Text style={styles.btnOutlineText}>Book Test Drive</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (data) {
                  // map data vào type Vehicle đã dùng trong FE của bạn
                  dispatch(addTempVehicle({
                    id: data.id,
                    model: data.model,
                    version: data.version ?? null,
                    color: data.color ?? null,
                    // msrp: String(data.msrp ?? ""),
                    // features: data.features ?? null,
                    // status: normalizedStatus,
                    // year: data.year ?? null,
                    // description: data.description ?? null,
                    // image_url: data.image_url ?? null,
                    // gallery: data.gallery ?? null,
                    // wholesale_price: null as any,
                  }));
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600/90"
            >
              <Text className="text-white font-semibold">+ Add to Temp</Text>
            </Pressable>
            <View style={{ width: 10 }} />

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

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="w-[46%]">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-white/70">{label}</Text>
      </View>
      <Text className="text-white font-semibold mt-1">{value}</Text>
    </View>
  );
}
const BLUE = "#2B61D1";
const BG   = "#0B1220";
const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0B1220",
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
  bottomWrap: {
    backgroundColor: BG
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",   
  },

  btnOutline: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BLUE,
    backgroundColor: BG,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",        
  },
  btnOutlineText: {
    color: "#E6F0FF",               
    fontWeight: "700",
    fontSize: 13,
  },

  btnPrimary: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  btnPrimaryText: {
    
    color: "#12312",
    fontWeight: "700",
    fontSize: 13,
  },
});
