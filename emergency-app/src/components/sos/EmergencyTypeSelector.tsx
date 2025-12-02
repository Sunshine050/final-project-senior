import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { EmergencyType } from "../../types/sos";

export interface EmergencyOption {
  id: string;
  label: string;
  icon: string;
  backendType: EmergencyType;
}

export const EMERGENCY_OPTIONS: EmergencyOption[] = [
  {
    id: "accident",
    label: "อุบัติเหตุ",
    icon: "car-crash",
    backendType: EmergencyType.ACCIDENT,
  },
  {
    id: "unconscious",
    label: "หมดสติ",
    icon: "favorite",
    backendType: EmergencyType.UNCONSCIOUS,
  },
  {
    id: "fall",
    label: "ล้ม/บาดเจ็บ",
    icon: "accessible",
    backendType: EmergencyType.FALL,
  },
  {
    id: "fire",
    label: "ไฟไหม้",
    icon: "local-fire-department",
    backendType: EmergencyType.FIRE,
  },
  {
    id: "other",
    label: "อื่นๆ",
    icon: "help",
    backendType: EmergencyType.OTHER,
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
    <FlatList
      data={EMERGENCY_OPTIONS}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isSelected = selectedTypeId === item.id;
        return (
          <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(item.id)}
          >
            <View
              style={[
                styles.iconContainer,
                isSelected && styles.iconContainerSelected,
              ]}
            >
              <MaterialIcons
                name={item.icon as any}
                size={32}
                color={isSelected ? "#FFFFFF" : "#DC2626"}
              />
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minHeight: 140,
    justifyContent: "center",
  },
  cardSelected: {
    borderColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainerSelected: {
    backgroundColor: "#DC2626",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  labelSelected: {
    color: "#DC2626",
  },
});
