import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HapticTab from "@/components/ui/haptic/tab";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();

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

      {/* FAVORITOS — somente logado */}
      {user && (
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
        />
      )}

      {/* PERFIL — somente logado */}
      {user && (
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
        />
      )}
    </Tabs>
  );
}
