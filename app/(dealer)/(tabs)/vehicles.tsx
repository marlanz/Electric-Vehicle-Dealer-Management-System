import Features from "@/src/components/ui/CustomFeatures";
import { color } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import cn from "clsx";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { modelStock } from ".";

const brands = [
  {
    id: 1,
    name: "All brands",
  },
  { id: 2, name: "Tesla" },
  { id: 3, name: "BYD" },
  { id: 4, name: "Vinfast" },
  { id: 5, name: "Honda" },
];

const Vehicles = () => {
  const [selected, setSelected] = useState(1);

  return (
    <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
      <SafeAreaView className="px-4 ">
        <View className="pb-6">
          <View className="flex-row justify-between py-5">
            <Text className="text-2xl font-semibold text-white">
              Vehicles Catalog
            </Text>
            <Ionicons name="heart-outline" size={24} color={"white"} />
          </View>

          <View className="p-3 bg-gray rounded-[10px] flex-row items-center gap-3">
            <Ionicons
              name="search-outline"
              size={24}
              color={color.textSecondary}
            />
            <TextInput
              placeholder="Search by model or VIN..."
              className="font-medium text-secondary text-xl flex-1 pb-1"
              placeholderTextColor={color.textSecondary}
              // value={search.name}
              // onChangeText={handleChange}
              // onSubmitEditing={handleSearch}
              returnKeyType="search"
              // ref={inputRef}
              autoFocus={true}
            />
          </View>
          <FlatList
            data={brands}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isActive = selected === item.id;

              return (
                <Pressable
                  onPress={() => setSelected(item.id)}
                  className={cn(
                    "px-4 py-[10px] rounded-[10px] ",
                    isActive ? "bg-blue" : "bg-gray border-gray-700"
                  )}
                >
                  <Text
                    className={cn(
                      "font-semibold text-base",
                      isActive ? "text-white" : "text-secondary"
                    )}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
            contentContainerClassName="gap-3 mt-4"
            // style={{ overflow: "visible" }}
          />
        </View>

        <FlatList
          data={modelStock}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/(vehicle)/${item.id}`)}>
              <View className="flex-1 rounded-[15px] overflow-hidden bg-gray p-5">
                <Image
                  source={{ uri: item.img }}
                  resizeMode="cover"
                  className="w-full h-[200px] rounded-[15px]"
                />
                <View className="mt-3 mb-2">
                  <View className="justify-between flex-row items-center">
                    <Text className="text-xl font-semibold text-white">
                      {item.model}
                    </Text>
                    <Text className="text-base font-medium text-secondary">
                      {item.brand}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Features number={item.maxDistance} icon={"engine-outline"} />
                  <Features number={item.seat} icon={"seat-outline"} />
                  <Features number={item.stock} icon={"battery-outline"} />
                  <Features number={item.drivetrain} icon={"abacus"} />
                </View>

                <View className="flex-row gap-3 items-end mt-5">
                  <Text className="font-semibold text-white text-xl">
                    Starting at {item.price}
                  </Text>
                  <Text className="text-secondary text-base line-through">
                    {item.discount}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          contentContainerClassName=" gap-3 "
          contentContainerStyle={{ paddingBottom: 190 }}
        />
      </SafeAreaView>
    </View>
  );
};

export default Vehicles;
