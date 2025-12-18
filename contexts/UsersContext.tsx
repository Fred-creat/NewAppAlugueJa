import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

type UsersContextData = {
  users: User[];
  register: (user: Omit<User, "id" | "role">) => User;
  login: (email: string, password: string) => User | null;
};

const UsersContext = createContext({} as UsersContextData);

const STORAGE_KEY = "@alugueja:users";

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setUsers(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const register = (data: Omit<User, "id" | "role">) => {
    const newUser: User = {
      id: Date.now().toString(),
      role: "USER",
      ...data,
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const login = (email: string, password: string) => {
    return users.find(
      (u) => u.email === email && u.password === password
    ) || null;
  };

  return (
    <UsersContext.Provider value={{ users, register, login }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
