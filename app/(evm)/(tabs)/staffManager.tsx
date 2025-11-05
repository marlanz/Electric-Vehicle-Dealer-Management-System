import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { useAppSelector } from "@/src/store";
import { selectToken } from "@/src/features/auth/authSlice";
import { http } from "@/src/services/http";
import { router } from "expo-router";

const BG = "#0B1220";
type Role = "EVM_STAFF" | "DEALER_MANAGER" | string;
type Status = "ACTIVE" | "INACTIVE" | string;

type User = {
  id: string; email: string; full_name: string; role: Role; status: Status;
  created_at?: string; updated_at?: string;
};

export default function StaffsList() {
  const token = useAppSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [all, setAll] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  const [status, setStatus] = useState<Status | "ALL">("ALL");

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await http.get("/users", { params: { limit: 50, offset: 0 } });
      setAll(res.data?.data?.users ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const onRefresh = async () => {
    try { setRefreshing(true); await load(); } finally { setRefreshing(false); }
  };

  const data = useMemo(() => {
    return all
      .filter(u => ["EVM_STAFF", "DEALER_MANAGER"].includes(u.role))
      .filter(u => !q.trim()
        || u.full_name?.toLowerCase().includes(q.toLowerCase())
        || u.email?.toLowerCase().includes(q.toLowerCase()))
      .filter(u => role === "ALL" ? true : u.role === role)
      .filter(u => status === "ALL" ? true : u.status === status);
  }, [all, q, role, status]);

  const FilterPill = ({ label, active, onPress }:{label:string;active:boolean;onPress:()=>void}) => (
    <Pressable onPress={onPress}
      style={{
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999,
        backgroundColor: active ? "#60A5FA" : "rgba(255,255,255,0.06)",
        borderWidth: 1, borderColor: active ? "#60A5FA" : "rgba(255,255,255,0.12)"
      }}>
      <Text style={{ color: active ? "#0B1220" : "#fff", fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG , paddingTop: 40}}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>Users</Text>
          <Pressable
            onPress={() => router.push("/(evm)/staffManager/create" as const)}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "#60A5FA" }}>
            <Text style={{ color: "#0B1220", fontWeight: "800" }}>+ Create</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)" }}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by name or email…"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ color: "#fff", paddingHorizontal: 12, paddingVertical: 10 }}
          />
        </View>

        {/* Filters */}
        <View style={{ marginTop: 10, gap: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>Role</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <FilterPill label="All" active={role==="ALL"} onPress={()=>setRole("ALL")} />
            <FilterPill label="EVM Staff" active={role==="EVM_STAFF"} onPress={()=>setRole("EVM_STAFF")} />
            <FilterPill label="Dealer Manager" active={role==="DEALER_MANAGER"} onPress={()=>setRole("DEALER_MANAGER")} />
          </View>

          <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Status</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <FilterPill label="All" active={status==="ALL"} onPress={()=>setStatus("ALL")} />
            <FilterPill label="Active" active={status==="ACTIVE"} onPress={()=>setStatus("ACTIVE")} />
            <FilterPill label="Inactive" active={status==="INACTIVE"} onPress={()=>setStatus("INACTIVE")} />
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(u) => u.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Loading…</Text>
            </View>
          ) : (
            <Text style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", paddingVertical: 24 }}>No users</Text>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/(evm)/staffManager/[id]", params: { id: item.id } })}
            style={{
              backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1, borderRadius: 16, padding: 14
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }} numberOfLines={1}>{item.full_name || "—"}</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }} numberOfLines={1}>{item.email}</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              {item.role} • {item.status}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
