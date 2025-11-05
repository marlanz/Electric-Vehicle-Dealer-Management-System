import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { http } from "@/src/services/http";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectToken } from "@/src/features/auth/authSlice";

const BG = "#0B1220";
type Role = "EVM_STAFF" | "DEALER_MANAGER" | string;
type Status = "ACTIVE" | "INACTIVE" | string;

type User = {
  id: string; email: string; full_name: string; role: Role; status: Status;
  created_at?: string; updated_at?: string;
};

export default function StaffDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const token = useAppSelector(selectToken);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<{ full_name?: string; email?: string; status?: Status; role?: Role }>({});

  const changed = useMemo(() => {
    if (!user) return false;
    return (
      (form.full_name ?? user.full_name) !== user.full_name ||
      (form.email ?? user.email) !== user.email ||
      (form.status ?? user.status) !== user.status ||
      (form.role ?? user.role) !== user.role
    );
  }, [form, user]);

  const load = async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      const res = await http.get(`/users/${id}`);
      console.log('[[res]],'  , res.data.data.user);
      const u: User | null = res.data?.data.user ?? null;
      setUser(u);
      setForm({
        full_name: u?.full_name, email: u?.email, status: u?.status as Status, role: u?.role as Role
      });
    } catch (e:any) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Fetch failed", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token, id]);

  const save = async () => {
    if (!token || !id || !user || !changed) return;
    try {
      setSaving(true);
      await http.put(`/users/${id}`, {
        full_name: form.full_name, email: form.email, status: form.status, role: form.role
      });
      Alert.alert("Thành công", "Đã cập nhật user.");
      await load();
      setEdit(false);
    } catch (e:any) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const softDelete = async () => {
    if (!token || !id) return;
    Alert.alert("Xác nhận", "Chuyển user sang INACTIVE?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý", style: "destructive",
        onPress: async () => {
          try {
            await http.put(`/users/${id}`, { status: "INACTIVE" });
            Alert.alert("Đã chuyển INACTIVE");
            router.replace("/(evm)/(tabs)/staffManager");
          } catch (e:any) {
            Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Update failed");
          }
        }
      }
    ]);
  };

  const Pill = ({ active, onPress, children }:{active:boolean; onPress:()=>void; children:React.ReactNode}) => (
    <Pressable onPress={onPress}
      disabled={!edit}
      style={{
        opacity: edit ? 1 : 0.6,
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999,
        backgroundColor: active ? "#60A5FA" : "rgba(255,255,255,0.06)",
        borderWidth: 1, borderColor: active ? "#60A5FA" : "rgba(255,255,255,0.12)"
      }}>
      <Text style={{ color: active ? "#0B1220" : "#fff", fontWeight: "600" }}>{children}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>User Detail</Text>
          {!edit ? (
            <Pressable onPress={() => setEdit(true)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "#60A5FA" }}>
              <Text style={{ color: "#0B1220", fontWeight: "800" }}>Edit</Text>
            </Pressable>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              {changed && (
                <Pressable disabled={saving} onPress={save}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: saving ? "rgba(255,255,255,0.3)" : "#22c55e" }}>
                  <Text style={{ color: "#0B1220", fontWeight: "800" }}>{saving ? "Saving…" : "Confirm"}</Text>
                </Pressable>
              )}
              <Pressable onPress={() => { setEdit(false); if (user) setForm({ full_name: user.full_name, email: user.email, status: user.status as Status, role: user.role as Role }); }}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>

        {loading || !user ? (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Loading…</Text>
          </View>
        ) : (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)", padding: 14, gap: 12 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>Full name</Text>
            <TextInput
              editable={edit}
              value={form.full_name}
              onChangeText={(t)=>setForm(f=>({...f, full_name: t}))}
              placeholder="Full name" placeholderTextColor="rgba(255,255,255,0.6)"
              style={{
                color: "#fff", padding: 12, borderRadius: 10,
                backgroundColor: edit ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                borderWidth: 1, borderColor: "rgba(255,255,255,0.12)"
              }}
            />

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Email</Text>
            <TextInput
              editable={edit}
              value={form.email}
              onChangeText={(t)=>setForm(f=>({...f, email: t}))}
              placeholder="user@example.com" placeholderTextColor="rgba(255,255,255,0.6)"
              style={{
                color: "#fff", padding: 12, borderRadius: 10,
                backgroundColor: edit ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                borderWidth: 1, borderColor: "rgba(255,255,255,0.12)"
              }}
              autoCapitalize="none" keyboardType="email-address"
            />

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Role</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <Pill active={(form.role ?? user.role)==="EVM_STAFF"} onPress={()=> setForm(f=>({...f, role: "EVM_STAFF"}))}>EVM Staff</Pill>
              <Pill active={(form.role ?? user.role)==="DEALER_MANAGER"} onPress={()=> setForm(f=>({...f, role: "DEALER_MANAGER"}))}>Dealer Manager</Pill>
            </View>

            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <Pill active={(form.status ?? user.status)==="ACTIVE"} onPress={()=> setForm(f=>({...f, status: "ACTIVE"}))}>Active</Pill>
              <Pill active={(form.status ?? user.status)==="INACTIVE"} onPress={()=> setForm(f=>({...f, status: "INACTIVE"}))}>Inactive</Pill>
            </View>

            {edit && (
              <Pressable onPress={softDelete}
                style={{ marginTop: 8, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#ef4444" }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>Set INACTIVE</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
