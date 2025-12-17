import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

export default function HapticTab({ children }) {
  return (
    <Pressable
      onPressIn={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
    >
      {children}
    </Pressable>
  );
}