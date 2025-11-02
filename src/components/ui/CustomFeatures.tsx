import { color } from "@/src/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface FeaturesProps {
  number: any;
  icon: any;
}

const Features = ({ number, icon }: FeaturesProps) => {
  return (
    <View className="flex-row gap-[5px] items-center">
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={color.textSecondary}
      />
      <Text className="text-base  text-secondary font-medium">
        {icon === "seat-outline" ? `${number} seats` : number}
      </Text>
    </View>
  );
};

export default Features;
