import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// --- Config ของ emergency type ---
const TYPE_CONFIG = {
  hospital: {
    title: "โรงพยาบาล",
    emoji: "💊",
    gradient: ["#FFC5D8", "#FF89AE"] as const,
    color: "#FF6B9D",
    services: ["ฉุกเฉิน 24 ชม.", "ห้องฉุกเฉิน", "รถพยาบาล"],
    hotline: "1669",
    lightBg: "#FFF2F6",
  },
  police: {
    title: "สถานีตำรวจ",
    emoji: "🛡️",
    gradient: ["#D4E4FF", "#9ABAF8"] as const,
    color: "#6B9AFF",
    services: ["เหตุฉุกเฉิน", "แจ้งความ", "ตรวจการณ์"],
    hotline: "191",
    lightBg: "#F1F7FF",
  },
  fire: {
    title: "หน่วยดับเพลิง",
    emoji: "🔥",
    gradient: ["#FFE1D1", "#FFB899"] as const,
    color: "#FF9B6B",
    services: ["ดับเพลิง", "กู้ภัย", "ช่วยเหลือ"],
    hotline: "199",
    lightBg: "#FFF4EC",
  },
  rescue: {
    title: "หน่วยกู้ภัย",
    emoji: "🌿",
    gradient: ["#CFFFF1", "#A7F3D0"] as const,
    color: "#4BCFA9",
    services: ["กู้ชีพ", "รถพยาบาล", "ช่วยเหลือ"],
    hotline: "1554",
    lightBg: "#EEFFF7",
  },
};

export default function EmergencyDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const {
    name = "ไม่ระบุชื่อ",
    address = "-",
    phone = "",
    distance,
    type = "rescue",
    latitude,
    longitude,
  } = params;

  const info = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.rescue;

  const estimatedTime = distance
    ? Math.ceil((Number(distance) / 40) * 60)
    : null;

  const getDistanceLevel = (dist: number) => {
    if (dist < 1) return { text: "ใกล้มาก", color: "#6FCF97", icon: "check-circle" };
    if (dist < 3) return { text: "ใกล้", color: "#56CCF2", icon: "info" };
    if (dist < 5) return { text: "ปานกลาง", color: "#F2C94C", icon: "warning" };
    return { text: "ไกล", color: "#EB5757", icon: "error" };
  };

  const distanceLevel = distance ? getDistanceLevel(Number(distance)) : null;

  const handleCall = () => phone && Linking.openURL(`tel:${phone}`);
  const handleHotlineCall = () => Linking.openURL(`tel:${info.hotline}`);
  const handleDirections = () =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FCFCFD" },
    scrollContent: { paddingBottom: 120 },

    // HEADER
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      overflow: "hidden",
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.5)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 18,
    },
    headerContent: { alignItems: "center" },
    emoji: { fontSize: 58 },
    title: { marginTop: 10, fontSize: 26, fontWeight: "800", color: "#fff", textAlign: "center" },
    typeBadge: {
      marginTop: 8,
      backgroundColor: "rgba(255,255,255,0.35)",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 14,
    },
    typeText: { color: "#fff", fontSize: 14, fontWeight: "600" },

    // CONTENT
    content: { paddingHorizontal: 20, paddingTop: 26 },

    // CARD
    infoCard: {
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 20,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    infoCardRow: { flexDirection: "row", alignItems: "center", gap: 16 },
    iconCircle: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
    },
    infoLabel: { fontSize: 13, color: "#9E9E9E", marginBottom: 3 },
    infoValue: { fontSize: 16, color: "#333", fontWeight: "700" },
    infoSubtext: { fontSize: 12, color: "#9E9E9E", marginTop: 2 },
    distanceBadge: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 },
    distanceBadgeText: { fontSize: 12, fontWeight: "600" },

    // Service chips
    servicesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
    serviceChip: { backgroundColor: info.lightBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    serviceText: { fontSize: 12, fontWeight: "600", color: info.color },

    // HOTLINE
    hotlineCard: {
      marginTop: 8,
      backgroundColor: "#FFF8E8",
      borderRadius: 22,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderLeftWidth: 5,
      borderLeftColor: "#F2C94C",
      shadowColor: "#F2C94C",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
    },
    hotlineIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#F2C94C",
      justifyContent: "center",
      alignItems: "center",
    },
    hotlineLabel: { fontSize: 12, color: "#B77900", fontWeight: "700" },
    hotlineNumber: { fontSize: 22, fontWeight: "800", color: "#B77900" },

    // BOTTOM BUTTONS
    stickyButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 26,
      backgroundColor: "#ffffff",
      borderTopWidth: 1,
      borderTopColor: "#EEE",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: -2 },
    },
    actionButtons: { flexDirection: "row", gap: 12 },
    actionButton: { flex: 1, borderRadius: 20, overflow: "hidden", elevation: 3 },
    buttonGradient: { paddingVertical: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
    buttonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <LinearGradient
          colors={info.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.6}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.emoji}>{info.emoji}</Text>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{info.title}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          {/* DISTANCE */}
          {distance && (
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                  <MaterialIcons name="explore" size={28} color={info.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>ระยะทาง</Text>
                  <Text style={styles.infoValue}>{Number(distance).toFixed(1)} กม.</Text>
                  {estimatedTime && <Text style={styles.infoSubtext}>⏱️ ประมาณ {estimatedTime} นาที</Text>}
                  {distanceLevel && (
                    <View style={styles.distanceBadge}>
                      <MaterialIcons name={distanceLevel.icon as any} size={16} color={distanceLevel.color} />
                      <Text style={[styles.distanceBadgeText, { color: distanceLevel.color }]}>{distanceLevel.text}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* SERVICES */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                <MaterialIcons name="local-hospital" size={28} color={info.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>บริการ</Text>
                <View style={styles.servicesRow}>
                  {info.services.map((service, i) => (
                    <View key={i} style={styles.serviceChip}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ADDRESS */}
          {address && (
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                  <MaterialIcons name="place" size={28} color={info.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>ที่อยู่</Text>
                  <Text style={styles.infoValue}>{address}</Text>
                </View>
              </View>
            </View>
          )}

          {/* PHONE */}
          {phone && (
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                  <MaterialIcons name="phone" size={28} color={info.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>เบอร์โทรศัพท์</Text>
                  <Text style={styles.infoValue}>{phone}</Text>
                </View>
              </View>
            </View>
          )}

          {/* HOTLINE */}
          <TouchableOpacity style={styles.hotlineCard} onPress={handleHotlineCall} activeOpacity={0.8}>
            <View style={styles.hotlineIcon}>
              <MaterialIcons name="phone-in-talk" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hotlineLabel}>สายด่วนฉุกเฉิน</Text>
              <Text style={styles.hotlineNumber}>{info.hotline}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color="#B77900" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.stickyButtonContainer}>
        <View style={styles.actionButtons}>
          {phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <LinearGradient colors={info.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                <MaterialIcons name="call" size={22} color="#fff" />
                <Text style={styles.buttonText}>โทรด่วน</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <LinearGradient colors={["#B8A4F5", "#9B7FD9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
              <MaterialIcons name="directions" size={22} color="#fff" />
              <Text style={styles.buttonText}>นำทาง</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
