import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Informe seu email");
      return;
    }

    // 🔒 Simulação (rota ainda não existe no backend)
    Alert.alert(
      "Link enviado",
      "Se este email estiver cadastrado, você receberá um link para redefinir sua senha."
    );

    setEmail("");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Recuperar senha
      </Text>

      <TextInput
        placeholder="Seu email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: "#F2F2F2",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#2C6EFA",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleSend}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          Enviar link
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const input = {
  backgroundColor: "#F2F2F2",
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
};

const btn = {
  backgroundColor: "#2C6EFA",
  padding: 15,
  borderRadius: 10,
  alignItems: "center",
};

const btnText = {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
};
