import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EmergencyGrade } from '../../types/sos';

interface EmergencyGradeSelectorProps {
  selectedGrade: EmergencyGrade | null;
  onSelect: (grade: EmergencyGrade) => void;
}

const GRADE_OPTIONS = [
  {
    grade: EmergencyGrade.LEVEL_1,
    label: 'ระดับ 1',
    title: 'เล็กน้อย',
    description: 'ไม่รุนแรง ต้องการความช่วยเหลือเบื้องต้น',
    color: '#10B981',
  },
  {
    grade: EmergencyGrade.LEVEL_2,
    label: 'ระดับ 2',
    title: 'ปานกลาง',
    description: 'ต้องการความช่วยเหลือแต่ไม่เร่งด่วน',
    color: '#F59E0B',
  },
  {
    grade: EmergencyGrade.LEVEL_3,
    label: 'ระดับ 3',
    title: 'รุนแรง',
    description: 'ต้องการความช่วยเหลือเร่งด่วน',
    color: '#EF4444',
  },
  {
    grade: EmergencyGrade.LEVEL_4,
    label: 'ระดับ 4',
    title: 'วิกฤต',
    description: 'วิกฤต ต้องการความช่วยเหลือทันที',
    color: '#DC2626',
  },
];

export default function EmergencyGradeSelector({
  selectedGrade,
  onSelect,
}: EmergencyGradeSelectorProps) {
  return (
    <View style={styles.container}>
      {GRADE_OPTIONS.map((option) => {
        const isSelected = selectedGrade === option.grade;
        return (
          <TouchableOpacity
            key={option.grade}
            style={[
              styles.card,
              isSelected && { borderColor: option.color, borderWidth: 2 },
            ]}
            onPress={() => onSelect(option.grade)}
          >
            <View style={[styles.badge, { backgroundColor: option.color }]}>
              <Text style={styles.badgeText}>{option.label}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

