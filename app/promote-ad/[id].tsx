import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAds } from "../../contexts/AdsContext";

const PICPAY_LINK = "https://picpay.me/685b29af-a0b5-46f7-b561-b48f4d5241cf";

export default function PromoteAd() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { ads, requestPromotion } = useAds();

  const ad = ads.find((a) => a.id === id);

  if (!ad) {
    return (
      <View style={styles.center}>
        <Text>Anúncio não encontrado</Text>
      </View>
    );
  }

  const handlePay = () => {
    Linking.openURL(PICPAY_LINK);
  };

  const handleConfirmPayment = () => {
    requestPromotion(ad.id);

    Alert.alert(
      "Pagamento em análise",
      "Recebemos sua solicitação. Assim que o pagamento for confirmado, seu anúncio será destacado."
    );

    router.replace("/my-ads");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destaque seu anúncio</Text>

      <Text style={styles.text}>
        Seu anúncio ficará em destaque por 7 dias, aparecendo no topo da lista.
      </Text>

      <View style={styles.box}>
        <Text style={styles.price}>R$ 19,90</Text>
        <Text style={styles.subtext}>Pagamento via PicPay</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payText}>Pagar com PicPay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPayment}
      >
        <Text style={styles.confirmText}>Já paguei</Text>
      </TouchableOpacity>

      <Text style={styles.warning}>
        O destaque será ativado após confirmação manual do pagamento.
      </Text>
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2C6EFA",
  },
  subtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  payButton: {
    backgroundColor: "#21C25E",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  payText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#2C6EFA",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  warning: {
    marginTop: 16,
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
