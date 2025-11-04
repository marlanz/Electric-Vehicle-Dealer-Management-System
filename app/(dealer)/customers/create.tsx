// app/(dealer)/customers/create.tsx
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch } from "@/src/store";
import { createCustomer } from "@/src/features/customers/customerSlice";
import type { CustomerCreatePayload } from "@/src/features/customers/type";
import { router } from "expo-router";

export default function CreateCustomer() {
  const d = useAppDispatch();
  const [form, setForm] = useState<CustomerCreatePayload>({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    id_no: "",
    dob: "",
    notes: "",
  });
  const patch = (k: keyof CustomerCreatePayload, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async () => {
    if (!form.full_name || !form.phone) {
      Alert.alert("Validation", "Full name và Phone là bắt buộc");
      return;
    }
    const res = await d(createCustomer(form));
    if (createCustomer.fulfilled.match(res)) {
      Alert.alert("Success", "Customer created");
      router.back();
    } else {
      Alert.alert("Error", String(res.payload ?? "Create failed"));
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#0B1220]" contentContainerStyle={{ padding: 16 }}>
      {["full_name","phone","email","address","id_no","dob","notes"].map((k) => (
        <View key={k} className="mb-4">
          <Text className="text-white/80 mb-1">{k}</Text>
          <TextInput
            value={(form as any)[k] ?? ""}
            onChangeText={(t) => patch(k as any, t)}
            placeholder={k}
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
          />
        </View>
      ))}
      <Pressable onPress={onSubmit} className="px-4 py-3 rounded-xl bg-blue-600">
        <Text className="text-white font-semibold text-center">Create</Text>
      </Pressable>
    </ScrollView>
  );
}
