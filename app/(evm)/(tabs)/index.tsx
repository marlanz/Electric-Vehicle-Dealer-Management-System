import Features from "@/src/components/ui/CustomFeatures";
import RoundDivider from "@/src/components/ui/RoundDivider";
import { color, images } from "@/src/constants";
import { selectAuth } from "@/src/features/auth/authSlice";
import { useAppSelector } from "@/src/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

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

const testDriveAppointments = [
  {
    name: "John D. Robbin",
    vehicle: "Cyber truck",
    variant: "Long Range",
    color: "Blue Navy",
    date: "Oct 28, 2024, 10:30 AM",
  },
  {
    name: "John D. Robbin",
    vehicle: "Cyber truck",
    variant: "Long Range",
    color: "Blue Navy",
    date: "Oct 28, 2024, 10:30 AM",
  },
  {
    name: "John D. Robbin",
    vehicle: "Cyber truck",
    variant: "Long Range",
    color: "Blue Navy",
    date: "Oct 28, 2024, 10:30 AM",
  },
];

const modelStock = [
  {
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
  return (
    <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
      <SafeAreaView className="px-4 pb-[72px]">
        {/* Header */}
        <View className="flex-row justify-between items-center py-5">
          <View className="flex-row gap-3 items-center">
            <Image
              source={images.avt_placeholder}
              className="size-[50px] rounded-full"
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
          <Ionicons name="log-out-outline" size={24} color={"white"} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <Text className="mt-6 font-bold text-white text-xl mb-3">
            Dashboard Statistics
          </Text>

          {/* Dashboard cards grid */}
          <View className="flex-row flex-wrap justify-between">
            {dashboardStats.map((d, index) => (
              <View
                key={index}
                className="bg-gray p-5 rounded-[10px] w-[48%] mb-4"
              >
                <Text className="text-white text-2xl font-semibold">
                  {d.number}
                </Text>
                <Text className="font-medium text-base text-secondary mt-2">
                  {d.desc}
                </Text>

                <View className="mt-4 flex-row gap-2 items-center">
                  <Ionicons
                    name={d.icon as any}
                    size={24}
                    color={color.iconColor}
                  />
                  <Text className="text-white font-semibold text-lg">
                    {d.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Test drive appointments */}
          <Text className="mt-6 font-bold text-white text-xl mb-3">
            My Test Drive Appointments
          </Text>

          <View className="flex-col gap-3 ">
            {testDriveAppointments.map((t, index) => (
              <View
                key={index}
                className="p-5 bg-gray rounded-[10px] w-full items-center justify-between flex-row"
              >
                <View className="flex-col gap-4">
                  <View>
                    <Text className="font-semibold text-xl text-white ">
                      {t.name}
                    </Text>
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-secondary text-base font-medium">
                        {t.vehicle} - {t.variant}
                      </Text>
                      <RoundDivider />
                      <Text className="text-secondary font-medium text-base">
                        {t.color}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Ionicons
                      name="calendar-clear-outline"
                      size={16}
                      color={color.textSecondary}
                    />
                    <Text className="font-medium text-secondary">{t.date}</Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  color={"white"}
                  size={24}
                />
              </View>
            ))}
          </View>

          <Text className="mt-10 font-bold text-white text-xl mb-3">
            My Inventory
          </Text>

          <View className="flex-col gap-3">
            {modelStock.map((s, index) => (
              <View
                key={index}
                className="flex-1 rounded-[15px] overflow-hidden bg-gray p-5"
              >
                <Image
                  source={{ uri: s.img }}
                  resizeMode="cover"
                  className="w-full h-[200px] rounded-[15px]"
                />
                <View className="mt-3 mb-2">
                  <View className="justify-between flex-row items-center">
                    <Text className="text-xl font-semibold text-white">
                      {s.model}
                    </Text>
                    <Text className="text-base font-medium text-secondary">
                      {s.brand}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Features number={s.maxDistance} icon={"engine-outline"} />
                  <Features number={s.seat} icon={"seat-outline"} />
                  <Features number={s.stock} icon={"battery-outline"} />
                  <Features number={s.drivetrain} icon={"abacus"} />
                </View>

                <View className="flex-row gap-3 items-end mt-5">
                  <Text className="font-semibold text-white text-xl">
                    Starting at {s.price}
                  </Text>
                  <Text className="text-secondary text-base line-through">
                    {s.discount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
