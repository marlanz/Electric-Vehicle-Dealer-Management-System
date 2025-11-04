// app/(dealer-manager)/inventory/create.tsx
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../../src/store";
import { createVehicle } from "../../../src/features/dealerManager/inventory/inventorySlice";

const BG = "#0B1220";
const HeaderLeft = () => (
  <Pressable
    onPress={() => router.back()}
    className="px-2 py-1 rounded-lg bg-white/10 border border-white/15"
    hitSlop={8}
  >
    <Feather name="arrow-left" size={18} color="#E7EEF7" />
  </Pressable>
);
export default function DMInventoryCreate() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    model: "", version: "", color: "", year: "", msrp: "", description: "", status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    image_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onCreate = async () => {
    if (!form.model.trim()) return Alert.alert("Validate", "Model is required.");
    if (!form.version.trim()) return Alert.alert("Validate", "Version is required.");

    try {
      setSubmitting(true);
      await dispatch(
        createVehicle({
          model: form.model.trim(),
          version: form.version.trim(),
          color: form.color.trim() || undefined,
          year: form.year ? Number(form.year) : undefined,
          msrp: form.msrp ? Number(form.msrp) : undefined,
          description: form.description.trim() || undefined,
          image_url: form.image_url.trim() || undefined,
          status: form.status,
          features: {}, // tuỳ bạn map
        })
      ).unwrap();
      Alert.alert("Created", "Vehicle created.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header đồng bộ: back + title + action (Create) */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>Create Vehicle</Text>
            <Text numberOfLines={1} style={styles.headerSub}>Add a new vehicle to catalog</Text>
          </View>
          <Pressable disabled={submitting} onPress={onCreate} hitSlop={8} style={[styles.headerIconBtn, { backgroundColor: "#1e3a8a", borderColor: "rgba(255,255,255,0.12)" }]}>
            {submitting ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="save" size={18} color="#E7EEF7" />}
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
          {row("Model", form.model, (t) => setForm((s) => ({ ...s, model: t })))}
          {row("Version", form.version, (t) => setForm((s) => ({ ...s, version: t })))}
          {row("Color", form.color, (t) => setForm((s) => ({ ...s, color: t })))}
          {row("Year", form.year, (t) => setForm((s) => ({ ...s, year: t })), "numeric")}
          {row("MSRP", form.msrp, (t) => setForm((s) => ({ ...s, msrp: t })), "numeric")}
          {row("Status (ACTIVE/INACTIVE)", form.status, (t) => setForm((s) => ({ ...s, status: t as any })))}
          {multi("Description", form.description, (t) => setForm((s) => ({ ...s, description: t })))}
          {row("Image URL", form.image_url, (t) => setForm((s) => ({ ...s, image_url: t })))}

          {/* Footer buttons (phụ) */}
          <View className="flex-row gap-10 mt-12">
            <Pressable onPress={() => router.back()} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15" disabled={submitting}>
              <Text className="text-white">Cancel</Text>
            </Pressable>
            <Pressable onPress={onCreate} className="px-4 py-2 rounded-xl bg-blue-600" disabled={submitting}>
              <Text className="text-white font-semibold">{submitting ? "Saving…" : "Create"}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function row(
  label: string,
  value: string,
  onChange: (t: string) => void,
  keyboardType: "default" | "numeric" = "default"
) {
  return (
    <View className="mb-3">
      <Text className="text-white/70 mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor="rgba(255,255,255,0.4)"
        className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
        keyboardType={keyboardType}
      />
    </View>
  );
}

function multi(label: string, value: string, onChange: (t: string) => void) {
  return (
    <View className="mb-3">
      <Text className="text-white/70 mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
        placeholder={label}
        placeholderTextColor="rgba(255,255,255,0.4)"
        className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BG,
  },
  headerIconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: { color: "white", fontWeight: "700", fontSize: 16 },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
});
