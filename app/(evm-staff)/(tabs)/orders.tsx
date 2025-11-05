// import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Pressable,
//   RefreshControl,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useAppDispatch, useAppSelector } from "@/src/store";
// import {
//   fetchEvmOrders,
//   refreshEvmOrders,
//   loadMoreEvmOrders,
//   selectEvmOrders,
//   selectEvmOrdersLoading,
//   selectEvmOrdersRefreshing,
//   selectEvmOrdersLoadingMore,
//   selectEvmOrdersHasMore,
//   selectEvmOrdersQuery,
//   setOrdersQuery,
// } from "@/src/features/evmStaff/ordersSlice";
// import { router } from "expo-router";
// import StatusPicker, { StatusType } from "@/src/components/ui/StatusPicker";

// const BG = "#0B1220";

// function currencyVND(n?: number | null) {
//   if (n == null) return "—";
//   try {
//     return new Intl.NumberFormat("vi-VN").format(n) + "₫";
//   } catch {
//     return String(n);
//   }
// }
// function fmt(d?: string | null) {
//   return d ? new Date(d).toLocaleString() : "—";
// }

// /** Header bar (không phụ thuộc items để tránh re-render) */
// const HeaderBar = memo(function HeaderBar({ onRefresh }: { onRefresh: () => void }) {
//   return (
//     <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
//       <View
//         style={{
//           height: 56,
//           paddingHorizontal: 12,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
//           Incoming Orders
//         </Text>
//         <Pressable
//           onPress={onRefresh}
//           hitSlop={8}
//           style={{
//             paddingHorizontal: 12,
//             paddingVertical: 8,
//             backgroundColor: "rgba(255,255,255,0.06)",
//             borderWidth: 1,
//             borderColor: "rgba(255,255,255,0.12)",
//             borderRadius: 12,
//           }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "600" }}>Refresh</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// });

// /** Filters – chuyển Status sang dropdown (hết wrap → hết "giật") */
// const Filters = memo(function Filters({
//   query,
//   onSearchSubmit,
//   onChangeSearch,
//   onChangeStatus,
//   onSetSortBy,
//   onToggleSortOrder,
// }: {
//   query: ReturnType<typeof useAppSelector<typeof selectEvmOrdersQuery>>;
//   onSearchSubmit: () => void;
//   onChangeSearch: (t: string) => void;
//   onChangeStatus: (st: StatusType) => void;
//   onSetSortBy: (sb: "created_at" | "order_date") => void;
//   onToggleSortOrder: () => void;
// }) {
//   return (
//     <View style={{ backgroundColor: BG }}>
//       {/* Search */}
//       <View className="px-4 pt-2">
//         <View className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
//           <TextInput
//             value={query.search ?? ""}
//             onChangeText={onChangeSearch}
//             onSubmitEditing={onSearchSubmit}
//             placeholder="Search by note or VIN…"
//             placeholderTextColor="#9aa4b2"
//             className="text-white"
//             returnKeyType="search"
//           />
//         </View>
//       </View>

//       {/* Status dropdown + sort controls */}
//       <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
//         <StatusPicker
//           value={query.status as StatusType}
//           onChange={onChangeStatus}
//         />

//         <View style={{ flexDirection: "row", gap: 8 }}>
//           {(["created_at", "order_date"] as const).map((sb) => {
//             const active = query.sort_by === sb;
//             return (
//               <Pressable
//                 key={sb}
//                 onPress={() => onSetSortBy(sb)}
//                 hitSlop={6}
//                 style={{
//                   paddingHorizontal: 12,
//                   height: 36,
//                   justifyContent: "center",
//                   borderRadius: 12,
//                   borderWidth: 1,
//                   backgroundColor: active
//                     ? "rgba(255,255,255,0.12)"
//                     : "rgba(255,255,255,0.06)",
//                   borderColor: active
//                     ? "rgba(255,255,255,0.6)"
//                     : "rgba(255,255,255,0.15)",
//                 }}
//               >
//                 <Text style={{ color: "#fff", fontSize: 12 }}>Sort: {sb}</Text>
//               </Pressable>
//             );
//           })}
//           <Pressable
//             onPress={onToggleSortOrder}
//             hitSlop={6}
//             style={{
//               paddingHorizontal: 12,
//               height: 36,
//               justifyContent: "center",
//               borderRadius: 12,
//               borderWidth: 1,
//               backgroundColor: "rgba(255,255,255,0.06)",
//               borderColor: "rgba(255,255,255,0.15)",
//             }}
//           >
//             <Text style={{ color: "#fff", fontSize: 12 }}>
//               Order: {query.sort_order ?? "desc"}
//             </Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// });

// export default function EVM_Orders() {
//   const dispatch = useAppDispatch();
//   const insets = useSafeAreaInsets();

//   const items = useAppSelector(selectEvmOrders);
//   const loading = useAppSelector(selectEvmOrdersLoading);
//   const refreshing = useAppSelector(selectEvmOrdersRefreshing);
//   const loadingMore = useAppSelector(selectEvmOrdersLoadingMore);
//   const hasMore = useAppSelector(selectEvmOrdersHasMore);
//   const query = useAppSelector(selectEvmOrdersQuery);

