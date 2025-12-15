import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useAds } from "../contexts/AdsContext";
import ItemCard from "../components/ui/ItemCard";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MyAds() {
    const { user } = useAuth();
    const { ads } = useAds();
    const router = useRouter();

    if (!user) {
        return (
            <View style={styles.center}>
                <Text>Faça login para gerenciar seus anúncios</Text>
            </View>
        );
    }

    if (ads.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="home-outline" size={64} color="#999" />
                <Text style={styles.emptyTitle}>Nenhum anúncio criado</Text>
                <Text style={styles.emptyText}>
                    Crie seu primeiro anúncio e comece a receber contatos
                </Text>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push("/create-ad")}
                >
                    <Text style={styles.createButtonText}>Criar anúncio</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus anúncios</Text>

            <FlatList
                data={ads}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View>
                        <ItemCard
                            title={item.title}
                            price={item.price}
                            location={item.location}
                            image={item.image} // URI real
                            beds={item.beds}
                            baths={item.baths}
                            isFeatured={item.isFeatured}
                            onPress={() => router.push(`/item/${item.id}`)}
/>


                        {!item.isFeatured && (
                            <TouchableOpacity
                                style={styles.promoteButton}
                                onPress={() => alert("Promover anúncio (Destaque)")}
                            >
                                <Ionicons name="star-outline" size={18} color="#2C6EFA" />
                                <Text style={styles.promoteText}>Promover anúncio</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FA",
        padding: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 12,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    promoteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAF0FF",
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: -8,
        marginBottom: 16,
        gap: 6,
    },
    promoteText: {
        color: "#2C6EFA",
        fontWeight: "700",
    },

    createButton: {
        marginTop: 20,
        backgroundColor: "#2C6EFA",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 14,
    },
    createButtonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },

});
