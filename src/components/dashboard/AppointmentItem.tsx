import Card from "../ui/Card";
import { View, Text } from "react-native";
export default function AppointmentItem({ name, model, time }:{ name:string; model:string; time:string }) {
  return (
    <Card className="p-4 mb-3">
      <Text className="text-white font-semibold">{name}</Text>
      <Text className="text-gray-400 mt-1">{model}</Text>
      <Text className="text-gray-400 mt-1">📅 {time}</Text>
    </Card>
  );
}
