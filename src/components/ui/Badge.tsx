import { View, Text } from "react-native";
export default function Badge({ text, tone="blue" }:{ text:string; tone?: "blue"|"green"|"gray" }) {
  const map = { blue: "bg-blue-600/20 text-blue-300", green:"bg-green-600/20 text-green-300", gray:"bg-white/10 text-gray-300" };
  return <View className={`px-2 py-0.5 rounded-lg ${map[tone]}`}><Text className="text-[11px]">{text}</Text></View>;
}
