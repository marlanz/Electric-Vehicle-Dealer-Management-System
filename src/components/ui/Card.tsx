import { View, ViewProps } from "react-native";
export default function Card({ className = "", ...p }: ViewProps & { className?: string }) {
  return <View {...p} className={`bg-[#111827] rounded-2xl ${className}`} />;
}
