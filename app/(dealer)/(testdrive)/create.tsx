import CustomButton from "@/src/components/ui/CustomButton";
import CustomerPickerModal from "@/src/components/ui/CustomerPickerModal";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import DateTimeInput from "@/src/components/ui/DateTimeInput ";
import { color, images } from "@/src/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

export const customers = [
  {
    id: "CUS-001",
    name: "Nguyễn Minh Sang",
    phone: "+84 98738726",
    email: "sang.nguyen@example.com",
  },
  {
    id: "CUS-002",
    name: "Trần Thu Hà",
    phone: "+84 912345678",
    email: "ha.tran@example.com",
  },
  {
    id: "CUS-003",
    name: "Lê Hoàng Dũng",
    phone: "+84 988222111",
    email: "dung.le@example.com",
  },
];

const CreateAppointment = () => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">
          Create Appointment
        </Text>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color={"white"} />
        </Pressable>
      </View>

      {/* Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={{ flex: 1 }}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName="gap-5 "
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Customer info */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons name="person-outline" size={24} color="white" />
                <Text className="font-semibold text-xl text-white">
                  Customer Information
                </Text>
              </View>

              <Pressable onPress={() => setShowCustomerModal(true)}>
                <AntDesign name="user-switch" size={24} color="white" />
              </Pressable>
            </View>

            <View className="flex-row gap-4 items-center">
              <Image
                source={images.avt_placeholder}
                className="size-[65px] rounded-full"
              />

              <View>
                <Text className="font-medium text-xl text-white">
                  {selectedCustomer.name}
                </Text>
                <Text className="text-secondary text-base">
                  {selectedCustomer.phone}
                </Text>
                <Text className="text-secondary text-base">
                  {selectedCustomer.email}
                </Text>
              </View>
            </View>
          </View>

          <CustomerPickerModal
            visible={showCustomerModal}
            customers={customers}
            onClose={() => setShowCustomerModal(false)}
            onSelect={(customer) => {
              setSelectedCustomer(customer);
              setShowCustomerModal(false);
            }}
          />
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
          {/* Appointment details */}
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
                  Appointment Details
                </Text>
              </View>
            </View>
            {/* Body */}
            <View className="gap-5">
              <DateTimeInput />
              <View className="gap-2 flex-1">
                <Text className="font-medium text-base text-secondary">
                  Test Drive Location
                </Text>
                <View className="p-4  bg-dark rounded-[10px] border border-secondary flex-row justify-between items-center">
                  <View className="gap-1">
                    <Text className="font-semibold text-white text-lg">
                      Showroom Vinfast Go Vap
                    </Text>
                    <Text className="font-medium text-secondary text-base">
                      123 Nguyen Van Luong, P.11, Q.Go Vap
                    </Text>
                  </View>
                  <Ionicons name="location-outline" size={24} color="white" />
                </View>
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

export default CreateAppointment;
