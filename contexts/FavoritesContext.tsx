import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type Favorite = {
  adId: string;
  userId: string;
};

type FavoritesContextData = {
  favorites: Favorite[];
  toggleFavorite: (adId: string, userId: string) => void;
  isFavorite: (adId: string, userId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextData>(
  {} as FavoritesContextData
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const STORAGE_KEY = "@alugueja:favorites";
  const [loaded, setLoaded] = useState(false);

  /* 🔄 Load */
  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
      setLoaded(true);
    }
    load();
  }, []);

  /* 💾 Persist */
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, loaded]);

  const toggleFavorite = (adId: string, userId: string) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.adId === adId && f.userId === userId
      );

      if (exists) {
        return prev.filter(
          (f) => !(f.adId === adId && f.userId === userId)
        );
      }

      return [...prev, { adId, userId }];
    });
  };

  const isFavorite = (adId: string, userId: string) => {
    return favorites.some(
      (f) => f.adId === adId && f.userId === userId
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
