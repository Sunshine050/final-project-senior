// app/(main)/nearby.tsx - Soft Pastel Theme
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
import { useTheme, useThemedStyles } from "@/src/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { findNearbyHospitalsLongdo } from "@/src/api/longdoMap";
import { NearbyHospital } from "@/src/types/hospital";
import { LinearGradient } from "expo-linear-gradient";

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
      const data = await findNearbyHospitalsLongdo(
        loc.coords.latitude,
        loc.coords.longitude,
        10
      );
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
        backgroundColor: "#FAFAFA",
      },
      headerGradient: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
      },
      headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      },
      headerLeft: {
        flex: 1,
      },
      title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 4,
      },
      subtitle: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.85)",
        fontWeight: "500",
      },
      headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
      statBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 6,
      },
      statText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#fff",
      },
      searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingHorizontal: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      searchInput: {
        flex: 1,
        padding: 12,
        fontSize: 15,
        color: theme.colors.text,
      },
      content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: theme.colors.text,
      },
      sectionCount: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.textSecondary,
        backgroundColor: "#FFB6C120",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
      },
      card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: "#FF6B9D",
      },
      cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
        gap: 12,
      },
      iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFF0F5",
        justifyContent: "center",
        alignItems: "center",
      },
      cardContent: {
        flex: 1,
      },
      hospitalName: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: 6,
        lineHeight: 20,
      },
      cardMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      },
      metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      },
      distanceText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: "600",
      },
      address: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 19,
        marginTop: 6,
      },
      phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
      },
      phoneText: {
        fontSize: 13,
        color: "#FF6B9D",
        fontWeight: "600",
      },
      emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
      },
      emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFF0F5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
      },
      emptyText: {
        fontSize: 17,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: 6,
      },
      emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: "center",
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
          backgroundColor: "#FAFAFA",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#FFF0F5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <MaterialIcons name="favorite" size={40} color="#FF6B9D" />
        </View>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: theme.colors.textSecondary,
          }}
        >
          กำลังค้นหาโรงพยาบาลใกล้คุณ...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={["#FFB6C1", "#FF69B4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>💊 โรงพยาบาลใกล้ฉัน</Text>
            <Text style={styles.subtitle}>รัศมี 10 กม. • อัปเดตเรียลไทม์</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statBadge}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.statText}>{hospitals.length}</Text>
            </View>
          </View>
        </View>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อโรงพยาบาล..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadHospitals();
            }}
            colors={["#FF6B9D"]}
          />
        }
      >
        {filtered.length > 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>โรงพยาบาลทั้งหมด</Text>
            <Text style={styles.sectionCount}>{filtered.length}</Text>
          </View>
        )}

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="favorite" size={40} color="#FF6B9D" />
            </View>
            <Text style={styles.emptyText}>ไม่พบข้อมูล</Text>
            <Text style={styles.emptySubtext}>
              {search ? "ลองค้นหาด้วยคำอื่น" : "ไม่พบโรงพยาบาลในรัศมี 10 กม."}
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
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBadge}>
                  <MaterialIcons name="favorite" size={22} color="#FF6B9D" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.hospitalName}>{hospital.name}</Text>
                  <View style={styles.cardMeta}>
                    {hospital.distance !== undefined && (
                      <View style={styles.metaItem}>
                        <MaterialIcons
                          name="location-on"
                          size={15}
                          color="#FF6B9D"
                        />
                        <Text style={styles.distanceText}>
                          {formatDistance(hospital.distance)}
                        </Text>
                      </View>
                    )}
                    {hospital.contactPhone && (
                      <View style={styles.metaItem}>
                        <MaterialIcons name="phone" size={15} color="#FF6B9D" />
                        <Text style={styles.distanceText}>โทรได้</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {(hospital.address || hospital.city) && (
                <Text style={styles.address} numberOfLines={2}>
                  {hospital.address || hospital.city}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
