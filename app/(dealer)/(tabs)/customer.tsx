import { color } from "@/src/constants";
import useCustomer from "@/src/hooks/useCustomer";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Customers = () => {
  const { fetchAllCustomers, cdata, createCustomer, deleteCustomer, loading } =
    useCustomer();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      return Alert.alert("Please fill all required fields");
    }

    const success = await createCustomer({
      ...form,
      createdAt: new Date().toISOString(),
    });

    if (success) {
      Alert.alert("Customer added");
      setModalVisible(false);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
      });
      fetchAllCustomers();
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const ok = await deleteCustomer(id as any);
            if (ok) {
              Alert.alert("Customer deleted");
              fetchAllCustomers();
            }
          },
        },
      ]
    );
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: color.backgroundPrimary }}
    >
      <SafeAreaView className="px-4 pt-5">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-semibold text-white">Customers</Text>

          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-blue px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">+ Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={cdata}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 pb-20"
          renderItem={({ item }) => (
            <View className="bg-gray rounded-xl p-4">
              <Text className="text-white text-lg font-semibold">
                {item.fullName}
              </Text>
              <Text className="text-secondary">{item.email}</Text>
              <Text className="text-secondary mb-2">{item.phone}</Text>

              <View className="flex-row gap-3 mt-2">
                <Pressable
                  className="bg-blue px-3 py-2 rounded-lg"
                  onPress={() =>
                    // navigate if needed: router.push(`/customers/${item.id}`)
                    Alert.alert("Open detail view here")
                  }
                >
                  <Text className="text-white">View</Text>
                </Pressable>

                <Pressable
                  className="bg-red-600 px-3 py-2 rounded-lg"
                  onPress={() => handleDelete(item.id)}
                >
                  <Text className="text-white">Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </SafeAreaView>

      {/* Add Modal Below... */}

      {/* ✅ Add Customer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-5">
            <Text className="text-xl font-semibold mb-4">Add Customer</Text>

            {["fullName", "email", "phone", "address"].map((field) => (
              <TextInput
                key={field}
                placeholder={field.replace("_", " ")}
                className="border border-gray-300 rounded-lg p-3 mb-3"
                value={(form as any)[field]}
                onChangeText={(txt) =>
                  setForm((prev) => ({ ...prev, [field]: txt }))
                }
              />
            ))}

            <View className="flex-row justify-end gap-3 mt-1">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="bg-gray p-3 rounded-lg"
              >
                <Text className="text-black font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddCustomer}
                className="bg-blue p-3 rounded-lg"
              >
                <Text className="text-white font-medium">
                  {loading ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Customers;
