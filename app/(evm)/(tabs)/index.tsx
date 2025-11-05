import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useAppSelector } from "@/src/store";
import { selectToken } from "@/src/features/auth/authSlice";
import { http } from "@/src/services/http";

const BG = "#0B1220";

type User = {
  id: string; email: string; full_name: string;
  role: "EVM_STAFF" | "DEALER_MANAGER" | string;
  status: "ACTIVE" | "INACTIVE" | string;
};

export default function EvmDashboard() {
  const token = useAppSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await http.get("/users", { params: { limit: 50, offset: 0 } });
      setUsers(res.data?.data?.users ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const onRefresh = async () => {
    try { setRefreshing(true); await load(); } finally { setRefreshing(false); }
  };

  const stats = useMemo(() => {
    const all = users.length;
    const evm = users.filter(u => u.role === "EVM_STAFF").length;
    const dm  = users.filter(u => u.role === "DEALER_MANAGER").length;
    const active = users.filter(u => u.status === "ACTIVE").length;
    return { all, evm, dm, active };
  }, [users]);

  return (
    <View style={{ flex: 1, backgroundColor: BG , paddingTop: 40}}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>Admin Dashboard</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
          Quản lý tài khoản EVM Staff & Dealer Manager
        </Text>

        <View style={{ marginTop: 16, gap: 12 }}>
          {[
            { label: "Tổng tài khoản", value: stats.all },
            { label: "EVM Staff", value: stats.evm },
            { label: "Dealer Manager", value: stats.dm },
            { label: "Đang hoạt động", value: stats.active },
          ].map((it, idx) => (
            <View key={idx} style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1, borderRadius: 16, padding: 16
            }}>
              {loading ? <ActivityIndicator/> : (
                <>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{it.value ?? "—"}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{it.label}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
