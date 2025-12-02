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
import { useTheme, useThemedStyles } from "../src/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

const TYPE_CONFIG = {
  hospital: {
    title: "โรงพยาบาล",
    icon: "favorite",
    color: "#FF6B9D",
    gradient: ["#FFB6C1", "#FF69B4"] as const,
    emoji: "💊",
    services: ["ฉุกเฉิน 24 ชม.", "ห้องฉุกเฉิน", "รถพยาบาล"],
    hotline: "1669",
    lightBg: "#FFF0F5"
  },
  police: {
    title: "สถานีตำรวจ",
    icon: "shield",
    color: "#6B9AFF",
    gradient: ["#89CFF0", "#6495ED"] as const,
    emoji: "🛡️",
    services: ["เหตุฉุกเฉิน", "แจ้งความ", "ตรวจการณ์"],
    hotline: "191",
    lightBg: "#E6F3FF"
  },
  fire: {
    title: "หน่วยดับเพลิง",
    icon: "whatshot",
    color: "#FF9B6B",
    gradient: ["#FFB88C", "#FF8C69"] as const,
    emoji: "🔥",
    services: ["ดับเพลิง", "กู้ภัย", "ช่วยเหลือ"],
    hotline: "199",
    lightBg: "#FFF4E6"
  },
  rescue: {
    title: "หน่วยกู้ภัย",
    icon: "healing",
    color: "#6BFFB9",
    gradient: ["#98FB98", "#90EE90"] as const,
    emoji: "🌿",
    services: ["กู้ชีพ", "รถพยาบาล", "ช่วยเหลือ"],
    hotline: "1554",
    lightBg: "#F0FFF4"
  },
};

export default function EmergencyDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const {
    name = "ไม่ระบุชื่อ",
    address = "",
    phone = "",
    distance,
    type = "rescue",
    latitude,
    longitude,
  } = params;

  const { theme } = useTheme();
  const info = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.rescue;

  const estimatedTime = distance
    ? Math.ceil((Number(distance) / 40) * 60)
    : null;

  const getDistanceLevel = (dist: number) => {
    if (dist < 1) return { text: "ใกล้มาก", color: "#90EE90", icon: "check-circle" };
    if (dist < 3) return { text: "ใกล้", color: "#87CEEB", icon: "info" };
    if (dist < 5) return { text: "ปานกลาง", color: "#FFD700", icon: "warning" };
    return { text: "ไกล", color: "#FFB6C1", icon: "error" };
  };

  const distanceLevel = distance ? getDistanceLevel(Number(distance)) : null;

  const handleCall = () => phone && Linking.openURL(`tel:${phone}`);

  const handleHotlineCall = () => Linking.openURL(`tel:${info.hotline}`);

  const handleDirections = () =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);

  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
      },
      scrollContent: {
        paddingBottom: 90,
      },
      header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
      },
      backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
      },
      headerContent: {
        alignItems: "center",
        gap: 12,
      },
      emoji: {
        fontSize: 56,
      },
      title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        textShadowColor: "rgba(0, 0, 0, 0.1)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      typeBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
      },
      typeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
      },
      content: {
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
      },
      infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        minWidth: "100%",
      },
      infoCardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      },
      iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
      },
      infoText: {
        flex: 1,
      },
      infoLabel: {
        fontSize: 12,
        color: "#9E9E9E",
        marginBottom: 4,
        fontWeight: "500",
      },
      infoValue: {
        fontSize: 15,
        color: "#424242",
        fontWeight: "600",
        lineHeight: 20,
      },
      infoSubtext: {
        fontSize: 12,
        color: "#9E9E9E",
        marginTop: 3,
      },
      distanceBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 6,
      },
      distanceBadgeText: {
        fontSize: 12,
        fontWeight: "600",
      },
      servicesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
      },
      serviceChip: {
        backgroundColor: info.lightBg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
      },
      serviceText: {
        fontSize: 12,
        color: info.color,
        fontWeight: "600",
      },
      hotlineCard: {
        backgroundColor: "#FFF9E6",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderLeftWidth: 4,
        borderLeftColor: "#FFD700",
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      hotlineIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFD700",
        justifyContent: "center",
        alignItems: "center",
      },
      hotlineText: {
        flex: 1,
      },
      hotlineLabel: {
        fontSize: 12,
        color: "#F57C00",
        fontWeight: "600",
        marginBottom: 3,
      },
      hotlineNumber: {
        fontSize: 22,
        color: "#F57C00",
        fontWeight: "800",
      },
      stickyButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      actionButtons: {
        flexDirection: "row",
        gap: 12,
      },
      actionButton: {
        flex: 1,
        borderRadius: 18,
        overflow: "hidden",
        elevation: 5,
        shadowColor: info.color,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      buttonGradient: {
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      },
      buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
      },
    })
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={info.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
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

        <View style={styles.content}>
          <View style={styles.infoGrid}>
            {distance && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardRow}>
                  <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                    <MaterialIcons name="explore" size={28} color={info.color} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>ระยะทาง</Text>
                    <Text style={styles.infoValue}>
                      {Number(distance).toFixed(1)} กม.
                    </Text>
                    {estimatedTime && (
                      <Text style={styles.infoSubtext}>
                        ⏱️ ประมาณ {estimatedTime} นาที
                      </Text>
                    )}
                    {distanceLevel && (
                      <View style={styles.distanceBadge}>
                        <MaterialIcons name={distanceLevel.icon as any} size={16} color={distanceLevel.color} />
                        <Text style={[styles.distanceBadgeText, { color: distanceLevel.color }]}>
                          {distanceLevel.text}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                  <MaterialIcons name="local-hospital" size={28} color={info.color} />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>บริการ</Text>
                  <View style={styles.servicesRow}>
                    {info.services.map((service, idx) => (
                      <View key={idx} style={styles.serviceChip}>
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {address && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardRow}>
                  <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                    <MaterialIcons name="place" size={28} color={info.color} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>ที่อยู่</Text>
                    <Text style={styles.infoValue}>
                      {address}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {phone && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardRow}>
                  <View style={[styles.iconCircle, { backgroundColor: info.lightBg }]}>
                    <MaterialIcons name="phone" size={28} color={info.color} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>เบอร์โทรศัพท์</Text>
                    <Text style={styles.infoValue}>{phone}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.hotlineCard}
            onPress={handleHotlineCall}
            activeOpacity={0.7}
          >
            <View style={styles.hotlineIcon}>
              <MaterialIcons name="phone-in-talk" size={26} color="#fff" />
            </View>
            <View style={styles.hotlineText}>
              <Text style={styles.hotlineLabel}>สายด่วนฉุกเฉิน</Text>
              <Text style={styles.hotlineNumber}>{info.hotline}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color="#F57C00" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.stickyButtonContainer}>
        <View style={styles.actionButtons}>
          {phone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={info.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="call" size={24} color="#fff" />
                <Text style={styles.buttonText}>โทรด่วน</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDirections}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#B8A4F5", "#9B7FD9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="directions" size={24} color="#fff" />
              <Text style={styles.buttonText}>นำทาง</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

