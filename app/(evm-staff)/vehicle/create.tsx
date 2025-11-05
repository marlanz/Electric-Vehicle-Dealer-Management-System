// import CustomButton from "@/src/components/ui/CustomButton";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React, { useState } from "react";
// import {
//   Image,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   View,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import axios from "axios";

// const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io";
// const FALLBACK_IMG =
//   "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg";

// export default function CreateVehicle() {
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     model: "",
//     desc: "",
//     maxDistance: "",
//     seat: "",
//     stock: "",
//     drivetrain: "",
//     variant: "",
//     color: "",
//     hex: "#C62833",
//     price: "",
//     discount: "",
//   });

//   const onChange = (k: keyof typeof form, v: string) =>
//     setForm((s) => ({ ...s, [k]: v }));

//   const onSave = async () => {
//     try {
//       setSaving(true);
//       const body = {
//         model: form.model || undefined,
//         description: form.desc || undefined,
//         version: form.variant || undefined,
//         color: form.color || undefined,
//         dealerPrice: form.price?.replace(/[^0-9.]/g, "")
//           ? Number(form.price.replace(/[^0-9.]/g, ""))
//           : undefined,
//         manufacturedPrice: form.discount?.replace(/[^0-9.]/g, "")
//           ? Number(form.discount.replace(/[^0-9.]/g, ""))
//           : undefined,
//         imageURL: FALLBACK_IMG, // không cho đổi ảnh
//         features: {
//           motor: form.maxDistance || undefined,
//           seats: form.seat ? Number(form.seat) : undefined,
//           battery: form.stock || undefined,
//           drivetrain: form.drivetrain || undefined,
//         },
//         stock: form.stock ? Number(form.stock) : undefined,
//         createAt: Math.floor(Date.now() / 1000), // để sort ổn định
//       };
//       await new Promise((r) => setTimeout(r, 300));
//       await axios.post(`${API}/vehicles`, body);
//       Alert.alert("Created", "Vehicle created.");
//       router.back();
//     } catch (e: any) {
//       Alert.alert("Error", e?.message ?? "Create failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const label = (t: string) => (
//     <Text className="text-secondary font-medium text-base">{t}</Text>
//   );

//   return (
//     <SafeAreaView className="px-4">
//       {/* Header */}
//       <View className="flex-row justify-between py-5">
//         <Pressable onPress={() => router.back()}>
//           <Ionicons name="arrow-back-outline" size={24} color={"white"} />
//         </Pressable>
//         <Text className="text-2xl font-semibold text-white">Create Vehicle</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
//         <Image source={{ uri: FALLBACK_IMG }} resizeMode="cover" className="w-full h-[300px] rounded-[10px]" />

//         {/* Title */}
//         <View className="gap-2 mt-5">
//           {label("Model")}
//           <TextInput value={form.model} onChangeText={(t) => onChange("model", t)} className="text-white font-bold text-2xl" />
//           {label("Description")}
//           <TextInput value={form.desc} onChangeText={(t) => onChange("desc", t)} multiline className="text-secondary font-medium text-base" />
//         </View>

//         {/* Specs */}
//         <View className="mt-6">
//           <View className="flex-row justify-between">
//             <View style={{ flex: 0.48 }}>
//               <Text className="text-white font-semibold text-base">Motor Engine</Text>
//               <Text className="text-secondary">Peak Power</Text>
//               <TextInput value={form.maxDistance} onChangeText={(t) => onChange("maxDistance", t)} className="text-white mt-1" />
//             </View>
//             <View style={{ flex: 0.48 }}>
//               <Text className="text-white font-semibold text-base">Capacity</Text>
//               <Text className="text-secondary">Total Seats</Text>
//               <TextInput value={form.seat} onChangeText={(t) => onChange("seat", t)} keyboardType="number-pad" className="text-white mt-1" />
//             </View>
//           </View>

//           <View className="flex-row justify-between mt-3">
//             <View style={{ flex: 0.48 }}>
//               <Text className="text-white font-semibold text-base">Battery</Text>
//               <Text className="text-secondary">Battery life</Text>
//               <TextInput value={form.stock} onChangeText={(t) => onChange("stock", t)} className="text-white mt-1" />
//             </View>
//             <View style={{ flex: 0.48 }}>
//               <Text className="text-white font-semibold text-base">Drivetrain</Text>
//               <Text className="text-secondary">Power Distribution</Text>
//               <TextInput value={form.drivetrain} onChangeText={(t) => onChange("drivetrain", t)} className="text-white mt-1" />
//             </View>
//           </View>
//         </View>

//         {/* Color */}
//         <View className="gap-4 mt-6">
//           <Text className="text-white font-semibold text-xl">Model Color</Text>
//           <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
//             <View className="gap-2 flex-1">
//               {label("Color")}
//               <TextInput value={form.color} onChangeText={(t) => onChange("color", t)} className="text-white font-semibold text-[18px]" />
//               {label("Hex (display only)")}
//               <TextInput value={form.hex} onChangeText={(t) => onChange("hex", t)} className="text-secondary font-semibold text-base" />
//             </View>
//             <View className="size-[20px] rounded-full" style={{ backgroundColor: form.hex || "#C62833" }} />
//           </View>
//         </View>

//         {/* Variant */}
//         <View className="gap-4 mt-8">
//           <Text className="text-white font-semibold text-xl">Model Variant</Text>
//           <View className="p-5 rounded-[10px] bg-gray flex-row justify-between items-center">
//             <View className="gap-2 flex-1">
//               {label("Variant")}
//               <TextInput value={form.variant} onChangeText={(t) => onChange("variant", t)} className="text-white font-semibold text-[18px]" />
//               <Text className="text-secondary font-semibold text-base">Efficient for maximum range.</Text>
//             </View>
//             <TextInput
//               value={form.price}
//               onChangeText={(t) => onChange("price", t)}
//               keyboardType="decimal-pad"
//               className="font-semibold text-xl text-white"
//               placeholder="$"
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {/* Actions */}
//         <View className="mt-[40px]">
//           <CustomButton
//             btnStyles="bg-blue"
//             textStyles="text-white"
//             title={saving ? "Creating…" : "Create"}
//             onPress={onSave}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
