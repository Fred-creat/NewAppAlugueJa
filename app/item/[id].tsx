import { Linking } from "react-native";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


const openWhatsApp = (phone: string, title: string) => {
  const message = `Olá! Tenho interesse no imóvel "${title}" que vi no AlugueJá.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
};

const MOCK_ITEMS = [
  {
    id: "1",
    title: "Casa Vista Mar",
    price: "4.500",
    location: "Morro de São Paulo",
    image: "https://picsum.photos/600/400?random=1",
    beds: 3,
    baths: 2,
    description:
      "Casa ampla com vista para o mar, ideal para temporada ou moradia. Próxima à praia e ao centro.",
    phone: "55999999999",
  },
  {
    id: "2",
    title: "Apartamento Moderno",
    price: "2.800",
    location: "Centro da Cidade",
    image: "https://picsum.photos/600/400?random=2",
    beds: 2,
    baths: 1,
    description:
      "Apartamento moderno, bem localizado, próximo a comércios e transporte público.",
    phone: "55888888888",
  },
];

export default function ItemDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const item = MOCK_ITEMS.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Item não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>R$ {item.price} / mês</Text>
      <Text style={styles.location}>{item.location}</Text>

      <View style={styles.infoRow}>
        <Text>{item.beds} quartos</Text>
        <Text>{item.baths} banheiros</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
<TouchableOpacity
  style={styles.contactButton}
  onPress={() => openWhatsApp(item.phone, item.title)}
>
  <Text style={styles.contactButtonText}>Falar com anunciante</Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C6EFA",
    marginBottom: 4,
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
