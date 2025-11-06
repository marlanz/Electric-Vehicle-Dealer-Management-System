import React from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

const VoucherPickerModal = ({ visible, vouchers, onSelect, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-[rgba(0,0,0,0.6)] justify-end">
        <View className="bg-gray rounded-t-2xl p-5 max-h-[65%]">
          <Text className="text-white font-semibold text-xl mb-4">
            Select Voucher
          </Text>

          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className="bg-dark p-4 rounded-xl mb-3 border border-secondary"
              >
                <Text className="text-white font-semibold text-lg">
                  {item.name}
                </Text>
                <Text className="text-secondary mb-1">{item.description}</Text>
                <Text className="text-green-400 font-semibold">
                  {item.discountPercentage}% OFF
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />

          <Pressable onPress={onClose} className="mt-3 py-3 rounded-xl bg-blue">
            <Text className="text-center text-white font-semibold text-lg">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default VoucherPickerModal;
