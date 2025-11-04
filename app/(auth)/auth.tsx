import { login, persistAuth, selectAuth } from "@/src/features/auth/authSlice";
import { http } from "@/src/services/http";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ToastAndroid } from "react-native";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import * as yup from "yup";

// atoms
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-white/90 mb-1">{children}</Text>
);
const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    placeholderTextColor="#d1d5db"
    className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white"
    {...props}
  />
);
const PrimaryButton = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`w-full items-center justify-center rounded-2xl px-4 py-3 ${disabled ? "bg-white/30" : "bg-white"}`}
  >
    <Text className="text-[#3b5cff] font-semibold">{title}</Text>
  </Pressable>
);
const GhostButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <Pressable onPress={onPress} className="w-full items-center justify-center rounded-2xl px-4 py-3 border border-white/20">
    <Text className="text-white font-medium">{title}</Text>
  </Pressable>
);

//schemas
const loginSchema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  password: yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
});

const registerSchema = yup.object({
  fullName: yup.string().min(2, "Nhập tên hợp lệ").required("Bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  password: yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Bắt buộc"),
});

type LoginForm = yup.InferType<typeof loginSchema>;
type RegisterForm = yup.InferType<typeof registerSchema>;
type FormValues = (LoginForm & Partial<RegisterForm>) | RegisterForm;

export default function AuthUnifiedScreen() {
    console.log('vào trang auth')
  const [mode, setMode] = useState<"login" | "register">("login");
  const isLogin = mode === "login";
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectAuth);

  const resolver = useMemo(() => yupResolver(isLogin ? loginSchema : registerSchema), [isLogin]);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver,
    defaultValues: { email: "", password: "", fullName: "", confirmPassword: "" } as any,
    mode: "onBlur",
  });

  const title = isLogin ? "Welcome back" : "Create your account";
  const cta = isLogin ? "Sign In" : "Sign Up";

  const onSubmit = async (values: any) => {
    try {
      if (isLogin) {
        const res = await dispatch(login({ email: values.email, password: values.password })).unwrap();
        console.log('đăng nhập nè')
        await persistAuth(res);
      } 
      // else {
      //   await http.post("/auth/register", {
      //     fullName: values.fullName,
      //     email: values.email,
      //     password: values.password,
      //   });
      //   const res = await dispatch(login({ email: values.email, password: values.password })).unwrap();
      //   await persistAuth(res);
      // }
      router.replace("/");
    } catch (err: any) {
      console.warn("Auth error:", err?.message ?? err);
      ToastAndroid.show(`Error: ${err?.message ?? err}`, ToastAndroid.LONG);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} className="flex-1">
      <View className="flex-1 bg-[#3b5cff]">
        {/* Top bar */}
        <View className="px-5 pt-14 pb-2 flex-row items-center justify-between">
          <Text className="text-white/90 font-medium">EVM Dealer System</Text>
        
        </View>

        {/* Header */}
        <View className="px-6 mt-2">
          <Text className="text-white text-3xl font-extrabold">{isLogin ? "Choose car right for you" : "Join EVM ecosystem"}</Text>
          <Text className="text-white/70 mt-2">
            {isLogin ? "Sign in to manage vehicles, quotes and orders." : "Create an account to start managing your dealership."}
          </Text>
        </View>

        {/* Visual placeholder */}
        <View className="items-center mt-6">
          {/* <View className="w-[280px] h-[140px] rounded-3xl bg-white/10 items-center justify-center">
            
          </View> */}
          <Image source={require("@/assets/images/model-s.png")} className="w-[560px] h-[240px]" resizeMode="contain" />
        </View>

        {/* Form card */}
        <View className="flex-1 mt-6 px-5">
          <View className="bg-[#2f46e0] rounded-3xl p-5">

            {!isLogin && (
              <>
                <FieldLabel>Full name</FieldLabel>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input placeholder="Nguyen Tri Thanh" autoCapitalize="words" value={value as any} onChangeText={onChange} />
                  )}
                />
                {errors.fullName && <Text className="text-red-200 mt-1">{errors.fullName.message as string}</Text>}
                <View className="h-3" />
              </>
            )}

            <FieldLabel>Email</FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value} }) => (
                <Input placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" value={value as any} onChangeText={onChange} />
              )}
            />
            {errors.email && <Text className="text-red-200 mt-1">{errors.email.message as string}</Text>}

            <View className="h-3" />
            <FieldLabel>Password</FieldLabel>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input placeholder="••••••••" secureTextEntry value={value as any} onChangeText={onChange} />
              )}
            />
            {errors.password && <Text className="text-red-200 mt-1">{errors.password.message as string}</Text>}

            {!isLogin && (
              <>
                <View className="h-3" />
                <FieldLabel>Confirm password</FieldLabel>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input placeholder="••••••••" secureTextEntry value={value as any} onChangeText={onChange} />
                  )}
                />
                {errors.confirmPassword && <Text className="text-red-200 mt-1">{errors.confirmPassword.message as string}</Text>}
              </>
            )}

            <View className="h-4" />
            <PrimaryButton title={loading ? "Please wait..." : cta} onPress={handleSubmit(onSubmit)} disabled={loading} />
            <View className="h-3" />
            {/* <GhostButton title={isLogin ? "Create a new account" : "I already have an account"} onPress={() => setMode(isLogin ? "register" : "login")} /> */}

            {loading && (
              <View className="mt-4 items-center">
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>

          {isLogin && (
            <View className="mt-3 items-center">
              <Pressable onPress={() => {}}>
                <Text className="text-white/80">Forgot password?</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
