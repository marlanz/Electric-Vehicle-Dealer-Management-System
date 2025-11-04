// app/(dealer)/(tabs)/customers.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { addTempCustomer, TempCustomer } from "@/src/features/selections/tempSelectionsSlice";
import {
  fetchCustomers,
  selectCustomers,
  selectCustomersLoading,
  selectCustomersParams,
  setParams,
} from "@/src/features/customers/customerSlice";
import type { CustomerLite } from "@/src/features/customers/type";

const BG = "#0B1220";

export default function CustomersIndexScreen() {
  const dispatch   = useAppDispatch();
  const items      = useAppSelector(selectCustomers);
  const loading    = useAppSelector(selectCustomersLoading);
  const params     = useAppSelector(selectCustomersParams);

  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState(params.search ?? "");

  // ❗️Đổi kiểu timer cho đúng RN
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // initial load
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setParams({ search: q, offset: 0 }));
      dispatch(fetchCustomers({ search: q, offset: 0 }));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, dispatch]);

  const header = useMemo(
    () => (
      <View className="px-4 pt-4 pb-2" style={{ backgroundColor: BG }}>
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Feather name="search" size={16} color="#AFC1D8" />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search name / phone / email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              className="flex-1 text-white ml-2"
              returnKeyType="search"
              onSubmitEditing={() => {
                dispatch(setParams({ search: q, offset: 0 }));
                dispatch(fetchCustomers({ search: q, offset: 0 }));
              }}
            />
          </View>
          <Pressable
            onPress={() => router.push("/(dealer)/customers/create")}
            className="px-3 py-2 rounded-xl bg-blue-600"
          >
            <Text className="text-white font-semibold">New</Text>
          </Pressable>
        </View>
      </View>
    ),
    [q, dispatch]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      {header}

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/70 mt-2">Loading customers…</Text>
        </View>
      ) : (
        <FlatList<CustomerLite>
          data={items}
          keyExtractor={(item) => item.customerId}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl
              tintColor="#fff"
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await dispatch(fetchCustomers());
                setRefreshing(false);
              }}
            />
          }
          renderItem={({ item }) => (
            <View className="rounded-2xl p-4 bg-white/5 border border-white/10">
              <Text className="text-white font-semibold" numberOfLines={1}>
                {item.fullName}
              </Text>
              <Text className="text-white/70 mt-1" numberOfLines={1}>
                {item.phone}{item.email ? ` • ${item.email}` : ""}
              </Text>

              <View className="flex-row gap-8 mt-3">
                <Pressable
                  onPress={() => dispatch(addTempCustomer(item as TempCustomer))}
                  className="px-3 py-2 rounded-lg bg-emerald-600/90"
                >
                  <Text className="text-white font-semibold">+ Add to Temp</Text>
                </Pressable>

                <Pressable
                  onPress={() => {}}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
                >
                  <Text className="text-white">Details</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-white/80 mb-4">No customers</Text>
              <Pressable
                onPress={() => router.push("/(dealer)/customers/create")}
                className="px-4 py-2 rounded-xl bg-blue-600"
              >
                <Text className="text-white font-semibold">Create customer</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}
