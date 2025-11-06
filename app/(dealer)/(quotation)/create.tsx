import CustomDivider from "@/src/components/ui/CustomDivider";
import CustomerPickerModal from "@/src/components/ui/CustomerPickerModal";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import CustomPrice from "@/src/components/ui/CustomPrice";
import VoucherPickerModal from "@/src/components/ui/VoucherPickerModal";
import { color, images } from "@/src/constants";
import { selectAuth } from "@/src/features/auth/authSlice";
import useCustomer from "@/src/hooks/useCustomer";
import useQuotations from "@/src/hooks/useQuotations";
import useVehicles from "@/src/hooks/useVehicles";
import useVouchers, { Vouchers } from "@/src/hooks/useVouchers";
import { useAppSelector } from "@/src/store";
import { formatToDollar } from "@/src/utils";
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
import { SelectedCustomerProps } from "../(testdrive)/create";

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
  const { vehicleID } = useLocalSearchParams();

  const { user } = useAppSelector(selectAuth);

  console.log(vehicleID); // your id value

  const { fetchVehicleDetail, vdetail } = useVehicles();

  const { fetchAllCustomers, cdata } = useCustomer();

  const { fetchAllVouchers, vodata } = useVouchers();

  const { createQuotations } = useQuotations();

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomerProps | null>(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [selectedVoucher, setSelectedVoucher] = useState<Vouchers | null>(null);

  const price = vdetail?.dealerPrice || 0;

  const discountPercent = selectedVoucher?.discountPercentage || 0;

  const discountAmount = price * (discountPercent / 100);

  const finalPrice = price - discountAmount;

  const [form, setForm] = useState<{
    customerID: string;
    appointedDate: string;
    note: string;
  }>({ customerID: "", appointedDate: "", note: "" });

  const handleSubmitQuotation = async () => {
    const body = {
      customerID: form.customerID,
      vehicleID: Array.isArray(vehicleID) ? vehicleID[0] : vehicleID,
      finalPrice: finalPrice,
      voucherID: selectedVoucher?.id ?? null,
      staffID: user?.full_name ?? null,
      status: "Pending",
      createAt: new Date().toISOString(),
      note: form.note,
    };
    console.log(body);

    try {
      const success = await createQuotations(body);
      if (success) {
        Alert.alert("Success", "Quotation created successfully", [
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

  useEffect(() => {
    fetchAllVouchers();
  }, []);
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
          contentContainerClassName=" gap-5 pb-6"
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
              {/* On-road price */}
              <View className="flex-row gap-4">
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">
                    On-Road Price
                  </Text>
                  <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                    {formatToDollar(price)}
                  </Text>
                </View>

                {/* Voucher select */}
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">
                    Voucher
                  </Text>

                  <Pressable
                    onPress={() => setShowVoucherModal(true)}
                    className="px-3 py-[14px] bg-blue rounded-[10px]"
                  >
                    <Text className="font-semibold text-white text-center">
                      {selectedVoucher
                        ? `${selectedVoucher.discountPercentage}% OFF`
                        : "Select Voucher"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Price Summary */}
              <View className="p-[15px] bg-dark rounded-[10px] gap-4">
                <CustomPrice
                  title="Subtotal"
                  value={formatToDollar(price)}
                  valueStyles="text-white text-lg"
                />

                <CustomPrice
                  title="Discount"
                  value={`- ${formatToDollar(discountAmount)}`}
                  valueStyles="text-[#16D68F]  text-lg"
                />

                <CustomDivider />

                <CustomPrice
                  title="Total Price"
                  value={formatToDollar(finalPrice)}
                  valueStyles="text-white text-xl"
                  titleStyles="text-white font-semibold text-xl"
                />
              </View>
            </View>
          </View>

          <VoucherPickerModal
            visible={showVoucherModal}
            vouchers={vodata}
            onClose={() => setShowVoucherModal(false)}
            onSelect={(voucher: any) => setSelectedVoucher(voucher)}
          />

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
              onPress={handleSubmitQuotation}
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

export default CreateQuotation;
