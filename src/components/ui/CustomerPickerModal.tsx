import { Customer } from "@/src/hooks/useCustomer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "./CustomButton";
import CustomDivider from "./CustomDivider";

interface Props {
  visible: boolean;
  customers: Customer[];
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

const CustomerPickerModal = ({
  visible,
  customers,
  onClose,
  onSelect,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-dark p-5 rounded-t-2xl max-h-[60%]">
          <View className="flex-row justify-between">
            <Text className="text-white font-semibold text-xl mb-4">
              Select Customer
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-outline" size={24} color={"white"} />
            </Pressable>
          </View>

          <FlatList
            data={customers}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <CustomDivider />}
            renderItem={({ item }) => (
              <TouchableOpacity className="p-4 " onPress={() => onSelect(item)}>
                <Text className="text-white font-semibold text-lg">
                  {item.fullName}
                </Text>
                <Text className="text-secondary">{item.phone}</Text>
                <Text className="text-secondary">{item.email}</Text>
              </TouchableOpacity>
            )}
          />

          <CustomButton
            title="Close"
            btnStyles="mt-3 bg-gray-700"
            onPress={onClose}
            textStyles="text-white-100"
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomerPickerModal;
