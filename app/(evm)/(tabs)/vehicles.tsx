import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  fetchVehicles, selectVehicles, selectVehiclesLoading, selectVehiclesMeta,
  selectVehiclesRefreshing, setFilters, setSearch
} from "@/src/features/vehicles/vehiclesSlice";
import VehicleCard from "@/src/components/vehicles/VehicleCard";
type Timeout = ReturnType<typeof setTimeout>;

const brands = ["All Brands", "Tesla", "BYD", "Honda", "Vinfast"]; // demo; nếu cần lấy từ API thì thay

export default function VehiclesScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectVehicles);
  const loading = useAppSelector(selectVehiclesLoading);          // chỉ dùng cho lần đầu
  const refreshing = useAppSelector(selectVehiclesRefreshing);    // kéo-to-refresh
  const { total, filters } = useAppSelector(selectVehiclesMeta);

  type Timeout = ReturnType<typeof setTimeout>;
  const [q, setQ] = useState(filters.search ?? "");
  const debRef = useRef<Timeout | null>(null);

  const onChangeSearch = (t: string) => {
    setQ(t);
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => {
      dispatch(setSearch(t.trim() === "" ? '' : t));
      // tìm kiếm lại nhưng KHÔNG nhảy spinner full-screen
      dispatch(fetchVehicles({ mode: "silent" }));  // <- xem phần slice bên dưới
    }, 350);
  };

  const onSelectBrand = (b: string) => {
    dispatch(setFilters({ ...filters, model: b === "All Brands" ? undefined : b, search: q || undefined }));
    dispatch(fetchVehicles({ mode: "silent" }));
  };

  const loadMore = () => {
    if (items.length < total) {
      dispatch(fetchVehicles({ append: true }));
    }
  };

  const onRefresh = () => {
    dispatch(fetchVehicles({ refresh: true })); // chỉ bật cờ refreshing
  };

  useEffect(() => {
    // Lần đầu vào màn mới dùng loading
    dispatch(fetchVehicles({ initial: true }));
  }, [dispatch]);

  const renderHeader = useMemo(
    () => (
      <View className="px-3 py-3">
        {/* top bar */}
        <View className="flex-row items-center justify-center mb-3">
          <Text className="text-white font-semibold text-base">Vehicle Catalog</Text>
        </View>

        {/* search */}
        <View className="bg-[#111827] rounded-2xl px-4 py-2 mb-3">
          <TextInput
            value={q}
            onChangeText={onChangeSearch}
            placeholder="Search by model or VIN…"
            placeholderTextColor="#94a3b8"
            className="text-white"
          />
        </View>

        {/* brand chips */}
        <View className="flex-row flex-wrap gap-2 mb-2">
          {brands.map((b) => {
            const active = (filters.model ?? "All Brands") === b;
            return (
              <Pressable
                key={b}
                onPress={() => onSelectBrand(b)}
                className={`px-3 py-1.5 rounded-full ${active ? "bg-blue-600" : "bg-white/10"}`}
              >
                <Text className={active ? "text-white" : "text-white/70"}>{b}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    ),
    [q, filters.model]
  );

  return (
    <View className="flex-1 bg-[#0B1220]">
      <FlatList
        contentContainerStyle={{ padding: 12, paddingBottom: 24, flexGrow: 1 }}
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => <VehicleCard v={item} />}
        ListHeaderComponent={renderHeader}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        refreshing={refreshing} 
        onRefresh={onRefresh}             
        ListEmptyComponent={
          loading
            ? (
              <View className="flex-1 items-center justify-center py-24">
                <ActivityIndicator />
                <Text className="text-white/70 mt-2">Loading vehicles…</Text>
              </View>
            )
            : (
              <View className="flex-1 items-center justify-center py-24">
                <Text className="text-white/70">No vehicles found</Text>
              </View>
            )
        }
        ListFooterComponent={
          items.length < total ? (
            <View className="py-4 items-center">
              <Text className="text-white/60">Scroll to load more…</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

