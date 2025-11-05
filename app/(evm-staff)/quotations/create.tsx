// app/(evm-staff)/quotations/create.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import CustomButton from "@/src/components/ui/CustomButton";
import CustomDivider from "@/src/components/ui/CustomDivider";
import CustomModelSpecs from "@/src/components/ui/CustomModelSpecs";
import CustomPrice from "@/src/components/ui/CustomPrice";
import { color, images } from "@/src/constants";

import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  fetchEvmOrderDetail,
  selectEvmOrderDetail,
  selectEvmOrderDLoading,
} from "@/src/features/evmStaff/ordersSlice";
import { http } from "@/src/services/http";

const BG = "#0B1220";
const FALLBACK_IMG =
  "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg";

type VehicleDetail = {
  vehicle_id: string;
  model: string;
  version?: string | null;
  color?: string | null;
  year?: number | null;
  msrp?: number | null;
  wholesale_price?: number | null;
  description?: string | null;
  image_url?: string | null;
  features?: {
    motor?: string | null; // Peak power
    seats?: number | null;
    battery?: string | null;
    drivetrain?: string | null;
  } | null;
};

type PromotionDetail = {
  id: string;
  name: string;
  discount_type: "AMOUNT" | "PERCENT";
  discount_value: number; // VND hoặc %
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
};

function currencyVND(n?: number | null) {
  if (n == null) return "—";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return String(n);
  }
}

