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
import { useUsers } from "../../contexts/UsersContext";

export default function Register() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { register, userExists } = useUsers();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    if (userExists(email)) {
      Alert.alert(
        "Email já cadastrado",
        "Este email já está em uso. Faça login."
      );
      return;
    }

    const newUser = register({
      name,
      email: email.toLowerCase(),
      password,
      phone: "55999999999", // depois vira input
    });

    signIn({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "USER",
      phone: newUser.phone,
    });

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Anuncie ou encontre imóveis facilmente
        </Text>

        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Já tem conta?</Text>
          <Link href="/auth/login" style={styles.linkStrong}>
            Entrar
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
