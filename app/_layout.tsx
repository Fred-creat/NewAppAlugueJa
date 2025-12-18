import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AdsProvider } from "../contexts/AdsContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AdsProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </AdsProvider>
    </AuthProvider>
  );
}
