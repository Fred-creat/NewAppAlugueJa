import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function FilterModal({ visible, onClose }) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedType, setSelectedType] = useState(null);

  const propertyTypes = ["Apartamento", "Casa", "Comercial", "Terreno"];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Tipo de Imóvel */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Imóvel</Text>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={styles.checkbox}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      selectedType === type && styles.checkboxBoxChecked,
                    ]}
                  >
                    {selectedType === type && (
                      <Ionicons name="checkmark" size={16} color="#2C6EFA" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Preço */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preço (R$)</Text>
              <View style={styles.priceRange}>
                <Text style={styles.priceText}>R$ {priceRange[0]}</Text>
                <Text style={styles.separator}>-</Text>
                <Text style={styles.priceText}>R$ {priceRange[1]}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonSecondaryText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.buttonPrimary}
            >
              <Text style={styles.buttonPrimaryText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
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
    color: "#333",
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
    borderColor: "#E0E0E0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#F0F5FF",
    borderColor: "#2C6EFA",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  separator: {
    marginHorizontal: 8,
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2C6EFA",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#2C6EFA",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2C6EFA",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});