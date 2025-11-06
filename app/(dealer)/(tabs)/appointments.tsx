import CustomTestDriveCard, {
  CustomTestDriveCardProps,
} from "@/src/components/ui/CustomTestDriveCard";
import { color } from "@/src/constants";
import useAppointments from "@/src/hooks/useAppointments";
import cn from "clsx";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const brands = [
  {
    id: 1,
    name: "All",
  },
  { id: 2, name: "Scheduled" },
  { id: 3, name: "Completed" },
  { id: 4, name: "Cancelled" },
];

const Appointments = () => {
  const [selected, setSelected] = useState(1);

  const { fetchAllAppointments, adata } = useAppointments();

  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  return (
    <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
      <SafeAreaView className="px-4 ">
        <View className="pb-6">
          <View className="flex-row justify-between py-5">
            <Text className="text-2xl font-semibold text-white">
              Test Drive Appointments
            </Text>
          </View>

          {/* <View className="p-3 bg-gray rounded-[10px] flex-row items-center gap-3">
            <Ionicons
              name="search-outline"
              size={24}
              color={color.textSecondary}
            />
            <TextInput
              placeholder="Search by model"
              className="font-medium text-secondary text-xl flex-1 pb-1"
              placeholderTextColor={color.textSecondary}
              // value={search.name}
              // onChangeText={handleChange}
              // onSubmitEditing={handleSearch}
              returnKeyType="search"
              // ref={inputRef}
              autoFocus={true}
            />
          </View> */}
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
            contentContainerClassName="gap-3 "
            // style={{ overflow: "visible" }}
          />
        </View>

        <FlatList
          data={adata}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const body = {
              id: item.id,
              customerID: item.customerID,
              vehicleID: item.vehicleID,
              location: item.dealerLocation,
              staffName: item.staffName,
              appointedDate: item.appointedDate,
              status: item.status,
            };
            return (
              <CustomTestDriveCard item={body as CustomTestDriveCardProps} />
            );
          }}
          contentContainerClassName=" gap-4 "
          contentContainerStyle={{ paddingBottom: 150 }}
        />
      </SafeAreaView>
    </View>
  );
};

export default Appointments;
