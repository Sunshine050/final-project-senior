import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { Hospital, Organization } from '../types';
import { colors, radii, spacing } from '../constants/theme';

interface HospitalCardProps {
  payload: Hospital | Organization;
  distanceKm?: number;
  onNavigate?: (lat: number, lng: number) => void;
  badge?: string;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  payload,
  distanceKm,
  onNavigate,
  badge,
}) => {
  const phoneNumber = 'phone' in payload ? payload.phone : undefined;

  const location = 'location' in payload ? payload.location : undefined;
  const coords =
    location && 'coordinates' in location ? location.coordinates : undefined;

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleNavigate = () => {
    if (coords) {
      onNavigate?.(coords[1], coords[0]);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{payload.name}</Text>
          {badge && <Text style={styles.badge}>{badge}</Text>}
        </View>
        {distanceKm ? <Text style={styles.distance}>{distanceKm.toFixed(1)} กม.</Text> : null}
      </View>
      <Text style={styles.address}>{payload.address}</Text>
      {'availableCapacity' in payload && (
        <Text style={styles.capacity}>
          เตียงว่าง {payload.availableCapacity}/{payload.capacity}
        </Text>
      )}
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.outline]} onPress={handleCall}>
          <MaterialCommunityIcons name="phone" size={18} color={colors.textPrimary} />
          <Text style={styles.buttonText}>โทร</Text>
        </Pressable>
        {coords && (
          <Pressable style={[styles.button, styles.filled]} onPress={handleNavigate}>
            <MaterialCommunityIcons name="navigation" size={18} color="#fff" />
            <Text style={[styles.buttonText, { color: '#fff' }]}>นำทาง</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  distance: {
    color: colors.accentBlue,
    fontWeight: '600',
  },
  address: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  capacity: {
    color: colors.accentGreen,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

