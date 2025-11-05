// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CustomStatCard from "@/src/components/ui/CustomStatCard";
// import axios from "axios";

// const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io";
// const FALLBACK_IMG =
//   "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg";

// type MockVehicle = {
//   id: string;
//   model?: string;
//   version?: string;
//   color?: string;
//   manufacturedPrice?: number;
//   dealerPrice?: number;
//   description?: string;
//   imageURL?: string;
//   features?: { motor?: string; seats?: number | null; battery?: string; drivetrain?: string };
// };

// export default function VehicleDetail() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [v, setV] = useState<MockVehicle | null>(null);
//   const [loading, setLoading] = useState(true);

//   const img = useMemo(() => v?.imageURL || FALLBACK_IMG, [v?.imageURL]);

//   useEffect(() => {
//     if (!id) return;
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API}/vehicles/${id}`, { headers: { "Cache-Control":"no-cache" }});
//         const vv: MockVehicle = res.data?.item ?? res.data;
//         if (!cancelled) setV(vv);
//       } catch (e: any) {
//         Alert.alert("Error", e?.message ?? "Load vehicle failed");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [id]);

//   if (loading && !v) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator />
//         <Text className="text-white/70 mt-2">Loading…</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="px-4">
//       {/* Header */}
//       <View className="flex-row justify-between py-5">
//         <Pressable onPress={() => router.back()}>
//           <Ionicons name="arrow-back-outline" size={24} color={"white"} />
//         </Pressable>
//         <Text className="text-2xl font-semibold text-white">Vehicle Detail</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
//         <Image source={{ uri: img }} resizeMode="cover" className="w-full h-[300px] rounded-[10px]" />

//         {/* Title (read-only) */}
//         <View className="gap-2 mt-5">
//           <Text className="text-white font-bold text-2xl">{v?.model || "—"}</Text>
//           <Text className="text-secondary font-medium text-base">{v?.description || "—"}</Text>
//         </View>

//         {/* Specs (giữ layout) */}
//         <View className="mt-6">
//           <View className="flex-row justify-between">
//             <CustomStatCard title="Motor Engine" desc="Peak Power" number={v?.features?.motor || "—"} icon={"engine-outline"} />
//             <CustomStatCard title="Capacity" desc="Total Seats" number={v?.features?.seats != null ? `0${v?.features?.seats} seats` : "—"} icon={"seat-outline"} />
//           </View>
//           <View className="flex-row justify-between">
//             <CustomStatCard title="Battery" desc="Battery life" number={v?.features?.battery || "—"} icon={"battery-outline"} />
//             <CustomStatCard title="Drivetrain" desc="Power Distribution" number={v?.features?.drivetrain ? `${v?.features?.drivetrain} gear` : "—"} icon={"abacus"} />
//           </View>
//         </View>

//         {/* Color */}
//         <View className="gap-4 mt-6">
//           <Text className="text-white font-semibold text-xl">Model Color</Text>
//           <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
//             <View className="gap-2 flex-1">
//               <Text className="text-white font-semibold text-[18px]">{v?.color || "—"}</Text>
//               <Text className="text-secondary font-semibold text-base">Energetic & sharp</Text>
//             </View>
//             <View className="size-[20px] rounded-full" style={{ backgroundColor: "#C62833" }} />
//           </View>
//         </View>

//         {/* Variant */}
//         <View className="gap-4 mt-8">
//           <Text className="text-white font-semibold text-xl">Model Variant</Text>
//           <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
//             <View className="gap-2 flex-1">
//               <Text className="text-white font-semibold text-[18px]">
//                 {v?.version ? `${v?.version} version` : "—"}
//               </Text>
//               <Text className="text-secondary font-semibold text-base">Efficient for maximum range.</Text>
//             </View>
//             <Text className="font-semibold text-xl text-white">
//               {v?.dealerPrice != null ? `$${v?.dealerPrice}` : "—"}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
