import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    /* ================= ADMIN ================= */
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      signIn({
        id: "admin",
        name: "Administrador",
        email,
        role: "ADMIN",
      });

      router.replace("/(tabs)");
      return;
    }

    /* ================= USUÁRIO ================= */
    const storedUsers = await AsyncStorage.getItem("@alugueja:users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      Alert.alert("Erro", "Email ou senha inválidos");
      return;
    }

    signIn({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "USER",
      phone: user.phone,
    });

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>Entre para continuar no AlugueJá</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Link href="/auth/forgot" style={styles.link}>
          Esqueci minha senha
        </Link>

        <View style={styles.footer}>
          <Text>Não tem conta?</Text>
          <Link href="/auth/register" style={styles.linkStrong}>
            Criar conta
          </Link>
        </View>
      </View>
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2C6EFA",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#555",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkStrong: {
    marginTop: 4,
    fontWeight: "700",
    color: "#2C6EFA",
  },
});
