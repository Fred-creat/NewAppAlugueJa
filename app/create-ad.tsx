import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAds } from "../contexts/AdsContext";

export default function CreateAd() {
  const router = useRouter();
  const { addAd } = useAds();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const isValid =
    title.trim() &&
    price.trim() &&
    location.trim() &&
    beds.trim() &&
    baths.trim() &&
    description.trim() &&
    image;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às imagens.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    addAd({
      title,
      price,
      location,
      description,
      beds: Number(beds),
      baths: Number(baths),
      image: image!,
    });

    Alert.alert("Sucesso", "Anúncio criado com sucesso!");
    router.replace("/profile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar anúncio</Text>

      {/* IMAGEM */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Selecionar imagem</Text>
        )}
      </TouchableOpacity>

      <TextInput placeholder="Título" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Preço" keyboardType="numeric" style={styles.input} value={price} onChangeText={setPrice} />
      <TextInput placeholder="Localização" style={styles.input} value={location} onChangeText={setLocation} />

      <TextInput placeholder="Quartos" keyboardType="numeric" style={styles.input} value={beds} onChangeText={setBeds} />
      <TextInput placeholder="Banheiros" keyboardType="numeric" style={styles.input} value={baths} onChangeText={setBaths} />

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
  height: 180,
  borderRadius: 16,
  backgroundColor: "#EAEAEA",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
},
imageText: {
  color: "#555",
  fontWeight: "600",
},
imagePreview: {
  width: "100%",
  height: "100%",
  borderRadius: 16,
},

});
