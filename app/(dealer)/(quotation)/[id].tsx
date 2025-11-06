import CustomDivider from "@/src/components/ui/CustomDivider";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import CustomPrice from "@/src/components/ui/CustomPrice";
import { color, images } from "@/src/constants";
import useCustomer from "@/src/hooks/useCustomer";
import useQuotations from "@/src/hooks/useQuotations";
import useVehicles from "@/src/hooks/useVehicles";
import useVouchers from "@/src/hooks/useVouchers";
import { formatToDollar } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statusOptions = ["Pending", "Accepted", "Declined"];

const QuotationDetail = () => {
  const { fetchQuotationDetail, updateQuotation, qdetail } = useQuotations();
  const { fetchCustomerDetail, cdetail } = useCustomer();
  const { fetchVehicleDetail, vdetail } = useVehicles();
  const { fetchVoucherDetail, vodetail } = useVouchers();

  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [note, setNote] = React.useState("");

  const { id } = useLocalSearchParams();
  const quoteID = Number(id);

  // Fetch quotation detail
  useEffect(() => {
    fetchQuotationDetail(quoteID);
  }, [fetchQuotationDetail, quoteID]);

  // Set status from API
  useEffect(() => {
    if (qdetail?.status) {
      setSelectedStatus(qdetail.status);
    }
  }, [qdetail]);

  // Set note from API
  useEffect(() => {
    if (qdetail?.note) setNote(qdetail.note);
  }, [qdetail]);

  // Fetch related info
  useEffect(() => {
    if (qdetail) {
      if (qdetail.customerID) fetchCustomerDetail(qdetail.customerID);
      if (qdetail.vehicleID) fetchVehicleDetail(qdetail.vehicleID);
      if (qdetail.voucherID) fetchVoucherDetail(qdetail.voucherID);
    }
  }, [qdetail, fetchCustomerDetail, fetchVehicleDetail, fetchVoucherDetail]);

  // Price calculation
  const price = vdetail?.dealerPrice ?? 0;
  const discountPercent = vodetail?.discountPercentage ?? 0;
  const discountValue = (price * discountPercent) / 100;

  const isFinalStatus =
    qdetail?.status?.toLowerCase() === "accepted" ||
    qdetail?.status?.toLowerCase() === "declined";

  const handleUpdateStatus = (status: string) => {
    setSelectedStatus(status);
    setShowStatusModal(false);

    // TODO: call API update quotation status here
    // updateQuotationStatus(quoteID, status)
  };

  const handleUpdateQuote = async () => {
    const body = {
      status: selectedStatus,
      note: note,
    };
    try {
      const success = await updateQuotation(quoteID, body);
      if (success) {
        Alert.alert("Success", "Quote updated successfully", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/quotations"),
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
    console.log(body);
  };

  return (
    <SafeAreaView className="flex-1 px-4">
      {/* Header */}
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">
          Quotation Detail
        </Text>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color={"white"} />
        </Pressable>
      </View>

      {/* Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerClassName="gap-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Customer info */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row gap-2 items-center mb-5">
              <Ionicons
                name="person-outline"
                size={24}
                color={color.iconColor}
              />
              <Text className="font-semibold text-xl text-white">
                Customer Information
              </Text>
            </View>

            <View className="flex-row gap-4 items-center">
              <Image
                source={images.avt_placeholder}
                className="size-[65px] rounded-full"
              />

              <View>
                <Text className="font-medium text-xl text-white">
                  {cdetail?.fullName}
                </Text>
                <Text className="text-secondary text-base">
                  {cdetail?.phone}
                </Text>
                <Text className="text-secondary text-base">
                  {cdetail?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Vehicle info */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row gap-2 items-center mb-5">
              <Ionicons name="car-outline" size={24} color={color.iconColor} />
              <Text className="font-semibold text-xl text-white">
                Vehicle Selection
              </Text>
            </View>

            <Image
              source={{ uri: vdetail?.imageURL }}
              resizeMode="cover"
              className="w-full h-[250px] rounded-[10px]"
            />

            <View className="gap-5 mt-5">
              <Text className="font-semibold text-white text-xl">
                {vdetail?.model}
              </Text>
              <View className="flex-row justify-between">
                <CustomModelSpecs
                  label="Power"
                  value={`${vdetail?.features.motor}`}
                />
                <CustomModelSpecs
                  label="Seats"
                  value={`${vdetail?.features.seats}`}
                />
                <CustomModelSpecs
                  label="Battery"
                  value={`${vdetail?.features.battery}`}
                />
                <CustomModelSpecs
                  label="Drive"
                  value={`${vdetail?.features.drivetrain}`}
                />
              </View>

              <View className="flex-row gap-[50px]">
                <View>
                  <Text className="text-secondary text-base">Color</Text>
                  <Text className="font-semibold text-white text-xl">
                    {vdetail?.color}
                  </Text>
                </View>
                <View>
                  <Text className="text-secondary text-base">Variant</Text>
                  <Text className="font-semibold text-white text-xl">
                    {vdetail?.version}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Pricing */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row gap-2 items-center mb-5">
              <Ionicons name="cash-outline" size={24} color={color.iconColor} />
              <Text className="font-semibold text-xl text-white">
                Pricing & Discounts
              </Text>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-secondary text-base">On-Road Price</Text>
                <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                  {formatToDollar(vdetail?.dealerPrice as number)}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-secondary text-base">Voucher</Text>
                <Text className="font-semibold text-white text-center px-3 py-[14px] bg-blue rounded-[10px]">
                  {vodetail?.discountPercentage}%
                </Text>
              </View>
            </View>

            <View className="p-[15px] bg-dark rounded-[10px] mt-5 gap-4">
              <CustomPrice
                title="Subtotal"
                value={formatToDollar(price)}
                valueStyles="text-white text-lg"
              />
              <CustomPrice
                title="Discount"
                value={`-${formatToDollar(discountValue)}`}
                valueStyles="text-[#16D68F] text-lg"
              />
              <CustomDivider />
              <CustomPrice
                title="Total Price"
                value={formatToDollar(qdetail?.finalPrice as number)}
                valueStyles="text-white text-xl"
                titleStyles="text-white font-semibold text-xl"
              />
            </View>

            {/* Update Status */}
            <View className="mt-5">
              <View className="gap-2">
                <Text className="text-secondary text-base font-medium">
                  Quotation Status
                </Text>
                <Pressable
                  disabled={isFinalStatus}
                  onPress={() => !isFinalStatus && setShowStatusModal(true)}
                  className={cn(
                    "py-3 w-full rounded-[8px]",
                    isFinalStatus ? "bg-gray" : "bg-blue"
                  )}
                >
                  <Text className="font-semibold text-base text-center text-white">
                    {selectedStatus || "Update Status"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row gap-2 items-center mb-5">
              <Ionicons
                name="document-text-outline"
                size={24}
                color={color.iconColor}
              />
              <Text className="font-semibold text-xl text-white">
                Additional Notes
              </Text>
            </View>

            <TextInput
              multiline
              placeholder="Write something..."
              placeholderTextColor="#959CA7"
              textAlignVertical="top"
              className="p-4 font-msr-medium text-lg border rounded-xl bg-dark border-secondary text-white"
              style={{ minHeight: 150 }}
              value={note}
              editable={!isFinalStatus}
              // value={note}
              onChangeText={(text) => !isFinalStatus && setNote(text)}
            />
          </View>
          {qdetail?.status !== "Declined" && (
            <View className="mt-5">
              <Pressable
                className="py-3 w-full rounded-[8px] bg-blue"
                onPress={handleUpdateQuote}
              >
                <Text className="font-semibold text-base  text-center text-white">
                  {qdetail?.status === "Accepted"
                    ? "Create Order"
                    : qdetail?.status === "Pending"
                      ? "Update Quote"
                      : ""}
                  {/* Update quote */}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#1E1E1E",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                marginBottom: 12,
              }}
            >
              Update Status
            </Text>

            {statusOptions.map((status) => (
              <Pressable
                key={status}
                onPress={() => handleUpdateStatus(status)}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 0.8,
                  borderBottomColor: "#444",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: selectedStatus === status ? "#4DA6FF" : "white",
                    fontWeight: selectedStatus === status ? "600" : "400",
                  }}
                >
                  {status}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setShowStatusModal(false)}
              style={{
                marginTop: 15,
                paddingVertical: 12,
                backgroundColor: "#444",
                borderRadius: 10,
              }}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 16 }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuotationDetail;
