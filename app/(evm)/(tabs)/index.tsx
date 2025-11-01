import { color, images } from "@/src/constants";
import { selectAuth } from "@/src/features/auth/authSlice";
import { useAppSelector } from "@/src/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const dashboardStats = [
  {
    title: "Quotations",
    desc: "My Total Quotations",
    number: 38,
    icon: "document-outline",
  },
  {
    title: "Sales",
    desc: "My Total Vehicales Sold",
    number: 38,
    icon: "cash-outline",
  },
  {
    title: "Appointments",
    desc: "Test Drive Appointments",
    number: 38,
    icon: "car-outline",
  },
  {
    title: "Inventory",
    desc: "Total Cars In Stock",
    number: 12,
    icon: "cube-outline",
  },
];

const Home = () => {
  const { user } = useAppSelector(selectAuth);
  return (
    <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
      <SafeAreaView className="px-4 ">
        {/* Header */}
        <View className="flex-row justify-between items-center py-5">
          <View className="flex-row gap-3 items-center">
            <Image
              source={images.avt_placeholder}
              className="size-[50px] rounded-full"
              resizeMode="contain"
            />
            <View>
              <Text className="font-semibold text-white text-xl">
                Hello {user?.full_name}
              </Text>
              <Text className="font-medium text-secondary text-base">
                {user?.role}
              </Text>
            </View>
          </View>
          <Ionicons name="log-out-outline" size={24} color={"white"} />
        </View>

        <ScrollView>
          {/* Stats */}
          <View className="flex-wrap">
            {dashboardStats.map((d, index) => (
              <View key={index}>
                <Text className="text-white text-2xl font-semibold">
                  {d.number}
                </Text>
                <Text className="font-medium text-xl text-secondary mt-2">
                  {d.desc}
                </Text>
                <View className="mt-4 flex-row gap-2 items-center">
                  <Ionicons
                    name={d.icon as any}
                    size={24}
                    color={color.iconColor}
                  />
                  <Text className="text-white-100 font-semibold text-xl">
                    {d.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
