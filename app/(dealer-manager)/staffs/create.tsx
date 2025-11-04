// app/(dealer-manager)/staffs/create.tsx
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppDispatch } from "@/src/store";
import { createDMStaff } from "@/src/features/dealerManager/staffs/staffSlice";

export default function DMStaffCreate() {
  const d = useAppDispatch();
  const [full_name, setName] = useState("");
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "New Staff" }} />
      <ScrollView contentContainerStyle={{ padding:16 }}>
        <Field label="Full name" value={full_name} onChangeText={setName}/>
        <Field label="Email" value={email} onChangeText={setEmail}/>
        <Field label="Phone" value={phone} onChangeText={setPhone}/>
        <Pressable
          onPress={async () => {
            await d(createDMStaff({ full_name, email, phone, role: "DEALER_STAFF" }));
            router.back();
          }}
          className="mt-4 px-4 py-3 rounded-xl bg-blue-600"
        ><Text className="text-white font-semibold text-center">Create</Text></Pressable>
      </ScrollView>
    </View>
  );
}

function Field(p: any) {
  return (
    <View className="mb-4">
      <Text className="text-white/70 mb-1">{p.label}</Text>
      <TextInput {...p} className="rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2" placeholderTextColor="rgba(255,255,255,0.5)"/>
    </View>
  );
}
