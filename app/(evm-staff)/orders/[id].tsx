// app/(evm-staff)/orders/[id].tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  fetchEvmOrderDetail,
  refreshEvmOrderDetail,
  selectEvmOrderDetail,
  selectEvmOrderDLoading,
} from "@/src/features/evmStaff/ordersSlice";
import { http } from "@/src/services/http";

const BG = "#0B1220";

function currencyVND(v?: number | null) {
  if (v == null) return "—";
  try { return new Intl.NumberFormat("vi-VN").format(v) + "₫"; } catch { return String(v); }
}
function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <View style={{ marginTop: 12 }}>
    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</Text>
    <Text style={{ color: "#fff", fontWeight: "500", marginTop: 6 }}>{value ?? "—"}</Text>
  </View>
);

const Badge = ({ text, tone = "blue" }: { text: string; tone?: "blue" | "green" | "amber" | "red" | "gray" }) => {
  const map: Record<typeof tone, { bg: string; border: string; color: string }> = {
    blue:  { bg: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.35)",  color: "#bfdbfe" },
    green: { bg: "rgba(16,185,129,0.18)",  border: "rgba(16,185,129,0.35)",  color: "#bbf7d0" },
    amber: { bg: "rgba(245,158,11,0.18)",  border: "rgba(245,158,11,0.35)",  color: "#fde68a" },
    red:   { bg: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.35)",   color: "#fecaca" },
    gray:  { bg: "rgba(148,163,184,0.18)", border: "rgba(148,163,184,0.35)", color: "#e2e8f0" },
  };
  const s = map[tone];
  return (
    <View style={{
      paddingHorizontal: 10, height: 28, borderRadius: 999,
      backgroundColor: s.bg, borderWidth: 1, borderColor: s.border,
      justifyContent: "center", alignSelf: "flex-start"
    }}>
      <Text style={{ color: s.color, fontSize: 12, fontWeight: "600" }}>{text}</Text>
    </View>
  );
};

function statusTone(st?: string): "blue" | "green" | "amber" | "red" | "gray" {
  switch (st) {
    case "PROCESSING": return "amber";
    case "PAID":       return "blue";
    case "CONTRACTED": return "blue";
    case "FULFILLED":  return "green";
    case "CANCELLED":  return "gray";
    default:           return "blue";
  }
}

