import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    gradient: ['#34D399', '#10B981'] as const,
    lightBg: '#D1FAE5',
  },
  {
    grade: EmergencyGrade.LEVEL_2,
    label: 'ระดับ 2',
    title: 'ปานกลาง',
    description: 'ต้องการความช่วยเหลือแต่ไม่เร่งด่วน',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#F59E0B'] as const,
    lightBg: '#FEF3C7',
  },
  {
    grade: EmergencyGrade.LEVEL_3,
    label: 'ระดับ 3',
    title: 'รุนแรง',
    description: 'ต้องการความช่วยเหลือเร่งด่วน',
    color: '#EF4444',
    gradient: ['#F87171', '#EF4444'] as const,
    lightBg: '#FEE2E2',
  },
  {
    grade: EmergencyGrade.LEVEL_4,
    label: 'ระดับ 4',
    title: 'วิกฤต',
    description: 'วิกฤต ต้องการความช่วยเหลือทันที',
    color: '#DC2626',
    gradient: ['#EF4444', '#DC2626'] as const,
    lightBg: '#FEE2E2',
  },
];

export default function EmergencyGradeSelector({
  selectedGrade,
  onSelect,
}: EmergencyGradeSelectorProps) {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {GRADE_OPTIONS.map((option) => {
        const isSelected = selectedGrade === option.grade;
        return (
          <TouchableOpacity
            key={option.grade}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              isSelected && { borderColor: option.color, borderWidth: 3 },
            ]}
            onPress={() => onSelect(option.grade)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={option.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <Text style={styles.badgeLabel}>ระดับ</Text>
              <Text style={styles.badgeNumber}>
                {option.label.split(' ')[1]}
              </Text>
            </LinearGradient>
            <View style={styles.content}>
              <Text style={[styles.title, isSelected && { color: option.color }]}>
                {option.title}
              </Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
            {isSelected && (
              <View style={[styles.checkBadge, { backgroundColor: option.lightBg }]}>
                <Text style={[styles.checkText, { color: option.color }]}>✓</Text>
              </View>
            )}
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
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  badgeNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
