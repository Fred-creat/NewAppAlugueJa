import { Image, ScrollView, } from "react-native";

export default function PhotoCarousel({ images = [] }) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ width: "100%" }}
    >
      {images.map((img, index) => (
        <Image
          key={index}
          source={{ uri: img }}
          style={{ width: 350, height: 230, borderRadius: 12, marginRight: 10 }}
        />
      ))}
    </ScrollView>
  );
}
