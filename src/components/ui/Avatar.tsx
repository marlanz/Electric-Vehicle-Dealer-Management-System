import { Image, View, Text } from "react-native";
export default function Avatar({ name }: { name: string }) {
  return (
    <View className="flex-row items-center">
      <Image source={require("@/assets/images/model-s.png")} className="w-8 h-8 rounded-full" />
      <View className="ml-2">
        <Text className="text-white font-semibold">{name}</Text>
        <Text className="text-gray-400 text-xs">Dealer Staff</Text>
      </View>
    </View>
  );
}
