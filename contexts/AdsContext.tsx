import { createContext, useContext, useState } from "react";

export type AdStatus = "PENDING" | "APPROVED";

export type Ad = {
  id: string;
  userId: string;

  title: string;
  description: string;
  price: string;
  location: string;

  beds: number;
  baths: number;
  images: string[];

   status: "PENDING" | "APPROVED";
  isFeatured: boolean;

  createdAt: number;
};

type NewAd = Omit<
  Ad,
  "id" | "status" | "isFeatured" | "createdAt"
>;

type AdsContextData = {
  ads: Ad[];
  addAd: (ad: NewAd) => void;
  approveAd: (adId: string) => void;
  promoteAd: (adId: string) => void;
};

const AdsContext = createContext<AdsContextData>(
  {} as AdsContextData
);

export function AdsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ads, setAds] = useState<Ad[]>([]);

  // Criar anúncio (sempre pendente)
  const addAd = (adData: NewAd) => {
    const newAd: Ad = {
      id: Date.now().toString(),
      userId: adData.userId,

      title: adData.title,
      description: adData.description,
      price: adData.price,
      location: adData.location,

      beds: adData.beds,
      baths: adData.baths,
      images: adData.images,

      status: "PENDING",
      isFeatured: false,
      createdAt: Date.now(),
    };

    setAds((prev) => [newAd, ...prev]);
  };

  // Aprovação (simulando admin por enquanto)
  const approveAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? { ...ad, status: "APPROVED" }
          : ad
      )
    );
  };

  // Promover anúncio (somente aprovado)
  const promoteAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "APPROVED"
          ? { ...ad, isFeatured: true }
          : ad
      )
    );
  };

  return (
    <AdsContext.Provider
      value={{ ads, addAd, approveAd, promoteAd }}
    >
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  return useContext(AdsContext);
}
