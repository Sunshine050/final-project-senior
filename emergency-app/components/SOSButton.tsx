import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, radii } from "../constants/theme";

interface SOSButtonProps {
  label?: string;
  subLabel?: string;
  disabled?: boolean;
  onPress: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  label = "กด SOS",
  subLabel = "แจ้งเหตุฉุกเฉินทันที",
  disabled,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.07,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [scale]);

  return (
    <Pressable
      style={styles.touchable}
      accessibilityLabel="ปุ่มส่งสัญญาณ SOS"
      accessibilityHint="แตะค้างเพื่อเริ่มขั้นตอนแจ้งเหตุฉุกเฉิน"
      disabled={disabled}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.sosButton,
          {
            transform: [{ scale }],
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons name="alert-decagram" size={48} color="#fff" />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subLabel}>{subLabel}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    width: 220,
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    borderWidth: 8,
    borderColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 12 },
  },
  label: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 12,
  },
  subLabel: {
    color: "#ffe4e6",
    fontSize: 15,
    marginTop: 4,
  },
});
