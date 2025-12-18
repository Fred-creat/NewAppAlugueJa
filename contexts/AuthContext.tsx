import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

/* ================== TYPES ================== */

export type User = {
  id: string;
  name: string;
  role: "USER" | "ADMIN";
  phone?: string;
};

type AuthContextData = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

/* ================== CONTEXT ================== */

const STORAGE_KEY = "@alugueja:user";

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

/* ================== PROVIDER ================== */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  /* 🔄 Carregar usuário salvo */
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  /* 🔐 Login */
  const signIn = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(userData)
    );
  };

  /* 🚪 Logout */
  const signOut = async () => {
    setUser(null);
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

/* ================== HOOK ================== */

export function useAuth() {
  return useContext(AuthContext);
}
