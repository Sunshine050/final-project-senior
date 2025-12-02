import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { EmergencyResponse, EmergencyStatus } from '../../types/sos';
import { getEmergencyById } from '../../api/sos/sos';

interface RequestStatusProps {
  emergency: EmergencyResponse;
  onCancel: () => void;
  onUpdate: (updated: EmergencyResponse) => void;
}

export default function RequestStatus({ emergency, onCancel, onUpdate }: RequestStatusProps) {
  const [currentEmergency, setCurrentEmergency] = useState(emergency);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pollStatus = async () => {
      if (currentEmergency.status === EmergencyStatus.COMPLETED || 
          currentEmergency.status === EmergencyStatus.CANCELLED) {
        return;
      }

      try {
        const updated = await getEmergencyById(currentEmergency.id);
        setCurrentEmergency(updated);
        onUpdate(updated);
      } catch (error) {
        console.error('Failed to poll status:', error);
      }
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [currentEmergency.id]);

  const getStatusInfo = () => {
    switch (currentEmergency.status) {
      case EmergencyStatus.PENDING:
        return {
          text: 'รอการตอบรับ',
          color: '#F59E0B',
          icon: 'schedule',
        };
      case EmergencyStatus.ASSIGNED:
        return {
          text: 'ได้รับมอบหมาย',
          color: '#3B82F6',
          icon: 'check-circle',
        };
      case EmergencyStatus.IN_PROGRESS:
        return {
          text: 'กำลังดำเนินการ',
          color: '#10B981',
          icon: 'local-hospital',
        };
      case EmergencyStatus.COMPLETED:
        return {
          text: 'เสร็จสิ้น',
          color: '#10B981',
          icon: 'check-circle',
        };
      case EmergencyStatus.CANCELLED:
        return {
          text: 'ยกเลิก',
          color: '#6B7280',
          icon: 'cancel',
        };
      default:
        return {
          text: 'ไม่ทราบสถานะ',
          color: '#6B7280',
          icon: 'help',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>สถานะการแจ้งเหตุ</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: `${statusInfo.color}20` }]}>
            <MaterialIcons name={statusInfo.icon as any} size={48} color={statusInfo.color} />
          </View>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
          <Text style={styles.description}>
            {currentEmergency.description}
          </Text>
        </View>

        {currentEmergency.status !== EmergencyStatus.COMPLETED &&
         currentEmergency.status !== EmergencyStatus.CANCELLED && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#DC2626" />
            ) : (
              <>
                <MaterialIcons name="cancel" size={20} color="#DC2626" />
                <Text style={styles.cancelText}>ยกเลิกการแจ้งเหตุ</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});

