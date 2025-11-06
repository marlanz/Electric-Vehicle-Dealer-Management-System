import CustomQuotationCard from "@/src/components/ui/CustomQuotationCard";
import { color } from "@/src/constants";
import useQuotations from "@/src/hooks/useQuotations";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const brands = [
  {
    id: 1,
    name: "All",
  },
  { id: 2, name: "Pending" },
  { id: 3, name: "Approved" },
  { id: 4, name: "Rejected" },
];

const quotations = [
  {
    id: "QUO-2024-00123",
    customerName: "Nguyễn Minh Sang",
    model: "Vinfast VF7",
    color: "Crimson Pulse",
    version: "Long Range",
    createdAt: "20/10/2024",
    staff: "John Doe",
    status: "Approved",
    price: "$ 52,990.00",
  },
  {
    id: "QUO-2024-00124",
    customerName: "Trần Hoàng Phúc",
    model: "Tesla Model Y",
    color: "Midnight Silver",
    version: "Performance",
    createdAt: "22/10/2024",
    staff: "Emily Carter",
    status: "Pending",
    price: "$ 52,990.00",
  },
  {
    id: "QUO-2024-00125",
    customerName: "Lê Bảo Ngọc",
    model: "BYD Atto 3",
    color: "Arctic White",
    version: "Standard Range",
    createdAt: "25/10/2024",
    staff: "David Nguyen",
    status: "Rejected",
    price: "$ 52,990.00",
  },
];

const parseStatusToColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "text-[#16D68F] bg-[#16D68F]/[0.1]";

    case "pending":
      return "text-[#F9C74F] bg-[#F9C74F]/[0.1]";

    case "rejected":
      return "text-[#FF6B6B] bg-[#FF6B6B]/[0.1]";

    case "draft":
    case "created":
      return "text-[#61B1FF] bg-[#61B1FF]/[0.1]";

    case "expired":
    case "cancelled":
      return "text-[#959CA7] bg-[#959CA7]/[0.1]";

    default:
      return "text-white bg-gray-600/30";
  }
};

const Quotations = () => {
  const [selected, setSelected] = useState(1);

  const { fetchAllQuotations, qdata } = useQuotations();

  useEffect(() => {
    fetchAllQuotations();
  }, [fetchAllQuotations]);

  return (
    <View style={{ backgroundColor: color.backgroundPrimary, flex: 1 }}>
      <SafeAreaView className="px-4 ">
        <View className="pB-3">
          <View className="flex-row justify-between py-5">
            <Text className="text-2xl font-semibold text-white">
              My Quotations
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
          {/* <FlatList
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
          /> */}
        </View>

        <FlatList
          data={qdata}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CustomQuotationCard item={item} />}
          contentContainerClassName=" gap-4 "
          contentContainerStyle={{ paddingBottom: 190 }}
        />
      </SafeAreaView>
    </View>
  );
};

export default Quotations;
