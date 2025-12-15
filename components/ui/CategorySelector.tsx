import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

const categories = [
  "Todos",
  "Casas",
  "Apartamentos",
  "Pousadas",
  "Chalés",
  "Luxo",
];

export default function CategorySelector({ onSelect }) {
  const [active, setActive] = useState("Todos");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 15 }}
    >
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          onPress={() => {
            setActive(cat);
            onSelect && onSelect(cat);
          }}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 15,
            backgroundColor: active === cat ? "#2C6EFA" : "#EDEDED",
            borderRadius: 20,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: active === cat ? "#FFF" : "#555",
              fontWeight: "600",
            }}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
