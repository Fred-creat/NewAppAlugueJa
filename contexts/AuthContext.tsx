import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { setAuthToken } from "../services/api";

/* ================== TYPES ================== */

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  token?: string;
};

type AuthContextData = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
};

/* ================== CONTEXT ================== */

const STORAGE_KEY = "@alugueja:user";

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

/* ================== PROVIDER ================== */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: User = JSON.parse(stored);

        if (parsed?.id && parsed?.role && parsed?.token) {
          setUser(parsed);
          setAuthToken(parsed.token); // 🔥 AQUI
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (userData: User) => {
    const normalizedUser: User = {
      id: String(userData.id),
      name: userData.name,
      email: userData.email,
      role: userData.role ?? "USER",
      token: userData.token,
    };

    setUser(normalizedUser);
    setAuthToken(normalizedUser.token); // 🔥 AQUI
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizedUser)
    );
  };

  const signOut = async () => {
    setUser(null);
    setAuthToken(undefined); // 🔥 AQUI
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
