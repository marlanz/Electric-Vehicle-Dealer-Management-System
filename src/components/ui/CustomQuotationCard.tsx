import useCustomer from "@/src/hooks/useCustomer";
import useVehicles from "@/src/hooks/useVehicles";
import { formatDate, formatToDollar } from "@/src/utils";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import CustomDivider from "./CustomDivider";
import CustomPrice from "./CustomPrice";

const parseStatusToColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "text-[#16D68F] bg-[#16D68F]/[0.1]";

    case "pending":
      return "text-[#F9C74F] bg-[#F9C74F]/[0.1]";

    case "declined":
      return "text-[#959CA7] bg-[#959CA7]/[0.1]";

    default:
      return "text-white bg-gray-600/30";
  }
};

const CustomQuotationCard = ({ item }: any) => {
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
      onPress={() => router.push(`/(quotation)/${item.id}`)}
      className="p-5 rounded-[10px] bg-gray"
    >
      <View className="gap-4">
        {/* header */}
        <View className="flex-row gap-[10px] items-start">
          <Feather
            name="file-text"
            size={24}
            color={"white"}
            className="p-[10px] bg-[#1C354C] self-start rounded-[10px]"
          />
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              QUO-2025-00{item.id}
            </Text>
            <Text className="mt-1 text-base text-secondary font-medium">
              Customer: {cdetail?.fullName}
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
            title="Date Created"
            value={formatDate(item?.createAt)}
            valueStyles="text-white"
          />

          <CustomPrice
            title="Created By"
            value={item?.staffID}
            valueStyles="text-white"
          />
          <CustomPrice
            title="Status"
            value={item?.status}
            valueStyles={`px-[10px] py-[5px] rounded-[8px] ${parseStatusToColor(item.status)}`}
          />
        </View>
      </View>
      <Text className="mt-6 text-2xl font-semibold text-green-200">
        Total Price: {formatToDollar(item.finalPrice)}
      </Text>
    </Pressable>
  );
};

export default CustomQuotationCard;