//   // Fetch khi các filter quan trọng đổi (KHÔNG gồm search để tránh spam)
//   useEffect(() => {
//     dispatch(fetchEvmOrders());
//   }, [
//     dispatch,
//     query.dealer_id,
//     query.status,
//     query.sort_by,
//     query.sort_order,
//     query.date_from,
//     query.date_to,
//     query.payment_method,
//   ]);

//   // Handlers
//   const onSearchSubmit = useCallback(() => {
//     dispatch(fetchEvmOrders());
//   }, [dispatch]);

//   const onChangeSearch = useCallback(
//     (t: string) => {
//       dispatch(setOrdersQuery({ search: t }));
//     },
//     [dispatch]
//   );

//   const onChangeStatus = useCallback(
//     (st: StatusType) => {
//       dispatch(setOrdersQuery({ status: st }));
//     },
//     [dispatch]
//   );

//   const onSetSortBy = useCallback(
//     (sb: "created_at" | "order_date") => {
//       dispatch(setOrdersQuery({ sort_by: sb }));
//     },
//     [dispatch]
//   );

//   const onToggleSortOrder = useCallback(() => {
//     dispatch(
//       setOrdersQuery({ sort_order: query.sort_order === "desc" ? "asc" : "desc" })
//     );
//   }, [dispatch, query.sort_order]);

//   // Infinite scroll – throttle nhẹ để tránh trùng
//   const lastLoadMoreAt = useRef(0);
//   const onEndReached = useCallback(() => {
//     const now = Date.now();
//     if (now - lastLoadMoreAt.current < 800) return;
//     if (!loading && !loadingMore && hasMore) {
//       lastLoadMoreAt.current = now;
//       dispatch(loadMoreEvmOrders());
//     }
//   }, [dispatch, loading, loadingMore, hasMore]);

//   const renderItem = useCallback(
//     ({ item }: any) => (
//       <Pressable
//         onPress={() => router.push(`/(evm-staff)/orders/${item.id}` as const)}
//         className="rounded-2xl p-4 bg-white/5 border border-white/10"
//       >
//         <Text className="text-white font-semibold" numberOfLines={1}>
//           {item.dealer_name ?? item.dealer_id}
//         </Text>
//         <Text className="text-white/70 mt-1" numberOfLines={1}>
//           {item.customer_name} • {item.customer_phone ?? item.customer_email ?? "—"}
//         </Text>
//         <Text className="text-white/70 mt-1" numberOfLines={1}>
//           {item.vehicle_model}
//           {item.vehicle_version ? ` • ${item.vehicle_version}` : ""}
//           {item.vehicle_color ? ` • ${item.vehicle_color}` : ""}
//         </Text>
//         <Text className="text-white/60 mt-1 text-xs">
//           Price: {currencyVND(item.price)} • Status: {item.status} •{" "}
//           {fmt(item.order_date)}
//         </Text>
//       </Pressable>
//     ),
//     []
//   );

//   const keyExtractor = useCallback((o: any) => o.id, []);
//   const getItemLayout = useCallback(
//     (_: any, index: number) => ({ length: 108, offset: 108 * index, index }),
//     []
//   );

//   return (
//     <View className="flex-1" style={{ backgroundColor: BG }}>
//       {/* Header cố định – Refresh chỉ list, không re-render nguyên trang */}
//       <HeaderBar onRefresh={() => dispatch(refreshEvmOrders())} />

//       {loading && items.length === 0 ? (
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator />
//           <Text className="text-white/70 mt-2">Loading…</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={items}
//           keyExtractor={keyExtractor}
//           ListHeaderComponent={
//             <Filters
//               query={query}
//               onSearchSubmit={onSearchSubmit}
//               onChangeSearch={onChangeSearch}
//               onChangeStatus={onChangeStatus}
//               onSetSortBy={onSetSortBy}
//               onToggleSortOrder={onToggleSortOrder}
//             />
//           }
//           ListHeaderComponentStyle={{ backgroundColor: BG }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => dispatch(refreshEvmOrders())}
//               tintColor="#fff"
//             />
//           }
//           contentContainerStyle={{
//             padding: 16,
//             paddingTop: 0,
//             paddingBottom: Math.max(24, insets.bottom + 16),
//           }}
//           ItemSeparatorComponent={() => <View className="h-3" />}
//           renderItem={renderItem}
//           onEndReachedThreshold={0.3}
//           onEndReached={onEndReached}
//           ListFooterComponent={
//             loadingMore ? (
//               <View className="py-4 items-center">
//                 <ActivityIndicator />
//                 <Text className="text-white/60 mt-2">Loading more…</Text>
//               </View>
//             ) : !hasMore ? (
//               <Text className="text-white/40 text-center py-4">— No more —</Text>
//             ) : null
//           }
//           ListEmptyComponent={
//             <Text className="text-white/60 text-center py-16">No orders</Text>
//           }
//           // Gợi ý hiệu năng – nếu item chưa thực sự cố định chiều cao, có thể bỏ getItemLayout
//           removeClippedSubviews={false}
//           initialNumToRender={8}
//           windowSize={7}
//           maxToRenderPerBatch={8}
//           updateCellsBatchingPeriod={50}
//           getItemLayout={getItemLayout}
//         />
//       )}
//     </View>
//   );
// }
