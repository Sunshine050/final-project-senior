// app/(main)/home.tsx - Emergency Services (No Hospitals)
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
import { useTheme, useThemedStyles } from "@/src/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { getNearbyEmergencyPlaces } from "@/src/api/emergency";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

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
  police: {
    title: "ตำรวจ",
    icon: "shield",
    color: "#6B9AFF",
    gradient: ["#89CFF0", "#6495ED"] as const,
    lightBg: "#E6F3FF",
  },
  fire: {
    title: "ดับเพลิง",
    icon: "whatshot",
    color: "#FF9B6B",
    gradient: ["#FFB88C", "#FF8C69"] as const,
    lightBg: "#FFF4E6",
  },
  rescue: {
    title: "กู้ภัย",
    icon: "healing",
    color: "#6BFFB9",
    gradient: ["#98FB98", "#90EE90"] as const,
    lightBg: "#F0FFF4",
  },
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [places, setPlaces] = useState<EmergencyItem[]>([]);
  const [filtered, setFiltered] = useState<EmergencyItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log("Deep link URL received:", url);
      const parsed = Linking.parse(url);
      console.log("Parsed URL:", parsed);
      if (parsed.queryParams?.access_token) {
        const accessToken = parsed.queryParams.access_token as string;
        console.log("Access Token:", accessToken);
        // TODO: เก็บ token ลง state หรือเรียก API backend เพื่อล็อกอิน
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

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
      const filteredData = data.filter((item) => item.type !== "hospital");
      setPlaces(filteredData);
      setFiltered(filteredData);
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
    let result = places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q)
    );
    if (selectedType) {
      result = result.filter((p) => p.type === selectedType);
    }
    setFiltered(result);
  }, [search, places, selectedType]);

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
      notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
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
        paddingTop: 20,
      },
      filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 18,
      },
      filterScroll: {
        flexDirection: "row",
        gap: 10,
      },
      filterChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E0E0E0",
        gap: 6,
      },
      filterChipActive: {
        borderColor: "transparent",
      },
      filterText: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.textSecondary,
      },
      filterTextActive: {
        color: "#fff",
      },
      sectionContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120,
      },
      section: {
        marginBottom: 24,
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
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      },
      sectionCount: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.textSecondary,
        backgroundColor: "#F0F0F0",
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
        justifyContent: "center",
        alignItems: "center",
      },
      cardContent: {
        flex: 1,
      },
      cardTitle: {
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
      distance: {
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
      emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 50,
      },
      emptyIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
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

  if (loading)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        <ActivityIndicator size="large" color="#6B9AFF" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: theme.colors.textSecondary,
          }}
        >
          กำลังค้นหาหน่วยใกล้เคียง...
        </Text>
      </SafeAreaView>
    );

  const totalPlaces = places.length;
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={["#B8A4F5", "#9B7FD9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>🚨 หน่วยฉุกเฉิน</Text>
            <Text style={styles.subtitle}>
              ค้นหาหน่วยใกล้คุณ • อัปเดตเรียลไทม์
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statBadge}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.statText}>{totalPlaces}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications-none" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาหน่วยกู้ภัย..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={18} color="#999" />
            </TouchableOpacity>
          )}
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
              loadData();
            }}
            colors={["#B8A4F5"]}
          />
        }
      >
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedType && styles.filterChipActive,
                !selectedType && { backgroundColor: "#B8A4F5" },
              ]}
              onPress={() => setSelectedType(null)}
            >
              <MaterialIcons
                name="apps"
                size={16}
                color={!selectedType ? "#fff" : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  !selectedType && styles.filterTextActive,
                ]}
              >
                ทั้งหมด
              </Text>
            </TouchableOpacity>
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  selectedType === key && styles.filterChipActive,
                  selectedType === key && { backgroundColor: config.color },
                ]}
                onPress={() =>
                  setSelectedType(selectedType === key ? null : key)
                }
              >
                <MaterialIcons
                  name={config.icon as any}
                  size={16}
                  color={selectedType === key ? "#fff" : config.color}
                />
                <Text
                  style={[
                    styles.filterText,
                    selectedType === key && styles.filterTextActive,
                  ]}
                >
                  {config.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialIcons
                  name="search-off"
                  size={36}
                  color={theme.colors.textSecondary}
                />
              </View>
              <Text style={styles.emptyText}>ไม่พบข้อมูล</Text>
              <Text style={styles.emptySubtext}>
                ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง
              </Text>
            </View>
          ) : (
            Object.entries(TYPE_CONFIG).map(([key, config]) => {
              const items = filtered.filter((p) => p.type === key);
              if (items.length === 0) return null;

              return (
                <View key={key} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      <MaterialIcons
                        name={config.icon as any}
                        size={22}
                        color={config.color}
                      />{" "}
                      {config.title}
                    </Text>
                    <Text style={styles.sectionCount}>{items.length}</Text>
                  </View>

                  {items.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      style={[styles.card, { borderLeftColor: config.color }]}
                      onPress={() =>
                        navigation.navigate("EmergencyDetail", {
                          ...place,
                          type: place.type,
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.iconBadge,
                            { backgroundColor: config.lightBg },
                          ]}
                        >
                          <MaterialIcons
                            name={config.icon as any}
                            size={22}
                            color={config.color}
                          />
                        </View>
                        <View style={styles.cardContent}>
                          <Text style={styles.cardTitle}>{place.name}</Text>
                          <View style={styles.cardMeta}>
                            {place.distance && (
                              <View style={styles.metaItem}>
                                <MaterialIcons
                                  name="location-on"
                                  size={15}
                                  color={config.color}
                                />
                                <Text style={styles.distance}>
                                  {place.distance.toFixed(1)} กม.
                                </Text>
                              </View>
                            )}
                            {place.phone && (
                              <View style={styles.metaItem}>
                                <MaterialIcons
                                  name="phone"
                                  size={15}
                                  color={config.color}
                                />
                                <Text style={styles.distance}>โทรได้</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      {place.address && (
                        <Text style={styles.address} numberOfLines={2}>
                          {place.address}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
