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
import api from "../../services/api";

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error("Resposta inválida do servidor");
      }

      await signIn({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("ERRO LOGIN:", error);

      if (error?.message === "Network Error") {
        Alert.alert(
          "Erro de conexão",
          "Não foi possível conectar ao servidor. Verifique o IP e a rede."
        );
        return;
      }

      Alert.alert(
        "Erro",
        error?.response?.data?.error || "Email ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
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
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
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
