import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  title,
  onPress,
  variant = "primary",
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C6EFA",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  secondary: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#2C6EFA",
  },
  text: {
    color: "#FFF",
    fontWeight: "700",
  },
  secondaryText: {
    color: "#2C6EFA",
  },
});