function parseNumberInput(t: string) {
  const digits = t.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function calcDiscount(base: number, promo?: PromotionDetail | null) {
  if (!promo || !promo.discount_type || promo.discount_value == null) return 0;
  if (promo.discount_type === "AMOUNT") {
    return Math.max(0, Math.min(base, Math.floor(promo.discount_value)));
  }
  // PERCENT
  const pct = Math.max(0, Math.min(100, promo.discount_value));
  return Math.floor((base * pct) / 100);
}

export default function CreateQuotation() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectEvmOrderDetail);
  const orderLoading = useAppSelector(selectEvmOrderDLoading);

  // local fetch state
  const [veh, setVeh] = useState<VehicleDetail | null>(null);
  const [vehLoading, setVehLoading] = useState(false);

  const [promo, setPromo] = useState<PromotionDetail | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  // form state
  const [basePriceInput, setBasePriceInput] = useState<string>("");
  const [promotionId, setPromotionId] = useState<string>(""); // có thể để readonly theo order nếu muốn
  const [notes, setNotes] = useState<string>("");

  const [imgUri, setImgUri] = useState<string>(FALLBACK_IMG);
  const [submitting, setSubmitting] = useState(false);

  // 1) đảm bảo có order detail
  useEffect(() => {
    if (!order || order.id !== orderId) {
      if (orderId) dispatch(fetchEvmOrderDetail(orderId));
    }
  }, [dispatch, orderId]);

  // 2) khi có order → set prefill + gọi vehicle & promotion
  useEffect(() => {
    if (!order || !order.id) return;

    // base price: ưu tiên order.price; nếu trống thì dùng msrp (sau khi load vehicle)
    const p = order.price ?? 0;
    setBasePriceInput(p ? String(p) : "");

    // promotion id từ order nếu có
    setPromotionId(order.promotion_id ?? "");

    // gọi vehicle
    if (order.vehicle_id) {
      (async () => {
        try {
          setVehLoading(true);
          const res = await http.get(`/vehicles/${order.vehicle_id}`);
          const v = res?.data?.data?.vehicle;
          const vd: VehicleDetail = {
            vehicle_id: v?.vehicle_id,
            model: v?.model,
            version: v?.version,
            color: v?.color,
            year: v?.year,
            msrp: v?.msrp,
            wholesale_price: v?.wholesale_price,
            description: v?.description,
            image_url: v?.image_url,
            features: v?.features ?? null,
          };
          setVeh(vd);
          setImgUri(vd.image_url || FALLBACK_IMG);

          // nếu order.price trống thì điền msrp
          if (!p && vd.msrp) setBasePriceInput(String(vd.msrp));
        } catch (e) {
          setVeh(null);
          setImgUri(FALLBACK_IMG);
        } finally {
          setVehLoading(false);
        }
      })();
    }

    // gọi promotion nếu order có promotion_id
    if (order.promotion_id) {
      (async () => {
        try {
          setPromoLoading(true);
          const res = await http.get(`/promotions/${order.promotion_id}`);
          const pm = res?.data?.data?.promotion;
          const pd: PromotionDetail = {
            id: pm?.id,
            name: pm?.name,
            discount_type: pm?.discount_type,
            discount_value: pm?.discount_value,
            start_date: pm?.start_date,
            end_date: pm?.end_date,
            status: pm?.status,
          };
          setPromo(pd);
        } catch (e) {
          setPromo(null);
        } finally {
          setPromoLoading(false);
        }
      })();
    } else {
      setPromo(null);
    }
  }, [order?.id]);

  // 3) derive UI model (không đổi layout, chỉ thay giá trị)
  const vehicleDetail = useMemo(() => {
    // fallback text nếu thiếu
    return {
      id: 1,
      model: veh?.model || "—",
      brand: "—", // chưa có trong API
      stock: veh?.features?.battery || "—", // bạn đang dùng "stock" ở UI => map battery
      maxDistance: veh?.features?.motor || "—", // ở UI: Peak Power => map motor
      acceleration: 0, // không có trong API
      battery: 0, // không dùng ở UI
      price: currencyVND(parseNumberInput(basePriceInput)) || "—",
      drivetrain: veh?.features?.drivetrain || "—",
      seat: veh?.features?.seats ?? 0,
      discount: "—", // set ở dưới trong Pricing block
      variant: veh?.version || "—",
      color: veh?.color || "—",
      hex: "#C62833", // giữ nguyên vì layout đang dùng
      img: imgUri || FALLBACK_IMG,
      desc: veh?.description || "—",
    };
  }, [veh, basePriceInput, imgUri]);

  // 4) tính toán giá (subtotal, discount, total)
  const numberSubtotal = useMemo(() => parseNumberInput(basePriceInput), [basePriceInput]);
  const numberDiscount = useMemo(() => calcDiscount(numberSubtotal, promo), [numberSubtotal, promo]);
  const numberTotal = useMemo(() => Math.max(0, numberSubtotal - numberDiscount), [numberSubtotal, numberDiscount]);

  const discountLabel = useMemo(() => {
    if (!promo) return "—";
    if (promo.discount_type === "AMOUNT") return `- ${currencyVND(numberDiscount)}`;
    // percent
    return `- ${currencyVND(numberDiscount)} (${promo.discount_value}%)`;
  }, [promo, numberDiscount]);

  const canSubmit = useMemo(() => {
    if (!order) return false;
    if (!order.dealer_id || !order.customer_id || !order.vehicle_id) return false;
    return numberSubtotal > 0;
  }, [order?.id, numberSubtotal]);

  const onSubmit = useCallback(async () => {
    if (!order) return;
    const body: any = {
      dealer_id: order.dealer_id,
      customer_id: order.customer_id,
      vehicle_id: order.vehicle_id,
      base_price: numberSubtotal,
    };
    if (promotionId) body.promotion_id = promotionId;

    try {
      setSubmitting(true);
      console.log({body})
      const res = await http.post("/quotes", body);
      const quote = res?.data?.data?.quote ?? res?.data?.data ?? res?.data;
      Alert.alert("Success", "Quotation has been created.", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/(evm-staff)/orders/[id]",
              params: { id: order.id },
            }),
        },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Create quote failed");
    } finally {
      setSubmitting(false);
    }
  }, [order?.id, numberSubtotal, promotionId]);

  // 5) Loading tổng
  if (orderLoading || !order || vehLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: BG }}>
        <ActivityIndicator />
        <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-4" style={{ backgroundColor: BG, paddingBottom: Math.max(16, insets.bottom) }}>
      {/* Header giữ nguyên layout */}
      <View className="flex-row justify-between py-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={"white"} />
        </Pressable>
        <Text className="text-2xl font-semibold text-white">Create Quotation</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName=" gap-5 pb-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Customer info (thay giá trị thật) */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons name="person-outline" size={24} color={color.iconColor} />
                <Text className="font-semibold text-xl text-white">Customer Information</Text>
              </View>
              <Text className="text-[#16D68F] font-medium textbase px-[10px] py-[5px] bg-[#16D68F]/[0.1] rounded-[8px]">
                Verified
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row gap-4">
                <Image source={images.avt_placeholder} className="size-[65px] rounded-full" resizeMode="contain" />
                <View>
                  <Text className="font-medium text-xl text-white">
                    {order.customer_name || "—"}
                  </Text>
                  <Text className="mt-1 text-secondary font-medium text-base">
                    {order.customer_phone || "—"}
                  </Text>
                  <Text className="text-secondary font-medium text-base mt-1">
                    {order.customer_email || "—"}
                  </Text>
                </View>
              </View>
              {/* giữ icon bên phải */}
              {/* <AntDesign name="user-switch" size={24} color="white" /> */}
            </View>
          </View>

          {/* Vehicle info (thay giá trị thật + fallback ảnh) */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons name="car-outline" size={24} color={color.iconColor} />
                <Text className="font-semibold text-xl text-white">Vehicle Selection</Text>
              </View>
            </View>
            <View className="gap-5">
              <Image
                source={{ uri: vehicleDetail.img }}
                resizeMode="cover"
                className="w-full h-[250px] rounded-[10px]"
                onError={() => setImgUri(FALLBACK_IMG)}
              />
              <View className="gap-5">
                {/* Model name */}
                <View className="gap-1">
                  <Text className="font-medium text-base text-secondary">Model</Text>
                  <Text className="font-semibold text-white text-xl">
                    {vehicleDetail.model}
                  </Text>
                </View>
                {/* Specs */}
                <View>
                  <View className="gap-2">
                    <Text className="font-medium text-base text-secondary">Specifications</Text>
                    <View className="flex-row justify-between">
                      <CustomModelSpecs label="Peak Power" value={`${vehicleDetail.maxDistance}`} />
                      <CustomModelSpecs label="Total Seats" value={`${vehicleDetail.seat || "—"} seats`} />
                      <CustomModelSpecs label="Battery" value={`${vehicleDetail.stock}`} />
                      <CustomModelSpecs label="Drivetrain" value={`${vehicleDetail.drivetrain}`} />
                    </View>
                  </View>
                </View>
                {/* Color & Variant */}
                <View className="flex-row gap-[50px]">
                  <View className="gap-1">
                    <Text className="font-medium text-base text-secondary">Model Color</Text>
                    <Text className="font-semibold text-white text-xl">
                      {vehicleDetail.color}
                    </Text>
                  </View>
                  <View className="gap-1">
                    <Text className="font-medium text-base text-secondary">Model Variant</Text>
                    <Text className="font-semibold text-white text-xl">
                      {vehicleDetail.variant}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Pricing (thay trị thật, giữ layout) */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons name="cash-outline" size={24} color={color.iconColor} />
                <Text className="font-semibold text-xl text-white">Pricing & Discounts</Text>
              </View>
            </View>
            <View className="gap-5">
              <View className="flex-row gap-4">
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">On-Road Price</Text>
                  <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                    {currencyVND(numberSubtotal)}
                  </Text>
                </View>

                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">Discount</Text>
                  <Text className="font-semibold text-white text-xl px-3 py-[14px] bg-dark rounded-[10px] border border-secondary">
                    {promoLoading ? "…" : discountLabel}
                  </Text>
                </View>
              </View>

              <View className="p-[15px] bg-dark rounded-[10px] gap-4">
                <CustomPrice title="Subtotal" value={currencyVND(numberSubtotal)} valueStyles="text-white text-lg" />
                <CustomPrice
                  title="Discount"
                  value={promoLoading ? "…" : `- ${currencyVND(numberDiscount)}`}
                  valueStyles="text-[#16D68F]  text-lg"
                />
                <CustomDivider />
                <CustomPrice
                  title="Total Price"
                  value={currencyVND(numberTotal)}
                  valueStyles="text-white  text-xl"
                  titleStyles="text-white font-semibold text-xl"
                />
              </View>

              {/* Base price input + Promotion Id (không đổi layout tổng thể, chỉ thêm nhập liệu) */}
              <View className="flex-row gap-4">
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">Base price (VND)</Text>
                  <TextInput
                    value={basePriceInput}
                    onChangeText={setBasePriceInput}
                    keyboardType="number-pad"
                    placeholder="e.g. 690000000"
                    placeholderTextColor="#959CA7"
                    className="font-msr-medium text-lg px-3 py-[14px] bg-dark rounded-[10px] border border-secondary text-white"
                  />
                </View>
                <View className="gap-1 flex-1">
                  <Text className="font-medium text-base text-secondary">Promotion ID</Text>
                  <TextInput
                    value={promotionId}
                    onChangeText={setPromotionId}
                    placeholder="uuid…"
                    placeholderTextColor="#959CA7"
                    autoCapitalize="none"
                    className="font-msr-medium text-lg px-3 py-[14px] bg-dark rounded-[10px] border border-secondary text-white"
                  />
                </View>
              </View>
              {!!promo?.name && (
                <Text className="text-secondary">
                  Promotion: <Text className="text-white font-semibold">{promo.name}</Text>
                </Text>
              )}
            </View>
          </View>

          {/* Additional Notes (giữ nguyên layout) */}
          <View className="p-[15px] bg-gray rounded-[10px]">
            <View className="flex-row justify-between mb-5">
              <View className="flex-row gap-2 items-center">
                <Ionicons name="document-text-outline" size={24} color={color.iconColor} />
                <Text className="font-semibold text-xl text-white">Additional Notes</Text>
              </View>
            </View>
            <View className="bg-dark">
              <TextInput
                multiline
                autoCapitalize="none"
                numberOfLines={6}
                autoCorrect={false}
                placeholder="Write something..."
                placeholderTextColor="#959CA7"
                textAlignVertical="top"
                className="p-4 font-msr-medium text-lg border border-secondary rounded-xl text-secondary"
                style={{
                  minHeight: 150,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  lineHeight: 20,
                }}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          <View className="mt-5">
            <CustomButton
              btnStyles="bg-blue"
              textStyles="text-white"
              title={submitting ? "Sending…" : "Confirm & Send"}
              onPress={onSubmit}
              disabled={!canSubmit || submitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
