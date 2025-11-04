// app/(dealer-manager)/testdrives/create.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import { selectTempCustomers } from "@/src/features/selections/tempSelectionsSlice";

const BG = "#0B1220";

export default function CreateTestDrive() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { token } = useAppSelector(selectAuth);
  const tempCustomers = useAppSelector(selectTempCustomers);

  const [customerId, setCustomerId] = useState(tempCustomers[0]?.customerId ?? "");
  const [notes, setNotes] = useState("");
  const [dt, setDt] = useState<Date>(new Date());

  // Show flags cho từng picker
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const formattedDate = useMemo(() => {
    // 04 Nov 2025
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }, [dt]);

  const formattedTime = useMemo(() => {
    // 14:35
    return dt.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [dt]);

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    // Luôn đóng picker trên Android (iOS inline có thể để mở nếu muốn)
    if (Platform.OS === "android") setShowDate(false);
    if (event.type === "set" && selected) {
      // giữ nguyên giờ/phút đang có
      const h = dt.getHours();
      const m = dt.getMinutes();
      const n = new Date(selected);
      n.setHours(h, m, 0, 0);
      setDt(n);
      // Nếu muốn “bước tiếp” sang chọn giờ trên Android:
      if (Platform.OS === "android") setShowTime(true);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowTime(false);
    if (event.type === "set" && selected) {
      // giữ nguyên ngày/tháng/năm đang có
      const y = dt.getFullYear();
      const mo = dt.getMonth();
      const d = dt.getDate();
      const n = new Date(y, mo, d, selected.getHours(), selected.getMinutes(), 0, 0);
      setDt(n);
    }
  };

  const validate = () => {
    if (!vehicleId) {
      Alert.alert("Validate", "Missing vehicle_id.");
      return false;
    }
    if (!customerId) {
      Alert.alert("Validate", "Please pick a customer from temp list.");
      return false;
    }
    return true;
  };

  const onCreate = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await fetch("https://electric-vehicle-dealer-management.onrender.com/api/v1/test-drives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer_id: customerId,
          vehicle_id: vehicleId,
          datetime: dt.toISOString(),
          // staff_id: ... // nếu BE cần bạn map từ profile
          notes: notes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Create test drive failed");

      Alert.alert("Success", "Test drive scheduled.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header: Back + Title + Save */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>Create Test Drive</Text>
            <Text numberOfLines={1} style={styles.headerSub}>Vehicle: {String(vehicleId ?? "").slice(0, 8)}…</Text>
          </View>
          <Pressable
            disabled={submitting}
            onPress={onCreate}
            hitSlop={8}
            style={[styles.headerIconBtn, { backgroundColor: "#1e3a8a", borderColor: "rgba(255,255,255,0.12)" }]}
          >
            {submitting ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="save" size={18} color="#E7EEF7" />}
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="p-4 gap-4">
        {/* Customer picker (Temp customers) */}
        <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <Text className="text-white/70 mb-1">Customer *</Text>
          {tempCustomers.length === 0 ? (
            <Text className="text-amber-200">
              No temp customers. Please add a customer to temp list first.
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {tempCustomers.map((c) => {
                const active = c.customerId === customerId;
                return (
                  <Pressable
                    key={c.customerId}
                    onPress={() => setCustomerId(c.customerId)}
                    className={`px-3 py-2 rounded-xl border ${
                      active ? "bg-white/10 border-white" : "bg-white/5 border-white/20"
                    }`}
                  >
                    <Text className="text-white">{c.fullName}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Date & Time chips (mở 2 picker riêng) */}
        <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <Text className="text-white/70 mb-2">Date & time *</Text>
          <View className="flex-row gap-8">
            <Pressable
              onPress={() => setShowDate(true)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"
            >
              <Text className="text-white font-semibold">{formattedDate}</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowTime(true)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"
            >
              <Text className="text-white font-semibold">{formattedTime}</Text>
            </Pressable>
          </View>

          {/* Date picker */}
          {showDate && (
            <DateTimePicker
              value={dt}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeDate}
            />
          )}

          {/* Time picker */}
          {showTime && (
            <DateTimePicker
              value={dt}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Notes */}
        <View className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <Text className="text-white/70 mb-1">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes…"
            placeholderTextColor="#9aa4b2"
            multiline
            className="rounded-xl px-3 py-2 bg-white/10 text-white border border-white/10"
          />
        </View>

        {/* Footer buttons phụ */}
        <View className="flex-row gap-3 mt-10">
          <Pressable onPress={() => router.back()} className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15">
            <Text className="text-white">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onCreate}
            disabled={submitting}
            className="px-4 py-3 rounded-2xl bg-emerald-600 disabled:opacity-60"
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Create</Text>}
          </Pressable>
        </View>
      </View>
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
