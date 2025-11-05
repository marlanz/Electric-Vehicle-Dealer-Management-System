import { color } from "@/src/constants";
import useCustomer from "@/src/hooks/useCustomer";
import useVehicles from "@/src/hooks/useVehicles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import RoundDivider from "../ui/RoundDivider";

interface CustomAppointmentProps {
  date: string;
  customerID: string;
  vehicleID: string;
}

const CustomAppointmnet = ({
  customerID,
  date,
  vehicleID,
}: CustomAppointmentProps) => {
  const { fetchCustomerDetail, cdetail } = useCustomer();
  const { fetchVehicleDetail, vdetail } = useVehicles();

  useEffect(() => {
    fetchCustomerDetail(customerID);
    fetchVehicleDetail(vehicleID);
  }, [fetchCustomerDetail, fetchVehicleDetail]);

  return (
    <View className="p-5 bg-gray rounded-[10px] w-full flex-row items-center justify-between">
      <View className="flex-col gap-3 flex-1">
        <View>
          <Text className="font-semibold text-xl text-white mb-1">
            {cdetail?.fullName}
          </Text>

          <View className="flex-row gap-2 items-center flex-wrap">
            <Text className="text-secondary text-base font-medium">
              {vdetail?.model} - {vdetail?.version}
            </Text>
            <RoundDivider />
            <Text
              className="text-secondary font-medium text-base"
              numberOfLines={1}
            >
              {vdetail?.color}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 items-center">
          <Ionicons
            name="calendar-clear-outline"
            size={16}
            color={color.textSecondary}
          />
          <Text className="font-medium text-secondary">{date}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" color="white" size={24} />
    </View>
  );
};

export default CustomAppointmnet;
