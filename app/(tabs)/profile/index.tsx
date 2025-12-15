
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={90} color="#2C6EFA" />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>
          {user?.role === "advertiser" ? "Anunciante" : "Usuário"}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {user?.role === "advertiser" && (
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/my-ads")}
          >
            <Ionicons name="home-outline" size={22} color="#333" />
            <Text style={styles.actionText}>Meus anúncios</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push("/favorites")}
        >
          <Ionicons name="heart-outline" size={22} color="#333" />
          <Text style={styles.actionText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, styles.logout]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={[styles.actionText, { color: "#E53935" }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  actions: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  logout: {
    borderBottomWidth: 0,
  },
});
