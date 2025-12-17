import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAds } from "../contexts/AdsContext";
import { useAuth } from "../contexts/AuthContext";

export default function CreateAd() {
  const router = useRouter();
  const { addAd } = useAds();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const isValid =
    title.trim() &&
    price.trim() &&
    location.trim() &&
    beds.trim() &&
    baths.trim() &&
    description.trim() &&
    images.length > 0;

  /* ===== SELECIONAR IMAGENS ===== */
  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert("Limite atingido", "Você pode adicionar até 5 fotos.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às imagens.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selected].slice(0, 5));
    }
  };

  /* ===== REMOVER IMAGEM ===== */
  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = () => {
    if (!isValid || !user) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    addAd({
      userId: user.id,
      title,
      price,
      location,
      description,
      beds: Number(beds),
      baths: Number(baths),
      images,
    });

    Alert.alert(
      "Anúncio enviado",
      "Seu anúncio será analisado antes de ser publicado."
    );

    router.replace("/profile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar anúncio</Text>

      {/* IMAGENS */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        <Text style={styles.imageText}>
          Adicionar fotos ({images.length}/5)
        </Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((uri) => (
            <View key={uri} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(uri)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* CAMPOS */}
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Preço"
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="Localização"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        placeholder="Quartos"
        keyboardType="numeric"
        style={styles.input}
        value={beds}
        onChangeText={setBeds}
      />

      <TextInput
        placeholder="Banheiros"
        keyboardType="numeric"
        style={styles.input}
        value={baths}
        onChangeText={setBaths}
      />

      <TextInput
        placeholder="Descrição"
        multiline
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Publicar anúncio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4F6FA",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2C6EFA",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0B8FF",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  imagePicker: {
    height: 70,
    borderRadius: 14,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  imageText: {
    color: "#555",
    fontWeight: "600",
  },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF4D4D",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18,
  },
});
