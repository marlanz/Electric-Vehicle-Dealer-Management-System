import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { http } from "@/src/services/http";
import { router } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectToken } from "@/src/features/auth/authSlice";

const BG = "#0B1220";
type Role = "EVM_STAFF" | "DEALER_MANAGER";
type Status = "ACTIVE" | "INACTIVE";

export default function CreateStaff() {
  const token = useAppSelector(selectToken);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("EVM_STAFF");
  const [status, setStatus] = useState<Status>("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const create = async () => {
    if (!token) return;
    if (!email || !fullName || !password) {
      Alert.alert("Thiếu dữ liệu", "Vui lòng nhập Email, Họ tên và Mật khẩu.");
      return;
    }
    try {
      setSubmitting(true);
      await http.post("/users", {
        email, password, full_name: fullName, role, status
      });
      Alert.alert("Thành công", "Đã tạo tài khoản.", [
        { text: "OK", onPress: () => router.replace("/(evm)/(tabs)/staffManager") }
      ]);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Create failed");
    } finally { setSubmitting(false); }
  };

  const Pill = ({ active, onPress, children }:{active:boolean; onPress:()=>void; children:React.ReactNode}) => (
    <Pressable onPress={onPress}
      style={{
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999,
        backgroundColor: active ? "#60A5FA" : "rgba(255,255,255,0.06)",
        borderWidth: 1, borderColor: active ? "#60A5FA" : "rgba(255,255,255,0.12)"
      }}>
      <Text style={{ color: active ? "#0B1220" : "#fff", fontWeight: "600" }}>{children}</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: BG }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>Create User</Text>

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)", padding: 14, gap: 10 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>Email</Text>
            <TextInput
              value={email} onChangeText={setEmail}
              placeholder="user@example.com" placeholderTextColor="rgba(255,255,255,0.6)"
              autoCapitalize="none" keyboardType="email-address"
              style={{ color: "#fff", padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
            />

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Full name</Text>
            <TextInput
              value={fullName} onChangeText={setFullName}
              placeholder="Nguyen Van A" placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: "#fff", padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
            />

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Password</Text>
            <TextInput
              value={password} onChangeText={setPassword} secureTextEntry
              placeholder="••••••••" placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: "#fff", padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
            />

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Role</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <Pill active={role==="EVM_STAFF"} onPress={()=>setRole("EVM_STAFF")}>EVM Staff</Pill>
              <Pill active={role==="DEALER_MANAGER"} onPress={()=>setRole("DEALER_MANAGER")}>Dealer Manager</Pill>
            </View>

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <Pill active={status==="ACTIVE"} onPress={()=>setStatus("ACTIVE")}>Active</Pill>
              <Pill active={status==="INACTIVE"} onPress={()=>setStatus("INACTIVE")}>Inactive</Pill>
            </View>

            <Pressable
              disabled={submitting}
              onPress={create}
              style={{ marginTop: 12, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: submitting ? "rgba(255,255,255,0.3)" : "#60A5FA" }}
            >
              <Text style={{ color: "#0B1220", fontWeight: "800" }}>{submitting ? "Creating…" : "Create"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
