import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

const DateTimeInput = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const [tempDate, setTempDate] = useState(new Date());

  const formattedDate = date.toLocaleString();

  const handleChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selectedDate) {
      if (Platform.OS === "android") {
        if (mode === "date") {
          // After date picked → show time picker
          setTempDate(selectedDate);
          setMode("time");
          setShow(true);
        } else if (mode === "time") {
          // Combine date + time
          const newDate = new Date(tempDate);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          setDate(newDate);
          setShow(false);
          setMode("date");
        }
      } else {
        // iOS
        setDate(selectedDate);
      }
    }
  };

  const openPicker = () => {
    if (Platform.OS === "android") {
      setMode("date");
      setShow(true);
    } else {
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
        className="flex-row items-center justify-between bg-dark p-4 rounded-xl border border-secondary"
      >
        <Text className="text-white text-lg">{formattedDate}</Text>
        <Ionicons name="calendar-outline" size={22} color="white" />
      </Pressable>

      {/* iOS modal */}
      {Platform.OS === "ios" && (
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
                textColor="white"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android native */}
      {Platform.OS === "android" && show && (
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
