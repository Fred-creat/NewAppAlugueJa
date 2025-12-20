import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Order = "DEFAULT" | "PRICE_ASC" | "PRICE_DESC";

type Props = {
  value: Order;
  onChange: (order: Order) => void;
};

export default function SortSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          value === "PRICE_ASC" && styles.active,
        ]}
        onPress={() => onChange("PRICE_ASC")}
      >
        <Text
          style={[
            styles.text,
            value === "PRICE_ASC" && styles.activeText,
          ]}
        >
          Menor preço
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          value === "PRICE_DESC" && styles.active,
        ]}
        onPress={() => onChange("PRICE_DESC")}
      >
        <Text
          style={[
            styles.text,
            value === "PRICE_DESC" && styles.activeText,
          ]}
        >
          Maior preço
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EEE",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#2C6EFA",
  },
  text: {
    fontWeight: "600",
    color: "#333",
  },
  activeText: {
    color: "#FFF",
  },
});
