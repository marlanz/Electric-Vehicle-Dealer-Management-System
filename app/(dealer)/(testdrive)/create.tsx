import CustomerPickerModal from "@/src/components/ui/CustomerPickerModal";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import DateTimeInput from "@/src/components/ui/DateTimeInput ";
import { color, images } from "@/src/constants";
import { selectAuth } from "@/src/features/auth/authSlice";
import useAppointments from "@/src/hooks/useAppointments";
import useCustomer from "@/src/hooks/useCustomer";
import useVehicles from "@/src/hooks/useVehicles";
import { useAppSelector } from "@/src/store";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

export interface SelectedCustomerProps {
  fullName: string;
  phone: string;
  email: string;
}

const CreateAppointment = () => {
  const { fetchAllCustomers, cdata } = useCustomer();

  const { user } = useAppSelector(selectAuth);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [form, setForm] = useState<{
    customerID: string;
    appointedDate: string;
    note: string;
  }>({ customerID: "", appointedDate: "", note: "" });

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomerProps | null>(null);

  const { vehicleID } = useLocalSearchParams();

  const { fetchVehicleDetail, vdetail } = useVehicles();

  const { createAppointment } = useAppointments();

  const handleCreateAppointment = async () => {
    if (!form) return;
    try {
      const body = {
        customerID: form.customerID,
        vehicleID: Array.isArray(vehicleID) ? vehicleID[0] : vehicleID, // ✅ ensure string
        dealerLocation: "EV Motors TP.HCM",
        appointedDate: form.appointedDate,
        staffName: user?.full_name,
        status: "Scheduled",
        note: form.note,
        isQuote: false,
      };

      const success = await createAppointment(body);
      if (success) {
        Alert.alert("Success", "Test drive appointment created successfully", [
          {
            text: "OK",
            onPress: () => router.push("/"), // ✅ go home after OK
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVehicleDetail(vehicleID as string);
  }, [vehicleID, fetchVehicleDetail]);

  useEffect(() => {
    fetchAllCustomers();
  }, [fetchAllCustomers]);

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
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color.iconColor}
                />
                <Text className="font-semibold text-xl text-white">
                  Customer Information
                </Text>
              </View>

              {selectedCustomer && (
                <Pressable onPress={() => setShowCustomerModal(true)}>
                  <AntDesign name="user-switch" size={24} color="white" />
                </Pressable>
              )}
            </View>
            {!selectedCustomer ? (
              <Pressable
                className="py-3 w-full rounded-[8px] bg-blue"
                onPress={() => setShowCustomerModal(true)}
              >
                <Text className="font-semibold text-base  text-center text-white">
                  Add Customer
                </Text>
              </Pressable>
            ) : (
              <View className="flex-row gap-4 items-center">
                <Image
                  source={images.avt_placeholder}
                  className="size-[65px] rounded-full"
                />

                <View>
                  <Text className="font-medium text-xl text-white">
                    {selectedCustomer?.fullName}
                  </Text>
                  <Text className="text-secondary text-base">
                    {selectedCustomer.phone}
                  </Text>
                  <Text className="text-secondary text-base">
                    {selectedCustomer.email}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <CustomerPickerModal
            visible={showCustomerModal}
            customers={cdata}
            onClose={() => setShowCustomerModal(false)}
            onSelect={(customer) => {
              setSelectedCustomer({
                fullName: customer.fullName,
                phone: customer.phone,
                email: customer.email,
              });

              setForm((prev: any) => ({
                ...prev,
                customerID: customer.id,
              }));

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
                source={{ uri: vdetail?.imageURL }}
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
                    {vdetail?.model}
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
                        value={`${vdetail?.features.motor}`}
                      />
                      <CustomModelSpecs
                        label="Total Seats"
                        value={`${vdetail?.features.seats} seats`}
                      />
                      <CustomModelSpecs
                        label="Battery"
                        value={`${vdetail?.features.battery}`}
                      />
                      <CustomModelSpecs
                        label="Drivetrain"
                        value={`${vdetail?.features.drivetrain}`}
                      />
                    </View>
                  </View>
                </View>
                {/* Color */}
                <View className="flex-row gap-[50px]">
                  <View className="gap-1 ">
                    <Text className="font-medium text-base text-secondary">
                      Model Color
                    </Text>
                    <Text className="font-semibold text-white text-xl">
                      {vdetail?.color}
                    </Text>
                  </View>
                  <View className="gap-1">
                    <Text className="font-medium text-base text-secondary">
                      Model Variant
                    </Text>
                    <Text className="font-semibold text-white text-xl">
                      {vdetail?.version}
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
              <DateTimeInput
                onChangeDate={(dateStr) =>
                  setForm((prev) => ({ ...prev, appointedDate: dateStr }))
                }
              />

              {/* <View className="gap-2">
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
              </View> */}
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
                value={form.note}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, note: text }))
                }
              />
            </View>
          </View>
          <View className="mt-5">
            <Pressable
              className="py-3 w-full rounded-[8px] bg-blue"
              onPress={handleCreateAppointment}
            >
              <Text className="font-semibold text-base  text-center text-white">
                Confirm & Send
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAppointment;
