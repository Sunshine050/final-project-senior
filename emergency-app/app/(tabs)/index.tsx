import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SOSButton } from "../../components/SOSButton";
import { GradeSelector } from "../../components/GradeSelector";
import { EmergencyTypeSelector } from "../../components/EmergencyTypeSelector";
import { HospitalCard } from "../../components/HospitalCard";
import {
  quickContacts,
  type EmergencySeverity,
} from "../../constants/emergencyTypes";
import { colors, radii, spacing } from "../../constants/theme";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "../../hooks/useLocation";
import {
  fetchNearbyHospitals,
  getEmergencyContacts,
  submitSos,
} from "../../services/api";
import type { Hospital, Organization } from "../../types";

const steps = [
  "เลือกระดับเหตุ",
  "เลือกประเภทเหตุ",
  "ยืนยันตำแหน่ง",
  "ตรวจสอบก่อนส่ง",
];

const HomeScreen = () => {
  const { user } = useAuth();
  const { coords, addressLine, refresh, isLoading: isLocating } = useLocation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [severity, setSeverity] = useState<EmergencySeverity | undefined>();
  const [emergencyType, setEmergencyType] = useState<string>();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [contacts, setContacts] = useState<Organization[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  useEffect(() => {
    const fetchContactsList = async () => {
      try {
        const data = await getEmergencyContacts();
        setContacts(data.slice(0, 4));
      } catch (error) {
        console.warn("Cannot load contacts", error);
      }
    };

    fetchContactsList();
  }, []);

  useEffect(() => {
    if (!coords) return;
    setLoadingHospitals(true);
    fetchNearbyHospitals(coords.latitude, coords.longitude)
      .then(setNearbyHospitals)
      .catch((error) => console.warn("Cannot fetch hospitals", error))
      .finally(() => setLoadingHospitals(false));
  }, [coords]);

  const mapRegion = useMemo(() => {
    if (!coords) return undefined;
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [coords]);

  const resetFlow = () => {
    setSeverity(undefined);
    setEmergencyType(undefined);
    setNotes("");
    setStepIndex(0);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetFlow();
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (stepIndex === 0) {
      closeModal();
    } else {
      setStepIndex((prev) => prev - 1);
    }
  };

  const canProceed = useMemo(() => {
    if (stepIndex === 0) return Boolean(severity);
    if (stepIndex === 1) return Boolean(emergencyType);
    if (stepIndex === 2) return Boolean(mapRegion);
    return Boolean(severity && emergencyType && mapRegion);
  }, [emergencyType, mapRegion, severity, stepIndex]);

  const handleSubmit = async () => {
    if (!coords || !severity || !emergencyType) return;
    setSubmitting(true);
    try {
      await submitSos({
        severity,
        emergencyType,
        description: notes,
        requesterName: `${user?.firstName ?? ""} ${
          user?.lastName ?? ""
        }`.trim(),
        requesterPhone: user?.phone,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: addressLine,
        },
      });
      Alert.alert("ส่งสัญญาณสำเร็จ", "หน่วยงานที่เกี่ยวข้องได้รับข้อมูลแล้ว");
      closeModal();
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const openDial = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderStepContent = () => {
    switch (stepIndex) {
      case 0:
        return <GradeSelector selected={severity} onSelect={setSeverity} />;
      case 1:
        return (
          <EmergencyTypeSelector
            selectedId={emergencyType}
            onSelect={setEmergencyType}
          />
        );
      case 2:
        return (
          <View style={{ gap: spacing.md }}>
            <View
              style={{
                height: 240,
                borderRadius: radii.md,
                overflow: "hidden",
              }}
            >
              {mapRegion ? (
                <MapView
                  style={{ flex: 1 }}
                  region={mapRegion}
                  showsUserLocation
                  showsMyLocationButton={false}
                >
                  <Marker coordinate={mapRegion} />
                </MapView>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>
                    กำลังค้นหาตำแหน่ง...
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.addressLabel}>
              {addressLine || "ไม่พบที่อยู่"}
            </Text>
            <Pressable style={styles.secondaryButton} onPress={refresh}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                color="#fff"
                size={18}
              />
              <Text style={styles.secondaryButtonText}>
                {isLocating ? "กำลังอัปเดตตำแหน่ง..." : "อัปเดตตำแหน่งอีกครั้ง"}
              </Text>
            </Pressable>
          </View>
        );
      case 3:
        return (
          <View style={{ gap: spacing.md }}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ระดับความรุนแรง</Text>
              <Text style={styles.summaryValue}>ระดับ {severity}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ประเภทเหตุ</Text>
              <Text style={styles.summaryValue}>{emergencyType}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ตำแหน่ง</Text>
              <Text style={styles.summaryValue}>{addressLine || "-"}</Text>
            </View>
            <TextInput
              style={[styles.input, { minHeight: 100 }]}
              multiline
              placeholder="รายละเอียดเพิ่มเติม เช่น จำนวนผู้บาดเจ็บ อาการนำส่ง"
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userCard}>
          <View>
            <Text style={styles.greeting}>
              สวัสดี {user?.firstName ?? "ผู้ใช้"}
            </Text>
            <Text style={styles.helperText}>พร้อมช่วยเหลือคุณ 24 ชั่วโมง</Text>
          </View>
          <MaterialCommunityIcons name="shield-alert" size={32} color="#fff" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ปุ่ม SOS</Text>
          <SOSButton onPress={() => setModalVisible(true)} disabled={!coords} />
          {!coords && (
            <Text style={styles.helperText}>
              อนุญาตตำแหน่งเพื่อเริ่มต้นใช้งาน SOS
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สายด่วนฉุกเฉิน</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
          >
            {quickContacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={[
                  styles.quickTile,
                  { backgroundColor: contact.background },
                ]}
                onPress={() => openDial(contact.number)}
              >
                <MaterialCommunityIcons
                  name={contact.icon as never}
                  size={28}
                  color="#fff"
                />
                <Text style={styles.quickLabel}>{contact.label}</Text>
                <Text style={styles.quickNumber}>{contact.number}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>โรงพยาบาลใกล้คุณ</Text>
            <Pressable onPress={() => Linking.openURL("tel:1669")}>
              <Text style={styles.linkText}>โทร 1669</Text>
            </Pressable>
          </View>

          {loadingHospitals ? (
            <Text style={styles.helperText}>กำลังค้นหาโรงพยาบาล...</Text>
          ) : (
            nearbyHospitals.slice(0, 2).map((hospital) => (
              <HospitalCard
                key={hospital.id}
                payload={hospital}
                distanceKm={(hospital.distance ?? 0) / 1000}
                onNavigate={(lat, lng) => {
                  const fallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                  const url =
                    Platform.select({
                      ios: `http://maps.apple.com/?ll=${lat},${lng}`,
                      android: `geo:${lat},${lng}?q=${hospital.name}`,
                      default: fallback,
                    }) ?? fallback;
                  Linking.openURL(url);
                }}
              />
            ))
          )}
        </View>

        {contacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>สายกู้ภัยที่พร้อมตอบรับ</Text>
            {contacts.slice(0, 3).map((org) => (
              <View key={org.id} style={styles.contactCard}>
                <View>
                  <Text style={styles.contactName}>{org.name}</Text>
                  <Text style={styles.contactMeta}>{org.type}</Text>
                </View>
                <Pressable
                  style={styles.contactCall}
                  onPress={() => openDial(org.phone)}
                >
                  <MaterialCommunityIcons name="phone" color="#fff" size={16} />
                  <Text style={styles.contactCallText}>{org.phone}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{steps[stepIndex]}</Text>
              <Pressable onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.stepIndicator}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        index <= stepIndex ? colors.primary : colors.border,
                      flex: 1,
                    },
                  ]}
                />
              ))}
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingVertical: spacing.md }}
            >
              {renderStepContent()}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>
                  {stepIndex === 0 ? "ยกเลิก" : "ย้อนกลับ"}
                </Text>
              </Pressable>
              {stepIndex === steps.length - 1 ? (
                <Pressable
                  style={[
                    styles.primaryButton,
                    !canProceed && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={!canProceed || submitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {submitting ? "กำลังส่ง..." : "ส่งคำขอ"}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    styles.primaryButton,
                    !canProceed && styles.disabledButton,
                  ]}
                  onPress={nextStep}
                  disabled={!canProceed}
                >
                  <Text style={styles.primaryButtonText}>ถัดไป</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  helperText: {
    color: colors.muted,
    marginTop: 4,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: colors.accentBlue,
    fontWeight: "600",
  },
  quickTile: {
    width: 160,
    borderRadius: radii.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    justifyContent: "space-between",
  },
  quickLabel: {
    color: "#fff",
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  quickNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "65%",
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  stepIndicator: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  stepDot: {
    height: 6,
    borderRadius: 6,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  addressLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    color: colors.muted,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.muted,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  contactCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  contactMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
  },
  contactCall: {
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  contactCallText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default HomeScreen;
