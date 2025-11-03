import cn from "clsx";
import React from "react";
import { Text, View } from "react-native";

interface CustomPriceProps {
  title: string;
  value: any;
  valueStyles: string;
  titleStyles?: string;
}

const CustomPrice = ({
  title,
  value,
  valueStyles,
  titleStyles,
}: CustomPriceProps) => {
  return (
    <View className="flex-row justify-between items-start ">
      <Text
        className={cn(
          "",
          !titleStyles ? "font-medium text-base text-secondary" : titleStyles
        )}
      >
        {title}
      </Text>
      <Text className={cn("font-semibold", valueStyles)}>{value}</Text>
    </View>
  );
};

export default CustomPrice;
