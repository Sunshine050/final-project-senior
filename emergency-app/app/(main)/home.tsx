import React, { useEffect, useState } from "react";
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
  hospital: { title: "โรงพยาบาล", icon: "local-hospital", color: "#4da6ff" },
  police: { title: "ตำรวจ", icon: "local-police", color: "#5ba3f0" },
  fire: { title: "ดับเพลิง", icon: "fire-extinguisher", color: "#ff784e" },
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
      const data = await getNearbyEmergencyPlaces(
        loc.coords.latitude,
        loc.coords.longitude
      );

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
    setFiltered(
      places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.address || "").toLowerCase().includes(q)
      )
    );
  }, [search, places]);

  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: { flex: 1, backgroundColor: "#f8fbff" },

      header: {
        paddingTop: 50,
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: "#5bb8ff",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,

        // Gradient (Light → Dark Blue)
        shadowColor: "#4da6ff",
        shadowOpacity: 0.2,
        shadowRadius: 10
      },

      title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
      },
      subtitle: {
        fontSize: 16,
        color: "#eef7ff",
        opacity: 0.9,
        textAlign: "center",
        marginTop: 6,
      },

      searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginTop: 22,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        elevation: 6,
        shadowColor: "#a6caff",
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: "#333",
      },

      content: { flex: 1, padding: 20 },

      section: { marginBottom: 24 },

      sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1c2c3d",
        marginBottom: 12,
      },

      card: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#e2ecf5",

        elevation: 3,
        shadowColor: "#aac7dd",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },

      cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      },

      cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1a2b3c",
        flex: 1,
      },

      distance: {
        fontSize: 13,
        color: "#64829c",
        fontWeight: "600",
      },

      address: {
        fontSize: 14,
        color: "#4e657a",
        marginTop: 2,
        lineHeight: 20,
      },
    })
  );

  if (loading)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fbff",
        }}
      >
        <ActivityIndicator size="large" color="#4da6ff" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#7a8fa6" }}>
          กำลังค้นหาหน่วยฉุกเฉินใกล้คุณ...
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>หน่วยฉุกเฉินใกล้คุณ</Text>
        <Text style={styles.subtitle}>ภายในรัศมี 5 กม. | อัปเดตแบบเรียลไทม์</Text>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#5ca6e6" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาโรงพยาบาล / สถานีตำรวจ..."
            placeholderTextColor="#9fb6c9"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
          />
        }
      >
        {Object.entries(TYPE_CONFIG).map(([key, config]) => {
          const items = filtered.filter((p) => p.type === key);
          if (items.length === 0) return null;

          return (
            <View key={key} style={styles.section}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons
                  name={config.icon as any}
                  size={22}
                  color={config.color}
                />{" "}
                {config.title}
              </Text>

              {items.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("EmergencyDetail", {
                      ...place,
                      type: place.type,
                    })
                  }
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{place.name}</Text>
                    {place.distance && (
                      <Text style={styles.distance}>
                        {place.distance.toFixed(1)} กม.
                      </Text>
                    )}
                  </View>

                  {place.address && (
                    <Text style={styles.address}>{place.address}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
