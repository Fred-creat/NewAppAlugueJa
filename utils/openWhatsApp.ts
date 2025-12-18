import { Linking } from "react-native";

export function openWhatsApp(phone: string, title: string) {
  const message = `Olá! Tenho interesse no imóvel "${title}" que vi no AlugueJá.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
}
