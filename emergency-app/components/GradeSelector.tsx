import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  severityOptions,
  type EmergencySeverity,
} from "../constants/emergencyTypes";
import { colors, radii, spacing } from "../constants/theme";

interface GradeSelectorProps {
  selected?: EmergencySeverity;
  onSelect: (level: EmergencySeverity) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = memo(
  ({ selected, onSelect }) => {
    return (
      <View style={styles.container}>
        {severityOptions.map((option) => {
          const isActive = option.level === selected;
          return (
            <Pressable
              key={option.level}
              style={[
                styles.card,
                {
                  borderColor: isActive ? option.color : colors.border,
                  backgroundColor: isActive
                    ? `${option.color}22`
                    : "transparent",
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onSelect(option.level)}
            >
              <View
                style={[styles.levelBadge, { backgroundColor: option.color }]}
              >
                <Text style={styles.levelText}>{option.level}</Text>
              </View>
              <View style={styles.textGroup}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.description}>{option.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  textGroup: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
