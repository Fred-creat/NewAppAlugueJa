import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ItemCardProps = {
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  onPress?: () => void;
  isFeatured?: boolean;
};

function ItemCard({
  title,
  price,
  location,
  image,
  beds,
  baths,
  onPress,
  isFeatured = false,
}: ItemCardProps) {
  const imageUri =
    image && image.length > 0
      ? image
      : "https://via.placeholder.com/400x300?text=Sem+imagem";

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#eee" }}
      style={({ pressed }) => [
        styles.card,
        isFeatured && styles.featuredCard,
        pressed && { opacity: 0.96 },
      ]}
    >
      <Image source={{ uri: imageUri }} style={styles.image} />

      {isFeatured && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DESTAQUE</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            🛏 {beds} • 🚿 {baths}
          </Text>

          <Text style={styles.price}>R$ {price}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(ItemCard);

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: "#2C6EFA",
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#EEE",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#2C6EFA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C6EFA",
  },
});
