import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

/* ================== TYPES ================== */

export type AdStatus =
  | "PENDING"
  | "APPROVED"
  | "PAYMENT_PENDING";

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
  price: number;
  location: string;
  category: Category;

  beds: number | null;
  baths: number | null;
  images: string[];
  contactPhone: string;

  status: AdStatus;
  isFeatured: boolean;

  createdAt: number;
};

type NewAd = {
  title: string;
  description: string;
  price: number;
  location: string;
  category: Category;

  beds: number | null;
  baths: number | null;
  images: string[];
  contactPhone: string;
};

type AdsContextData = {
  ads: Ad[];
  myAds: Ad[];
  pendingAds: Ad[];

  loadPublicAds: () => Promise<void>;
  loadMyAds: () => Promise<void>;
  loadPendingAds: () => Promise<void>;

  createAd: (ad: NewAd) => Promise<void>;
  approveAd: (adId: string) => Promise<void>;

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
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [pendingAds, setPendingAds] = useState<Ad[]>([]);

  /* ================== MAPPER ================== */

  function mapAds(data: any[]): Ad[] {
    return data.map((item) => ({
      id: item.id,
      userId: item.ownerId,

      title: item.title,
      description: item.description,
      price: item.price,
      location: item.location || "Indefinido",
      category: item.category as Category,

      beds: item.beds ?? null,
      baths: item.baths ?? null,
      images: item.images?.length
        ? item.images
        : ["https://via.placeholder.com/400"],

      contactPhone: item.contactPhone || "Não informado",

      status: item.status,
      isFeatured: item.isFeatured,

      createdAt: new Date(item.createdAt).getTime(),
    }));
  }

  /* ================== LOADERS ================== */

  async function loadPublicAds() {
    try {
      const res = await api.get("/properties");
      setAds(mapAds(res.data));
    } catch (error) {
      console.log("Erro ao carregar anúncios públicos");
    }
  }

  async function loadMyAds() {
    try {
      const res = await api.get("/properties/me");
      setMyAds(mapAds(res.data));
    } catch (error) {
      // ❗ NÃO quebrar app se usuário não estiver logado ainda
      console.log("Usuário sem anúncios ou não autenticado");
      setMyAds([]);
    }
  }
async function loadPendingAds() {
  try {
    const res = await api.get("/properties/admin/pending");
    setPendingAds(mapAds(res.data));
  } catch (error) {
    console.log("Sem acesso a anúncios pendentes");
    setPendingAds([]);
  }
}


  /* ================== EFFECT ================== */

  // 🔹 SOMENTE anúncios públicos carregam automaticamente
  useEffect(() => {
    loadPublicAds();
  }, []);

  /* ================== ACTIONS ================== */

  async function createAd(ad: NewAd) {
    try {
      await api.post("/properties", {
        title: ad.title,
        description: ad.description,
        price: ad.price,
        location: ad.location,
        category: ad.category,
        beds: ad.beds,
        baths: ad.baths,
        contactPhone: ad.contactPhone,
        images: ad.images,
      });

      await loadMyAds();
    } catch (error) {
      console.log("Erro ao criar anúncio");
      throw error;
    }
  }

  async function approveAd(adId: string) {
    try {
      await api.patch(`/properties/admin/${adId}/approve`);

      await Promise.all([
        loadPendingAds(),
        loadPublicAds(),
        loadMyAds(),
      ]);
    } catch (error) {
      console.log("Erro ao aprovar anúncio");
    }
  }

  /* ================== PROMOÇÃO (LOCAL) ================== */

  function requestPromotion(adId: string) {
    setMyAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "APPROVED"
          ? { ...ad, status: "PAYMENT_PENDING" }
          : ad
      )
    );
  }

  function promoteAd(adId: string) {
    setMyAds((prev) =>
      prev.map((ad) =>
        ad.id === adId && ad.status === "PAYMENT_PENDING"
          ? { ...ad, isFeatured: true, status: "APPROVED" }
          : ad
      )
    );
  }

  /* ================== PROVIDER ================== */

  return (
    <AdsContext.Provider
      value={{
        ads,
        myAds,
        pendingAds,
        loadPublicAds,
        loadMyAds,
        loadPendingAds,
        createAd,
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
