// app/(dealer-manager)/inventory/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import {
  deleteVehicle, fetchVehicleDetail, selectDmInvDetail, selectDmInvDetailDeleting,
  selectDmInvDetailLoading, selectDmInvDetailSaving, updateVehicle
} from "../../../src/features/dealerManager/inventory/inventorySlice";

const BG = "#0B1220";

function currency(v?: number | string | null) {
  if (v == null) return "—";
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return String(v);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}
const HeaderLeft = () => (
  <Pressable
    onPress={() => router.back()}
    className="px-2 py-1 rounded-lg bg-white/10 border border-white/15"
    hitSlop={8}
  >
    <Feather name="arrow-left" size={18} color="#E7EEF7" />
  </Pressable>
);

export default function DMInventoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const data     = useAppSelector(selectDmInvDetail);
  const loading  = useAppSelector(selectDmInvDetailLoading);
  const saving   = useAppSelector(selectDmInvDetailSaving);
  const deleting = useAppSelector(selectDmInvDetailDeleting);

  const [edit, setEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    model: "", version: "", color: "", year: "", msrp: "", description: "", status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  });

  useEffect(() => { if (id) dispatch(fetchVehicleDetail(id)); }, [id, dispatch]);
  useEffect(() => {
    if (data) {
      setForm({
        model: data.model ?? "",
        version: data.version ?? "",
        color: data.color ?? "",
        year: data.year ? String(data.year) : "",
        msrp: data.msrp ? String(data.msrp) : "",
        description: data.description ?? "",
        status: (data.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"),
      });
    }
  }, [data]);

  const images = useMemo(() => {
    const arr = [
      ...(data?.image_url ? [data.image_url] : []),
      ...(data?.gallery ?? []),
    ];
    return arr;
  }, [data?.image_url, data?.gallery]);

  const title = useMemo(() => {
    if (!data) return "";
    return `${data.model}${data.version ? " " + data.version : ""}`;
  }, [data]);

  const onSave = async () => {
    if (!id) return;
    const body = {
      model: form.model || undefined,
      version: form.version || undefined,
      color: form.color || undefined,
      year: form.year ? Number(form.year) : undefined,
      msrp: form.msrp ? Number(form.msrp) : undefined,
      description: form.description || undefined,
      status: form.status,
    };
    try {
      await dispatch(updateVehicle({ vehicleId: id, body })).unwrap();
      setEdit(false);
      Alert.alert("Updated", "Vehicle updated successfully.");
    } catch (e: any) {
      Alert.alert("Update failed", String(e?.message ?? e));
    }
  };

  const onDelete = async () => {
    if (!id) return;
    setConfirmOpen(false);
    try {
      await dispatch(deleteVehicle(id)).unwrap();
      Alert.alert("Deleted", "Vehicle removed successfully.");
      router.back();
    } catch (e: any) {
      Alert.alert("Delete failed", String(e?.message ?? e));
    }
  };

  if (loading || !data) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: BG }}>
        <ActivityIndicator />
        <Text className="text-white/70 mt-2">Loading vehicle…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {/* Header giống inventory style */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerIconBtn}>
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>

          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
            {!!data.msrp && <Text numberOfLines={1} style={styles.headerSub}>From {currency(data.msrp)}</Text>}
          </View>

          {!edit ? (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={() => setEdit(true)} hitSlop={8} style={styles.headerIconBtn}>
                <Feather name="edit-3" size={18} color="#E7EEF7" />
              </Pressable>
              <Pressable
                onPress={() => setConfirmOpen(true)}
                hitSlop={8}
                style={[styles.headerIconBtn, { borderColor: "rgba(255,255,255,0.14)" }]}
              >
                <Feather name="trash-2" size={18} color="#FCA5A5" />
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                disabled={saving}
                onPress={onSave}
                hitSlop={8}
                style={[styles.headerIconBtn, { backgroundColor: "#166534" }]}
              >
                {saving ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="save" size={18} color="#E7EEF7" />}
              </Pressable>
              <Pressable
                disabled={saving}
                onPress={() => {
                  setEdit(false);
                  setForm({
                    model: data.model ?? "", version: data.version ?? "", color: data.color ?? "",
                    year: data.year ? String(data.year) : "", msrp: data.msrp ? String(data.msrp) : "",
                    description: data.description ?? "", status: (data.status === "ACTIVE" ? "ACTIVE" : "INACTIVE")
                  });
                }}
                hitSlop={8}
                style={styles.headerIconBtn}
              >
                <Feather name="x" size={18} color="#E7EEF7" />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Gallery */}
        <View style={{ borderRadius: 24, overflow: "hidden" }} className="m-4">
          <Image
            source={{ uri: images[0] || "https://tse1.mm.bing.net/th/id/OIP.BNr7COrS5-hwntskpdYHpQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" }}
            style={{ width: "100%", height: 240 }}
            contentFit="cover"
          />
        </View>

        {/* Fields giống inventory */}
        <View className="px-5">
          {renderRow("Model", form.model, (t) => setForm((s) => ({ ...s, model: t })), !edit)}
          {renderRow("Version", form.version, (t) => setForm((s) => ({ ...s, version: t })), !edit)}
          {renderRow("Color", form.color, (t) => setForm((s) => ({ ...s, color: t })), !edit)}
          {renderRow("Year", form.year, (t) => setForm((s) => ({ ...s, year: t })), !edit, "numeric")}
          {renderRow("MSRP", form.msrp, (t) => setForm((s) => ({ ...s, msrp: t })), !edit, "numeric")}
          {renderRow("Status (ACTIVE/INACTIVE)", form.status, (t) => setForm((s) => ({ ...s, status: t as any })), !edit)}
          {renderMulti("Description", form.description, (t) => setForm((s) => ({ ...s, description: t })), !edit)}
        </View>
      </ScrollView>

      {/* Confirm delete */}
      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text className="text-white font-semibold text-base">Delete this vehicle?</Text>
            <Text className="text-white/70 mt-2">This action cannot be undone.</Text>
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
              <Pressable onPress={() => setConfirmOpen(false)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                <Text className="text-white">Cancel</Text>
              </Pressable>
              <Pressable disabled={deleting} onPress={onDelete} className="px-3 py-2 rounded-lg bg-rose-600/90">
                {deleting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Delete</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function renderRow(
  label: string,
  value: string,
  onChange: (t: string) => void,
  readOnly: boolean,
  keyboardType: "default" | "numeric" = "default"
) {
  return (
    <View className="mb-3">
      <Text className="text-white/70 mb-1">{label}</Text>
      <TextInput
        value={value}
        editable={!readOnly}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor="rgba(255,255,255,0.4)"
        className={`rounded-xl px-3 py-2 ${readOnly ? "bg-white/5" : "bg-white/10"} text-white border border-white/10`}
        keyboardType={keyboardType}
      />
    </View>
  );
}
function renderMulti(label: string, value: string, onChange: (t: string) => void, readOnly: boolean) {
  return (
    <View className="mb-3">
      <Text className="text-white/70 mb-1">{label}</Text>
      <TextInput
        value={value}
        editable={!readOnly}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
        placeholder={label}
        placeholderTextColor="rgba(255,255,255,0.4)"
        className={`rounded-xl px-3 py-2 ${readOnly ? "bg-white/5" : "bg-white/10"} text-white border border-white/10`}
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
  modalWrap: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center",
    padding: 16
  },
  modalCard: {
    width: "100%", borderRadius: 16, padding: 16,
    backgroundColor: "#121826", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)"
  },
});
