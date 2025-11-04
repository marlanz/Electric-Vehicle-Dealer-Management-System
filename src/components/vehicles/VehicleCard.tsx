import type { Vehicle } from "@/src/features/vehicles/type";
import { Feather, MaterialCommunityIcons as MCI } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

function currencyVND(v?: string | number | null) {
  if (v == null) return "—";
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return String(v);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

function Pill({
  children,
  tone = "blue",
  leftIcon,
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "gray" | "blue";
  leftIcon?: React.ReactNode;
}) {
  const map: Record<"green" | "amber" | "gray" | "blue", string> = {
    green: "bg-emerald-500/90 text-white",
    amber: "bg-amber-500/90 text-black",
    gray: "bg-gray-500/80 text-white",
    blue: "bg-blue-500/90 text-white",
  };
  return (
    <View className={`px-3 py-1.5 rounded-2xl ${map[tone]} shadow flex-row items-center gap-1.5`}>
      {leftIcon ?? null}
      <Text className="font-semibold text-xs">{children}</Text>
    </View>
  );
}

type FeatherName = React.ComponentProps<typeof Feather>["name"];
type MciName = React.ComponentProps<typeof MCI>["name"];

function Spec({ label, f, mci }: { label: string; f?: FeatherName; mci?: MciName }) {
  return (
    <View className="flex-row items-center gap-2">
      {f ? <Feather name={f} size={14} color="#9FB3C8" /> : null}
      {mci ? <MCI name={mci} size={14} color="#9FB3C8" /> : null}
      <Text className="text-slate-300 text-xs" numberOfLines={1}>{label}</Text>
    </View>
  );
}

export default function VehicleCard({ v }: { v: Vehicle }) {
  const inStock = v.status === "ACTIVE";
  const motor = v.features?.motor;
  const seats = v.features?.seats;
  const drivetrain = v.features?.drivetrain;
  const battery = v.features?.battery;
  const color = v.color ?? "—";
  const year = v.year;

  const goDetail = () =>
    router.push({ pathname: "/(dealer)/(vehicles)/[id]", params: { id: v.vehicle_id } });

  return (
    <Pressable onPress={goDetail}>
      <View className="mb-4 rounded-3xl bg-[#111a24] overflow-hidden shadow-lg">
        {/* Image */}
        <View style={{ borderRadius: 24, overflow: "hidden" }} className="relative">
          <Image
            source={{ uri: v.image_url || "https://tse1.mm.bing.net/th/id/OIP.BNr7COrS5-hwntskpdYHpQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" }}
            style={{ width: "100%", height: 176 }}
            contentFit="cover"
            onError={(e) => console.log("IMG ERROR:", e)}
            placeholder={require("@/assets/images/model-s.png")}
          />
          <View className="absolute right-5 bottom-5">
            <Pill
              tone={inStock ? "green" : "gray"}
              leftIcon={<Feather name={inStock ? "check-circle" : "slash"} size={12} color="white" />}
            >
              {inStock ? "In stock" : "Out of stock"}
            </Pill>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 pb-5">
          <Text className="text-white font-bold text-[18px]" numberOfLines={1}>
            {v.model} {v.version ? v.version : ""}
          </Text>

          <View className="flex-row items-center gap-2 mt-1">
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.25)" }} />
            <Text className="text-stone-50" numberOfLines={1}>{color}</Text>
            {year ? (
              <>
                <Text className="text-stone-50">•</Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="calendar" size={12} color="#C9D4E3" />
                  <Text className="text-stone-50">{year}</Text>
                </View>
              </>
            ) : null}
          </View>

          <View className="flex-row flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {motor && <Spec label={String(motor)} f="zap" />}
            {seats != null && <Spec label={`${seats} seats`} f="users" />}
            {drivetrain && <Spec label={String(drivetrain)} f="cpu" />}
            {battery && <Spec label={String(battery)} mci="battery-high" />}
          </View>

          <View className="flex-row items-center gap-2 mt-3">
            <Feather name="tag" size={16} color="#E8EEF7" />
            <Text className="text-white font-extrabold text-[18px]">
              Starting at {currencyVND(v.msrp)}
            </Text>
          </View>

          {!!v.description && (
            <Text className="text-slate-300 mt-2 leading-5" numberOfLines={2}>
              {v.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
