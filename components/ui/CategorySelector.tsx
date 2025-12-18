import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CATEGORIES = [
  { label: "Todos", value: "ALL" },
  { label: "Casas", value: "CASAS" },
  { label: "Apartamentos", value: "APARTAMENTO" },
  { label: "Pousadas", value: "POUSADA" },
  { label: "Lanchas", value: "LANCHA" },
  { label: "Ferramentas", value: "FERRAMENTA" },
];

type Props = {
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategorySelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;

        return (
          <TouchableOpacity
            key={cat.value}
            style={[styles.button, isActive && styles.active]}
            onPress={() => onSelect(cat.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    marginBottom: 6,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    marginRight: 8,
    marginBottom: 8,
  },
  active: {
    backgroundColor: "#2C6EFA",
  },
  text: {
    color: "#555",
    fontWeight: "600",
  },
  activeText: {
    color: "#FFF",
  },
});
