import { View, Text, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import ItemCard from "../../../components/ui/ItemCard";
import { useRouter } from "expo-router";

export default function Favorites() {
  const { user } = useAuth();
  const router = useRouter();

  // Mock de favoritos (depois vem do backend)
  const favorites = [
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
      id: 3,
      title: "Cobertura Luxo",
      price: "6.200",
      location: "Praia Grande",
      image: "https://picsum.photos/400/300?random=3",
      beds: 4,
      baths: 3,
      isFeatured: false,
    },
  ];

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Faça login para ver seus favoritos</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
        <Text style={styles.emptyText}>
          Salve imóveis para encontrá-los facilmente depois
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard
            {...item}
            onPress={() => router.push(`/item/${item.id}`)}
            isFeatured={item.isFeatured}
          />
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
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
