import CustomButton from "@/src/components/ui/CustomButton";
import CustomStatCard from "@/src/components/ui/CustomStatCard";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const vehicleDetail = {
  id: 1,
  model: "Vinfast VF7 Limited Edition",
  brand: "Tesla",
  stock: "57 kW",
  maxDistance: "330 kWh",
  acceleration: 4.8,
  battery: 81,
  price: "$44,990",
  drivetrain: "AWD",
  seat: 5,
  discount: "$40,290",
  variant: "Eco",
  color: "Crimson Pulse",
  hex: "#C62833",
  img: "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg",
  desc: "Vinfast VF7 is a high-performance electric sedan with unparallel rage and exhilirating acceleration",
};

const VehicleDetail = () => {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="px-4">
      {/* Header */}
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">
          Vehicle Detail
        </Text>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color={"white"} />
        </Pressable>
      </View>

      {/* Vehicle Detail */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Image
          source={{ uri: vehicleDetail.img }}
          resizeMode="cover"
          className="w-full h-[300px] rounded-[10px]"
        />

        {/* Title */}
        <View className="gap-2 mt-5">
          <Text className="text-white font-bold text-2xl">
            {vehicleDetail.model}
          </Text>
          <Text className="text-secondary font-medium text-base">
            {vehicleDetail.desc}
          </Text>
        </View>

        {/* Specs */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <CustomStatCard
              title="Motor Engine"
              desc="Peak Power"
              number={vehicleDetail.maxDistance}
              icon={"engine-outline"}
            />
            <CustomStatCard
              title="Capacity"
              desc="Total Seats"
              number={`0${vehicleDetail.seat} seats`}
              icon={"seat-outline"}
            />
          </View>
          <View className="flex-row justify-between">
            <CustomStatCard
              title="Battery"
              desc="Max range"
              number={vehicleDetail.stock}
              icon={"battery-outline"}
            />
            <CustomStatCard
              title="Drivetrain"
              desc="Power Distribution"
              number={`${vehicleDetail.drivetrain} gear`}
              icon={"abacus"}
            />
          </View>
        </View>

        {/* Color */}
        <View className="gap-4 mt-6">
          <Text className="text-white font-semibold text-xl">Model Color</Text>
          <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
            <View className="gap-2 flex-1">
              <Text className="text-white font-semibold text-[18px]">
                {vehicleDetail.color}
              </Text>
              <Text className="text-secondary font-semibold text-base">
                Energetic & sharp
              </Text>
            </View>
            <View
              className="size-[20px] rounded-full"
              style={{ backgroundColor: vehicleDetail.hex }}
            ></View>
          </View>
        </View>

        {/* Variant */}
        <View className="gap-4 mt-8">
          <Text className="text-white font-semibold text-xl">
            Model Variant
          </Text>
          <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
            <View className="gap-2 flex-1">
              <Text className="text-white font-semibold text-[18px]">
                {vehicleDetail.variant} version
              </Text>
              <Text className="text-secondary font-semibold text-base">
                Efficient for maximum range.
              </Text>
            </View>
            <Text className="font-semibold text-xl text-white">$74,000</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="mt-[40px]">
          <CustomButton
            btnStyles="bg-blue"
            textStyles="text-white"
            title="Create Quotation"
            onPress={() => {}}
          />
          <View className="flex-row gap-3 mt-4">
            <CustomButton
              btnStyles="bg-[#61B1FF]/[0.15] "
              textStyles="text-blue"
              title="Book Test Drive"
              onPress={() => {}}
            />
            <CustomButton
              btnStyles="border border-blue "
              textStyles="text-blue"
              title="Request for Stock"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VehicleDetail;
