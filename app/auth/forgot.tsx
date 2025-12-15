import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Forgot() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Recuperar senha
      </Text>

      <TextInput placeholder="Seu email" style={input} />

      <TouchableOpacity style={btn}>
        <Text style={btnText}>Enviar link</Text>
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
