import { logout, selectAuth } from "@/src/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { Feather } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  row: { flexDirection: "row", alignItems: "center" },
});

function titleCaseRole(r?: string) {
  if (!r) return "";
  return r
    .toLowerCase()
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function DealerHeaderTitle() {
  const { user } = useAppSelector(selectAuth);
  const name = user?.full_name ?? "Dealer User";
  const role = titleCaseRole(user?.role ?? "DEALER_STAFF");
  const avatarUri = "";

  return (
    <View style={[styles.row]}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={{ width: 32, height: 32, borderRadius: 16 }} />
      ) : (
        <View
          style={{
            width: 32, height: 32, borderRadius: 16,
            alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Text style={{ color: "#E7EEF7", fontWeight: "700", fontSize: 12 }}>
            {initialsOf(name)}
          </Text>
        </View>
      )}
      <View style={{ marginLeft: 12, maxWidth: 220 }}>
        <Text style={{ color: "white", fontWeight: "600" }} numberOfLines={1}>
          {name}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }} numberOfLines={1}>
          {role}
        </Text>
      </View>
    </View>
  );
}

function DealerHeaderRight() {
  const dispatch = useAppDispatch();

  const onLogout = async () => {
    await dispatch(logout());
    // về đúng màn auth hợp nhất
    router.replace("/(auth)/auth");
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onLogout} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name="log-out" size={18} color="#E7EEF7" />
      </TouchableOpacity>
      <View style={{ width: 12 }} />
      <TouchableOpacity onPress={() => router.push("/")} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name="bell" size={18} color="#E7EEF7" />
      </TouchableOpacity>
    </View>
  );
}

export default function DealerTabsLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#60A5FA",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarStyle: { backgroundColor: "#0B1220", borderTopColor: "rgba(255,255,255,0.08)" },
          tabBarLabelStyle: { fontSize: 11 },
          headerStyle: { backgroundColor: "#0B1220" },
          headerTitleAlign: "left",
          headerTintColor: "#E7EEF7",
          headerShadowVisible: false,
          headerTitle: () => <DealerHeaderTitle />,
          headerRight: () => <DealerHeaderRight />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="vehicles"
          options={{ title: "Vehicles", tabBarIcon: ({ color, size }) => <Feather name="truck" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="quotations"
          options={{ title: "Quotations", tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="orders"
          options={{ title: "Orders", tabBarIcon: ({ color, size }) => <Feather name="shopping-bag" size={size} color={color} /> }}
        />
      </Tabs>
    </>
  );
}
