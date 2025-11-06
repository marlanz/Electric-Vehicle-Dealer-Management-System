import useCustomer from "@/src/hooks/useCustomer";
import useVehicles from "@/src/hooks/useVehicles";
import { formatDate } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import CustomDivider from "./CustomDivider";
import CustomPrice from "./CustomPrice";

export interface CustomTestDriveCardProps {
  id: string;
  customerID: string;
  vehicleID: string;
  appointedDate: string;
  staffName: string;
  status: string;
  location: string;
}

export interface DataProp {
  item: CustomTestDriveCardProps;
}

const parseStatusToColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-[#16D68F] bg-[#16D68F]/[0.1]";

    case "pending":
      return "text-[#F9C74F] bg-[#F9C74F]/[0.1]";

    case "scheduled":
    case "created":
      return "text-[#61B1FF] bg-[#61B1FF]/[0.1]";

    case "cancelled":
      return "text-[#959CA7] bg-[#959CA7]/[0.1]";

    default:
      return "text-white bg-gray-600/30";
  }
};

const CustomTestDriveCard = ({ item }: DataProp) => {
  const { fetchCustomerDetail, cdetail } = useCustomer();

  const { fetchVehicleDetail, vdetail } = useVehicles();

  useEffect(() => {
    fetchCustomerDetail(item.customerID);
    fetchVehicleDetail(item.vehicleID);
  }, [
    fetchCustomerDetail,
    fetchVehicleDetail,
    item.vehicleID,
    item.customerID,
  ]);
  return (
    <Pressable
      onPress={() => router.push(`/(testdrive)/${item.id}`)}
      className="p-5 rounded-[10px] bg-gray"
    >
      <View className="gap-4">
        {/* header */}
        <View className="flex-row gap-[10px] items-start">
          <Ionicons
            name="car-outline"
            size={24}
            color={"white"}
            className="p-[10px] bg-[#1C354C] self-start rounded-[10px]"
          />
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              {cdetail?.fullName}
            </Text>

            <Text
              className="text-sm text-secondary font-medium mt-1"
              numberOfLines={1}
            >
              {vdetail?.model} / {vdetail?.color} / {vdetail?.version}
            </Text>
          </View>
        </View>
        <CustomDivider />
        <View className="gap-4">
          <CustomPrice
            title="Location"
            value={"EV Motors TP.HCM"}
            valueStyles="text-white max-w-[200px]"
          />
          <CustomPrice
            title="Appointed Date"
            value={formatDate(item.appointedDate)}
            valueStyles="text-white"
          />

          <CustomPrice
            title="Created By"
            value={item.staffName}
            valueStyles="text-white"
          />
          <CustomPrice
            title="Status"
            value={item.status}
            valueStyles={`px-[10px] py-[5px] rounded-[8px] ${parseStatusToColor(item.status)}`}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default CustomTestDriveCard;
