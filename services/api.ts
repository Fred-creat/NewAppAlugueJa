import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_URL !== ""
    ? process.env.EXPO_PUBLIC_API_URL
    : "http://192.168.0.105:3333";

const api = axios.create({
  
  baseURL: API_URL,
  timeout: 10000,
});

/* 🔐 Helper para setar/remover token */
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/* 🔄 Interceptor */
api.interceptors.request.use(async (config) => {
  if (!config.headers.Authorization) {
    const storedUser = await AsyncStorage.getItem("@alugueja:user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  }
  return config;
});

export default api;
