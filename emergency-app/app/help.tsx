// app/help.tsx - ศูนย์ช่วยเหลือ (เวอร์ชันสมบูรณ์ ไม่มี error แล้วนะครับ!)
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type IconName =
  | "phone"
  | "email"
  | "chat"
  | "help-outline"
  | "expand-more"
  | "expand-less"
  | "emergency"
  | "chevron-right"
  | "article"
  | "video-library"
  | "feedback"
  | "arrow-back";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "ฉันจะขอความช่วยเหลือฉุกเฉินได้อย่างไร?",
      answer:
        "กดปุ่ม SOS บนหน้าหลัก จากนั้นเลือกระดับความรุนแรงและประเภทเหตุการณ์ ระบบจะส่งข้อมูลของคุณไปยังศูนย์ 1669 และโรงพยาบาลที่ใกล้ที่สุดทันที",
    },
    {
      question: "ข้อมูลส่วนตัวของฉันปลอดภัยหรือไม่?",
      answer:
        "ข้อมูลของคุณได้รับการเข้ารหัสและจัดเก็บอย่างปลอดภัย เราจะใช้ข้อมูลเฉพาะในกรณีฉุกเฉินเท่านั้น และจะไม่แชร์ให้บุคคลที่สามโดยไม่ได้รับอนุญาต",
    },
    {
      question: "ฉันสามารถดูประวัติการขอความช่วยเหลือได้หรือไม่?",
      answer:
        "ได้ คุณสามารถดูประวัติการขอความช่วยเหลือทั้งหมดได้ที่เมนู 'ประวัติ' ซึ่งจะแสดงรายละเอียดเวลา สถานที่ และสถานะของแต่ละครั้ง",
    },
    {
      question: "แอพทำงานโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ตได้หรือไม่?",
      answer:
        "แอพต้องการการเชื่อมต่ออินเทอร์เน็ตเพื่อส่งข้อมูลไปยังศูนย์ช่วยเหลือ แต่คุณสามารถดูเบอร์โทรฉุกเฉินและโทรออกได้แม้ไม่มีอินเทอร์เน็ต",
    },
    {
      question: "ฉันจะอัปเดตข้อมูลทางการแพทย์ได้อย่างไร?",
      answer:
        "ไปที่ 'โปรไฟล์' > 'บัญชีของฉัน' จากนั้นเลื่อนลงมาที่ส่วน 'ข้อมูลทางการแพทย์' คุณสามารถอัปเดตกรุ๊ปเลือด อาการแพ้ และข้อมูลอื่นๆ ได้",
    },
    {
      question: "ถ้าฉันกดขอความช่วยเหลือผิดจะทำอย่างไร?",
      answer:
        "คุณสามารถยกเลิกการขอความช่วยเหลือได้ทันทีโดยกดปุ่ม 'ยกเลิกการแจ้งเหตุ' ในหน้าสถานะ หากเจ้าหน้าที่โทรมาแล้ว กรุณาแจ้งว่าเป็นการกดผิด",
    },
  ];

  const contactMethods = [
    {
      icon: "phone" as IconName,
      title: "โทรศัพท์",
      subtitle: "1669 (ฉุกเฉิน)",
      color: "#DC2626",
      bgColor: "#FEE2E2",
      action: () => Linking.openURL("tel:1669"),
    },
    {
      icon: "email" as IconName,
      title: "อีเมล",
      subtitle: "support@emergencycare.com",
      color: "#2563EB",
      bgColor: "#DBEAFE",
      action: () => Linking.openURL("mailto:support@emergencycare.com"),
    },
    {
      icon: "chat" as IconName,
      title: "แชทสด",
      subtitle: "พร้อมให้บริการ 24/7 (เร็วๆ นี้)",
      color: "#059669",
      bgColor: "#D1FAE5",
      action: () =>
        Alert.alert("แชทสด", "ฟีเจอร์แชทสดกำลังอยู่ระหว่างการพัฒนา\nจะเปิดให้ใช้งานเร็ว ๆ นี้ค่ะ"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ศูนย์ช่วยเหลือ</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyIcon}>
            <MaterialIcons name="emergency" size={32} color="#DC2626" />
          </View>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>ฉุกเฉิน?</Text>
            <Text style={styles.emergencySubtitle}>กดปุ่ม SOS หรือโทร 1669 ทันที</Text>
          </View>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL("tel:1669")}
          >
            <MaterialIcons name="phone" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ติดต่อเรา</Text>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={method.action}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIcon, { backgroundColor: method.bgColor }]}>
                <MaterialIcons name={method.icon} size={24} color={method.color} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>คำถามที่พบบ่อย</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                activeOpacity={0.8}
              >
                <View style={styles.faqIconContainer}>
                  <MaterialIcons name="help-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <MaterialIcons
                  name={expandedIndex === index ? "expand-less" : "expand-more"}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ลิงก์ที่เป็นประโยชน์</Text>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push("/user-guide" as any)}
          >
            <View style={[styles.linkIcon, { backgroundColor: "#DBEAFE" }]}>
              <MaterialIcons name="article" size={22} color="#2563EB" />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>คู่มือการใช้งาน</Text>
              <Text style={styles.linkSubtitle}>เรียนรู้วิธีใช้แอพอย่างละเอียด</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() =>
              Alert.alert("วิดีโอสอนใช้งาน", "กำลังจัดทำวิดีโอแนะนำอยู่\nจะอัปเดตให้เร็ว ๆ นี้ค่ะ")
            }
          >
            <View style={[styles.linkIcon, { backgroundColor: "#FEF3C7" }]}>
              <MaterialIcons name="video-library" size={22} color="#D97706" />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>วิดีโอสอนใช้งาน</Text>
              <Text style={styles.linkSubtitle}>ดูวิดีโอแนะนำการใช้งาน</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FCA5A5",
  },
  emergencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emergencyContent: { flex: 1 },
  emergencyTitle: { fontSize: 18, fontWeight: "bold", color: "#DC2626", marginBottom: 2 },
  emergencySubtitle: { fontSize: 14, color: "#991B1B" },
  emergencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactContent: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  contactSubtitle: { fontSize: 14, color: "#6B7280" },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  faqQuestion: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16, paddingLeft: 60 },
  faqAnswerText: { fontSize: 14, color: "#6B7280", lineHeight: 22 },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  linkContent: { flex: 1 },
  linkTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  linkSubtitle: { fontSize: 13, color: "#6B7280" },
});

