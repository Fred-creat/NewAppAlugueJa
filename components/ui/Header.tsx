import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Header() {
  return (
    <View
      style={{
        paddingTop: 55,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderColor: "#EEE",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700" }}>AlugueJá</Text>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Ionicons name="person-circle" size={34} color="#444" />
      </TouchableOpacity>
    </View>
  );
}
