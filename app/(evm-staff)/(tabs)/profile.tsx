// app/(evm-staff)/(tabs)/profile.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchProfile, logout, selectUser } from "@/src/features/auth/authSlice";

const BG = "#0B1220";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</Text>
      <Text style={{ color: "#fff", fontWeight: "500", marginTop: 6 }}>{value ?? "—"}</Text>
    </View>
  );
}

function initials(name?: string | null) {
  const n = (name ?? "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/);
  const f = parts[0]?.[0] ?? "";
  const l = parts[parts.length - 1]?.[0] ?? "";
  return (f + l).toUpperCase();
}

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectUser);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchProfile()).unwrap();
    } catch {}
    setRefreshing(false);
  }, [dispatch]);

  const avatarFallback = useMemo(() => {
    // Tạo avatar chữ cái (initials)
    return (
      <View
        style={{
          width: 72, height: 72, borderRadius: 9999,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Text style={{ color: "#E7EEF7", fontSize: 22, fontWeight: "700" }}>{initials(user?.full_name)}</Text>
      </View>
    );
  }, [user?.full_name]);

  const handleLogout = useCallback(() => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
          router.replace("/(auth)/auth"); // đổi path đúng màn login của bạn
        },
      },
    ]);
  }, [dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View
          style={{
            height: 56,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Profile</Text>
          <Pressable
            onPress={onRefresh}
            hitSlop={8}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Refresh</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ padding: 16, paddingBottom: Math.max(24, insets.bottom + 16) }}
      >
        {/* Card top: avatar + name + role */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            padding: 16,
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Nếu bạn có ảnh avatar user.avatar_url thì thay Image vào đây, còn không dùng chữ cái */}
          {avatarFallback}

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }} numberOfLines={1}>
              {user?.full_name ?? "—"}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              {user?.role ?? "—"}
            </Text>
          </View>
        </View>

        {/* Card info chi tiết */}
        <View
          style={{
            marginTop: 12,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            padding: 16,
          }}
        >
          <Row label="Email" value={user?.email} />
          <Row label="User ID" value={user?.id} />
          <Row label="Status" value={user?.status} />
          <Row label="Dealer ID" value={user?.dealer_id} />

          <Row
            label="Dealer Address"
            value={(user as any)?.dealers?.address}
          />
          <Row
            label="Dealer Contact"
            value={`${(user as any)?.dealers?.contact_phone ?? "—"} • ${(user as any)?.dealers?.contact_email ?? "—"}`}
          />
          {/* <Row label="Created at" value={(user as any)?.created_at} />
          <Row label="Updated at" value={(user as any)?.updated_at} /> */}
        </View>

        {/* Logout */}
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Pressable
            onPress={handleLogout}
            style={{
              paddingHorizontal: 16,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#ef4444",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="log-out" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700" }}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
