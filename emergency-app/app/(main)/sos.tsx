// app/(main)/sos.tsx - แก้ไข footer ไม่ให้ถูกบัง
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmergencyGradeSelector from "@/src/components/sos/EmergencyGradeSelector";
import EmergencyTypeSelector, {
  EMERGENCY_OPTIONS,
} from "@/src/components/sos/EmergencyTypeSelector";
import RequestStatus from "@/src/components/sos/RequestStatus";
import { createEmergencyRequest } from "@/src/api/sos/sos";
import {
  EmergencyGrade,
  EmergencyType,
  EmergencyResponse,
  EmergencyStatus,
} from "@/src/types/sos";
import { useTranslation } from "react-i18next";

type Step = "initial" | "grade" | "type" | "status";

const ACTIVE_EMERGENCY_KEY = "@active_emergency";

export default function SOSScreens() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("initial");
  const [selectedGrade, setSelectedGrade] = useState<EmergencyGrade | null>(
    null
  );
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [emergency, setEmergency] = useState<EmergencyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveEmergency();
  }, []);

  const loadActiveEmergency = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACTIVE_EMERGENCY_KEY);
      if (stored) {
        const activeEmergency: EmergencyResponse = JSON.parse(stored);
        if (
          activeEmergency.status !== EmergencyStatus.COMPLETED &&
          activeEmergency.status !== EmergencyStatus.CANCELLED
        ) {
          setEmergency(activeEmergency);
          setStep("status");
        } else {
          await AsyncStorage.removeItem(ACTIVE_EMERGENCY_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load active emergency:", error);
    }
  };

  const saveActiveEmergency = async (emergencyData: EmergencyResponse) => {
    try {
      await AsyncStorage.setItem(
        ACTIVE_EMERGENCY_KEY,
        JSON.stringify(emergencyData)
      );
    } catch (error) {
      console.error("Failed to save active emergency:", error);
    }
  };

  const clearActiveEmergency = async () => {
    try {
      await AsyncStorage.removeItem(ACTIVE_EMERGENCY_KEY);
    } catch (error) {
      console.error("Failed to clear active emergency:", error);
    }
  };

  const sendSOS = async () => {
    if (!selectedGrade || !selectedTypeId) return;

    const selectedOption = EMERGENCY_OPTIONS.find(
      (opt) => opt.id === selectedTypeId
    );
    if (!selectedOption) return;

    setLoading(true);
    try {
      const res = await createEmergencyRequest({
        description: `เหตุฉุกเฉิน: ${selectedOption.label} - ระดับ ${selectedGrade}`,
        grade: selectedGrade,
        type: selectedOption.backendType,
      });
      setEmergency(res);
      await saveActiveEmergency(res);
      setStep("status");
    } catch (err: any) {
      Alert.alert("ผิดพลาด", err.message || "ไม่สามารถส่งสัญญาณได้");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEmergency = async () => {
    await clearActiveEmergency();
    setEmergency(null);
    setStep("initial");
    setSelectedGrade(null);
    setSelectedTypeId(null);
  };

  const handleEmergencyUpdate = async (updatedEmergency: EmergencyResponse) => {
    setEmergency(updatedEmergency);
    if (
      updatedEmergency.status === EmergencyStatus.COMPLETED ||
      updatedEmergency.status === EmergencyStatus.CANCELLED
    ) {
      await clearActiveEmergency();
    } else {
      await saveActiveEmergency(updatedEmergency);
    }
  };

  if (step === "status" && emergency) {
    return (
      <RequestStatus
        emergency={emergency}
        onCancel={handleCancelEmergency}
        onUpdate={handleEmergencyUpdate}
      />
    );
  }

  if (step === "grade") {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep("initial")}>
            <MaterialIcons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>เลือกความรุนแรง</Text>
        </View>
        <EmergencyGradeSelector
          selectedGrade={selectedGrade}
          onSelect={(g) => {
            setSelectedGrade(g);
            setStep("type");
          }}
        />
      </SafeAreaView>
    );
  }

  if (step === "type") {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep("grade")}>
            <MaterialIcons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ประเภทเหตุการณ์</Text>
        </View>
        <View style={styles.content}>
          <EmergencyTypeSelector
            selectedTypeId={selectedTypeId}
            onSelect={setSelectedTypeId}
          />
        </View>
        <View style={[styles.footer, { paddingBottom: insets.bottom + 110 }]}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setStep("initial")}
            >
              <Text style={styles.cancelText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                (!selectedTypeId || loading) && { opacity: 0.6 },
              ]}
              onPress={sendSOS}
              disabled={!selectedTypeId || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.confirmText}>ยืนยันแจ้งเหตุฉุกเฉิน</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.initial}>
        <Text style={styles.title}>คุณกำลังอยู่ในภาวะฉุกเฉินหรือไม่?</Text>
        <Text style={styles.subtitle}>กดปุ่มเพื่อขอความช่วยเหลือทันที</Text>
        <TouchableOpacity
          style={styles.bigSosBtn}
          onPress={() => setStep("grade")}
        >
          <MaterialIcons name="add-alert" size={100} color="white" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtnSmall} onPress={() => {}}>
          <Text style={styles.cancelTextSmall}>ยกเลิก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { flex: 1 },
  initial: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 60,
  },
  bigSosBtn: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#FF3B30",
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  sosText: { fontSize: 60, fontWeight: "900", color: "white", marginTop: 10 },
  cancelBtnSmall: { marginTop: 40, padding: 16 },
  cancelTextSmall: { fontSize: 18, color: "#666" },
  footer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 100,
  },
  buttonContainer: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "600", color: "#4B5563" },
  confirmBtn: {
    flex: 2,
    height: 56,
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
