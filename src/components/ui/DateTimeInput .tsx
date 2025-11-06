import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

interface Props {
  value?: string; // ISO string from backend
  readOnly?: boolean;
  onChangeDate?: (d: string) => void;
}

const DateTimeInput = ({ value, readOnly = false, onChangeDate }: Props) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
        setTempDate(parsed);
      }
    }
  }, [value]);

  const formattedDate = date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selectedDate) {
      if (Platform.OS === "android") {
        if (mode === "date") {
          setTempDate(selectedDate);
          setMode("time");
          setShow(true);
        } else if (mode === "time") {
          const newDate = new Date(tempDate);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          setDate(newDate);
          onChangeDate?.(newDate.toISOString());
          setShow(false);
          setMode("date");
        }
      } else {
        setDate(selectedDate);
        onChangeDate?.(selectedDate.toISOString());
      }
    }
  };

  const openPicker = () => {
    if (!readOnly) {
      setMode("date");
      setShow(true);
    }
  };

  return (
    <View className="gap-2">
      <Text className="text-secondary text-base font-medium">
        Appointment Time
      </Text>

      <Pressable
        onPress={openPicker}
        disabled={readOnly}
        className={`flex-row items-center justify-between p-4 rounded-xl border ${
          readOnly ? "bg-dark border-secondary" : "bg-dark border-secondary"
        }`}
      >
        <Text className="text-white text-lg">{formattedDate}</Text>
        <Ionicons name="calendar-outline" size={22} color="white" />
      </Pressable>

      {Platform.OS === "ios" && !readOnly && show && (
        <Modal visible={show} transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-[#1E1E1E] rounded-t-2xl p-4">
              <View className="flex-row justify-between mb-3">
                <Pressable onPress={() => setShow(false)}>
                  <Text className="text-white text-lg font-medium">Cancel</Text>
                </Pressable>

                <Text className="text-white text-lg font-semibold">
                  Select Date & Time
                </Text>

                <Pressable onPress={() => setShow(false)}>
                  <Text className="text-white text-lg font-medium">Done</Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={date}
                mode="datetime"
                display="spinner"
                onChange={handleChange}
                style={{ backgroundColor: "#1E1E1E" }}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && show && !readOnly && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DateTimeInput;
