import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (min: number | null, max: number | null) => void;
};

export default function PriceRange({
  minPrice,
  maxPrice,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preço</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="Mínimo"
          keyboardType="numeric"
          value={minPrice?.toString() ?? ""}
          onChangeText={(v) =>
            onChange(v ? Number(v) : null, maxPrice)
          }
          style={styles.input}
        />

        <TextInput
          placeholder="Máximo"
          keyboardType="numeric"
          value={maxPrice?.toString() ?? ""}
          onChangeText={(v) =>
            onChange(minPrice, v ? Number(v) : null)
          }
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 12,
  },
});
