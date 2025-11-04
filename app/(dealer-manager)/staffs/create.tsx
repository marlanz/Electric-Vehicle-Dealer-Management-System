import React, { useMemo } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "@/src/store";
import { createDMStaff } from "@/src/features/dealerManager/staffs/staffSlice";
import type { CreateStaffBody } from "@/src/features/dealerManager/staffs/types";

export default function DM_StaffCreate() {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateStaffBody>({
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "DEALER_STAFF",
      dealer_id: "",
      status: "ACTIVE",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (form: CreateStaffBody) => {
    try {
      const res = await dispatch(createDMStaff(form)).unwrap();
      Alert.alert("Thành công", "Đã tạo staff mới");
      router.replace(`/(dealer-manager)/staffs/${res.id}`);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Tạo staff thất bại");
    }
  };

  const SaveBtn = useMemo(
    () => () => (
      <Pressable
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        className="px-3 py-2 rounded-xl bg-emerald-600 disabled:opacity-60"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Save</Text>
        )}
      </Pressable>
    ),
    [isSubmitting]
  );

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "New Staff", headerRight: SaveBtn }} />

      <View className="p-4 gap-4">
        {/* Full name */}
        <View>
          <Text className="text-white mb-2">Full name *</Text>
          <Controller
            control={control}
            name="full_name"
            rules={{ required: "Bắt buộc" }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: Trần Thị Staff"
                placeholderTextColor="#9aa4b2"
                className="rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3"
              />
            )}
          />
          {errors.full_name && <Text className="text-red-400 mt-1">{errors.full_name.message}</Text>}
        </View>

        {/* Email */}
        <View>
          <Text className="text-white mb-2">Email *</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Bắt buộc",
              pattern: { value: /\S+@\S+\.\S+/, message: "Email không hợp lệ" },
            }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="staff@dealer.vn"
                placeholderTextColor="#9aa4b2"
                className="rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3"
              />
            )}
          />
          {errors.email && <Text className="text-red-400 mt-1">{errors.email.message}</Text>}
        </View>

        {/* Password */}
        <View>
          <Text className="text-white mb-2">Password *</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Bắt buộc", minLength: { value: 6, message: "≥ 6 ký tự" } }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor="#9aa4b2"
                className="rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3"
              />
            )}
          />
          {errors.password && <Text className="text-red-400 mt-1">{errors.password.message}</Text>}
        </View>

        {/* Dealer ID
        <View>
          <Text className="text-white mb-2">Dealer ID *</Text>
          <Controller
            control={control}
            name="dealer_id"
            rules={{ required: "Bắt buộc" }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                placeholder="UUID dealer (ví dụ: 8498f460-...)"
                placeholderTextColor="#9aa4b2"
                className="rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3"
              />
            )}
          />
          {errors.dealer_id && <Text className="text-red-400 mt-1">{errors.dealer_id.message}</Text>}
        </View> */}

        {/* Status */}
        <View>
          <Text className="text-white mb-2">Status *</Text>
          <Controller
            control={control}
            name="status"
            rules={{ required: "Bắt buộc" }}
            render={({ field: { value, onChange } }) => (
              <View className="flex-row gap-3">
                {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => onChange(s)}
                    className={`px-3 py-2 rounded-xl border ${
                      value === s ? "bg-white/10 border-white" : "bg-white/5 border-white/20"
                    }`}
                  >
                    <Text className="text-white">{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>

        {/* Role (fixed) */}
        <View className="opacity-70">
          <Text className="text-white mb-2">Role</Text>
          <Text className="text-white/80 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
            DEALER_STAFF
          </Text>
        </View>

        {/* Save bottom (backup to headerRight) */}
        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          className="mt-6 items-center justify-center rounded-2xl bg-emerald-600 h-12 disabled:opacity-60"
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Save</Text>}
        </Pressable>
      </View>
    </View>
  );
}
