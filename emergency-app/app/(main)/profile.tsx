// app/(main)/profile.tsx - Premium Emergency Care Profile
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/useTheme";
import { useThemedStyles } from "@/src/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useProfileController } from "@/src/hooks/profile/useProfileController";
import ConfirmationModal from "@/src/components/shared/ConfirmationModal";
import { getUserMeApi } from "@/src/api/user/user";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const {
    avatarUrl,
    isUploading,
    logoutModalVisible,
    setLogoutModalVisible,
    handleCameraPress,
    handleLogout,
  } = useProfileController();

  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getUserMeApi()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayName =
    profile?.profileSettings?.displayName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    profile?.email ||
    "ผู้ใช้";

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },
    header: {
      paddingTop: 60,
      paddingBottom: 100,
      backgroundColor: "#DC2626",
      position: "relative",
    },
    headerGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    avatarContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: "#fff",
    },
    cameraBtn: {
      position: "absolute",
      right: "35%",
      bottom: 0,
      backgroundColor: "#DC2626",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "#fff",
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginTop: 16,
      textAlign: "center",
    },
    role: {
      fontSize: 14,
      color: "#fff",
      opacity: 0.9,
      marginTop: 4,
      textAlign: "center",
    },
    infoCard: {
      marginHorizontal: 20,
      marginTop: -60,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#FEE2E2",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: "#6B7280",
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 15,
      color: "#111827",
      fontWeight: "600",
    },
    menuSection: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#374151",
      marginBottom: 12,
      marginLeft: 4,
    },
    menuCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 13,
      color: "#6B7280",
    },
    menuChevron: {
      marginLeft: 8,
    },
    logoutCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 40,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    logoutIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#FEE2E2",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    logoutText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#DC2626",
    },
  }));

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" }}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={{ marginTop: 20, color: "#6B7280", fontSize: 16 }}>
          กำลังโหลดโปรไฟล์...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View>
              <Image
                source={avatarUrl ? { uri: avatarUrl } : require("@/assets/images/android-icon-background.png")}
                style={styles.avatar}
                contentFit="cover"
                transition={400}
              />
              {isUploading && (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "#00000070", borderRadius: 60, justifyContent: "center", alignItems: "center" }]}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              <TouchableOpacity style={styles.cameraBtn} onPress={handleCameraPress}>
                <MaterialIcons name="photo-camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.role}>
              {profile?.role === "PATIENT" ? "ผู้ใช้งานทั่วไป" : "เจ้าหน้าที่"}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MaterialIcons name="email" size={20} color="#DC2626" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>อีเมล</Text>
              <Text style={styles.infoValue}>{profile?.email}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={styles.infoIcon}>
              <MaterialIcons name="phone" size={20} color="#DC2626" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>เบอร์โทร</Text>
              <Text style={styles.infoValue}>{profile?.phone || "ยังไม่ได้ระบุ"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>บัญชีและการตั้งค่า</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/account")}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: "#DBEAFE" }]}>
                <MaterialIcons name="person-outline" size={24} color="#2563EB" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>บัญชีของฉัน</Text>
                <Text style={styles.menuSubtitle}>จัดการข้อมูลส่วนตัว</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={styles.menuChevron} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => router.push("/settings")}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: "#E0E7FF" }]}>
                <MaterialIcons name="settings" size={24} color="#6366F1" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>การตั้งค่า</Text>
                <Text style={styles.menuSubtitle}>ปรับแต่งการใช้งาน</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={styles.menuChevron} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>ช่วยเหลือและสนับสนุน</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/help")}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: "#FEF3C7" }]}>
                <MaterialIcons name="help-outline" size={24} color="#D97706" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>ศูนย์ช่วยเหลือ</Text>
                <Text style={styles.menuSubtitle}>คำถามที่พบบ่อย และติดต่อเรา</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={styles.menuChevron} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => router.push("/policy")}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: "#D1FAE5" }]}>
                <FontAwesome5 name="shield-alt" size={20} color="#059669" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>นโยบายและความเป็นส่วนตัว</Text>
                <Text style={styles.menuSubtitle}>เงื่อนไขการใช้งาน</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={styles.menuChevron} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.logoutCard}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setLogoutModalVisible(true)}
            >
              <View style={styles.logoutIconContainer}>
                <MaterialIcons name="logout" size={24} color="#DC2626" />
              </View>
              <Text style={styles.logoutText}>ออกจากระบบ</Text>
              <MaterialIcons name="chevron-right" size={24} color="#DC2626" style={styles.menuChevron} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ConfirmationModal
        visible={logoutModalVisible}
        title="ออกจากระบบ"
        message="คุณต้องการออกจากระบบใช่หรือไม่?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
        confirmText="ออกจากระบบ"
      />
    </SafeAreaView>
  );
}

