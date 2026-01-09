import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ItemCard from "../../components/ui/ItemCard";
import { useAds } from "../../contexts/AdsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminApprove() {
  const {
    pendingAds,
    loadPendingAds,
    approveAd,
    confirmPayment,
  } = useAds();

  const { isAdmin, loading } = useAuth();
  const [processingId, setProcessingId] = useState<
    string | null
  >(null);

  /* ================== LOAD (FOCUS SAFE) ================== */
  useFocusEffect(
    useCallback(() => {
      if (isAdmin) {
        loadPendingAds();
      }
    }, [isAdmin])
  );

  /* ================== GUARD ================== */

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text>Acesso restrito</Text>
      </View>
    );
  }

  /* ================== DERIVED LISTS ================== */

  const approvalPendingAds = pendingAds.filter(
    (ad) => ad.status === "PENDING"
  );

  const paymentPendingAds = pendingAds.filter(
    (ad) => ad.status === "PAYMENT_PENDING"
  );

  /* ================== ACTIONS ================== */

  const handleApprove = (adId: string) => {
    Alert.alert(
      "Aprovar anúncio",
      "Deseja aprovar este anúncio e publicá-lo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprovar",
          onPress: async () => {
            setProcessingId(adId);
            await approveAd(adId);
            setProcessingId(null);
          },
        },
      ]
    );
  };

  const handleConfirmPayment = (adId: string) => {
    Alert.alert(
      "Confirmar pagamento",
      "Confirmar pagamento e ativar destaque?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setProcessingId(adId);
            await confirmPayment(adId);
            setProcessingId(null);
          },
        },
      ]
    );
  };

  /* ================== RENDER LIST ================== */

  function renderAd(
    item: any,
    action: () => void,
    label: string,
    color: string,
    icon: any
  ) {
    const disabled = processingId === item.id;

    return (
      <View style={styles.card}>
        <ItemCard
          title={item.title}
          price={item.price}
          image={item.images?.[0]}
        />

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: color, opacity: disabled ? 0.6 : 1 },
          ]}
          disabled={disabled}
          onPress={action}
        >
          <Ionicons name={icon} size={18} color="#FFF" />
          <Text style={styles.buttonText}>
            {disabled ? "Processando..." : label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================== RENDER ================== */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>

      {/* ===== APROVAÇÕES ===== */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="time-outline"
            size={20}
            color="#F39C12"
          />
          <Text style={styles.sectionTitle}>
            Anúncios pendentes
          </Text>
        </View>

        {approvalPendingAds.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum anúncio aguardando aprovação.
          </Text>
        ) : (
          <FlatList
            data={approvalPendingAds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              renderAd(
                item,
                () => handleApprove(item.id),
                "Aprovar anúncio",
                "#2ECC71",
                "checkmark-circle-outline"
              )
            }
          />
        )}
      </View>

      {/* ===== PAGAMENTOS ===== */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="card-outline"
            size={20}
            color="#8E44AD"
          />
          <Text style={styles.sectionTitle}>
            Pagamentos em análise
          </Text>
        </View>

        {paymentPendingAds.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum pagamento aguardando confirmação.
          </Text>
        ) : (
          <FlatList
            data={paymentPendingAds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              renderAd(
                item,
                () => handleConfirmPayment(item.id),
                "Confirmar pagamento",
                "#8E44AD",
                "star-outline"
              )
            }
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
    marginTop: 40,
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
  actionButton: {
    flexDirection: "row",
    gap: 6,
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
