import Card from "../ui/Card";
import { View, Text, Image } from "react-native";
import Badge from "../ui/Badge";

export default function InventoryItem({
  title, brand, price, img, inventory
}:{ title:string; brand:string; price:string; img:any; inventory:number }) {
  return (
    <Card className="overflow-hidden mb-4">
      <Image source={img} className="w-full h-36" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-semibold">{title}</Text>
          <Badge text={`Inventory: ${inventory}`} tone="blue" />
        </View>
        <Text className="text-gray-400 mt-1">{brand}</Text>
        <Text className="text-white font-bold mt-2">Starting at {price}</Text>
      </View>
    </Card>
  );
}
