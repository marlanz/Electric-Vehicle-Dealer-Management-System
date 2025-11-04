import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import React from "react";

export default function DealerManagerTabsLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#60A5FA",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarStyle: { backgroundColor: "#101922", borderTopColor: "rgba(255,255,255,0.08)" },
          tabBarLabelStyle: { fontSize: 11 },
          headerStyle: { backgroundColor: "#0B1220" },
          headerTitleAlign: "left",
          headerTintColor: "#E7EEF7",
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="staffs"
          options={{
            title: "Staffs",
            tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
            tabBarIcon: ({ color, size }) => <Feather name="package" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="purchase-orders"
          options={{
            title: "Purchase Orders",
            tabBarIcon: ({ color, size }) => <Feather name="shopping-cart" size={size} color={color} />
          }}
        />
      </Tabs>
    </>
  );
}
