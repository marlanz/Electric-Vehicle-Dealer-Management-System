import { color } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
interface CUstomDashboardCardProps {
  title: string;
  value: any;
  desc: string;
  icon: string;
}

const CustomDashboardCard = ({
  desc,
  icon,
  title,
  value,
}: CUstomDashboardCardProps) => {
  return (
    <View className="bg-gray p-5 rounded-[10px] w-[48%] mb-4">
      <Text className="text-white text-3xl font-semibold">{value}</Text>
      <Text className="font-medium text-xl text-secondary mt-2">{desc}</Text>

      <View className="mt-4 flex-row gap-2 items-center">
        <Ionicons name={icon as any} size={24} color={color.iconColor} />
        <Text className="text-white font-semibold text-lg">{title}</Text>
      </View>
    </View>
  );
};

export default CustomDashboardCard;
