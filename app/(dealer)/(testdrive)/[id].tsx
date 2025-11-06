import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import DateTimeInput from "@/src/components/ui/DateTimeInput ";
import { color, images } from "@/src/constants";
import useAppointments from "@/src/hooks/useAppointments";
import useCustomer from "@/src/hooks/useCustomer";
import useVehicles from "@/src/hooks/useVehicles";
import { Ionicons } from "@expo/vector-icons";
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

const statusOptions = ["Scheduled", "Completed", "Cancelled"];

const AppointmentDetail = () => {
  const { fetchAppointmentDetail, updateAppointment, adetail } =
    useAppointments();

  const { fetchCustomerDetail, cdetail } = useCustomer();

  const { fetchVehicleDetail, vdetail } = useVehicles();

  const [showStatusModal, setShowStatusModal] = React.useState(false);

  const [selectedStatus, setSelectedStatus] = React.useState("");

  const [note, setNote] = React.useState("");

  const { id } = useLocalSearchParams();

  const appointmentID = Number(id);

  const isFinalStatus =
    adetail?.status?.toLowerCase() === "completed" ||
    adetail?.status?.toLowerCase() === "cancelled";

  useEffect(() => {
    fetchAppointmentDetail(appointmentID);
  }, [fetchAppointmentDetail, appointmentID]);

  useEffect(() => {
    if (adetail?.status) {
      setSelectedStatus(adetail.status);
    }
  }, [adetail]);

  useEffect(() => {
    if (adetail?.note) setNote(adetail.note);
  }, [adetail]);

  useEffect(() => {
    if (adetail) {
      if (adetail.customerID) fetchCustomerDetail(adetail.customerID);
      if (adetail.vehicleID) fetchVehicleDetail(adetail.vehicleID);
    }
  }, [adetail, fetchCustomerDetail, fetchVehicleDetail]);

  const handlePress = (status: string) => {
    if (status === "Completed") {
      router.push("/");
    } else {
      handleUpdateAppointment();
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      const body = { status: selectedStatus, note: note };
      // console.log(body);

      const success = await updateAppointment(appointmentID, body);
      if (success) {
        Alert.alert("Success", "Test drive appointment created successfully", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/appointments"),
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">
          Appointment Detail
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
          {/* <CustomerPickerModal
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
          /> */}
          {/* Vehicle info */}
          <Pressable
            className="p-[15px] bg-gray rounded-[10px]"
            onPress={() => router.push(`/(vehicle)/${adetail?.vehicleID}`)}
          >
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
          </Pressable>
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
              <DateTimeInput value={adetail?.appointedDate} readOnly={true} />
              <View className="gap-2">
                <Text className="text-secondary text-base font-medium">
                  Test Drive Status
                </Text>

                <Pressable
                  disabled={isFinalStatus}
                  onPress={() => {
                    if (!isFinalStatus) setShowStatusModal(true);
                  }}
                  className={`bg-dark border flex-row items-center justify-between p-4 rounded-xl ${
                    isFinalStatus ? "border-secondary" : "border-secondary"
                  }`}
                >
                  <Text className="text-white text-lg">
                    {selectedStatus || "Select status"}
                  </Text>

                  {!isFinalStatus && (
                    <Ionicons name="chevron-down" size={22} color="white" />
                  )}
                </Pressable>
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
                placeholder="Write something..."
                placeholderTextColor="#959CA7"
                textAlignVertical="top"
                className={`p-4 font-msr-medium text-lg border rounded-xl bg-dark border-secondary text-white 
    ${isFinalStatus ? "opacity-60" : ""}`}
                style={{
                  minHeight: 150,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  lineHeight: 20,
                }}
                editable={!isFinalStatus}
                value={note}
                onChangeText={(text) => !isFinalStatus && setNote(text)}
              />
            </View>
          </View>
          <View className="mt-5">
            {adetail?.status === "Scheduled" && (
              <Pressable
                className="py-3 w-full rounded-[8px] bg-blue"
                onPress={() => handlePress(adetail?.status as string)}
              >
                <Text className="font-semibold text-base  text-center text-white">
                  Update Appointment
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
                onPress={() => {
                  setSelectedStatus(status);
                  setShowStatusModal(false);
                  // TODO: updateAppointmentStatus(appointmentID, status)
                }}
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

export default AppointmentDetail;
