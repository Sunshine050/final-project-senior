import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme, useThemedStyles } from "../../src/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { getNearbyEmergencyPlaces } from "../../src/api/emergency";

interface EmergencyItem {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  type: "hospital" | "police" | "fire" | "rescue";
  distance?: number;
  latitude: number;
  longitude: number;
}

const TYPE_CONFIG = {
  hospital: { title: "โรงพยาบาล", icon: "local-hospital", color: "#e91e63" },
  police: { title: "ตำรวจ", icon: "local-police", color: "#2196f3" },
  fire: { title: "ดับเพลิง", icon: "fire-extinguisher", color: "#ff5722" },
  rescue: { title: "กู้ภัย", icon: "health-and-safety", color: "#4caf50" },
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [places, setPlaces] = useState<EmergencyItem[]>([]);
  const [filtered, setFiltered] = useState<EmergencyItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const data = await getNearbyEmergencyPlaces(loc.coords.latitude, loc.coords.longitude);
      setPlaces(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(places.filter(p => p.name.toLowerCase().includes(q) || (p.address || "").toLowerCase().includes(q)));
  }, [search, places]);

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingTop: 50,
      padding: 20,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center" },
    subtitle: { fontSize: 16, color: "#fff", opacity: 0.9, textAlign: "center", marginTop: 8 },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      marginTop: 20,
      borderRadius: 16,
      paddingHorizontal: 16,
      elevation: 10,
    },
    searchInput: { flex: 1, padding: 14, fontSize: 16 },
    content: { flex: 1, padding: 20 },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text, marginBottom: 16 },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    cardTitle: { fontSize: 17, fontWeight: "bold", color: theme.colors.text, flex: 1 },
    distance: { fontSize: 13, color: "#666", fontWeight: "600" },
    address: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  }));

  if (loading) return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: 16, fontSize: 16, color: theme.colors.textSecondary }}>กำลังค้นหาหน่วยใกล้เคียง...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>หน่วยฉุกเฉินใกล้คุณ</Text>
        <Text style={styles.subtitle}>รัศมี 5 กม. • อัปเดตเรียลไทม์</Text>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาหน่วยกู้ภัย..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}>
        {Object.entries(TYPE_CONFIG).map(([key, config]) => {
          const items = filtered.filter(p => p.type === key);
          if (items.length === 0) return null;

          return (
            <View key={key} style={styles.section}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name={config.icon as any} size={24} color={config.color} /> {config.title}
              </Text>
              {items.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.card}
                  onPress={() => navigation.navigate("EmergencyDetail", { ...place, type: place.type })}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{place.name}</Text>
                    {place.distance && <Text style={styles.distance}>{place.distance.toFixed(1)} กม.</Text>}
                  </View>
                  {place.address && <Text style={styles.address}>{place.address}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
