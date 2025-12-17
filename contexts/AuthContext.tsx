import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  role: "USER" | "ADMIN";
};

type AuthContextData = {
  user: User | null;
  isAdmin: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Carregar usuário salvo
  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("@alugueja:user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const signIn = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("@alugueja:user", JSON.stringify(userData));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@alugueja:user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "ADMIN",
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
