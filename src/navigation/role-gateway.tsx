// // src/navigation/role-gateway.tsx
// import { selectAuth } from "@/src/features/auth/authSlice";
// import {
//   AUTH_SHARED_PREFIXES,
//   PUBLIC_PREFIXES,
//   ROLE_HOME,
// } from "@/src/lib/roles";
// import { useAppSelector } from "@/src/store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Slot, usePathname, useRouter, useSegments } from "expo-router";
// import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
// import { ActivityIndicator, Text, View } from "react-native";

// export default function RoleGateway({ children }: { children?: ReactNode }) {
//   // console.log('qua role gatewway')
//   const { user, token, loading } = useAppSelector(selectAuth);
//   // console.log('const { user, token, loading } = useAppSelector(selectAuth);', { user, token, loading });
//   const router = useRouter();
//   const pathname = usePathname();
//   const segments = useSegments();
//   const [init, setInit] = useState(true);
//   const redirected = useRef(false);

//   const isPublic = useMemo(
//     () => PUBLIC_PREFIXES.some((p) => pathname?.startsWith(p)),
//     [pathname]
//   );
//   const isShared = useMemo(
//     () => AUTH_SHARED_PREFIXES.some((p) => pathname?.startsWith(p)),
//     [pathname]
//   );

//   // lưu intended path nếu chưa login
//   useEffect(() => {
//     (async () => {
//       if (!loading && !token && !isPublic) {
//         await AsyncStorage.setItem("intendedPath", pathname || "/");
//         if (!redirected.current) {
//           redirected.current = true;
//           router.replace("/(auth)/auth");
//         }
//       }
//     })();
//   }, [loading, token, isPublic, pathname]);

//   // sau login quay lại intended path hoặc HOME theo role
//   useEffect(() => {
//     (async () => {
//       if (!loading && token && !redirected.current) {
//         const intended = await AsyncStorage.getItem("intendedPath");
//         if (intended) {
//           await AsyncStorage.removeItem("intendedPath");
//           if (PUBLIC_PREFIXES.some((p) => intended.startsWith(p))) {
//             redirected.current = true;
//             router.replace(ROLE_HOME[user!.role]);
//           } else {
//             redirected.current = true;
//             router.replace("/");
//           }
//         }
//       }
//     })();
//   }, [loading, token, user]);

//   // ép đúng nhánh theo role
//   useEffect(() => {
//     if (loading || !token || !user) return;
//     if (isShared) return;
//     const home = ROLE_HOME[user.role];
//     const top = segments[0];
//     if (!top || top === "(auth)") {
//       if (!redirected.current) {
//         redirected.current = true;
//         router.replace(home);
//       }
//       return;
//     }
//     const inDealer = top.includes("(dealer)"),
//       inEvm = top.includes("(evm)");
//     if (home.startsWith("/(dealer)") && !inDealer) {
//       if (!redirected.current) {
//         redirected.current = true;
//         router.replace(home);
//       }
//     }
//     if (home.startsWith("/(evm)") && !inEvm) {
//       if (!redirected.current) {
//         redirected.current = true;
//         router.replace(home);
//       }
//     }
//   }, [loading, token, user, segments, isShared]);

//   useEffect(() => {
//     const t = setTimeout(() => setInit(false), 10);
//     return () => clearTimeout(t);
//   }, []);
//   if (loading || init) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#0f1115]">
//         <ActivityIndicator />
//         <Text className="text-white mt-2">Loading…</Text>
//       </View>
//     );
//   }
//   return <>{children ?? <Slot />}</>;
// }
