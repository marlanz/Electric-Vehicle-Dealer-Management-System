import React from "react";
import { Text, View } from "react-native";

interface CustomModelSpecsProps {
  value: any;
  label: string;
}

const CustomModelSpecs = ({ value, label }: CustomModelSpecsProps) => {
  return (
    <View className="">
      <Text className="font-semibold text-white text-xl">{value}</Text>
      <Text className="font-medium text-secondary text-base">{label}</Text>
    </View>
  );
};

export default CustomModelSpecs;
