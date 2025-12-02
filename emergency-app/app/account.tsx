// app/account.tsx (เวอร์ชันสุดท้าย – ไม่มี error Text อีกต่อไป + เสียง + สั่น + บันทึกจริง)
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getUserMeApi, updateUserProfile } from "../src/api/user/user";
import { Audio } from "expo-av";
import { useSettings } from "../src/context/SettingsContext";

export default function AccountScreen() {
  const router = useRouter();
  const { soundEnabled, triggerHaptic } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
    emergencyContactPhone: "",
  });

  const playClickSound = async () => {
    if (!soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1100.mp3",
        },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (e) {}
  };

  useEffect(() => {
    getUserMeApi()
      .then((data) => {
        setProfile(data);
        setFormData({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          bloodType: data?.medicalInfo?.bloodType || "",
          allergies: data?.medicalInfo?.allergies || "",
          emergencyContact: data?.emergencyContact?.name || "",
          emergencyContactPhone: data?.emergencyContact?.phone || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await playClickSound();
    await triggerHaptic();
    setSaving(true);
    try {
      if (!profile?.id) throw new Error("ไม่พบข้อมูลผู้ใช้");
      await updateUserProfile(profile.id, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        medicalInfo: {
          bloodType: formData.bloodType.trim().toUpperCase(),
          allergies: formData.allergies.trim(),
        },
        emergencyContact: {
          name: formData.emergencyContact.trim(),
          phone: formData.emergencyContactPhone.trim(),
        },
      });
      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว", [
        { text: "ตกลง", onPress: playClickSound },
      ]);
      const updated = await getUserMeApi();
      setProfile(updated);
    } catch (error: any) {
      await playClickSound();
      Alert.alert("ผิดพลาด", error.message || "ไม่สามารถบันทึกได้");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    await playClickSound();
    await triggerHaptic();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(main)/profile");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>บัญชีของฉัน</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อ</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(t) => setFormData({ ...formData, firstName: t })}
              placeholder="ชื่อจริง"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>นามสกุล</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(t) => setFormData({ ...formData, lastName: t })}
              placeholder="นามสกุล"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.email}
              editable={false}
            />
            <Text style={styles.helperText}>ไม่สามารถเปลี่ยนอีเมลได้</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>เบอร์โทรศัพท์ 10 หลัก</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(t) => setFormData({ ...formData, phone: t })}
              placeholder="08x-xxx-xxxx"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={22} color="#DC2626" />
            <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>
              ข้อมูลทางการแพทย์
            </Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            ช่วยเจ้าหน้าที่ฉุกเฉินได้ทันที
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>กรุ๊ปเลือด</Text>
            <TextInput
              style={styles.input}
              value={formData.bloodType}
              onChangeText={(t) =>
                setFormData({ ...formData, bloodType: t.toUpperCase() })
              }
              placeholder="เช่น A+, O-, AB"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>แพ้ยา/อาหาร (ถ้ามี)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.allergies}
              onChangeText={(t) => setFormData({ ...formData, allergies: t })}
              placeholder="เช่น แพ้เพนิซิลลิน, ถั่วลิสง..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="contact-phone" size={22} color="#DC2626" />
            <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>
              ผู้ติดต่อฉุกเฉิน
            </Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            เราจะโทรหาคนนี้หากคุณไม่ตอบรับ
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อผู้ติดต่อ</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact}
              onChangeText={(t) =>
                setFormData({ ...formData, emergencyContact: t })
              }
              placeholder="เช่น คุณแม่, พี่ชาย"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>เบอร์โทรศัพท์</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContactPhone}
              onChangeText={(t) =>
                setFormData({ ...formData, emergencyContactPhone: t })
              }
              placeholder="08x-xxx-xxxx"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="save" size={22} color="#fff" />
                <Text style={styles.saveButtonText}>บันทึกข้อมูลทั้งหมด</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#6B7280" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  sectionSubtitle: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  inputDisabled: { backgroundColor: "#F3F4F6", color: "#9CA3AF" },
  textArea: { height: 100 },
  helperText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    fontStyle: "italic",
  },
  buttonContainer: { paddingHorizontal: 20, marginVertical: 32 },
  saveButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});
