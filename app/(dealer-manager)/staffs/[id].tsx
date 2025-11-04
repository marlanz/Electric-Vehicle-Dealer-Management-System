import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  deleteDMStaff,
  fetchDMStaffById,
  selectDMStaffDetail,
  selectDMStaffDetailLoading,
  updateDMStaff,
} from "@/src/features/dealerManager/staffs/staffSlice";
import type { UpdateStaffBody } from "@/src/features/dealerManager/staffs/types";

const BG = "#0B1220";

export default function DM_StaffDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectDMStaffDetailLoading);
  const detail = useAppSelector(selectDMStaffDetail(String(id)));
  const insets = useSafeAreaInsets();

  const [editing, setEditing] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, dirtyFields, errors },
  } = useForm<UpdateStaffBody>({
    defaultValues: { full_name: "", email: "", status: "ACTIVE" },
    mode: "onChange",
  });

  useEffect(() => {
    if (id) dispatch(fetchDMStaffById({ id: String(id) }));
  }, [id, dispatch]);

  useEffect(() => {
    if (detail) {
      reset(
        {
          full_name: detail.full_name,
          email: detail.email,
          status: (detail.status as "ACTIVE" | "INACTIVE") ?? "ACTIVE",
        },
        { keepDirty: false }
      );
    }
  }, [detail, reset]);

  const title = detail?.full_name ?? "Staff Detail";

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    if (detail)
      reset(
        {
          full_name: detail.full_name,
          email: detail.email,
          status: (detail.status as any) ?? "ACTIVE",
        },
        { keepDirty: false }
      );
    setEditing(false);
  };

  const onConfirm = async (data: UpdateStaffBody) => {
    const body: UpdateStaffBody = {};
    if (dirtyFields.full_name) body.full_name = data.full_name?.trim();
    if (dirtyFields.email) body.email = data.email?.trim();
    if (dirtyFields.status) body.status = data.status;

    if (!Object.keys(body).length) return setEditing(false);

    try {
      await dispatch(updateDMStaff({ id: String(id), body })).unwrap();
      setEditing(false);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Update failed");
    }
  };

  const onDelete = () => {
    Alert.alert("Delete staff", "Are you sure you want to delete this staff?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteDMStaff({ id: String(id) })).unwrap();
            router.replace("/(dealer-manager)/(tabs)");
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Delete failed");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header đồng bộ: back + title + action (Edit/Delete hoặc Save/Cancel) */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>

          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
            <Text numberOfLines={1} style={styles.headerSub}>
              {editing ? "Editing staff profile" : "Staff profile & metadata"}
            </Text>
          </View>

          {!editing ? (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={onDelete} hitSlop={8} style={[styles.headerIconBtn, { borderColor: "rgba(255,0,0,0.25)" }]}>
                <Feather name="trash-2" size={18} color="#FCA5A5" />
              </Pressable>
              <Pressable onPress={startEdit} hitSlop={8} style={[styles.headerIconBtn, { backgroundColor: "#1e3a8a", borderColor: "rgba(255,255,255,0.12)" }]}>
                <Feather name="edit-3" size={18} color="#E7EEF7" />
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable disabled={isSubmitting} onPress={handleSubmit(onConfirm)} hitSlop={8} style={[styles.headerIconBtn, { backgroundColor: "#166534", borderColor: "rgba(255,255,255,0.12)" }]}>
                {isSubmitting ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="save" size={18} color="#E7EEF7" />}
              </Pressable>
              <Pressable disabled={isSubmitting} onPress={cancelEdit} hitSlop={8} style={styles.headerIconBtn}>
                <Feather name="x" size={18} color="#E7EEF7" />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>

      {loading && !detail ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading…</Text>
        </View>
      ) : !detail ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/70">Staff not found</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} className="flex-1">
          <ScrollView
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: 24,
              paddingHorizontal: 16,
              gap: 16,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Card: Profile */}
            <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
              {/* Full name (required when editing) */}
              <Controller
                control={control}
                name="full_name"
                rules={editing ? { required: "Full name is required" } : undefined}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Text className="text-white/70 text-xs mb-1">Full name</Text>
                    <TextInput
                      editable={editing}
                      value={value || ""}
                      onChangeText={onChange}
                      placeholder="Full name"
                      placeholderTextColor="#9aa4b2"
                      className={`px-4 py-3 rounded-2xl border ${
                        editing ? "bg-white/10 border-white/10 text-white" : "bg-white/5 border-transparent text-white/80"
                      }`}
                    />
                    {errors.full_name && <Text className="text-red-400 mt-1">{errors.full_name.message}</Text>}
                  </View>
                )}
              />

              <View className="h-3" />

              {/* Email (required + pattern khi editing) */}
              <Controller
                control={control}
                name="email"
                rules={
                  editing
                    ? {
                        required: "Email is required",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                      }
                    : undefined
                }
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Text className="text-white/70 text-xs mb-1">Email</Text>
                    <TextInput
                      editable={editing}
                      value={value || ""}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="staff@dealer.vn"
                      placeholderTextColor="#9aa4b2"
                      className={`px-4 py-3 rounded-2xl border ${
                        editing ? "bg-white/10 border-white/10 text-white" : "bg-white/5 border-transparent text-white/80"
                      }`}
                    />
                    {errors.email && <Text className="text-red-400 mt-1">{errors.email.message}</Text>}
                  </View>
                )}
              />

              <View className="h-3" />

              {/* Status (pills) */}
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Text className="text-white/70 text-xs mb-1">Status</Text>
                    <View className="flex-row gap-2">
                      {(["ACTIVE", "INACTIVE"] as const).map((s) => {
                        const active = value === s;
                        return (
                          <Pressable
                            key={s}
                            disabled={!editing}
                            onPress={() => onChange(s)}
                            className={`px-3 py-2 rounded-xl border ${
                              active ? "bg-white/10 border-white" : "bg-white/5 border-white/20"
                            } ${editing ? "" : "opacity-60"}`}
                          >
                            <Text className="text-white">{s}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              />
            </View>

            {/* Card: Info */}
            <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <InfoRow label="Role" value={detail.role} />
              <InfoRow label="Dealer ID" value={detail.dealer_id} />
              <InfoRow label="Created" value={new Date(detail.created_at).toLocaleString()} />
              <InfoRow label="Updated" value={new Date(detail.updated_at).toLocaleString()} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View className="py-2">
      <Text className="text-white/50 text-xs">{label}</Text>
      <Text className="text-white mt-1">{value || "—"}</Text>
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
