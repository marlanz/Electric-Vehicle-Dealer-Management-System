import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./CustomButton";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

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
          <Text className="text-white font-semibold text-xl mb-4">
            Select Customer
          </Text>

          <FlatList
            data={customers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 border-b border-gray-700"
                onPress={() => onSelect(item)}
              >
                <Text className="text-white font-semibold text-lg">
                  {item.name}
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
            textStyles="text-white"
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomerPickerModal;
