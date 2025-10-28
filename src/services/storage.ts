import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  get: <T>(key: string) => AsyncStorage.getItem(key).then(v => v ? JSON.parse(v) as T : null),
  set: (key: string, value: unknown) => AsyncStorage.setItem(key, JSON.stringify(value)),
  del: (key: string) => AsyncStorage.removeItem(key),
};
