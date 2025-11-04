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
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
    formState: { isSubmitting, isDirty, dirtyFields },
    watch,
  } = useForm<UpdateStaffBody>({
    defaultValues: { full_name: "", email: "", status: "ACTIVE" },
    mode: "onChange",
  });

  useEffect(() => {
    if (id) dispatch(fetchDMStaffById({ id: String(id) }));
  }, [id]);

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
  }, [detail]);

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
    if (dirtyFields.full_name) body.full_name = data.full_name;
    if (dirtyFields.email) body.email = data.email;
    if (dirtyFields.status) body.status = data.status;
    if (!Object.keys(body).length) return setEditing(false);

    try {
      await dispatch(updateDMStaff({ id: String(id), body })).unwrap();
      setEditing(false);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Cập nhật thất bại");
    }
  };

  const onDelete = () => {
    Alert.alert("Xoá staff", "Bạn chắc chắn muốn xoá staff này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteDMStaff({ id: String(id) })).unwrap();
            router.replace("/(dealer-manager)/(tabs)");
          } catch (e: any) {
            Alert.alert("Lỗi", e?.message ?? "Xoá thất bại");
          }
        },
      },
    ]);
  };

 const HeaderRight = useMemo(() => {
  if (!editing) {
    return () => (
      <View className="flex-row gap-2">
        <Pressable onPress={onDelete} className="px-3 py-2 rounded-xl bg-red-600">
          <Text className="text-white font-semibold">Delete</Text>
        </Pressable>
        <Pressable onPress={startEdit} className="px-3 py-2 rounded-xl bg-blue-600">
          <Text className="text-white font-semibold">Edit</Text>
        </Pressable>
      </View>
    );
  }
  // 👇 edit mode: thêm Delete ngay trên header
  return () => (
    <View className="flex-row gap-2">
      <Pressable onPress={onDelete} className="px-3 py-2 rounded-xl bg-red-600">
        <Text className="text-white font-semibold">Delete</Text>
      </Pressable>
      <Pressable onPress={cancelEdit} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">
        <Text className="text-white font-semibold">Cancel</Text>
      </Pressable>
    </View>
  );
}, [editing]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: detail?.full_name ?? "Staff Detail", headerRight: HeaderRight }} />

      {loading && !detail ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading…</Text>
        </View>
      ) : !detail ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/70">Không tìm thấy staff</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              paddingTop: 12, // đã có SafeArea top, chỉ thêm khoảng thở
              paddingBottom: 120, // chừa chỗ cho footer nổi
              paddingHorizontal: 16,
              gap: 16,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Card: Profile */}
            <View className="rounded-2xl bg-white/5 border border-white/10 p-14px">
              <Field
                label="Full name"
                editable={editing}
                name="full_name"
                control={control}
                placeholder="Họ tên"
              />
              <View className="h-3" />
              <Field
                label="Email"
                editable={editing}
                name="email"
                control={control}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="staff@dealer.vn"
              />
              <View className="h-3" />
              <StatusField
                label="Status"
                editable={editing}
                control={control}
                name="status"
              />
            </View>

            {/* Card: Info */}
            <View className="rounded-2xl bg-white/5 border border-white/10 p-14px">
              <InfoRow label="Role" value={detail.role} />
              <InfoRow label="Dealer ID" value={detail.dealer_id} />
              <InfoRow label="Created" value={new Date(detail.created_at).toLocaleString()} />
              <InfoRow label="Updated" value={new Date(detail.updated_at).toLocaleString()} />
            </View>
          </ScrollView>

          {/* Floating footer actions */}
          {!editing && (
  <Pressable
    onPress={startEdit}
    className="absolute right-4"
    style={{ bottom: insets.bottom + 16 }}
  >
    {editing && (
  <View
    style={{ paddingBottom: insets.bottom + 12 }}
    className="absolute left-0 right-0 bottom-0 bg-[#0B1220]/95 border-t border-white/10 px-4 pt-10px"
  >
    <View className="flex-row gap-10px">
      {/* Delete luôn hiện trong edit mode */}
      <Pressable
        onPress={onDelete}
        className="flex-1 h-12 items-center justify-center rounded-2xl bg-red-600"
      >
        <Text className="text-white font-semibold">Delete</Text>
      </Pressable>

      {/* Cancel luôn hiện */}
      <Pressable
        onPress={cancelEdit}
        className="flex-1 h-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20"
      >
        <Text className="text-white font-semibold">Cancel</Text>
      </Pressable>

      {/* Confirm chỉ xuất hiện khi có thay đổi */}
      {isDirty ? (
        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onConfirm)}
          className="flex-1 h-12 items-center justify-center rounded-2xl bg-emerald-600 disabled:opacity-60"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Confirm</Text>
          )}
        </Pressable>
      ) : (
        <View className="flex-1 h-12 rounded-2xl opacity-0" />
      )}
    </View>
  </View>
)}
  </Pressable>
)}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

/* ---------- Small UI pieces ---------- */

function Field(props: any) {
  const { label, editable, control, name, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View>
          <Text className="text-white/70 text-xs mb-1">{label}</Text>
          <TextInput
            editable={editable}
            value={value || ""}
            onChangeText={onChange}
            placeholderTextColor="#9aa4b2"
            className={`px-4 py-3 rounded-2xl border ${
              editable
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white/5 border-transparent text-white/80"
            }`}
            {...rest}
          />
        </View>
      )}
    />
  );
}

function StatusField({
  label,
  editable,
  control,
  name,
}: {
  label: string;
  editable: boolean;
  control: any;
  name: "status";
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View>
          <Text className="text-white/70 text-xs mb-1">{label}</Text>
          <View className="flex-row gap-2">
            {(["ACTIVE", "INACTIVE"] as const).map((s) => {
              const active = value === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => editable && onChange(s)}
                  className={`px-3 py-2 rounded-xl border ${
                    active ? "border-white bg-white/10" : "border-white/20 bg-white/5"
                  } ${editable ? "" : "opacity-60"}`}
                >
                  <Text className="text-white">{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    />
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

function ConfirmButton({
  visible,
  loading,
  onPress,
}: {
  visible: boolean;
  loading: boolean;
  onPress: () => void;
}) {
  if (!visible) {
    // nút Confirm ẩn → để hàng nút đều nhau
    return (
      <View className="flex-1 h-12 rounded-2xl bg-white/10 opacity-0" />
    );
  }
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      className="flex-1 h-12 items-center justify-center rounded-2xl bg-emerald-600 disabled:opacity-60"
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Confirm</Text>}
    </Pressable>
  );
}

/* tiny utility class that NativeWind accepts (14px, 10px) */
declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
}
