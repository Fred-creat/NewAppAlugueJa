import { useRouter } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ItemCard from "../../components/ui/ItemCard";
import { useAds } from "../../contexts/AdsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ApproveAds() {
  const { ads, approveAd } = useAds();
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // 🔒 SOMENTE ADMIN
  if (!user || !isAdmin) {
    return (
      <View style={styles.center}>
        <Text>Acesso restrito</Text>
      </View>
    );
  }

  // 👉 SOMENTE ANÚNCIOS PENDENTES
  const pendingAds = ads.filter((ad) => ad.status === "PENDING");

  if (pendingAds.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum anúncio pendente</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aprovação de anúncios</Text>

      <FlatList
        data={pendingAds}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ItemCard
              title={item.title}
              price={item.price}
              location={item.location}
              image={item.images[0]}
              beds={item.beds}
              baths={item.baths}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => approveAd(item.id)}
              >
                <Text style={styles.approveText}>Aprovar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() =>
                  alert("Rejeição será tratada no backend futuramente")
                }
              >
                <Text style={styles.rejectText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
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
  card: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -6,
    marginBottom: 16,
  },
  approveButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  approveText: {
    color: "#FFF",
    fontWeight: "700",
  },
  rejectButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  rejectText: {
    color: "#FFF",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
