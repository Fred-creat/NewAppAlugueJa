import { useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAds } from "../../contexts/AdsContext";
import { openWhatsApp } from "../../utils/openWhatsApp";

/* ================== WHATSAPP ================== */


export default function ItemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ads } = useAds();

  const ad = ads.find((item) => item.id === id);

  if (!ad) {
    return (
      <View style={styles.center}>
        <Text>Anúncio não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: ad.images[0] }}
        style={styles.image}
      />

      <Text style={styles.title}>{ad.title}</Text>

      <Text style={styles.price}>R$ {ad.price}</Text>

      <Text style={styles.location}>{ad.location}</Text>

      <View style={styles.infoRow}>
        <Text>{ad.beds} quartos</Text>
        <Text>{ad.baths} banheiros</Text>
      </View>

      <Text style={styles.description}>
        {ad.description}
      </Text>

      {/* CTA CONTATO */}
     <TouchableOpacity
  style={styles.contactButton}
  onPress={() =>
    openWhatsApp(ad.contactPhone, ad.title)
  }
>
  <Text style={styles.contactButtonText}>
    Falar com anunciante
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#EEE",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C6EFA",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: "#2C6EFA",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  contactButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
