import Card from "../ui/Card";
import { View, Text } from "react-native";
export default function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <Card className="p-4">
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-gray-400 mt-1">{label}</Text>
    </Card>
  );
}
