import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import SearchBar from "../../components/ui/SearchBar";
import CategorySelector from "../../components/ui/CategorySelector";
import ItemCard from "../../components/ui/ItemCard";

export default function Index() {
  const router = useRouter();

  const featuredProperties = [
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
      id: 2,
      title: "Apartamento Moderno",
      price: "2.800",
      location: "Centro da Cidade",
      image: "https://picsum.photos/400/300?random=2",
      beds: 2,
      baths: 1,
      isFeatured: false,
    },
    {
      id: 3,
      title: "Cobertura Luxo",
      price: "6.200",
      location: "Praia Grande",
      image: "https://picsum.photos/400/300?random=3",
      beds: 4,
      baths: 3,
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

  const sortedProperties = [...featuredProperties].sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
  );

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Bem-vindo!</Text>
          <Text style={styles.headerSubtitle}>Encontre seu imóvel ideal</Text>
        </View>

        {/* Auth buttons */}
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push("/auth/login")}
            accessibilityLabel="Entrar"
          >
            <Text style={styles.buttonSecondaryText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push("/auth/register")}
            accessibilityLabel="Criar Conta"
          >
            <Text style={styles.buttonPrimaryText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Selector */}
      <CategorySelector />

      {/* Featured Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>✨ Destaques</Text>
      </View>

      {/* Property Cards */}
      {sortedProperties.map((property) => (
        <ItemCard
          key={property.id}
          {...property}
          onPress={() => router.push(`/item/${property.id}`)}
          isFeatured={property.isFeatured}
        />
      ))}

      {/* Footer Spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerContainer: {
    marginBottom: 12,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  authButtons: {
    flexDirection: "row",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#2C6EFA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  buttonPrimaryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#2C6EFA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: {
    color: "#2C6EFA",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});
