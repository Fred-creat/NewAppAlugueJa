import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategorySelector from "../../components/ui/CategorySelector";
import ItemCard from "../../components/ui/ItemCard";
import SearchBar from "../../components/ui/SearchBar";
import { useAds } from "../../contexts/AdsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  const { ads } = useAds();
  const router = useRouter();

  // ✅ PADRÃO CORRETO
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  /* ✅ FILTRO FINAL (SEM BUG) */
  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => ad.status === "APPROVED")
      .filter((ad) => {
        if (selectedCategory === "ALL") return true;
        return ad.category === selectedCategory;
      })
      .filter((ad) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          ad.title.toLowerCase().includes(q) ||
          ad.location.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }, [ads, selectedCategory, search]);

  return (
    <FlatList
      data={filteredAds}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerTitle}>
                {user ? `Olá, ${user.name}` : "Bem-vindo!"}
              </Text>
              <Text style={styles.headerSubtitle}>
                Encontre seu imóvel ideal
              </Text>
            </View>

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

          {/* CTA */}
          {user && (
            <TouchableOpacity
              style={styles.createAdButton}
              onPress={() => router.push("/create-ad")}
            >
              <Text style={styles.createAdText}>+ Criar anúncio</Text>
            </TouchableOpacity>
          )}

          {/* SEARCH */}
          <SearchBar onSearch={setSearch} />

          {/* ✅ CATEGORIAS */}
          <CategorySelector
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>✨ Anúncios</Text>
          </View>

          {filteredAds.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum anúncio encontrado.
            </Text>
          )}
        </>
      }
      renderItem={({ item }) => (
        <ItemCard
          id={item.id}
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
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 20,
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
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 14,
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
