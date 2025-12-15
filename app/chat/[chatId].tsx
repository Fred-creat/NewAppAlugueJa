import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Chat() {
  const { chatId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Chat ID: {chatId}</Text>
    </View>
  );
}
