import cn from "clsx";
import React from "react";
import { Pressable, Text } from "react-native";
interface CustomButtonProps {
  btnStyles: string;
  textStyles: string;
  title: string;
  onPress: () => void;
}

const CustomButton = ({
  btnStyles,
  textStyles,
  title,
  onPress,
}: CustomButtonProps) => {
  return (
    <Pressable
      className={cn("py-3 w-full rounded-[8px] flex-1", btnStyles)}
      style={{}}
      onPress={onPress}
    >
      <Text className={cn("font-semibold text-base  text-center", textStyles)}>
        {title}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
