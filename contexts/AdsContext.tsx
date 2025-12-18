import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================== TYPES ================== */

export type AdStatus =
  | "PENDING"           // Criado, aguardando aprovação
  | "APPROVED"          // Aprovado para aparecer
  | "PAYMENT_PENDING";  // Pagamento em análise

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

  status: AdStatus;
  isFeatured: boolean;

  createdAt: number;
};

/* 🔐 Tipagem segura para criação */
type NewAd = {
  userId: string;
  title: string;
  description: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  images: string[];
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

export function AdsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loaded, setLoaded] = useState(false);

  const STORAGE_KEY = "@alugueja:ads";

  /* 🔄 Carregar anúncios salvos */
  useEffect(() => {
    async function loadAds() {
      try {
        const storedAds = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedAds) {
          setAds(JSON.parse(storedAds));
        }
      } catch (error) {
        console.log("Erro ao carregar anúncios", error);
      } finally {
        setLoaded(true);
      }
    }
    loadAds();
  }, []);

  /* 💾 Persistir anúncios (após carregar) */
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    }
  }, [ads, loaded]);

  /* Criar anúncio (sempre pendente) */
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

  /* Admin aprova anúncio */
  const approveAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? { ...ad, status: "APPROVED" }
          : ad
      )
    );
  };

  /* Usuário solicita destaque (pagamento enviado) */
  const requestPromotion = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "APPROVED"
          ? { ...ad, status: "PAYMENT_PENDING" }
          : ad
      )
    );
  };

  /* Admin confirma pagamento → destaque */
  const promoteAd = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "PAYMENT_PENDING"
          ? {
              ...ad,
              isFeatured: true,
              status: "APPROVED",
            }
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
