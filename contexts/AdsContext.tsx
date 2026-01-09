import {
  createContext,
  useContext,
  useState,
} from "react";
import api from "../services/api";

/* ================== TYPES ================== */

export type AdStatus =
  | "PENDING"
  | "APPROVED"
  | "PAYMENT_PENDING"
  | "REJECTED";

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

  loading: boolean;
  error: string | null;

  loadPublicAds: () => Promise<void>;
  loadMyAds: () => Promise<void>;
  loadPendingAds: () => Promise<void>;

  resetAds: () => void;

  createAd: (ad: NewAd) => Promise<void>;
  approveAd: (adId: string) => Promise<void>;
  requestPromotion: (adId: string) => Promise<void>;
  confirmPayment: (adId: string) => Promise<void>;
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
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [pendingAds, setPendingAds] = useState<Ad[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================== MAPPER ================== */

  function mapAds(data: any[]): Ad[] {
    return data.map((item) => ({
      id: item.id,
      userId: item.ownerId,

      title: item.title,
      description: item.description,
      price: Number(item.price),

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
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/properties");
      setAds(mapAds(res.data));
    } catch {
      setAds([]);
      setError("Erro ao carregar anúncios públicos");
    } finally {
      setLoading(false);
    }
  }

  async function loadMyAds() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/properties/me");
      setMyAds(mapAds(res.data));
    } catch {
      setMyAds([]);
      setError("Erro ao carregar meus anúncios");
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingAds() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/properties/admin/pending");
      setPendingAds(mapAds(res.data));
    } catch {
      setPendingAds([]);
      setError("Erro ao carregar anúncios pendentes");
    } finally {
      setLoading(false);
    }
  }

  /* ================== ACTIONS ================== */

  async function createAd(ad: NewAd) {
    setLoading(true);
    setError(null);

    try {
      await api.post("/properties", ad);
      await loadMyAds();
    } catch {
      setError("Erro ao criar anúncio");
    } finally {
      setLoading(false);
    }
  }

  async function approveAd(adId: string) {
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/properties/admin/${adId}/approve`);

      await Promise.all([
        loadPendingAds(),
        loadPublicAds(),
        loadMyAds(),
      ]);
    } catch {
      setError("Erro ao aprovar anúncio");
    } finally {
      setLoading(false);
    }
  }

  async function requestPromotion(adId: string) {
    setLoading(true);
    setError(null);

    try {
      await api.patch(
        `/properties/${adId}/request-promotion`
      );

      await Promise.all([
        loadMyAds(),
        loadPendingAds(),
      ]);
    } catch {
      setError("Erro ao solicitar destaque");
    } finally {
      setLoading(false);
    }
  }

  async function confirmPayment(adId: string) {
    setLoading(true);
    setError(null);

    try {
      await api.patch(
        `/properties/admin/${adId}/confirm-payment`
      );

      await Promise.all([
        loadPendingAds(),
        loadPublicAds(),
        loadMyAds(),
      ]);
    } catch {
      setError("Erro ao confirmar pagamento");
    } finally {
      setLoading(false);
    }
  }

  /* ================== RESET (LOGOUT) ================== */

  function resetAds() {
    setAds([]);
    setMyAds([]);
    setPendingAds([]);
    setError(null);
  }

  /* ================== PROVIDER ================== */

  return (
    <AdsContext.Provider
      value={{
        ads,
        myAds,
        pendingAds,
        loading,
        error,
        loadPublicAds,
        loadMyAds,
        loadPendingAds,
        resetAds,
        createAd,
        approveAd,
        requestPromotion,
        confirmPayment,
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
