import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "./Button";
import LocationFilter from "./LocationFilter";
import PriceRange from "./PriceRange";

/* ================== TYPES ================== */

export type FilterValues = {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  location: string;
};

type Props = {
  visible: boolean;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  onClose: () => void;
};

/* ================== CONSTANTS ================== */

const PROPERTY_TYPES = [
  { label: "Todos", value: "ALL" },
  { label: "Casa", value: "CASA" },
  { label: "Apartamento", value: "APARTAMENTO" },
  { label: "Pousada", value: "POUSADA" },
  { label: "Lancha", value: "LANCHA" },
  { label: "Ferramenta", value: "FERRAMENTA" },
];

/* ================== COMPONENT ================== */

export default function FilterModal({
  visible,
  filters,
  onApply,
  onClear,
  onClose,
}: Props) {
  /* ===== Estado local do modal ===== */
  const [localFilters, setLocalFilters] =
    useState<FilterValues>(filters);

  /* Sempre que abrir, sincroniza com o estado global */
  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared: FilterValues = {
      category: "ALL",
      minPrice: null,
      maxPrice: null,
      location: "",
    };

    setLocalFilters(cleared);
    onClear();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* CATEGORIA */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categoria</Text>

              {PROPERTY_TYPES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.checkbox}
                  onPress={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      category: item.value,
                    }))
                  }
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      localFilters.category === item.value &&
                        styles.checkboxBoxChecked,
                    ]}
                  >
                    {localFilters.category === item.value && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#2C6EFA"
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* LOCALIZAÇÃO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Localização
              </Text>

              <LocationFilter
                value={localFilters.location}
                onChange={(text) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    location: text,
                  }))
                }
              />
            </View>

            {/* PREÇO */}
            <PriceRange
              minPrice={localFilters.minPrice}
              maxPrice={localFilters.maxPrice}
              onChange={(min, max) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  minPrice: min,
                  maxPrice: max,
                }))
              }
            />
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Button
              title="Limpar"
              variant="secondary"
              onPress={handleClear}
            />

            <Button
              title="Aplicar filtros"
              onPress={handleApply}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#DDD",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    borderColor: "#2C6EFA",
    backgroundColor: "#F0F5FF",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});
