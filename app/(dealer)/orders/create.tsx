import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Stack, router } from "expo-router";
import { useAppSelector } from "@/src/store";
import { selectAuth } from "@/src/features/auth/authSlice";
import type { QuoteLite } from "@/src/features/quotations/type";

type CustomerLite = ReturnType<typeof selectTempCustomers>[number];
type VehicleLite  = ReturnType<typeof selectTempVehicles>[number];

const selectTempCustomers = (s: any) => s.tempSelections.customers as Array<{ customerId: string; fullName: string; phone: string; email?: string }>;
const selectTempVehicles  = (s: any) => s.tempSelections.vehicles as Array<{ vehicleId: string; model: string; version: string | null; color: string | null }>;

type ApiQuotesRes = { success: boolean; data?: { quotes?: QuoteLite[] } };

function currencyVND(val: string | number) {
  const n = typeof val === "string" ? Number(val) : val;
  if (!Number.isFinite(n)) return String(val);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function OrderCreateScreen() {
  const { token, user } = useAppSelector(selectAuth);
  const tempCustomers = useAppSelector(selectTempCustomers);
  const tempVehicles  = useAppSelector(selectTempVehicles);

  // mode: "quote" | "manual"
  const [mode, setMode] = useState<"quote" | "manual">("quote");

  // quotes (để chọn)
  const [quotes, setQuotes] = useState<QuoteLite[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  // selections
  const [quoteId, setQuoteId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [vehicleId,  setVehicleId]  = useState<string>("");

  // price
  const [basePrice, setBasePrice]   = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<string>("");

  const [err, setErr] = useState<string | null>(null);

  // Load quotes
  const fetchQuotes = useCallback(async () => {
    try {
      setLoadingQuotes(true);
      const res = await fetch("https://electric-vehicle-dealer-management.onrender.com/api/v1/quotes", {
        headers: { accept: "*/*", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const json: ApiQuotesRes = await res.json();
      setQuotes(json?.data?.quotes ?? []);
    } catch (e) {
      console.warn("Fetch quotes error:", e);
      setQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  }, [token]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  // Khi chọn quote → fill dữ liệu, khóa input giá
  const pickedQuote = useMemo(() => quotes.find((q) => q.id === quoteId), [quotes, quoteId]);

  useEffect(() => {
    if (mode === "quote" && pickedQuote) {
      setCustomerId(pickedQuote.customer_id);
      setVehicleId(pickedQuote.vehicle_id);
      setBasePrice(pickedQuote.base_price ?? "");
      setFinalPrice(pickedQuote.final_price ?? "");
    }
  }, [mode, pickedQuote]);

  const canSubmit =
    (mode === "quote" && quoteId) ||
    (mode === "manual" && customerId && vehicleId && basePrice.trim() && finalPrice.trim());

  const submit = async () => {
    if (!canSubmit) return;
    setErr(null);

    try {
      const body: any = {
        dealer_id: user?.dealer_id,
        status: "PENDING",
      };

      if (mode === "quote" && pickedQuote) {
        Object.assign(body, {
          quote_id: pickedQuote.id,
          customer_id: pickedQuote.customer_id,
          vehicle_id: pickedQuote.vehicle_id,
          base_price: Number(pickedQuote.base_price),
          final_price: Number(pickedQuote.final_price),
        });
      } else {
        Object.assign(body, {
          customer_id: customerId,
          vehicle_id: vehicleId,
          base_price: Number(basePrice),
          final_price: Number(finalPrice),
        });
      }

      const res = await fetch("https://electric-vehicle-dealer-management.onrender.com/api/v1/orders", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json?.success) throw new Error("Create order failed");

      router.replace("/(dealer)/(tabs)/orders");
    } catch (e: any) {
      console.warn("Create order error:", e);
      setErr("Không thể tạo order. Vui lòng kiểm tra dữ liệu và thử lại.");
    }
  };

  // pickers
  const [sheet, setSheet] = useState<"quote" | "customer" | "vehicle" | null>(null);

  const pickedCustomer = tempCustomers.find((c) => c.customerId === customerId);
  const pickedVehicle  = tempVehicles.find((v) => v.vehicleId === vehicleId);

  return (
    <View className="flex-1 bg-[#0B1220]">
      <Stack.Screen options={{ title: "Create Order" }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 56 }}>
        {/* Mode switch */}
        <View className="flex-row gap-3 mb-4">
          <Pressable
            onPress={() => setMode("quote")}
            className={`px-3 py-2 rounded-xl ${mode === "quote" ? "bg-blue-600" : "bg-white/10 border border-white/15"}`}
          >
            <Text className="text-white font-semibold">From Quote</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("manual")}
            className={`px-3 py-2 rounded-xl ${mode === "manual" ? "bg-blue-600" : "bg-white/10 border border-white/15"}`}
          >
            <Text className="text-white font-semibold">Manual</Text>
          </Pressable>
        </View>

        {/* From Quote */}
        {mode === "quote" ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white/80">Quote *</Text>
              {loadingQuotes ? (
                <ActivityIndicator />
              ) : (
                <Pressable
                  onPress={fetchQuotes}
                  className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15"
                >
                  <Text className="text-white/80 text-xs">Reload</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => setSheet("quote")}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-white">
                {pickedQuote
                  ? `${pickedQuote.customer_name ?? "—"} • ${pickedQuote.vehicle_model ?? "—"}`
                  : "Select quote"}
              </Text>
            </Pressable>

            {pickedQuote && (
              <View className="mt-4 rounded-2xl p-3 bg-white/5 border border-white/10">
                <Text className="text-white/80" numberOfLines={1}>
                  Base: <Text className="text-white font-semibold">{currencyVND(pickedQuote.base_price)}</Text>
                </Text>
                <Text className="text-white/80 mt-1" numberOfLines={1}>
                  Final: <Text className="text-white font-semibold">{currencyVND(pickedQuote.final_price)}</Text>
                </Text>
                <Text className="text-white/60 mt-1" numberOfLines={1}>Status: {pickedQuote.status}</Text>
              </View>
            )}
          </View>
        ) : (
          // Manual
          <View>
            {/* Customer */}
            <Text className="text-white/80 mb-2">Customer *</Text>
            <Pressable
              onPress={() => setSheet("customer")}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-white">
                {pickedCustomer ? `${pickedCustomer.fullName} • ${pickedCustomer.phone}` : "Select from Temp Selections"}
              </Text>
            </Pressable>

            {/* Vehicle */}
            <Text className="text-white/80 mb-2 mt-5">Vehicle *</Text>
            <Pressable
              onPress={() => setSheet("vehicle")}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-white">
                {pickedVehicle ? `${pickedVehicle.model} ${pickedVehicle.version ?? ""}` : "Select from Temp Selections"}
              </Text>
            </Pressable>

            {/* Prices */}
            <View className="mt-6">
              <Text className="text-white/80 mb-2">Base price (₫) *</Text>
              <TextInput
                value={basePrice}
                onChangeText={setBasePrice}
                placeholder="vd. 1050000000"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                className="text-white bg-white/5 border border-white/10 rounded-xl px-3 py-3"
              />
              {basePrice ? <Text className="text-white/60 mt-1">= {currencyVND(basePrice)}</Text> : null}

              <Text className="text-white/80 mb-2 mt-4">Final price (₫) *</Text>
              <TextInput
                value={finalPrice}
                onChangeText={setFinalPrice}
                placeholder="vd. 980000000"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                className="text-white bg-white/5 border border-white/10 rounded-xl px-3 py-3"
              />
              {finalPrice ? <Text className="text-white/60 mt-1">= {currencyVND(finalPrice)}</Text> : null}
            </View>
          </View>
        )}

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
            <Text className="text-white font-semibold">Create Order</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/(dealer)/temp-selections")}
          className="mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
        >
          <Text className="text-white/80">Open Temp Selections</Text>
        </Pressable>
      </ScrollView>

      {/* Sheets */}
      <PickerSheet
        visible={sheet === "quote"}
        title="Pick Quote"
        onClose={() => setSheet(null)}
        data={quotes.map((q) => ({
          key: q.id,
          label: `${q.customer_name ?? "—"} • ${q.vehicle_model ?? "—"}`,
          sub: `Final: ${currencyVND(q.final_price)} • Status: ${q.status}`,
        }))}
        onPick={(k) => { setQuoteId(k); setSheet(null); }}
      />

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
        data={tempVehicles.map((v:any) => ({
          key: v.id,
          label: `${v.model} ${v.version ?? ""}`,
          sub: [v.color, v.year ? String(v.year) : ""].filter(Boolean).join(" • "),
        }))}
        onPick={(k) => { setVehicleId(k); setSheet(null); }}
      />
    </View>
  );
}

function PickerSheet({
  visible, title, data, onPick, onClose,
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
                  {!!it.sub && <Text className="text-white/60 mt-1" numberOfLines={2}>{it.sub}</Text>}
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
