import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function LocationFilter({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cidade ou bairro"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 12,
  },
});
