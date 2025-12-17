import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ItemCard from "../components/ui/ItemCard";
import { useAds } from "../contexts/AdsContext";
import { useAuth } from "../contexts/AuthContext";

export default function MyAds() {
  const { ads, promoteAd } = useAds();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Faça login para ver seus anúncios</Text>
      </View>
    );
  }

  // 👉 SOMENTE ANÚNCIOS DO USUÁRIO
  const myAds = ads.filter((ad) => ad.userId === user.id);

  if (myAds.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="home-outline" size={64} color="#999" />
        <Text style={styles.emptyTitle}>Nenhum anúncio criado</Text>
        <Text style={styles.emptyText}>
          Crie seu primeiro anúncio e comece a receber contatos
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus anúncios</Text>

      <FlatList
        data={myAds}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <ItemCard
              title={item.title}
              price={item.price}
              location={item.location}
              image={item.images[0]}
              beds={item.beds}
              baths={item.baths}
              isFeatured={item.isFeatured}
              onPress={() => router.push(`/item/${item.id}`)}
            />

            {/* STATUS */}
            <View style={styles.statusRow}>
              {item.status === "PENDING" && (
                <Text style={styles.pending}>🕒 Em análise</Text>
              )}

              {item.status === "APPROVED" && (
                <Text style={styles.approved}>✅ Publicado</Text>
              )}
            </View>

            {/* PROMOVER */}
            {item.status === "APPROVED" && !item.isFeatured && (
              <TouchableOpacity
                style={styles.promoteButton}
                onPress={() => promoteAd(item.id)}
              >
                <Ionicons name="star-outline" size={18} color="#2C6EFA" />
                <Text style={styles.promoteText}>Promover anúncio</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  statusRow: {
    marginTop: -6,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  pending: {
    fontSize: 13,
    color: "#F39C12",
    fontWeight: "600",
  },
  approved: {
    fontSize: 13,
    color: "#2ECC71",
    fontWeight: "600",
  },
  promoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0FF",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
  },
  promoteText: {
    color: "#2C6EFA",
    fontWeight: "700",
  },
});