export default function EVM_OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const detail  = useAppSelector(selectEvmOrderDetail);
  const loading = useAppSelector(selectEvmOrderDLoading);

  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchEvmOrderDetail(id));
  }, [dispatch, id]);

  const onRefresh = useCallback(() => {
    if (id) dispatch(refreshEvmOrderDetail(id));
  }, [dispatch, id]);

  const onCreateQuote = useCallback(() => {
    if (!detail) return;
    router.push({ pathname: "/(evm-staff)/quotations/create", params: { orderId: detail.id } });
  }, [detail]);

  // >>> Mark Paid = tạo payment + confirm ngay sau đó, rồi refresh detail
  const onMarkPaid = useCallback(() => {
    if (!detail) return;
    const amount = Number(detail.price || 0);
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Giá cuối cùng (amount) của đơn đang bằng 0 hoặc không hợp lệ.");
      return;
    }
    Alert.alert("Confirm", `Xác nhận tạo thanh toán ${currencyVND(amount)} và đánh dấu đã thanh toán?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            setPaying(true);

            // 1) Create payment
            const transactionRef = `MANUAL-${Date.now()}`;
            const createBody = {
              type: "DOWNPAYMENT",
              amount,               // dùng giá cuối cùng
              method: "CASH",       // luôn tiền mặt
              transaction_ref: transactionRef,
              note: "Paid at counter",
            };
            const createRes = await http.post(`/orders/${detail.id}/payments`, createBody);
            const payment =
              createRes?.data?.data?.payment ??
              createRes?.data?.payment ??
              createRes?.data?.data ??
              createRes?.data;
            const paymentId = payment?.id || payment?.payment_id;
            if (!paymentId) throw new Error("Không lấy được payment_id từ API tạo thanh toán.");

            // 2) Confirm payment
            const confirmBody = { transaction_ref: transactionRef };
            await http.post(`/orders/payments/${paymentId}/confirm`, confirmBody);

            // 3) Refresh order detail
            await dispatch(refreshEvmOrderDetail(detail.id));

            Alert.alert("Success", "Thanh toán đã được xác nhận.");
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Thanh toán thất bại");
          } finally {
            setPaying(false);
          }
        },
      },
    ]);
  }, [detail, dispatch]);

  const onCreateContract = useCallback(() => {
    if (!detail) return;
    router.push({ pathname: "/(evm-staff)/contracts/create", params: { orderId: detail.id } });
  }, [detail]);

  const onFulfill = useCallback(() => {
    if (!detail) return;
    Alert.alert("Confirm", "Xác nhận đã bàn giao xe (Fulfilled)?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: async () => {
        // await dispatch(evmFulfillOrder(detail.id));
        onRefresh();
      }},
    ]);
  }, [detail, onRefresh]);

  const onCancel = useCallback(() => {
    if (!detail) return;
    Alert.alert("Cancel order", "Bạn có chắc hủy đơn hàng này?", [
      { text: "No", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: async () => {
        // await dispatch(evmCancelOrder(detail.id));
        router.back();
      }},
    ]);
  }, [detail]);

  // Điều kiện hiển thị các action theo status hiện tại
  const actions = useMemo(() => {
    const st = detail?.status;
    return {
      canCreateQuote:    st === "PROCESSING",
      canMarkPaid:       st === "PROCESSING",      // chờ thanh toán
      canCreateContract: st === "PAID",
      canFulfill:        st === "CONTRACTED",
      canCancel:         st !== "FULFILLED" && st !== "CANCELLED",
    };
  }, [detail?.status]);

  if (loading && !detail) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center", backgroundColor: BG }}>
        <ActivityIndicator />
        <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center", backgroundColor: BG, padding: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "600", marginBottom: 8 }}>Order not found</Text>
        <Pressable onPress={() => router.back()} style={{
          flexDirection:"row", alignItems:"center",
          paddingHorizontal:12, paddingVertical:8, borderRadius:12,
          backgroundColor: "rgba(255,255,255,0.06)", borderWidth:1, borderColor:"rgba(255,255,255,0.12)"
        }}>
          <Feather name="arrow-left" size={16} color="#E7EEF7" />
          <Text style={{ color:"#fff", marginLeft: 6 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor: BG }}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
        <View style={{ height:56, paddingHorizontal:12, flexDirection:"row", alignItems:"center", gap:8 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={{ padding:10, borderRadius:12, backgroundColor:"rgba(255,255,255,0.06)", borderWidth:1, borderColor:"rgba(255,255,255,0.12)" }}
          >
            <Feather name="arrow-left" size={18} color="#E7EEF7" />
          </Pressable>
          <View style={{ flex:1, marginHorizontal:8 }}>
            <Text numberOfLines={1} style={{ color:"#fff", fontWeight:"700", fontSize:16 }}>
              {detail.dealer_name ?? detail.dealer_id}
            </Text>
            <View style={{ marginTop: 4 }}>
              <Badge text={detail.status ?? "—"} tone={statusTone(detail.status)} />
            </View>
          </View>
          <Pressable
            onPress={onRefresh}
            hitSlop={8}
            style={{ padding:10, borderRadius:12, backgroundColor:"rgba(255,255,255,0.06)", borderWidth:1, borderColor:"rgba(255,255,255,0.12)" }}
          >
            {loading ? <ActivityIndicator color="#E7EEF7" /> : <Feather name="refresh-ccw" size={18} color="#E7EEF7" />}
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ padding:16, paddingBottom: Math.max(24, (useSafeAreaInsets().bottom || 0) + 84) }}
      >
        <View style={{ borderRadius: 16, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16 }}>
          <Row label="Order ID" value={detail.id} />
          <Row label="Order date" value={fmtDate(detail.order_date)} />
          <Row label="Dealer" value={`${detail.dealer_name ?? "—"}${detail.dealer_code ? ` (${detail.dealer_code})` : ""}`} />
          <Row label="Customer" value={`${detail.customer_name ?? "—"} • ${detail.customer_phone ?? detail.customer_email ?? ""}`} />
          <Row
            label="Vehicle"
            value={`${detail.vehicle_model ?? "—"}${detail.vehicle_version ? ` • ${detail.vehicle_version}` : ""}${detail.vehicle_color ? ` • ${detail.vehicle_color}` : ""}`}
          />
          <Row label="Price" value={currencyVND(detail.price)} />
          <Row label="Promotion" value={detail.promotion_name ?? "—"} />
          <Row label="VIN" value={detail.vin ?? "—"} />
          <Row label="Handover date" value={fmtDate(detail.handover_date)} />
          <Row label="Payment method" value={detail.payment_method ?? "—"} />
          <Row label="Note" value={detail.note ?? "—"} />
        </View>
      </ScrollView>

      {/* Sticky Action Bar */}
      <SafeAreaView edges={["bottom"]} style={{
        position:"absolute", left:0, right:0, bottom:0,
        backgroundColor: BG, borderTopWidth:1, borderTopColor:"rgba(255,255,255,0.08)"
      }}>
        <View style={{ paddingHorizontal:16, paddingTop:8, paddingBottom:16, flexDirection:"row", flexWrap:"wrap", gap:8, justifyContent: "center" }}>
          {!detail.quote_id && actions.canCreateQuote && (
            <Pressable onPress={onCreateQuote} style={btn("blue")}>
              <Feather name="file-plus" size={16} color="#fff" />
              <Text style={btnText()}>Create Quote</Text>
            </Pressable>
          )}
          {detail.quote_id && actions.canMarkPaid && (
            <Pressable onPress={onMarkPaid} style={btn("indigo")} disabled={paying}>
              {paying ? <ActivityIndicator color="#fff" /> : <Feather name="dollar-sign" size={16} color="#fff" />}
              <Text style={btnText()}>{paying ? "Processing…" : "Mark Paid"}</Text>
            </Pressable>
          )}
          {actions.canCreateContract && (
            <Pressable onPress={onCreateContract} style={btn("purple")}>
              <Feather name="file-text" size={16} color="#fff" />
              <Text style={btnText()}>Create Contract</Text>
            </Pressable>
          )}
          {actions.canFulfill && (
            <Pressable onPress={onFulfill} style={btn("green")}>
              <Feather name="check-circle" size={16} color="#fff" />
              <Text style={btnText()}>Fulfill</Text>
            </Pressable>
          )}
          {actions.canCancel && (
            <Pressable onPress={onCancel} style={btn("red")}>
              <Feather name="x-circle" size={16} color="#fff" />
              <Text style={btnText()}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function btn(tone: "blue" | "indigo" | "purple" | "green" | "red") {
  const map = {
    blue:   "#2563eb",
    indigo: "#3b82f6",
    purple: "#7c3aed",
    green:  "#10b981",
    red:    "#ef4444",
  };
  return {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: map[tone],
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  };
}
function btnText() {
  return { color: "#fff", fontWeight: "700" as const, fontSize: 13, letterSpacing: 0.2 };
}
