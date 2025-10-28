import { Pressable, Text, PressableProps } from "react-native";
export function PrimaryButton({ title, className="", ...p }: PressableProps & { title: string; className?: string }) {
  return (
    <Pressable {...p} className={`bg-[#3b82f6] rounded-2xl px-4 py-3 items-center ${className}`}>
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}
export function GhostButton({ title, className="", ...p }: PressableProps & { title: string; className?: string }) {
  return (
    <Pressable {...p} className={`border border-white/15 rounded-2xl px-4 py-3 items-center ${className}`}>
      <Text className="text-white font-medium">{title}</Text>
    </Pressable>
  );
}
