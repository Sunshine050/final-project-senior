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
      let data;

      if (status !== "granted") {
        data = await findNearbyHospitalsLongdo(19.9086, 99.8309, 10);
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        data = await findNearbyHospitalsLongdo(
          loc.coords.latitude,
          loc.coords.longitude,
          10
        );
      }

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
      container: {
        flex: 1,
        backgroundColor: "#F9FCFF", // โทนหน้า Home
      },

      header: {
        paddingTop: 48,
        paddingHorizontal: 24,
        paddingBottom: 34,
        backgroundColor: "#4CB5F5",
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        elevation: 8,
        shadowColor: "#4CB5F5",
        shadowOpacity: 0.25,
        shadowRadius: 22,
      },

      title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
      },

      subtitle: {
        fontSize: 14,
        color: "#EAF8FF",
        textAlign: "center",
        marginTop: 6,
        opacity: 0.9,
      },

      searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: 20,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 12,
      },

      searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
        color: theme.colors.text,
      },

      content: {
        flex: 1,
        padding: 20,
      },

      card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: "#E6F2FF",
      },

      cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      },

      hospitalName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#2C3E50",
        flex: 1,
      },

      distanceBadge: {
        backgroundColor: "#E8F6FF",
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#BEE7FF",
      },

      distanceText: {
        color: "#0288D1",
        fontWeight: "600",
        fontSize: 12,
      },

      address: {
        fontSize: 14,
        color: "#566573",
        lineHeight: 20,
        marginTop: 2,
      },

      phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
      },

      phoneText: {
        fontSize: 15,
        color: "#0288D1",
        fontWeight: "600",
      },
    })
  );

  const formatDistance = (km: number) =>
    km < 1 ? `${(km * 1000).toFixed(0)} เมตร` : `${km.toFixed(1)} กม.`;

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FCFF",
        }}
      >
        <ActivityIndicator size="large" color="#4CB5F5" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#7F8C8D" }}>
          กำลังค้นหาโรงพยาบาลใกล้คุณ...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>โรงพยาบาลใกล้ฉัน</Text>
        <Text style={styles.subtitle}>ระยะ 10 กม. • อัปเดตเรียลไทม์</Text>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#9AA6AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อโรงพยาบาล..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#AEB6BF"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialIcons name="clear" size={22} color="#AEB6BF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadHospitals();
            }}
          />
        }
      >
        {filtered.length === 0 ? (
          <View style={{ padding: 60, alignItems: "center" }}>
            <MaterialIcons name="local-hospital" size={85} color="#D6EBFF" />
            <Text
              style={{
                marginTop: 16,
                fontSize: 17,
                color: "#7F8C8D",
                textAlign: "center",
              }}
            >
              {search
                ? "ไม่พบโรงพยาบาลที่ค้นหา"
                : "ไม่พบโรงพยาบาลในรัศมี 10 กม."}
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
                <MaterialIcons
                  name="local-hospital"
                  size={26}
                  color="#4CB5F5"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.hospitalName}>{hospital.name}</Text>

                {hospital.distance !== undefined && (
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>
                      {formatDistance(hospital.distance)}
                    </Text>
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
                  <MaterialIcons name="phone" size={18} color="#0288D1" />
                  <Text style={styles.phoneText}>
                    {hospital.contactPhone}
                  </Text>
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
