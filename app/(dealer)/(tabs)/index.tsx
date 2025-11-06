import Features from "@/src/components/ui/CustomFeatures";
import { color, images } from "@/src/constants";
// import { color, images } from "@/src/constants";
import { logout, selectAuth } from "@/src/features/auth/authSlice";
import useVehicles from "@/src/hooks/useVehicles";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import CustomAppointmnet from "@/src/components/dashboard/CustomAppointmnet";
import CustomDashboardCard from "@/src/components/dashboard/CustomDashboardCard";
import useAppointments from "@/src/hooks/useAppointments";
import useOrders from "@/src/hooks/useOrders";
import useQuotations from "@/src/hooks/useQuotations";
import { formatToDollar } from "@/src/utils";
import { SafeAreaView } from "react-native-safe-area-context";

const dashboardStats = [
  {
    title: "Quotations",
    desc: "My Total \nQuotations",
    number: 38,
    icon: "document-outline",
  },
  {
    title: "Sales",
    desc: "My Total \nVehicales Sold",
    number: 38,
    icon: "cash-outline",
  },
  {
    title: "Appointments",
    desc: "Test Drive \nAppointments",
    number: 38,
    icon: "car-outline",
  },
  {
    title: "Inventory",
    desc: "Total Cars \nIn Stock",
    number: 12,
    icon: "cube-outline",
  },
];

export const modelStock = [
  {
    id: 1,
    model: "Tesla Model S",
    brand: "Tesla",
    stock: "57 kWh",
    maxDistance: "330 mil",
    acceleration: 4.8,
    battery: 81,
    price: "$44,990",
    drivetrain: "AWD",
    seat: 5,
    discount: "$40,290",
    img: "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg",
  },
  {
    id: 2,
    model: "Tesla Model S",
    brand: "Tesla",
    stock: "71 kWh",
    maxDistance: "330 mil",
    acceleration: 4.8,
    battery: 81,
    seat: 5,
    price: "$44,990",
    drivetrain: "AWD",
    discount: "$40,290",
    img: "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg",
  },
  {
    id: 3,
    model: "Tesla Model S",
    brand: "Tesla",
    stock: "75 kWh",
    maxDistance: "300 mil",
    acceleration: 4.8,
    battery: 81,
    seat: 5,
    price: "$44,990",
    drivetrain: "AWD",
    discount: "$40,290",
    img: "https://i.pinimg.com/1200x/d5/da/11/d5da11d9d023a866c2999c9c7c54b333.jpg",
  },
];

const Home = () => {
  const { user } = useAppSelector(selectAuth);

  const { fetchAllVehicles, vdata } = useVehicles();

  const { fetchAllAppointments, adata } = useAppointments();

  const { fetchAllQuotations, qdata } = useQuotations();

  const { fetchAllOrders, odata } = useOrders();

  const dispatch = useAppDispatch();

  const onLogout = async () => {
    await dispatch(logout());

    router.replace("/(auth)/auth");
  };

  useEffect(() => {
    fetchAllVehicles();
    fetchAllAppointments();
    fetchAllQuotations();
    fetchAllOrders();
  }, [
    fetchAllVehicles,
    fetchAllAppointments,
    fetchAllQuotations,
    fetchAllOrders,
  ]);

  return (
    <View
      style={{
        backgroundColor: color.backgroundPrimary,
        flex: 1,
      }}
    >
      <SafeAreaView className="px-4 ">
        {/* Header */}
        <View className="flex-row justify-between items-center py-5">
          <View className="flex-row gap-3 items-center">
            <Image
              source={images.avt_placeholder}
              className="size-[40px] rounded-full"
              resizeMode="contain"
            />
            <View>
              <Text className="font-semibold text-white text-xl">
                Hello {user?.full_name}
              </Text>
              <Text className="font-medium text-secondary text-base">
                {user?.role}
              </Text>
            </View>
          </View>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={"white"}
            onPress={onLogout}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Stats */}
          <Text className="mt-6 font-bold text-white text-xl mb-3">
            Dashboard Statistics
          </Text>

          {/* Dashboard cards grid */}
          <View className="">
            <View className="flex-row justify-between">
              <CustomDashboardCard
                title="Quotations"
                desc={`My Total \nQuotations`}
                value={qdata.length}
                icon={"document-outline"}
              />
              <CustomDashboardCard
                title="Sales"
                desc={`My Total \nVehicales Sold`}
                value={`${odata.length}`}
                icon={"cash-outline"}
              />
            </View>
            <View className="flex-row justify-between">
              <CustomDashboardCard
                title="Appointments"
                desc={`Test Drive \nAppointments`}
                value={adata.length}
                icon={"car-outline"}
              />
              <CustomDashboardCard
                title="Inventory"
                desc={`Total Cars \nIn Stock`}
                value={vdata.count}
                icon={"cube-outline"}
              />
            </View>
          </View>

          {/* Test drive appointments */}
          <Text className="mt-6 font-bold text-white text-xl mb-3">
            My Test Drive Appointments
          </Text>

          <View className="flex-col gap-3 ">
            {adata.slice(0, 3).map((t, index) => (
              <CustomAppointmnet
                key={index}
                date={t.appointedDate}
                vehicleID={t.vehicleID}
                customerID={t.customerID}
              />
            ))}
          </View>

          <Text className="mt-10 font-bold text-white text-xl mb-3">
            My Inventory
          </Text>

          <View className="flex-col gap-3">
            {vdata.list.map((s, index) => (
              <Pressable
                onPress={() => router.push(`/(vehicle)/${s.id}`)}
                key={index}
                className="flex-1 rounded-[15px] overflow-hidden bg-gray p-5"
              >
                <Image
                  source={{ uri: s.imageURL }}
                  resizeMode="cover"
                  className="w-full h-[200px] rounded-[15px]"
                />
                <View className="mt-3 mb-2">
                  <View className="justify-between flex-row items-center">
                    <Text className="text-xl font-semibold text-white">
                      {s.model}
                    </Text>
                    <Text className="text-lg font-medium text-secondary">
                      {s.version}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Features number={s.features.motor} icon={"engine-outline"} />
                  <Features number={s.features.seats} icon={"seat-outline"} />
                  <Features
                    number={s.features.battery}
                    icon={"battery-outline"}
                  />
                  <Features number={s.features.drivetrain} icon={"abacus"} />
                </View>

                <View className="flex-row gap-3 items-end mt-5">
                  <Text className="font-semibold text-white text-xl">
                    Starting at {formatToDollar(s.dealerPrice)}
                  </Text>
                  <Text className="text-secondary text-base line-through">
                    {formatToDollar(s.manufacturedPrice)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
