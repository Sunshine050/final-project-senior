// app/policy.tsx - Privacy Policy & Terms Page
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PolicyScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>นโยบายและความเป็นส่วนตัว</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
          onPress={() => setActiveTab('privacy')}
        >
          <MaterialIcons
            name="shield"
            size={20}
            color={activeTab === 'privacy' ? "#DC2626" : "#6B7280"}
          />
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
            ความเป็นส่วนตัว
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
          onPress={() => setActiveTab('terms')}
        >
          <MaterialIcons
            name="description"
            size={20}
            color={activeTab === 'terms' ? "#DC2626" : "#6B7280"}
          />
          <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
            เงื่อนไขการใช้งาน
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'privacy' ? (
          <View>
            <View style={styles.section}>
              <Text style={styles.updateDate}>อัปเดตล่าสุด: 1 ธันวาคม 2567</Text>
              <Text style={styles.sectionTitle}>1. ข้อมูลที่เราเก็บรวบรวม</Text>
              <Text style={styles.paragraph}>
                เราเก็บรวบรวมข้อมูลส่วนบุคคลของคุณเพื่อให้บริการฉุกเฉินได้อย่างมีประสิทธิภาพ ข้อมูลที่เก็บรวมถึง:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• ข้อมูลส่วนตัว (ชื่อ, นามสกุล, อีเมล, เบอร์โทร)</Text>
                <Text style={styles.bulletItem}>• ข้อมูลทางการแพทย์ (กรุ๊ปเลือด, อาการแพ้)</Text>
                <Text style={styles.bulletItem}>• ข้อมูลตำแหน่งที่ตั้ง (GPS)</Text>
                <Text style={styles.bulletItem}>• ข้อมูลการใช้งานแอพพลิเคชัน</Text>
              </View>
              <Text style={styles.sectionTitle}>2. วัตถุประสงค์ในการใช้ข้อมูล</Text>
              <Text style={styles.paragraph}>เราใช้ข้อมูลของคุณเพื่อ:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• ให้บริการช่วยเหลือฉุกเฉิน</Text>
                <Text style={styles.bulletItem}>• ติดต่อประสานงานกับหน่วยกู้ภัยและโรงพยาบาล</Text>
                <Text style={styles.bulletItem}>• ปรับปรุงคุณภาพการให้บริการ</Text>
                <Text style={styles.bulletItem}>• ส่งการแจ้งเตือนที่สำคัญ</Text>
              </View>
              <Text style={styles.sectionTitle}>3. การรักษาความปลอดภัยของข้อมูล</Text>
              <Text style={styles.paragraph}>
                เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ รวมถึง:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• การเข้ารหัสข้อมูลด้วย SSL/TLS</Text>
                <Text style={styles.bulletItem}>• การจำกัดการเข้าถึงข้อมูล</Text>
                <Text style={styles.bulletItem}>• การสำรองข้อมูลอย่างสม่ำเสมอ</Text>
                <Text style={styles.bulletItem}>• การตรวจสอบความปลอดภัยเป็นประจำ</Text>
              </View>
              <Text style={styles.sectionTitle}>4. การแชร์ข้อมูล</Text>
              <Text style={styles.paragraph}>เราจะแชร์ข้อมูลของคุณเฉพาะกับ:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• ศูนย์ฉุกเฉิน 1669</Text>
                <Text style={styles.bulletItem}>• โรงพยาบาลและหน่วยกู้ภัยที่เกี่ยวข้อง</Text>
                <Text style={styles.bulletItem}>• ผู้ติดต่อฉุกเฉินที่คุณระบุไว้</Text>
              </View>
              <Text style={styles.paragraph}>
                เราจะไม่ขายหรือแชร์ข้อมูลของคุณให้กับบุคคลที่สามเพื่อการตลาด
              </Text>
              <Text style={styles.sectionTitle}>5. สิทธิของคุณ</Text>
              <Text style={styles.paragraph}>คุณมีสิทธิ์ในการ:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• เข้าถึงและแก้ไขข้อมูลส่วนบุคคล</Text>
                <Text style={styles.bulletItem}>• ลบข้อมูลของคุณ</Text>
                <Text style={styles.bulletItem}>• ถอนความยินยอมในการใช้ข้อมูล</Text>
                <Text style={styles.bulletItem}>• ร้องเรียนการใช้ข้อมูลที่ไม่เหมาะสม</Text>
              </View>
              <Text style={styles.sectionTitle}>6. ติดต่อเรา</Text>
              <Text style={styles.paragraph}>
                หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อเราที่:
              </Text>
              <View style={styles.contactBox}>
                <Text style={styles.contactText}>อีเมล: privacy@emergencycare.com</Text>
                <Text style={styles.contactText}>โทร: 02-XXX-XXXX</Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.section}>
              <Text style={styles.updateDate}>อัปเดตล่าสุด: 1 ธันวาคม 2567</Text>
              <Text style={styles.sectionTitle}>1. การยอมรับเงื่อนไข</Text>
              <Text style={styles.paragraph}>
                การใช้งานแอพพลิเคชัน Emergency Care ถือว่าคุณยอมรับเงื่อนไขการใช้งานทั้งหมด หากคุณไม่ยอมรับเงื่อนไขเหล่านี้ กรุณาหยุดการใช้งานทันที
              </Text>
              <Text style={styles.sectionTitle}>2. การใช้งานแอพพลิเคชัน</Text>
              <Text style={styles.paragraph}>คุณตกลงที่จะ:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• ใช้งานแอพเพื่อวัตถุประสงค์ฉุกเฉินเท่านั้น</Text>
                <Text style={styles.bulletItem}>• ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</Text>
                <Text style={styles.bulletItem}>• ไม่ใช้แอพในทางที่ผิดกฎหมาย</Text>
                <Text style={styles.bulletItem}>• รักษาความลับของบัญชีผู้ใช้</Text>
              </View>
              <Text style={styles.sectionTitle}>3. การให้บริการ</Text>
              <Text style={styles.paragraph}>เราพยายามให้บริการที่ดีที่สุด แต่:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• เราไม่รับประกันว่าบริการจะไม่มีข้อผิดพลาด</Text>
                <Text style={styles.bulletItem}>• เราอาจหยุดให้บริการชั่วคราวเพื่อบำรุงรักษา</Text>
                <Text style={styles.bulletItem}>• เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงบริการ</Text>
              </View>
              <Text style={styles.sectionTitle}>4. ความรับผิดชอบ</Text>
              <Text style={styles.paragraph}>แอพพลิเคชันนี้เป็นเครื่องมือช่วยเหลือเท่านั้น:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• เราไม่รับผิดชอบต่อความล่าช้าในการให้ความช่วยเหลือ</Text>
                <Text style={styles.bulletItem}>• คุณควรโทร 1669 โดยตรงในกรณีฉุกเฉินรุนแรง</Text>
                <Text style={styles.bulletItem}>• เราไม่รับผิดชอบต่อการกระทำของหน่วยกู้ภัย</Text>
              </View>
              <Text style={styles.sectionTitle}>5. ทรัพย์สินทางปัญญา</Text>
              <Text style={styles.paragraph}>
                เนื้อหา ดีไซน์ และฟีเจอร์ทั้งหมดในแอพเป็นทรัพย์สินของเรา คุณไม่สามารถคัดลอก ดัดแปลง หรือจำหน่ายโดยไม่ได้รับอนุญาต
              </Text>
              <Text style={styles.sectionTitle}>6. การยกเลิกบัญชี</Text>
              <Text style={styles.paragraph}>เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณหาก:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• คุณละเมิดเงื่อนไขการใช้งาน</Text>
                <Text style={styles.bulletItem}>• คุณใช้งานในทางที่ผิด</Text>
                <Text style={styles.bulletItem}>• คุณให้ข้อมูลเท็จ</Text>
              </View>
              <Text style={styles.sectionTitle}>7. การเปลี่ยนแปลงเงื่อนไข</Text>
              <Text style={styles.paragraph}>
                เราอาจเปลี่ยนแปลงเงื่อนไขการใช้งานได้ตลอดเวลา การใช้งานต่อไปถือว่าคุณยอมรับเงื่อนไขใหม่
              </Text>
              <Text style={styles.sectionTitle}>8. กฎหมายที่ใช้บังคับ</Text>
              <Text style={styles.paragraph}>
                เงื่อนไขนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจศาลไทย
              </Text>
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: 6,
  },
  tabActive: { borderBottomColor: "#DC2626" },
  tabText: { fontSize: 15, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#DC2626" },
  content: { flex: 1 },
  section: { backgroundColor: "#fff", marginTop: 16, padding: 20 },
  updateDate: { fontSize: 13, color: "#6B7280", marginBottom: 20, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginTop: 20, marginBottom: 12 },
  paragraph: { fontSize: 15, color: "#374151", lineHeight: 24, marginBottom: 12 },
  bulletList: { marginLeft: 8, marginBottom: 12 },
  bulletItem: { fontSize: 15, color: "#374151", lineHeight: 24, marginBottom: 6 },
  contactBox: { backgroundColor: "#F3F4F6", padding: 16, borderRadius: 12, marginTop: 8 },
  contactText: { fontSize: 15, color: "#111827", marginBottom: 6 },
});

