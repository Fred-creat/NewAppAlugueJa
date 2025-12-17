import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ItemCard from "../../components/ui/ItemCard";
import { useAds } from "../../contexts/AdsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminApprove() {
  const { ads, approveAd, promoteAd } = useAds();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text>Acesso restrito</Text>
      </View>
    );
  }

  const pendingAds = ads.filter((ad) => ad.status === "PENDING");
  const paymentPendingAds = ads.filter(
    (ad) => ad.status === "PAYMENT_PENDING"
  );

  const confirmApprove = (id: string) => {
    Alert.alert(
      "Aprovar anúncio",
      "Deseja aprovar este anúncio e publicá-lo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprovar",
          style: "default",
          onPress: () => approveAd(id),
        },
      ]
    );
  };

  const confirmPayment = (id: string) => {
    Alert.alert(
      "Confirmar pagamento",
      "Deseja confirmar o pagamento e destacar este anúncio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "default",
          onPress: () => promoteAd(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>

      {/* ================== ANÚNCIOS PENDENTES ================== */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#F39C12" />
          <Text style={styles.sectionTitle}>Anúncios pendentes</Text>
        </View>

        {pendingAds.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum anúncio aguardando aprovação.
          </Text>
        ) : (
          <FlatList
            data={pendingAds}
            keyExtractor={(item) => item.id}
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

                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => confirmApprove(item.id)}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>Aprovar anúncio</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* ================== PAGAMENTOS ================== */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={20} color="#8E44AD" />
          <Text style={styles.sectionTitle}>Pagamentos em análise</Text>
        </View>

        {paymentPendingAds.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum pagamento aguardando confirmação.
          </Text>
        ) : (
          <FlatList
            data={paymentPendingAds}
            keyExtractor={(item) => item.id}
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

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => confirmPayment(item.id)}
                >
                  <Ionicons
                    name="star-outline"
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>
                    Confirmar pagamento
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
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
    fontWeight: "800",
    marginBottom: 12,
  },
  sectionBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    marginBottom: 16,
  },
  approveButton: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#8E44AD",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  empty: {
    fontSize: 14,
    color: "#777",
    marginVertical: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
