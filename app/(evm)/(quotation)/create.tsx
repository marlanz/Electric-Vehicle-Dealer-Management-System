import CustomButton from "@/src/components/ui/CustomButton";
import CustomDivider from "@/src/components/ui/CustomDivider";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import CustomPrice from "@/src/components/ui/CustomPrice";
import { color, images } from "@/src/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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

const CreateQuotation = () => {
  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">
          Create Quotation
        </Text>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color={"white"} />
        </Pressable>
      </View>

      {/* Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName="mt-6 gap-5 pb-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Customer info */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color.iconColor}
                />
                <Text className="font-semibold text-xl text-white">
                  Customer Information
                </Text>
              </View>
              <Text className="text-[#16D68F] font-medium textbase px-[10px] py-[5px] bg-[#16D68F]/[0.1] rounded-[8px]">
                Verified
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row gap-4">
                <Image
                  source={images.avt_placeholder}
                  className="size-[65px] rounded-full"
                  resizeMode="contain"
                />
                <View>
                  <Text className="font-medium text-xl text-white">
                    Nguyễn Minh Sang
                  </Text>
                  <Text className="mt-1 text-secondary font-medium text-base">
                    +84 98738726
                  </Text>
                  <Text className="text-secondary font-medium text-base mt-1">
                    johndoe.test@gmail.com
                  </Text>
                </View>
              </View>
              <AntDesign name="user-switch" size={24} color="white" />
            </View>
          </View>
          {/* Vehicle info */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons
                  name="car-outline"
                  size={24}
                  color={color.iconColor}
                />
                <Text className="font-semibold text-xl text-white">
                  Vehicle Selection
                </Text>
              </View>
            </View>
            <View className="gap-5">
              <Image
                source={{ uri: vehicleDetail?.img }}
                resizeMode="cover"
                className="w-full h-[250px] rounded-[10px]"
              />
              <View className="gap-5">
                {/* Model name */}
                <View className="gap-1">
                  <Text className="font-medium text-base text-secondary">
                    Model
                  </Text>
                  <Text className="font-semibold text-white text-xl">
                    {vehicleDetail.model}
                  </Text>
                </View>
                {/* Specs */}
                <View>
                  <View className="gap-2">
                    <Text className="font-medium text-base text-secondary">
                      Specifications
                    </Text>
                    <View className="flex-row justify-between">
                      <CustomModelSpecs
                        label="Peak Power"
                        value={`${vehicleDetail.maxDistance}`}
                      />
                      <CustomModelSpecs
                        label="Total Seats"
                        value={`${vehicleDetail.seat} seats`}
                      />
                      <CustomModelSpecs
                        label="Battery"
                        value={`${vehicleDetail.stock}`}
                      />
                      <CustomModelSpecs
                        label="Drivetrain"
                        value={`${vehicleDetail.drivetrain}`}
                      />
                    </View>
                  </View>
                </View>
                {/* Color */}
                <View className="flex-row gap-[50px]">
                  <View className="gap-1">
                    <Text className="font-medium text-base text-secondary">
                      Model Color
                    </Text>
                    <Text className="font-semibold text-white text-xl">
                      {vehicleDetail.color}
                    </Text>
                  </View>
                  <View className="gap-1">
                    <Text className="font-medium text-base text-secondary">
                      Model Variant
                    </Text>
                    <Text className="font-semibold text-white text-xl">
                      {vehicleDetail.variant}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Pricing */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            {/* Header */}
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color={color.iconColor}
                />
                <Text className="font-semibold text-xl text-white">
                  Pricing & Discounts
                </Text>
              </View>
            </View>
            {/* Body */}
            <View className="gap-5">
              <View className="flex-row gap-4">
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">
                    On-Road Price
                  </Text>
                  <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                    {vehicleDetail.price}
                  </Text>
                </View>

                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">
                    Discount
                  </Text>
                  <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                    {vehicleDetail.price}
                  </Text>
                </View>
              </View>
              <View className="p-[15px] bg-dark rounded-[10px] gap-4">
                <CustomPrice
                  title="Subtotal"
                  value={vehicleDetail.price}
                  valueStyles="text-white"
                />
                <CustomPrice
                  title="Discount"
                  value={`- $2,000`}
                  valueStyles="text-[#16D68F]"
                />
                <CustomDivider />
                <CustomPrice
                  title="Total Price"
                  value={`$ 52,990`}
                  valueStyles="text-white"
                  titleStyles="text-white font-semibold text-xl"
                />
              </View>
            </View>
          </View>

          {/* Additional Notes */}

          <View className="p-[15px] bg-gray rounded-[10px]">
            {/* Header */}
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={color.iconColor}
                />
                <Text className="font-semibold text-xl text-white">
                  Additional Notes
                </Text>
              </View>
            </View>
            {/* Body */}
            <View className="bg-dark">
              <TextInput
                multiline
                autoCapitalize="none"
                numberOfLines={6}
                autoCorrect={false}
                placeholder="Write something..."
                placeholderTextColor="#959CA7"
                textAlignVertical="top"
                className="p-4 font-msr-medium text-lg border border-secondary rounded-xl text-secondary"
                style={{
                  minHeight: 150,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  lineHeight: 20,
                }}
              />
            </View>
          </View>
          <View className="mt-5">
            <CustomButton
              btnStyles="bg-blue"
              textStyles="text-white"
              title="Confirm & Send"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateQuotation;
