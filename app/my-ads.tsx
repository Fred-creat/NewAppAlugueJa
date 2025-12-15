import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import ItemCard from "../components/ui/ItemCard";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MyAds() {
  const { user } = useAuth();
  const router = useRouter();

  // Mock de anúncios do anunciante (depois vem do backend)
  const myAds = [
    {
      id: 1,
      title: "Casa Vista Mar",
      price: "4.500",
      location: "Morro de São Paulo",
      image: "https://picsum.photos/400/300?random=1",
      beds: 3,
      baths: 2,
      isFeatured: true,
    },
    {
      id: 4,
      title: "Studio Aconchegante",
      price: "1.500",
      location: "Vila Mariana",
      image: "https://picsum.photos/400/300?random=4",
      beds: 1,
      baths: 1,
      isFeatured: false,
    },
  ];

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Faça login para gerenciar seus anúncios</Text>
      </View>
    );
  }

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
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <ItemCard
              {...item}
              onPress={() => router.push(`/item/${item.id}`)}
              isFeatured={item.isFeatured}
            />

            {!item.isFeatured && (
              <TouchableOpacity
                style={styles.promoteButton}
                onPress={() => {
                  // MVP: promoção manual
                  alert("Promover anúncio (Destaque)");
                }}
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
  promoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0FF",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 16,
    gap: 6,
  },
  promoteText: {
    color: "#2C6EFA",
    fontWeight: "700",
  },
});
