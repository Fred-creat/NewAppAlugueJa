import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ItemCard from "../../../components/ui/ItemCard";
import { useAds } from "../../../contexts/AdsContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useFavorites } from "../../../contexts/FavoritesContext";

export default function Favorites() {
  const { user } = useAuth();
  const { ads } = useAds();
  const { isFavorite } = useFavorites();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Faça login para ver seus favoritos</Text>
      </View>
    );
  }

  const favoriteAds = ads.filter((ad) =>
    isFavorite(ad.id, user.id)
  );

  if (favoriteAds.length === 0) {
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
        data={favoriteAds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
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
