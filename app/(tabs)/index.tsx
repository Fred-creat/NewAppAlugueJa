import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import SearchBar from "../../components/ui/SearchBar";
import CategorySelector from "../../components/ui/CategorySelector";
import ItemCard from "../../components/ui/ItemCard";
import { useAuth } from "../../contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER ADAPTADO */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>
            {user ? `Olá, ${user.name}` : "Bem-vindo!"}
          </Text>

          <Text style={styles.headerSubtitle}>
            {user
              ? "Encontre oportunidades na sua região"
              : "Encontre seu imóvel ideal"}
          </Text>
        </View>

        {/* Botões SOMENTE se NÃO estiver logado */}
        {!user && (
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.buttonSecondaryText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => router.push("/auth/register")}
            >
              <Text style={styles.buttonPrimaryText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* CTA – Criar anúncio (somente logado) */}
{user && (
  <TouchableOpacity
    style={styles.createAdButton}
    onPress={() => router.push("/create-ad")}
  >
    <Text style={styles.createAdText}>+ Criar anúncio</Text>
  </TouchableOpacity>
)}


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

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 25,
    marginTop: 40,
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

  createAdButton: {
  backgroundColor: "#2C6EFA",
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: "center",
  marginBottom: 16,
},
createAdText: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "700",
},

});
