// import Features from "@/src/components/ui/CustomFeatures";
// import { color } from "@/src/constants";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import axios from "axios";

// const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io";
// const FALLBACK_IMG =
//   "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg";

// type MockVehicle = {
//   id: string;
//   model?: string;
//   brand?: string;
//   version?: string;
//   color?: string;
//   year?: string | number;
//   manufacturedPrice?: number;
//   dealerPrice?: number;
//   description?: string;
//   imageURL?: string;
//   features?: { motor?: string; seats?: number | null; battery?: string; drivetrain?: string };
//   stock?: number | null;
//   createAt?: number;
// };

// export default function VehiclesTab() {
//   const [items, setItems] = useState<MockVehicle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API}/vehicles`, { headers: { "Cache-Control": "no-cache" }});
//         console.log('[data vehicle]',res.data.items)
        
//         const list = res.data.items;
//         console.log('[data list]',list)
//         const sorted = [...list].sort((a, b) => Number(b.createAt ?? 0) - Number(a.createAt ?? 0));
      
//         if (!cancelled) setItems(list);
//       } catch (e: any) {
//         Alert.alert("Error", e?.message ?? "Load vehicles failed");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   return (
//     <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
//       <SafeAreaView className="px-4 ">
//         {/* Header */}
//         <View className="flex-row justify-between py-5">
//           <Text className="text-2xl font-semibold text-white">Vehicles Catalog</Text>
//           <Pressable
//             onPress={() => router.push("/(evm-staff)/vehicle/create")}
//             hitSlop={8}
//             className="flex-row items-center"
//           >
//             <Ionicons name="add-circle-outline" size={26} color={"white"} />
//           </Pressable>
//         </View>

//         {loading ? (
//           <View className="flex-1 items-center justify-center">
//             <ActivityIndicator />
//             <Text className="text-white/70 mt-2">Loading…</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={items}
//             keyExtractor={(item) => String(item.id)}
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <Pressable onPress={() => router.push(`/(evm-staff)/vehilce/${item.id}`)}>
//                 <View className="flex-1 rounded-[15px] overflow-hidden bg-gray p-5">
//                   <Image
//                     source={{ uri: item.imageURL || FALLBACK_IMG }}
//                     defaultSource={{ uri: FALLBACK_IMG }}
//                     resizeMode="cover"
//                     className="w-full h-[200px] rounded-[15px]"
//                   />
//                   <View className="mt-3 mb-2">
//                     <View className="justify-between flex-row items-center">
//                       <Text className="text-xl font-semibold text-white">{item.model ?? "—"}</Text>
//                       <Text className="text-base font-medium text-secondary">{item.brand ?? "—"}</Text>
//                     </View>
//                   </View>
//                   <View className="flex-row justify-between">
//                     <Features number={item.features?.motor ?? "—"} icon={"engine-outline"} />
//                     <Features number={item.features?.seats ?? "—"} icon={"seat-outline"} />
//                     <Features number={item.features?.battery ?? "—"} icon={"battery-outline"} />
//                     <Features number={item.features?.drivetrain ?? "—"} icon={"abacus"} />
//                   </View>
//                   <View className="flex-row gap-3 items-end mt-5">
//                     <Text className="font-semibold text-white text-xl">
//                       Starting at {item.dealerPrice != null ? `$${item.dealerPrice}` : "—"}
//                     </Text>
//                     <Text className="text-secondary text-base line-through">
//                       {item.manufacturedPrice != null ? `$${item.manufacturedPrice}` : ""}
//                     </Text>
//                   </View>
//                 </View>
//               </Pressable>
//             )}
//             contentContainerClassName=" gap-3 "
//             contentContainerStyle={{ paddingBottom: 190 }}
//             ListEmptyComponent={<Text className="text-white/60 text-center py-16">No vehicles</Text>}
//           />
//         )}
//       </SafeAreaView>
//     </View>
//   );
// }
