import React from "react";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EvmStaffStackLayout() {
  const router = useRouter();
  const Back = () => (
    <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center" }}>
      <Feather name="chevron-left" size={22} color="#E7EEF7" />
      <Text style={{ color: "#E7EEF7", fontWeight: "600" }}>Back</Text>
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0B1220" },
        headerTintColor: "#E7EEF7",
        headerTitleStyle: { color: "#0B1220" },
        headerShadowVisible: false,
        headerShown: true,
        headerLeft: () => <Back />,
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "User detail" }} />
      <Stack.Screen name="create" options={{ title: "Create user" }} />
    </Stack>
  );
}
