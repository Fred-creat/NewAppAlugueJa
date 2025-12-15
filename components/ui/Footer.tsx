import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function Footer() {
  const path = usePathname();

  function Tab({ icon, route }) {
    const active = path === route;

    return (
      <TouchableOpacity onPress={() => router.push(route)}>
        <Ionicons
          name={icon}
          size={28}
          color={active ? "#2C6EFA" : "#888"}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderColor: "#EEE",
      }}
    >
      <Tab icon="home" route="/" />
      <Tab icon="heart" route="/favorites" />
      <Tab icon="map" route="/map" />
      <Tab icon="chatbubbles" route="/chat/1" />
      <Tab icon="person" route="/profile" />
    </View>
  );
}
