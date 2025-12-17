import HapticTab from "@/components/ui/haptic/tab";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <HapticTab>
              <Ionicons name="home-outline" size={size} color={color} />
            </HapticTab>
          ),
        }}
      />

      {/* FAVORITOS */}
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <HapticTab>
              <Ionicons name="heart-outline" size={size} color={color} />
            </HapticTab>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              Alert.alert(
                "Login necessário",
                "Faça login para acessar seus favoritos",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Entrar",
                    onPress: () => router.push("/auth/login"),
                  },
                ]
              );
            }
          },
        }}
      />

      {/* PERFIL */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <HapticTab>
              <Ionicons name="person-outline" size={size} color={color} />
            </HapticTab>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              router.push("/auth/login");
            }
          },
        }}
      />
    </Tabs>
  );
}
