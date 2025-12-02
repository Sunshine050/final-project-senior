import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { EmergencyType } from "../../types/sos";

export interface EmergencyOption {
  id: string;
  label: string;
  simpleLabel: string;
  icon: string;
  backendType: EmergencyType;
  color: string;
  gradient: readonly [string, string];
  lightBg: string;
}

export const EMERGENCY_OPTIONS: EmergencyOption[] = [
  {
    id: "accident",
    label: "อุบัติเหตุ",
    simpleLabel: "อุบัติเหตุ",
    icon: "car-crash",
    backendType: EmergencyType.ACCIDENT,
    color: "#EF4444",
    gradient: ["#F87171", "#EF4444"] as const,
    lightBg: "#FEE2E2",
  },
  {
    id: "unconscious",
    label: "หมดสติ",
    simpleLabel: "หมดสติ",
    icon: "favorite",
    backendType: EmergencyType.UNCONSCIOUS,
    color: "#DC2626",
    gradient: ["#EF4444", "#DC2626"] as const,
    lightBg: "#FEE2E2",
  },
  {
    id: "fall",
    label: "ล้ม/บาดเจ็บ",
    simpleLabel: "ล้มหรือบาดเจ็บ",
    icon: "accessible",
    backendType: EmergencyType.FALL,
    color: "#F59E0B",
    gradient: ["#FBBF24", "#F59E0B"] as const,
    lightBg: "#FEF3C7",
  },
  {
    id: "fire",
    label: "ไฟไหม้",
    simpleLabel: "ไฟไหม้",
    icon: "local-fire-department",
    backendType: EmergencyType.FIRE,
    color: "#F97316",
    gradient: ["#FB923C", "#F97316"] as const,
    lightBg: "#FFEDD5",
  },
  {
    id: "other",
    label: "อื่นๆ",
    simpleLabel: "เหตุการณ์อื่นๆ",
    icon: "help",
    backendType: EmergencyType.OTHER,
    color: "#6B7280",
    gradient: ["#9CA3AF", "#6B7280"] as const,
    lightBg: "#F3F4F6",
  },
];

interface EmergencyTypeSelectorProps {
  selectedTypeId: string | null;
  onSelect: (typeId: string) => void;
}

export default function EmergencyTypeSelector({
  selectedTypeId,
  onSelect,
}: EmergencyTypeSelectorProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {EMERGENCY_OPTIONS.map((item) => {
        const isSelected = selectedTypeId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              isSelected && { borderLeftColor: item.color, borderLeftWidth: 5 },
            ]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.iconBadge,
                  {
                    shadowColor: item.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={26}
                  color="#fff"
                />
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={[styles.label, isSelected && { color: item.color }]}>
                  {item.simpleLabel}
                </Text>
              </View>
              {isSelected && (
                <View style={[styles.checkBadge, { backgroundColor: item.lightBg }]}>
                  <MaterialIcons name="check-circle" size={28} color={item.color} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
  },
  cardSelected: {
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    backgroundColor: "#FAFAFA",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  checkBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
