import { createContext, useContext, useState } from "react";
export type Ad = {
  id: string;
  title: string;
  price: string;
  location: string;
  description: string;
  beds: number;
  baths: number;
  image: string; // 👈 imagem real (URI)
  isFeatured: boolean;
};

export type NewAd = Omit<Ad, "id" | "isFeatured">;


type AdsContextData = {
  ads: Ad[];
  addAd: (ad: NewAd) => void;
};

const AdsContext = createContext<AdsContextData>({} as AdsContextData);

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);

  const addAd = (adData: NewAd) => {
    const newAd: Ad = {
      id: Date.now().toString(),
      isFeatured: false,
      ...adData,
    };

    setAds((prev) => [newAd, ...prev]);
  };

  return (
    <AdsContext.Provider value={{ ads, addAd }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  return useContext(AdsContext);
}
