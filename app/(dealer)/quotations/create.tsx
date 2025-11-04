import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import type { PromotionLite } from "@/src/features/quotations/type";

// Lấy từ tempSelections (khách & xe đã lưu tạm)
type CustomerLite = ReturnType<typeof selectTempCustomers>[number];
type VehicleLite = ReturnType<typeof selectTempVehicles>[number];
const selectTempCustomers = (s: any) => s.tempSelections.customers as Array<{ customerId: string; fullName: string; phone: string; email?: string }>;
const selectTempVehicles  = (s: any) => s.tempSelections.vehicles as Array<{ vehicleId: string; model: string; version: string | null; color: string | null; year: number | null }>;

type ApiPromoRes = { success: boolean; data?: { promotions?: PromotionLite[] } };

function currencyVNDn(v: string | number) {
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return String(v);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function QuoteCreateScreen() {
  const { token, user } = useAppSelector(selectAuth);
  const tempCustomers = useAppSelector(selectTempCustomers);
  const tempVehicles  = useAppSelector(selectTempVehicles);

  const [promos, setPromos] = useState<PromotionLite[]>([]);
  const [loadingPromo, setLoadingPromo] = useState(true);

  const [customerId, setCustomerId] = useState<string>("");
  const [vehicleId,  setVehicleId]  = useState<string>("");
  const [promotionId, setPromotionId] = useState<string | undefined>(undefined);

  const [basePrice, setBasePrice]   = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<string>("");

  const [err, setErr] = useState<string | null>(null);

  // Lấy promotions còn hiệu lực (active_only=true) – lọc endDate > now nếu có
  const fetchPromotions = useCallback(async () => {
    try {
      setLoadingPromo(true);
      const res = await fetch(
        "https://electric-vehicle-dealer-management.onrender.com/api/v1/promotions?active_only=true",
        { headers: { accept: "*/*", ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
      );
      const json: ApiPromoRes = await res.json();
      const now = Date.now();
      const list = (json?.data?.promotions ?? []).filter((p) => {
        if (!p.endDate) return true;
        const t = Date.parse(p.endDate);
        return Number.isFinite(t) ? t > now : true;
      });
      setPromos(list);
    } catch (e) {
      console.warn("Fetch promotions error:", e);
      setPromos([]);
    } finally {
      setLoadingPromo(false);
    }
  }, [token]);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // Gợi ý tính toán (hiển thị phụ, KHÔNG ép buộc — final/base vẫn nhập tay)
  const suggestion = useMemo(() => {
    const base = Number(basePrice);
    if (!Number.isFinite(base) || !promotionId) return null;
    const p = promos.find((x) => x.promoId === promotionId);
    if (!p) return null;

    // dựa vào type + discount_value nếu API list k có value thì bỏ
    // trong response list quotes bạn có discount_value; ở list promotions demo không có value → chỉ gợi ý text
    return `Selected promo: ${p.name}`;
  }, [basePrice, promotionId, promos]);

  const canSubmit =
    customerId && vehicleId && basePrice.trim() && finalPrice.trim();

  const submit = async () => {
    if (!canSubmit) return;
    setErr(null);

    try {
      const body = {
        dealer_id: user?.dealer_id,                // Dealer của staff
        customer_id: customerId,
        vehicle_id: vehicleId,
        base_price: Number(basePrice),
        promotion_id: promotionId ?? undefined,    // optional
        appliedPromotions: promotionId ? [promotionId] : [],
        final_price: Number(finalPrice),
        status: "DRAFT",
      };

      const res = await fetch("https://electric-vehicle-dealer-management.onrender.com/api/v1/quotes", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json?.success) throw new Error("Create quote failed");

      router.replace("/(dealer)/(tabs)/quotations");
    } catch (e: any) {
      console.warn("Create quote error:", e);
      setErr("Không thể tạo báo giá. Vui lòng kiểm tra dữ liệu và thử lại.");
    }
  };

  // Pickers đơn giản (sheet modal) cho Customers / Vehicles / Promotions
  const [sheet, setSheet] = useState<"customer" | "vehicle" | "promotion" | null>(null);

  const pickedCustomer = tempCustomers.find((c) => c.customerId === customerId);
  const pickedVehicle  = tempVehicles.find((v) => v.vehicleId === vehicleId);
  const pickedPromo    = promos.find((p) => p.promoId === promotionId);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "Create Quotation" }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 56 }}>
        {/* Customers */}
        <Text className="text-white/80 mb-2">Customer *</Text>
        <Pressable
          onPress={() => setSheet("customer")}
          className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
        >
          <Text className="text-white">
            {pickedCustomer ? `${pickedCustomer.fullName} • ${pickedCustomer.phone}` : "Select from Temp Selections"}
          </Text>
        </Pressable>

        {/* Vehicles */}
        <Text className="text-white/80 mb-2 mt-5">Vehicle *</Text>
        <Pressable
          onPress={() => setSheet("vehicle")}
          className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
        >
          <Text className="text-white">
            {pickedVehicle ? `${pickedVehicle.model} ${pickedVehicle.version ?? ""}` : "Select from Temp Selections"}
          </Text>
        </Pressable>

        {/* Promotions */}
        <View className="mt-5">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white/80">Promotion (active)</Text>
            {loadingPromo ? (
              <ActivityIndicator />
            ) : (
              <Pressable
                onPress={fetchPromotions}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15"
              >
                <Text className="text-white/80 text-xs">Reload</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setSheet("promotion")}
            className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <Text className="text-white">{pickedPromo ? pickedPromo.name : "Select promotion (optional)"}</Text>
          </Pressable>

          {!!suggestion && (
            <Text className="text-sky-300 mt-2" numberOfLines={2}>
              {suggestion}
            </Text>
          )}
        </View>

        {/* Base & Final price (nhập tay) */}
        <View className="mt-6">
          <Text className="text-white/80 mb-2">Base price (₫) *</Text>
          <TextInput
            value={basePrice}
            onChangeText={setBasePrice}
            placeholder="vd. 458000000"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="numeric"
            className="text-white bg-white/5 border border-white/10 rounded-xl px-3 py-3"
          />
          {basePrice ? (
            <Text className="text-white/60 mt-1">= {currencyVNDn(basePrice)}</Text>
          ) : null}

          <Text className="text-white/80 mb-2 mt-4">Final price (₫) *</Text>
          <TextInput
            value={finalPrice}
            onChangeText={setFinalPrice}
            placeholder="vd. 435100000"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="numeric"
            className="text-white bg-white/5 border border-white/10 rounded-xl px-3 py-3"
          />
          {finalPrice ? (
            <Text className="text-white/60 mt-1">= {currencyVNDn(finalPrice)}</Text>
          ) : null}
        </View>

        {!!err && <Text className="text-amber-300 mt-3">{err}</Text>}

        <View className="flex-row gap-12 mt-8">
          <Pressable
            onPress={() => router.back()}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15"
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </Pressable>

          <Pressable
            disabled={!canSubmit}
            onPress={submit}
            className={`px-5 py-3 rounded-xl ${canSubmit ? "bg-blue-600" : "bg-blue-600/50"}`}
          >
            <Text className="text-white font-semibold">Create Quote</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/(dealer)/temp-selections")}
          className="mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
        >
          <Text className="text-white/80">Open Temp Selections</Text>
        </Pressable>
      </ScrollView>

      {/* Sheet pickers */}
      <PickerSheet
        visible={sheet === "customer"}
        title="Pick Customer (Temp)"
        onClose={() => setSheet(null)}
        data={tempCustomers.map((c) => ({
          key: c.customerId,
          label: `${c.fullName} • ${c.phone}`,
          sub: c.email ?? "",
        }))}
        onPick={(k) => { setCustomerId(k); setSheet(null); }}
      />
      <PickerSheet
        visible={sheet === "vehicle"}
        title="Pick Vehicle (Temp)"
        onClose={() => setSheet(null)}
        data={tempVehicles.map((v) => ({
          key: v.vehicleId,
          label: `${v.model} ${v.version ?? ""}`,
          sub: [v.color, v.year ? String(v.year) : ""].filter(Boolean).join(" • "),
        }))}
        onPick={(k) => { setVehicleId(k); setSheet(null); }}
      />
      <PickerSheet
        visible={sheet === "promotion"}
        title="Pick Promotion"
        onClose={() => setSheet(null)}
        data={promos.map((p) => ({
          key: p.promoId,
          label: p.name,
          sub: p.summary ?? "",
        }))}
        onPick={(k) => { setPromotionId(k); setSheet(null); }}
      />
    </View>
  );
}

// PickerSheet đơn giản
function PickerSheet({
  visible,
  title,
  data,
  onPick,
  onClose,
}: {
  visible: boolean;
  title: string;
  data: Array<{ key: string; label: string; sub?: string }>;
  onPick: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[70%] bg-[#0B1220] rounded-t-2xl p-4 border-t border-white/10">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-lg font-bold">{title}</Text>
            <Pressable onPress={onClose} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
              <Text className="text-white/80">Close</Text>
            </Pressable>
          </View>

          <ScrollView>
            {data.length === 0 ? (
              <Text className="text-white/70 py-12 text-center">No items</Text>
            ) : (
              data.map((it) => (
                <Pressable
                  key={it.key}
                  onPress={() => onPick(it.key)}
                  className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 mb-2"
                >
                  <Text className="text-white font-semibold" numberOfLines={1}>{it.label}</Text>
                  {!!it.sub && <Text className="text-white/60 mt-1" numberOfLines={1}>{it.sub}</Text>}
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
