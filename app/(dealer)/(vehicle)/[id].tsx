import CustomButton from "@/src/components/ui/CustomButton";
import CustomStatCard from "@/src/components/ui/CustomStatCard";
import useVehicles from "@/src/hooks/useVehicles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const vehicleDetail = {
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

  const { fetchVehicleDetail, vdetail, loading } = useVehicles();

  useEffect(() => {
    fetchVehicleDetail(id as string);
  }, [id, fetchVehicleDetail]);

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
          source={{ uri: vdetail?.imageURL }}
          resizeMode="cover"
          className="w-full h-[300px] rounded-[10px]"
        />

        {/* Title */}
        <View className="gap-2 mt-5">
          <Text className="text-white font-bold text-2xl">
            {vdetail?.model}
          </Text>
          <Text className="text-secondary font-medium text-base">
            {vdetail?.description}
          </Text>
        </View>

        <View className="flex-row justify-between mt-6">
          <View className="gap-1  w-[48%]">
            <Text className="font-medium text-lg text-secondary">
              Model Color
            </Text>
            <Text className="font-semibold text-white text-xl">
              {vehicleDetail.color}
            </Text>
          </View>
          <View className="gap-1 items-start  w-[48%]">
            <Text className="font-medium text-lg text-secondary">
              Model Variant
            </Text>
            <Text className="font-semibold text-white text-xl">
              {vehicleDetail.variant}
            </Text>
          </View>
        </View>
        {/* Specs */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <CustomStatCard
              title="Motor Engine"
              desc="Peak Power"
              number={vdetail?.features?.motor}
              icon={"engine-outline"}
            />
            <CustomStatCard
              title="Capacity"
              desc="Total Seats"
              number={`0${vdetail?.features?.seats} seats`}
              icon={"seat-outline"}
            />
          </View>
          <View className="flex-row justify-between">
            <CustomStatCard
              title="Battery"
              desc="Battery life"
              number={vdetail?.features.battery}
              icon={"battery-outline"}
            />
            <CustomStatCard
              title="Drivetrain"
              desc="Power Distribution"
              number={`${vdetail?.features.drivetrain} gear`}
              icon={"abacus"}
            />
          </View>
        </View>

        {/* Actions */}
        <View className="mt-[40px]">
          <Pressable
            className="py-3 w-full rounded-[8px] bg-blue"
            onPress={() => {
              if (!vdetail?.id) return;
              router.push({
                pathname: "/(quotation)/create" as any,
                params: { vehicleID: vdetail.id },
              });
            }}
          >
            <Text className="font-semibold text-base  text-center text-white">
              Create Quotation
            </Text>
          </Pressable>
          <View className="flex-row gap-3 mt-4">
            <CustomButton
              btnStyles="bg-[#61B1FF]/[0.15] "
              textStyles="text-blue"
              title="Book Test Drive"
              onPress={() => {
                router.push({
                  pathname: "/(testdrive)/create" as any,
                  params: { vehicleID: vdetail?.id },
                });
              }}
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
