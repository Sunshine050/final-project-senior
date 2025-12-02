import { memo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { emergencyTypes } from "../constants/emergencyTypes";
import { colors, radii, spacing } from "../constants/theme";

interface EmergencyTypeSelectorProps {
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const EmergencyTypeSelector: React.FC<EmergencyTypeSelectorProps> = memo(
  ({ selectedId, onSelect }) => {
    return (
      <FlatList
        data={emergencyTypes}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: spacing.sm }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = item.id === selectedId;
          return (
            <Pressable
              style={[
                styles.card,
                {
                  backgroundColor: isActive
                    ? item.accent + "22"
                    : colors.surfaceDark,
                  borderColor: isActive ? item.accent : "transparent",
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onSelect(item.id)}
            >
              <View
                style={[styles.iconBadge, { backgroundColor: item.background }]}
              >
                <MaterialCommunityIcons
                  name={item.icon as never}
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Pressable>
          );
        }}
      />
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    minHeight: 140,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
