import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FilterModal, {
  FilterValues,
} from "../../components/ui/FilterModal";
import ItemCard from "../../components/ui/ItemCard";
import SearchBar from "../../components/ui/SearchBar";

import { useAds } from "../../contexts/AdsContext";
import { useAuth } from "../../contexts/AuthContext";

type OrderType = "DEFAULT" | "PRICE_ASC" | "PRICE_DESC";

const FILTER_STORAGE_KEY = "@alugueja:filters";

/* ================== MAPA SEMÂNTICO ================== */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  LANCHA: ["lancha", "barco", "jet", "iate", "embarcação"],
  CASA: ["casa", "imóvel", "residência"],
  APARTAMENTO: ["apartamento", "apto", "flat"],
  TERRENO: ["terreno", "lote"],
};

/* ================== ESTADO BASE ================== */
const DEFAULT_FILTERS: FilterValues = {
  category: "ALL",
  minPrice: null,
  maxPrice: null,
  location: "",
};

export default function Index() {
  const { user } = useAuth();
  const { ads } = useAds();
  const router = useRouter();

  const [filters, setFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<OrderType>("DEFAULT");
  const [filterVisible, setFilterVisible] = useState(false);

  /* ================== LOAD FILTROS ================== */
  useEffect(() => {
    async function loadFilters() {
      const stored = await AsyncStorage.getItem(
        FILTER_STORAGE_KEY
      );
      if (stored) {
        setFilters(JSON.parse(stored));
      }
    }
    loadFilters();
  }, []);

  /* ================== FILTRAGEM ================== */
  const filteredAds = useMemo(() => {
    let result = ads.filter(
      (ad) => ad.status === "APPROVED"
    );

    /* ===== CATEGORIA INTELIGENTE ===== */
    if (filters.category !== "ALL") {
      const keywords =
        CATEGORY_KEYWORDS[filters.category] || [];

      result = result.filter((ad) => {
        if (ad.category === filters.category) return true;

        const title = ad.title.toLowerCase();
        return keywords.some((k) =>
          title.includes(k)
        );
      });
    }

    /* ===== BUSCA GLOBAL ===== */
    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((ad) => {
        const text =
          `${ad.title} ${ad.location}`.toLowerCase();
        return text.includes(q);
      });
    }

    /* ===== PREÇO ===== */
    if (filters.minPrice !== null) {
      result = result.filter(
        (ad) => Number(ad.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== null) {
      result = result.filter(
        (ad) => Number(ad.price) <= filters.maxPrice!
      );
    }

    /* ===== DESTAQUES + ORDENAÇÃO ===== */
    const featured = result.filter(
      (ad) => ad.isFeatured
    );
    let normal = result.filter(
      (ad) => !ad.isFeatured
    );

    if (order === "PRICE_ASC") {
      normal = [...normal].sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (order === "PRICE_DESC") {
      normal = [...normal].sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return [...featured, ...normal];
  }, [ads, filters, search, order]);

  /* ================== LIMPAR ================== */
  const clearFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setOrder("DEFAULT");
    await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
  };

  return (
    <>
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
                  {user
                    ? `Olá, ${user.name}`
                    : "Bem-vindo!"}
                </Text>
                <Text style={styles.headerSubtitle}>
                  Encontre seu imóvel ideal
                </Text>
              </View>

              {!user && (
                <View style={styles.authButtons}>
                  <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() =>
                      router.push("/auth/login")
                    }
                  >
                    <Text
                      style={styles.buttonSecondaryText}
                    >
                      Entrar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() =>
                      router.push("/auth/register")
                    }
                  >
                    <Text
                      style={styles.buttonPrimaryText}
                    >
                      Criar Conta
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* CTA */}
            {user && (
              <TouchableOpacity
                style={styles.createAdButton}
                onPress={() =>
                  router.push("/create-ad")
                }
              >
                <Text style={styles.createAdText}>
                  + Criar anúncio
                </Text>
              </TouchableOpacity>
            )}

            {/* SEARCH */}
            <SearchBar onSearch={setSearch} />

            {/* FILTROS */}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color="#2C6EFA"
              />
              <Text style={styles.filterButtonText}>
                Filtros avançados
              </Text>
            </TouchableOpacity>

            {/* ORDENAÇÃO */}
            <View style={styles.orderRow}>
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  order === "PRICE_ASC" &&
                    styles.orderActive,
                ]}
                onPress={() =>
                  setOrder("PRICE_ASC")
                }
              >
                <Text style={styles.orderText}>
                  Menor preço
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.orderButton,
                  order === "PRICE_DESC" &&
                    styles.orderActive,
                ]}
                onPress={() =>
                  setOrder("PRICE_DESC")
                }
              >
                <Text style={styles.orderText}>
                  Maior preço
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                ✨ Anúncios
              </Text>
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
            onPress={() =>
              router.push(`/item/${item.id}`)
            }
          />
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />

      <FilterModal
        visible={filterVisible}
        filters={filters}
        onApply={async (newFilters) => {
          setFilters(newFilters);
          await AsyncStorage.setItem(
            FILTER_STORAGE_KEY,
            JSON.stringify(newFilters)
          );
        }}
        onClear={clearFilters}
        onClose={() => setFilterVisible(false)}
      />
    </>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  authButtons: {
    flexDirection: "row",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#2C6EFA",
    padding: 10,
    borderRadius: 10,
  },
  buttonPrimaryText: {
    color: "#FFF",
    fontWeight: "700",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#2C6EFA",
    padding: 10,
    borderRadius: 10,
  },
  buttonSecondaryText: {
    color: "#2C6EFA",
    fontWeight: "700",
  },
  createAdButton: {
    backgroundColor: "#2C6EFA",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  createAdText: {
    color: "#FFF",
    fontWeight: "700",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonText: {
    color: "#2C6EFA",
    fontWeight: "700",
  },
  orderRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  orderButton: {
    flex: 1,
    backgroundColor: "#EEE",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  orderActive: {
    backgroundColor: "#2C6EFA",
  },
  orderText: {
    fontWeight: "700",
    color: "#333",
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});
