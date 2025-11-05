// app/(evm-staff)/promotions/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

type Voucher = {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  qty: number;
};

const API = "https://690a30bc1a446bb9cc21ba77.mockapi.io/vouchers";
const BG = "#0B1220";
const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="rounded-2xl p-4 bg-[#141C2C] border border-white/10">{children}</View>
);

export default function PromotionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [discount, setDiscount] = useState("");
  const [qty, setQty] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/${id}`);
      const v: Voucher = await res.json();
      setData(v);
      setName(v.name);
      setDesc(v.description);
      setDiscount(String(v.discountPercentage));
      setQty(String(v.qty));
    } catch (e) {
      console.warn("Load detail error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const dirty = useMemo(() => {
    if (!data) return false;
    return (
      name.trim() !== data.name ||
      desc.trim() !== data.description ||
      Number(discount) !== data.discountPercentage ||
      Number(qty) !== data.qty
    );
  }, [data, name, desc, discount, qty]);

  const onSave = async () => {
    if (!data || saving || !dirty) return;
    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: desc.trim(),
        discountPercentage: Number(discount),
        qty: Number(qty),
      };
      const res = await fetch(`${API}/${data.id}`, {
        method: "PUT", // MockAPI chấp nhận PUT hoặc PUT/PATCH đều được
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed ${res.status}`);
      const updated = await res.json();
      setData(updated);
      setEditing(false);
      Alert.alert("Thành công", "Đã lưu thay đổi.");
    } catch (e) {
      console.warn("Update error:", e);
      Alert.alert("Lỗi", "Không thể cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = () => {
    if (!data) return;
    Alert.alert("Xoá promotion?", "Thao tác này không thể khôi phục.", [
      { text: "Huỷ", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: doDelete },
    ]);
  };
  const doDelete = async () => {
    if (!data) return;
    try {
      const res = await fetch(`${API}/${data.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      Alert.alert("Đã xoá", "Promotion đã bị xoá.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e) {
      console.warn("Delete error:", e);
      Alert.alert("Lỗi", "Không thể xoá promotion.");
    }
  };

  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: BG }}>
        <ActivityIndicator />
        <Text className="text-white/70 mt-2">Loading…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: BG }}>
        <Text className="text-white/70">Not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-lg font-bold" numberOfLines={1}>{data.name}</Text>
          {!editing ? (
            <Pressable onPress={() => setEditing(true)} className="px-3 py-2 rounded-xl bg-white">
              <Text className="text-[#0B1220] font-semibold">Edit</Text>
            </Pressable>
          ) : (
            <View className="flex-row">
              <Pressable
                onPress={onSave}
                disabled={!dirty || saving}
                className={`px-3 py-2 rounded-xl ${!dirty || saving ? "bg-white/30" : "bg-white"}`}
              >
                {saving ? <ActivityIndicator /> : <Text className="text-[#0B1220] font-semibold">Save</Text>}
              </Pressable>
              <View className="w-2" />
              <Pressable
                onPress={() => { setEditing(false); setName(data.name); setDesc(data.description); setDiscount(String(data.discountPercentage)); setQty(String(data.qty)); }}
                className="px-3 py-2 rounded-xl border border-white/20"
              >
                <Text className="text-white font-medium">Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Card>
          <Text className="text-white/80 mb-1">Name</Text>
          <TextInput
            editable={editing}
            value={name} onChangeText={setName}
            placeholder="Promo name…" placeholderTextColor="rgba(255,255,255,0.6)"
            className={`text-white rounded-xl px-3 py-2 ${editing ? "bg-white/10" : "bg-white/5"}`}
          />
          <View className="h-3" />
          <Text className="text-white/80 mb-1">Description</Text>
          <TextInput
            editable={editing}
            value={desc} onChangeText={setDesc} multiline
            placeholder="Description…" placeholderTextColor="rgba(255,255,255,0.6)"
            className={`text-white rounded-xl px-3 py-2 min-h-[100px] ${editing ? "bg-white/10" : "bg-white/5"}`}
          />
          <View className="h-3" />
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Text className="text-white/80 mb-1">Discount %</Text>
              <TextInput
                editable={editing}
                value={discount} onChangeText={setDiscount} keyboardType="numeric"
                placeholder="10" placeholderTextColor="rgba(255,255,255,0.6)"
                className={`text-white rounded-xl px-3 py-2 ${editing ? "bg-white/10" : "bg-white/5"}`}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-white/80 mb-1">Qty</Text>
              <TextInput
                editable={editing}
                value={qty} onChangeText={setQty} keyboardType="numeric"
                placeholder="10" placeholderTextColor="rgba(255,255,255,0.6)"
                className={`text-white rounded-xl px-3 py-2 ${editing ? "bg-white/10" : "bg-white/5"}`}
              />
            </View>
          </View>
        </Card>

        {editing ? (
          <View className="mt-4">
            <Pressable onPress={onDelete} className="rounded-2xl px-4 py-3 items-center bg-red-500/20 border border-red-400/30">
              <Text className="text-red-200 font-semibold">Delete</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
