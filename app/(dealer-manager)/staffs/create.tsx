import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "@/src/store";
import { createDMStaff } from "@/src/features/dealerManager/staffs/staffSlice";
import type { CreateStaffBody } from "@/src/features/dealerManager/staffs/types";

const BG = "#0B1220";

export default function DM_StaffCreate() {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStaffBody>({
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "DEALER_STAFF",
      dealer_id: "",     // nếu backend tự suy ra từ token có thể bỏ qua
      status: "ACTIVE",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (form: CreateStaffBody) => {
    try {
      setSubmitting(true);
      const res = await dispatch(createDMStaff(form)).unwrap();
      Alert.alert("Success", "Staff created");
      router.replace(`/(dealer-manager)/staffs/${res.id}`);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header đồng bộ: back + title + action (Save) */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>New Staff</Text>
            <Text numberOfLines={1} style={styles.headerSub}>Create a dealer-staff account</Text>
          </View>
          <Pressable disabled={submitting} onPress={handleSubmit(onSubmit)} hitSlop={8} style={[styles.headerIconBtn, { backgroundColor: "#1e3a8a", borderColor: "rgba(255,255,255,0.12)" }]}>
            {submitting ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="save" size={18} color="#E7EEF7" />}
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
          {/* Full name (required) */}
          <Text className="text-white/70 mb-1">Full name *</Text>
          <Controller
            control={control}
            name="full_name"
            rules={{ required: "Full name is required" }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: Trần Thị Staff"
                placeholderTextColor="#9aa4b2"
                className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
              />
            )}
          />
          {errors.full_name && <Text className="text-red-400 mt-1">{errors.full_name.message}</Text>}

          <View style={{ height: 12 }} />

          {/* Email (required + pattern) */}
          <Text className="text-white/70 mb-1">Email *</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="staff@dealer.vn"
                placeholderTextColor="#9aa4b2"
                className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
              />
            )}
          />
          {errors.email && <Text className="text-red-400 mt-1">{errors.email.message}</Text>}

          <View style={{ height: 12 }} />

          {/* Password (required ≥ 6) */}
          <Text className="text-white/70 mb-1">Password *</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } }}
            render={({ field: { value, onChange} }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor="#9aa4b2"
                className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
              />
            )}
          />
          {errors.password && <Text className="text-red-400 mt-1">{errors.password.message}</Text>}

          <View style={{ height: 12 }} />

          {/* Status (pills) */}
          <Text className="text-white/70 mb-1">Status *</Text>
          <Controller
            control={control}
            name="status"
            rules={{ required: "Status is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="flex-row gap-2">
                {(["ACTIVE", "INACTIVE"] as const).map((s) => {
                  const active = value === s;
                  return (
                    <Pressable
                      key={s}
                      onPress={() => onChange(s)}
                      className={`px-3 py-2 rounded-xl border ${active ? "bg-white/10 border-white" : "bg-white/5 border-white/20"}`}
                    >
                      <Text className="text-white">{s}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </View>

        {/* Footer phụ (nếu muốn bấm thay vì icon Save) */}
        <View className="flex-row gap-3 mt-12">
          <Pressable onPress={() => router.back()} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15" disabled={submitting}>
            <Text className="text-white">Cancel</Text>
          </Pressable>
          <Pressable onPress={handleSubmit(onSubmit)} className="px-4 py-2 rounded-xl bg-emerald-600 disabled:opacity-60" disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Save</Text>}
          </Pressable>
        </View>
      </ScrollView>
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
