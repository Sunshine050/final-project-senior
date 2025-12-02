// app/(main)/sos.tsx - แก้ไข footer ไม่ให้ถูกบัง
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import EmergencyGradeSelector from "../../src/components/sos/EmergencyGradeSelector";
import EmergencyTypeSelector, {
  EMERGENCY_OPTIONS,
} from "../../src/components/sos/EmergencyTypeSelector";
import RequestStatus from "../../src/components/sos/RequestStatus";
import { createEmergencyRequest } from "../../src/api/sos/sos";
import {
  EmergencyGrade,
  EmergencyType,
  EmergencyResponse,
} from "../../src/types/sos";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";

type Step = "initial" | "grade" | "type" | "status";

// Map EmergencyGrade to EmergencySeverity
const gradeToSeverity = (grade: EmergencyGrade): "low" | "medium" | "high" | "critical" => {
  switch (grade) {
    case EmergencyGrade.LEVEL_1:
      return "low";
    case EmergencyGrade.LEVEL_2:
      return "medium";
    case EmergencyGrade.LEVEL_3:
      return "high";
    case EmergencyGrade.LEVEL_4:
      return "critical";
    default:
      return "medium";
  }
};

export default function SOSScreens() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("initial");
  const [selectedGrade, setSelectedGrade] = useState<EmergencyGrade | null>(
    null
  );
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [emergency, setEmergency] = useState<EmergencyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendSOS = async () => {
    if (!selectedGrade || !selectedTypeId) return;

    const selectedOption = EMERGENCY_OPTIONS.find(
      (opt) => opt.id === selectedTypeId
    );
    if (!selectedOption) return;

    setLoading(true);
    try {
      // Request location permission and get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("common.error"),
          "กรุณาอนุญาตให้เข้าถึงตำแหน่งเพื่อส่งสัญญาณ SOS"
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address from reverse geocoding
      let address = "ไม่ทราบที่อยู่";
      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (geocode) {
          const addressParts = [
            geocode.street,
            geocode.district,
            geocode.subdistrict,
            geocode.city,
            geocode.region,
            geocode.postalCode,
          ].filter(Boolean);
          address = addressParts.join(" ") || "ไม่ทราบที่อยู่";
        }
      } catch (e) {
        console.warn("Reverse geocoding failed:", e);
      }

      // Get user info
      const callerName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "ไม่ระบุชื่อ"
        : "ไม่ระบุชื่อ";
      const callerPhone = user?.phone || "ไม่ระบุเบอร์โทร";

      const res = await createEmergencyRequest({
        callerName,
        callerPhone,
        description: `${selectedOption.label} - ระดับความรุนแรง: ${selectedGrade}`,
        severity: gradeToSeverity(selectedGrade),
        address,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        emergencyType: selectedOption.backendType,
      });

      setEmergency(res);
      setStep("status");
    } catch (err: any) {
      console.error("SOS Error:", err);
      Alert.alert(t("common.error"), err.message || t("sos.send"));
    } finally {
      setLoading(false);
    }
  };

  if (step === "status" && emergency) {
    return (
      <RequestStatus
        emergency={emergency}
        onCancel={() => setStep("initial")}
        onUpdate={(updated) => setEmergency(updated)}
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
          <Text style={styles.headerTitle}>{t("sos.selectGrade")}</Text>
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
          <Text style={styles.headerTitle}>{t("sos.selectType")}</Text>
        </View>
        <View style={styles.content}>
          <EmergencyTypeSelector
            selectedTypeId={selectedTypeId}
            onSelect={setSelectedTypeId}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setStep("initial")}
          >
            <Text style={styles.cancelText}>{t("common.cancel")}</Text>
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
              <Text style={styles.confirmText}>{t("sos.send")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.initial}>
        <Text style={styles.title}>{t("sos.title")}</Text>
        <Text style={styles.subtitle}>{t("sos.subtitle")}</Text>
        <TouchableOpacity
          style={styles.bigSosBtn}
          onPress={() => setStep("grade")}
        >
          <MaterialIcons name="add-alert" size={100} color="white" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtnSmall} onPress={() => {}}>
          <Text style={styles.cancelTextSmall}>{t("common.cancel")}</Text>
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
    flexDirection: "row",
    padding: 20,
    paddingBottom: 30,
    gap: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmBtn: {
    flex: 2,
    padding: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
