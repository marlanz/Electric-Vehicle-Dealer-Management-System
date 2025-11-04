// app/(dealer-manager)/staffs/[id].tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { fetchDMStaffById, selectDMStaffDetail, selectDMStaffDetailLoading, updateDMStaff } from "@/src/features/dealerManager/staffs/staffSlice";

export default function DMStaffDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = useAppDispatch();
  const item = useAppSelector(selectDMStaffDetail(id!));
  const loading = useAppSelector(selectDMStaffDetailLoading);

  const [full_name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone]=useState("");

  useEffect(() => { if (id) d(fetchDMStaffById({ id })); }, [id, d]);
  useEffect(() => {
    if (item) { setName(item.full_name); setEmail(item.email); setPhone(item.phone ?? ""); }
  }, [item]);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "Edit Staff" }} />
      {loading && !item ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator/><Text className="text-white/70 mt-2">Loading…</Text></View>
      ) : !item ? (
        <View className="flex-1 items-center justify-center"><Text className="text-white">Not found</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding:16 }}>
          <Field label="Full name" value={full_name} onChangeText={setName}/>
          <Field label="Email" value={email} onChangeText={setEmail}/>
          <Field label="Phone" value={phone} onChangeText={setPhone}/>

          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={async () => { await d(updateDMStaff({ id: id!, body: { full_name, email, phone } })); router.back(); }}
              className="px-4 py-3 rounded-xl bg-blue-600 flex-1"
            ><Text className="text-white font-semibold text-center">Save</Text></Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Field(p: any) { return (
  <View className="mb-4">
    <Text className="text-white/70 mb-1">{p.label}</Text>
    <TextInput {...p} className="rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2" placeholderTextColor="rgba(255,255,255,0.5)"/>
  </View>
);}
