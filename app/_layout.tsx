import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { AdsProvider } from "../contexts/AdsContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <AdsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AdsProvider>
    </AuthProvider>
  );
}
