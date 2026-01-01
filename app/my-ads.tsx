import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ItemCard from "../components/ui/ItemCard";
import { useAds } from "../contexts/AdsContext";
import { useAuth } from "../contexts/AuthContext";

export default function MyAds() {
  const { myAds, loadMyAds } = useAds();
  const { user, loading } = useAuth();
  const router = useRouter();

  /* ================== EFFECT ================== */

  useEffect(() => {
    if (user?.id) {
      loadMyAds();
    }
  }, [user?.id]);

  /* ================== STATES ================== */

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Faça login para ver seus anúncios</Text>
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

  /* ================== HELPERS ================== */

  function renderStatus(item: any) {
    if (item.isFeatured) {
      return (
        <View style={[styles.badge, styles.featured]}>
          <Text style={styles.badgeText}>⭐ Destaque ativo</Text>
        </View>
      );
    }

    if (item.status === "PAYMENT_PENDING") {
      return (
        <View style={[styles.badge, styles.payment]}>
          <Text style={styles.badgeText}>💳 Pagamento em análise</Text>
        </View>
      );
    }

    if (item.status === "PENDING") {
      return (
        <View style={[styles.badge, styles.pending]}>
          <Text style={styles.badgeText}>⏳ Aguardando aprovação</Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.approved]}>
        <Text style={styles.badgeText}>✅ Publicado</Text>
      </View>
    );
  }

  /* ================== RENDER ================== */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus anúncios</Text>

      <FlatList
        data={myAds}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ItemCard
              title={item.title}
              price={item.price}
              location={item.location}
              image={item.images?.[0]}
              beds={item.beds}
              baths={item.baths}
              isFeatured={item.isFeatured}
              onPress={() => router.push(`/item/${item.id}`)}
            />

            {/* STATUS */}
            <View style={styles.statusRow}>
              {renderStatus(item)}
            </View>

            {/* CTA PROMOVER */}
            {item.status === "APPROVED" && !item.isFeatured && (
              <>
                <TouchableOpacity
                  style={styles.promoteButton}
                  onPress={() =>
                    router.push(`/promote-ad/${item.id}`)
                  }
                >
                  <Ionicons
                    name="star-outline"
                    size={18}
                    color="#2C6EFA"
                  />
                  <Text style={styles.promoteText}>
                    Destacar anúncio
                  </Text>
                </TouchableOpacity>

                <Text style={styles.helperText}>
                  Destaque seu anúncio e apareça no topo da lista
                </Text>
              </>
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
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    marginBottom: 20,
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

  /* STATUS */
  statusRow: {
    marginTop: -6,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFF",
  },
  pending: {
    backgroundColor: "#F39C12",
  },
  approved: {
    backgroundColor: "#2ECC71",
  },
  payment: {
    backgroundColor: "#2980B9",
  },
  featured: {
    backgroundColor: "#8E44AD",
  },

  /* PROMOVER */
  promoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0FF",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  promoteText: {
    color: "#2C6EFA",
    fontWeight: "700",
  },
  helperText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
  },
});
