import React, { useState, useEffect, useCallback } from "react";
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
import { findNearbyHospitalsLongdo } from "../../src/api/longdoMap";
import { NearbyHospital } from "../../src/types/hospital";

export default function NearbyScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [filtered, setFiltered] = useState<NearbyHospital[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const data = await findNearbyHospitalsLongdo(19.9086, 99.8309, 10);
        setHospitals(data);
        setFiltered(data);
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const data = await findNearbyHospitalsLongdo(loc.coords.latitude, loc.coords.longitude, 10);
      setHospitals(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      hospitals.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          (h.address || "").toLowerCase().includes(q) ||
          (h.city || "").toLowerCase().includes(q)
      )
    );
  }, [search, hospitals]);

  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: { flex: 1, backgroundColor: theme.colors.background },
      header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: "#e91e63",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
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
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      searchInput: { flex: 1, padding: 14, fontSize: 16, color: theme.colors.text },
      content: { flex: 1, padding: 20 },
      card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border + "30",
      },
      cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
      hospitalName: { fontSize: 18, fontWeight: "bold", color: theme.colors.text, flex: 1 },
      distanceBadge: {
        backgroundColor: "#e91e6320",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: "#e91e63",
      },
      distanceText: { color: "#c2185b", fontWeight: "bold", fontSize: 13 },
      address: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
      phoneRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
      phoneText: { fontSize: 15, color: "#e91e63", fontWeight: "600" },
    })
  );

  const formatDistance = (km: number) =>
    km < 1 ? `${(km * 1000).toFixed(0)} เมตร` : `${km.toFixed(1)} กม.`;

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={{ marginTop: 16, fontSize: 16, color: theme.colors.textSecondary }}>
          กำลังค้นหาโรงพยาบาลใกล้คุณ...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>โรงพยาบาลใกล้ฉัน</Text>
        <Text style={styles.subtitle}>รัศมี 10 กม. • อัปเดตเรียลไทม์</Text>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อโรงพยาบาล..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialIcons name="clear" size={24} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHospitals(); }} />}
      >
        {filtered.length === 0 ? (
          <View style={{ padding: 60, alignItems: "center" }}>
            <MaterialIcons name="local-hospital" size={80} color="#ddd" />
            <Text style={{ marginTop: 16, fontSize: 17, color: theme.colors.textSecondary, textAlign: "center" }}>
              {search ? "ไม่พบโรงพยาบาลที่ค้นหา" : "ไม่พบโรงพยาบาลในรัศมี 10 กม."}
            </Text>
          </View>
        ) : (
          filtered.map((hospital) => (
            <TouchableOpacity
              key={hospital.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("EmergencyDetail", {
                  name: hospital.name,
                  address: hospital.address || hospital.city,
                  phone: hospital.contactPhone,
                  distance: hospital.distance,
                  type: "hospital",
                  latitude: hospital.latitude,
                  longitude: hospital.longitude,
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                {hospital.distance !== undefined && (
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>{formatDistance(hospital.distance)}</Text>
                  </View>
                )}
              </View>
              {(hospital.address || hospital.city) && (
                <Text style={styles.address}>
                  {hospital.address || hospital.city}
                </Text>
              )}
              {hospital.contactPhone && (
                <View style={styles.phoneRow}>
                  <MaterialIcons name="phone" size={18} color="#e91e63" />
                  <Text style={styles.phoneText}>{hospital.contactPhone}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
