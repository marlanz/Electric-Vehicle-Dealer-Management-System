import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const CustomHeader = () => {
  return (
    <View className="flex-row justify-between py-5">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={"white"} />
      </Pressable>
      <Text className="text-2xl font-semibold text-white">Vehicle Detail</Text>
      <Pressable>
        <Ionicons name="heart-outline" size={24} color={"white"} />
      </Pressable>
    </View>
  );
};

export default CustomHeader;
