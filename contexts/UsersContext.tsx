import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

/* ================== TYPES ================== */

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type UsersContextData = {
  users: User[];
  register: (data: RegisterData) => User;
  login: (email: string, password: string) => User | null;
  userExists: (email: string) => boolean;
};

/* ================== CONTEXT ================== */

const UsersContext = createContext({} as UsersContextData);

const STORAGE_KEY = "@alugueja:users";

/* ================== PROVIDER ================== */

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* 🔄 Load users */
  useEffect(() => {
    async function loadUsers() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setUsers(JSON.parse(stored));
      setLoaded(true);
    }
    loadUsers();
  }, []);

  /* 💾 Persist users */
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, loaded]);

  /* ✅ Verifica se usuário já existe */
  const userExists = (email: string) => {
    return users.some((u) => u.email === email);
  };

  /* ➕ Registrar usuário */
  const register = (data: RegisterData) => {
    if (userExists(data.email)) {
      throw new Error("Usuário já cadastrado");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: "USER", // 🔒 SEMPRE USER
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  /* 🔐 Login */
  const login = (email: string, password: string) => {
    return (
      users.find(
        (u) => u.email === email && u.password === password
      ) || null
    );
  };

  return (
    <UsersContext.Provider
      value={{ users, register, login, userExists }}
    >
      {children}
    </UsersContext.Provider>
  );
}

/* ================== HOOK ================== */

export function useUsers() {
  return useContext(UsersContext);
}
