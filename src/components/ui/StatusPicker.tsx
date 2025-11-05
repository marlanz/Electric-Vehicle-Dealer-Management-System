import React, { memo, useCallback, useState } from "react";
import { Modal, View, Text, Pressable, FlatList } from "react-native";

const BG = "#0B1220";
const STATUSES = ["PROCESSING", "PAID", "CONTRACTED", "FULFILLED", "CANCELLED"] as const;
export type StatusType = (typeof STATUSES)[number] | undefined;

type Props = {
  value: StatusType;
  onChange: (v: StatusType) => void;
};

function StatusPickerImpl({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const label = value ?? "All";

  const pick = useCallback(
    (v: StatusType) => {
      setOpen(false);
      if (v !== value) onChange(v);
    },
    [onChange, value]
  );

  return (
    <>
      {/* Nút mở modal chọn status */}
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={{
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
          justifyContent: "center",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Status: {label}</Text>
      </Pressable>

      {/* Modal danh sách status */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Lớp nền – bấm để đóng */}
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setOpen(false)}
        >
          {/* Sheet đáy */}
          <View
            style={{
              marginTop: "auto",
              backgroundColor: BG,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              borderTopWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Select status
            </Text>

            {/* All */}
            <Pressable
              onPress={() => pick(undefined)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ color: "#fff" }}>All</Text>
            </Pressable>

            {/* Các status */}
            <FlatList
              data={STATUSES as readonly string[]}
              keyExtractor={(s) => s}
              renderItem={({ item }) => {
                const active = item === value;
                return (
                  <Pressable
                    onPress={() => pick(item as StatusType)}
                    style={{
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "#9EC5FE" : "#fff",
                        fontWeight: active ? "700" : "500",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Pressable
              onPress={() => setOpen(false)}
              style={{ paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#9aa4b2" }}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default memo(StatusPickerImpl);
