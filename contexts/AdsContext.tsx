import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================== TYPES ================== */

export type AdStatus =
  | "PENDING"
  | "APPROVED"
  | "PAYMENT_PENDING";

/* ✅ CATEGORIAS SUPORTADAS */
export type Category =
  | "CASAS"
  | "APARTAMENTOS"
  | "POUSADAS"
  | "KITNETS"
  | "TERRENOS"
  | "LANCHAS"
  | "FERRAMENTAS";

export type Ad = {
  id: string;
  userId: string;

  title: string;
  description: string;
  price: string;
  location: string;
  category: Category;

  beds: number;
  baths: number;
  images: string[];
  contactPhone: string;

  status: AdStatus;
  isFeatured: boolean;

  createdAt: number;
};

/* 🔐 Payload de criação */
type NewAd = {
  userId: string;
  title: string;
  description: string;
  price: string;
  location: string;
  category: Category;

  beds: number;
  baths: number;
  images: string[];
  contactPhone: string;
};

type AdsContextData = {
  ads: Ad[];
  addAd: (ad: NewAd) => void;
  approveAd: (adId: string) => void;
  requestPromotion: (adId: string) => void;
  promoteAd: (adId: string) => void;
};

/* ================== CONTEXT ================== */

const AdsContext = createContext<AdsContextData>(
  {} as AdsContextData
);

/* ================== PROVIDER ================== */

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loaded, setLoaded] = useState(false);

  const STORAGE_KEY = "@alugueja:ads";

  /* 🔄 Load + MIGRAÇÃO */
  useEffect(() => {
    async function loadAds() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed: Ad[] = JSON.parse(stored);

          // 🔁 Migração: anúncios antigos sem categoria
          const migrated = parsed.map((ad) => ({
            ...ad,
            category: ad.category ?? "CASA",
          }));

          setAds(migrated);
        }
      } catch (e) {
        console.log("Erro ao carregar anúncios", e);
      } finally {
        setLoaded(true);
      }
    }

    loadAds();
  }, []);

  /* 💾 Persist */
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    }
  }, [ads, loaded]);

  /* ➕ Criar anúncio */
  const addAd = (adData: NewAd) => {
    const newAd: Ad = {
      id: Date.now().toString(),
      userId: adData.userId,

      title: adData.title,
      description: adData.description,
      price: adData.price,
      location: adData.location,
      category: adData.category,

      beds: adData.beds,
      baths: adData.baths,
      images: adData.images,
      contactPhone: adData.contactPhone,

      status: "PENDING",
      isFeatured: false,
      createdAt: Date.now(),
    };

    setAds((prev) => [newAd, ...prev]);
  };

  /* ✅ Admin aprova */
  const approveAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId ? { ...ad, status: "APPROVED" } : ad
      )
    );
  };

  /* 💳 Solicita destaque */
  const requestPromotion = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "APPROVED"
          ? { ...ad, status: "PAYMENT_PENDING" }
          : ad
      )
    );
  };

  /* ⭐ Confirma pagamento */
  const promoteAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "PAYMENT_PENDING"
          ? { ...ad, isFeatured: true, status: "APPROVED" }
          : ad
      )
    );
  };

  return (
    <AdsContext.Provider
      value={{
        ads,
        addAd,
        approveAd,
        requestPromotion,
        promoteAd,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
}

/* ================== HOOK ================== */

export function useAds() {
  return useContext(AdsContext);
}
