// app/user-guide.tsx - User Guide Page
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

interface GuideSection {
    id: string;
    title: string;
    icon: string;
    content: GuideStep[];
}

interface GuideStep {
    step: number;
    title: string;
    description: string;
    tips?: string;
}

const guideData: GuideSection[] = [
    {
        id: 'sos',
        title: 'การขอความช่วยเหลือฉุกเฉิน (SOS)',
        icon: 'emergency',
        content: [
            {
                step: 1,
                title: 'เปิดแอพและไปที่แท็บ SOS',
                description: 'กดที่ไอคอน Shield (โล่) ที่แถบเมนูด้านล่าง',
            },
            {
                step: 2,
                title: 'เลือกระดับความรุนแรง',
                description: 'เลือกระดับความรุนแรงของเหตุการณ์:\n• ระดับ 1: เล็กน้อย\n• ระดับ 2: ปานกลาง\n• ระดับ 3: รุนแรง\n• ระดับ 4: วิกฤต',
            },
            {
                step: 3,
                title: 'เลือกประเภทเหตุการณ์',
                description: 'เลือกประเภทเหตุการณ์ที่เกิดขึ้น เช่น อุบัติเหตุ, หมดสติ, ล้ม/บาดเจ็บ',
            },
            {
                step: 4,
                title: 'ยืนยันการแจ้งเหตุ',
                description: 'กดปุ่ม "ยืนยันแจ้งเหตุฉุกเฉิน" ระบบจะส่งข้อมูลไปยัง 1669 ทันที',
                tips: 'ตรวจสอบให้แน่ใจว่าเปิด GPS และอนุญาตให้แอพเข้าถึงตำแหน่งของคุณ',
            },
            {
                step: 5,
                title: 'รอการติดต่อกลับ',
                description: 'เจ้าหน้าที่จะติดต่อกลับภายใน 2-5 นาที อย่าปิดแอพและเตรียมรับสาย',
            },
        ],
    },
    {
        id: 'nearby',
        title: 'ค้นหาโรงพยาบาลใกล้เคียง',
        icon: 'local-hospital',
        content: [
            {
                step: 1,
                title: 'เปิดแท็บ Nearby',
                description: 'กดที่ไอคอน Compass (เข็มทิศ) ที่แถบเมนูด้านล่าง',
            },
            {
                step: 2,
                title: 'ดูรายการโรงพยาบาล',
                description: 'ระบบจะแสดงโรงพยาบาลที่ใกล้ที่สุดพร้อมระยะทาง',
            },
            {
                step: 3,
                title: 'ดูรายละเอียดและโทรติดต่อ',
                description: 'กดที่โรงพยาบาลเพื่อดูรายละเอียด ที่อยู่ และโทรติดต่อได้ทันที',
                tips: 'สามารถกดปุ่มโทรเพื่อโทรติดต่อโรงพยาบาลได้โดยตรง',
            },
        ],
    },
    {
        id: 'profile',
        title: 'จัดการข้อมูลส่วนตัว',
        icon: 'person',
        content: [
            {
                step: 1,
                title: 'เข้าสู่หน้าโปรไฟล์',
                description: 'กดที่ไอคอนโปรไฟล์ที่แถบเมนูด้านล่าง',
            },
            {
                step: 2,
                title: 'แก้ไขข้อมูลส่วนตัว',
                description: 'กดที่ "บัญชีของฉัน" เพื่อแก้ไขชื่อ, เบอร์โทร',
            },
            {
                step: 3,
                title: 'เพิ่มข้อมูลทางการแพทย์',
                description: 'กรอกกรุ๊ปเลือด, อาการแพ้ยา/อาหาร เพื่อช่วยเจ้าหน้าที่ในกรณีฉุกเฉิน',
                tips: 'ข้อมูลนี้สำคัญมาก! จะช่วยให้เจ้าหน้าที่ดูแลคุณได้อย่างถูกต้อง',
            },
            {
                step: 4,
                title: 'ระบุผู้ติดต่อฉุกเฉิน',
                description: 'กรอกชื่อและเบอร์โทรของบุคคลที่จะติดต่อในกรณีฉุกเฉิน',
            },
            {
                step: 5,
                title: 'บันทึกข้อมูล',
                description: 'กดปุ่ม "บันทึกข้อมูล" เพื่อบันทึกการเปลี่ยนแปลง',
            },
        ],
    },
    {
        id: 'settings',
        title: 'การตั้งค่าแอพ',
        icon: 'settings',
        content: [
            {
                step: 1,
                title: 'เข้าสู่การตั้งค่า',
                description: 'ไปที่โปรไฟล์ > การตั้งค่า',
            },
            {
                step: 2,
                title: 'ปรับการแจ้งเตือน',
                description: 'เปิด/ปิดการแจ้งเตือนทั้งหมด หรือเฉพาะการแจ้งเตือนฉุกเฉิน',
            },
            {
                step: 3,
                title: 'ตั้งค่าเสียงและการสั่น',
                description: 'เปิด/ปิดเสียงเอฟเฟกต์และการสั่นตามความต้องการ',
            },
            {
                step: 4,
                title: 'เปลี่ยนภาษา',
                description: 'เลือกภาษาไทยหรือภาษาอังกฤษ',
                tips: 'การเปลี่ยนภาษาจะมีผลทันที',
            },
        ],
    },
];

