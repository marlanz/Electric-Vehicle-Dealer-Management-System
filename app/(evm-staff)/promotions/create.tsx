// app/(evm-staff)/promotions/create.tsx
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io/vouchers";
const BG = "#0B1220";
const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="rounded-2xl p-4 bg-[#141C2C] border border-white/10">{children}</View>
);

export default function PromotionCreate() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [discount, setDiscount] = useState("10");
  const [qty, setQty] = useState("10");
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() && desc.trim() && Number(discount) > 0 && Number(qty) >= 0;

  const onCreate = async () => {
    if (!canSave || saving) return;
    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: desc.trim(),
        discountPercentage: Number(discount),
        qty: Number(qty),
      };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed ${res.status}`);
      const created = await res.json();
      Alert.alert("Thành công", "Promotion đã được tạo.", [
        { text: "OK", onPress: () => router.replace(`/(evm-staff)/promotions/${created.id}` as const) },
      ]);
    } catch (e) {
      console.warn("Create error:", e);
      Alert.alert("Lỗi", "Không thể tạo promotion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text className="text-white text-lg font-bold mb-3">Create Promotion</Text>
        <Card>
          <Text className="text-white/80 mb-1">Name</Text>
          <TextInput
            value={name} onChangeText={setName}
            placeholder="Promo name…" placeholderTextColor="rgba(255,255,255,0.6)"
            className="text-white bg-white/10 rounded-xl px-3 py-2"
          />
          <View className="h-3" />
          <Text className="text-white/80 mb-1">Description</Text>
          <TextInput
            value={desc} onChangeText={setDesc} multiline
            placeholder="Description…" placeholderTextColor="rgba(255,255,255,0.6)"
            className="text-white bg-white/10 rounded-xl px-3 py-2 min-h-[100px]"
          />
          <View className="h-3" />
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Text className="text-white/80 mb-1">Discount %</Text>
              <TextInput
                value={discount} onChangeText={setDiscount} keyboardType="numeric"
                placeholder="10" placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white bg-white/10 rounded-xl px-3 py-2"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-white/80 mb-1">Qty</Text>
              <TextInput
                value={qty} onChangeText={setQty} keyboardType="numeric"
                placeholder="10" placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white bg-white/10 rounded-xl px-3 py-2"
              />
            </View>
          </View>
        </Card>

        <View className="h-4" />
        <Pressable
          onPress={onCreate}
          disabled={!canSave || saving}
          className={`rounded-2xl px-4 py-3 items-center ${!canSave || saving ? "bg-white/30" : "bg-white"}`}
        >
          {saving ? <ActivityIndicator /> : <Text className="text-[#0B1220] font-semibold">Create</Text>}
        </Pressable>

        <View className="h-2" />
        <Pressable onPress={() => router.back()} className="rounded-2xl px-4 py-3 items-center border border-white/20">
          <Text className="text-white">Cancel</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
