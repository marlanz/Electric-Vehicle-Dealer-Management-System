// import { CustomInputProps } from "@/type";
import cn from "clsx";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  labelStyle?: string;
}

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  multiline,
  labelStyle,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      {label && (
        <View className="w-full">
          {multiline ? (
            <TextInput
              multiline
              autoCapitalize="none"
              numberOfLines={6}
              autoCorrect={false}
              placeholder={placeholder}
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholderTextColor={"#8F9098"}
              textAlignVertical="top"
              value={value}
              className={cn(
                "p-4 font-msr-medium text-base border border-gray-100 rounded-xl",
                isFocused ? "border-orange-200" : "border-gray-100"
              )}
              style={{
                minHeight: 150,
                paddingHorizontal: 12,
                paddingVertical: 10,
                lineHeight: 20,
              }}
            />
          ) : (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              placeholderTextColor={"#8F9098"}
              className={cn(
                "p-4 font-msr-medium text-base border border-gray-100 rounded-xl height-[50px]",
                isFocused ? "border-orange-200" : "border-gray-100"
              )}
            />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default CustomInput;