export default function UserGuideScreen() {
    const router = useRouter();
    const [expandedSection, setExpandedSection] = useState<string | null>('sos');

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>คู่มือการใช้งาน</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.intro}>
                    <MaterialIcons name="menu-book" size={48} color="#DC2626" />
                    <Text style={styles.introTitle}>ยินดีต้อนรับสู่ Emergency Care</Text>
                    <Text style={styles.introText}>
                        แอพพลิเคชันช่วยเหลือฉุกเฉินที่เชื่อมต่อคุณกับศูนย์ 1669 และโรงพยาบาลใกล้เคียง
                    </Text>
                </View>

                {guideData.map((section) => (
                    <View key={section.id} style={styles.section}>
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => toggleSection(section.id)}
                        >
                            <View style={styles.sectionLeft}>
                                <View style={styles.sectionIcon}>
                                    <MaterialIcons name={section.icon as any} size={24} color="#DC2626" />
                                </View>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            <MaterialIcons
                                name={expandedSection === section.id ? "expand-less" : "expand-more"}
                                size={24}
                                color="#6B7280"
                            />
                        </TouchableOpacity>

                        {expandedSection === section.id && (
                            <View style={styles.sectionContent}>
                                {section.content.map((step) => (
                                    <View key={step.step} style={styles.stepCard}>
                                        <View style={styles.stepHeader}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>{step.step}</Text>
                                            </View>
                                            <Text style={styles.stepTitle}>{step.title}</Text>
                                        </View>
                                        <Text style={styles.stepDescription}>{step.description}</Text>
                                        {step.tips && (
                                            <View style={styles.tipBox}>
                                                <MaterialIcons name="lightbulb" size={16} color="#D97706" />
                                                <Text style={styles.tipText}>{step.tips}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                <View style={styles.emergencyTips}>
                    <View style={styles.emergencyHeader}>
                        <MaterialIcons name="warning" size={24} color="#DC2626" />
                        <Text style={styles.emergencyTitle}>เคล็ดลับสำคัญ</Text>
                    </View>
                    <View style={styles.tipsList}>
                        <Text style={styles.tipsItem}>• เปิด GPS ตลอดเวลาเพื่อความแม่นยำในการระบุตำแหน่ง</Text>
                        <Text style={styles.tipsItem}>• อัปเดตข้อมูลทางการแพทย์ให้เป็นปัจจุบัน</Text>
                        <Text style={styles.tipsItem}>• เก็บเบอร์โทรฉุกเฉินไว้ในที่ง่ายต่อการเข้าถึง</Text>
                        <Text style={styles.tipsItem}>• ในกรณีฉุกเฉินรุนแรง โทร 1669 โดยตรง</Text>
                    </View>
                </View>

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
    intro: {
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
        marginTop: 16,
    },
    introTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", marginTop: 12, marginBottom: 8 },
    introText: { fontSize: 15, color: "#6B7280", textAlign: "center", lineHeight: 22 },
    section: { backgroundColor: "#fff", marginTop: 16, overflow: "hidden" },
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
    sectionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1 },
    sectionContent: { paddingHorizontal: 16, paddingBottom: 16 },
    stepCard: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 12 },
    stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    stepNumberText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
    stepTitle: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1 },
    stepDescription: { fontSize: 14, color: "#4B5563", lineHeight: 20, marginLeft: 40 },
    tipBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FEF3C7",
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        marginLeft: 40,
    },
    tipText: { flex: 1, fontSize: 13, color: "#92400E", marginLeft: 8, lineHeight: 18 },
    emergencyTips: {
        backgroundColor: "#FEE2E2",
        padding: 20,
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    emergencyHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    emergencyTitle: { fontSize: 18, fontWeight: "bold", color: "#DC2626", marginLeft: 8 },
    tipsList: { marginTop: 8 },
    tipsItem: { fontSize: 14, color: "#991B1B", lineHeight: 24, marginBottom: 4 },
});

