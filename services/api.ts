import axios from "axios";
import { Platform } from "react-native";

/* ================== STORAGE CROSS-PLATFORM ================== */
export const storage = {
  async get(key: string) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    return AsyncStorage.getItem(key);
  },
};

/* ================== API URL ================== */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL não definida. Verifique o arquivo .env"
  );
}

console.log("API_URL EM USO:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/* ================== TOKEN HELPER ================== */
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/* ================== INTERCEPTOR (CORRIGIDO) ================== */
api.interceptors.request.use(async (config) => {
  // 🔒 NÃO enviar token em rotas públicas
  if (config.url?.includes("/auth/login")) {
    return config;
  }

  if (!config.headers.Authorization) {
    const storedUser = await storage.get("@alugueja:user");

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
