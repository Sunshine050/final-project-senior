'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Emergency, EmergencyStatus, EmergencySeverity, EmergencyStatusEnum, EmergencySeverityEnum } from '@/types/emergency';
import emergencyService from '@/services/emergencyService';
import rescueService from '@/services/rescueService';
import hospitalService from '@/services/hospitalService';
import { useWebSocket } from './useWebSocket';

interface DispatchStats {
  callsInQueue: number;
  criticalCalls: number;
  dispatchedUnits: number;
  avgResponseTime: string;
}

interface UseDispatchDashboardReturn {
  // Data
  pendingEmergencies: Emergency[];
  allEmergencies: Emergency[];
  rescueTeams: any[];
  hospitals: any[];
  
  // Stats
  stats: DispatchStats;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // WebSocket
  isConnected: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  assignEmergency: (emergencyId: string, hospitalId?: string, rescueTeamId?: string) => Promise<void>;
  updateEmergencyStatus: (id: string, status: EmergencyStatus) => Promise<void>;
}

export function useDispatchDashboard(): UseDispatchDashboardReturn {
  const [pendingEmergencies, setPendingEmergencies] = useState<Emergency[]>([]);
  const [allEmergencies, setAllEmergencies] = useState<Emergency[]>([]);
  const [rescueTeams, setRescueTeams] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket handlers
  const handleEmergencyNew = useCallback((data: any) => {
    refreshData();
  }, []);

  const handleEmergencyAssigned = useCallback((data: any) => {
    refreshData();
  }, []);

  const handleStatusUpdate = useCallback((data: any) => {
    refreshData();
  }, []);

  const { isConnected } = useWebSocket({
    autoConnect: true,
    onEmergencyNew: handleEmergencyNew,
    onEmergencyAssigned: handleEmergencyAssigned,
    onStatusUpdate: handleStatusUpdate,
  });

  // Fetch all data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [emergenciesRes, teamsRes, hospitalsRes] = await Promise.all([
        emergencyService.getAllEmergencies({ status: EmergencyStatusEnum.PENDING, limit: 100 }),
        rescueService.getAllRescueTeams(),
        hospitalService.getAllHospitals(),
      ]);

      const allEmergenciesData = await emergencyService.getAllEmergencies({ limit: 100 });

      setPendingEmergencies(emergenciesRes.data || []);
      setAllEmergencies(allEmergenciesData.data || []);
      setRescueTeams(teamsRes.data || []);
      setHospitals(hospitalsRes.data || []);
    } catch (err: any) {
      console.error('Failed to fetch dispatch data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Assign emergency
  const assignEmergency = useCallback(async (
    emergencyId: string,
    hospitalId?: string,
    rescueTeamId?: string
  ) => {
    try {
      if (!hospitalId && !rescueTeamId) {
        throw new Error('ต้องระบุ hospitalId หรือ rescueTeamId อย่างน้อยหนึ่งตัว');
      }
      
      await emergencyService.assignEmergency(emergencyId, {
        hospitalId,
        rescueTeamId,
      });
      
      // Refresh data after successful assignment
      await refreshData();
    } catch (err: any) {
      console.error('Failed to assign emergency:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถมอบหมายงานได้';
      throw new Error(errorMessage);
    }
  }, [refreshData]);

  // Update status
  const updateEmergencyStatus = useCallback(async (id: string, status: EmergencyStatus) => {
    try {
      await emergencyService.updateEmergencyStatus(id, { status });
      await refreshData();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      throw err;
    }
  }, [refreshData]);

  // Calculate stats
  const stats = useMemo((): DispatchStats => {
    const pending = pendingEmergencies.length;
    const critical = pendingEmergencies.filter(e => e.severity === EmergencySeverityEnum.CRITICAL).length;
    const dispatched = allEmergencies.filter(e => 
      [EmergencyStatusEnum.ASSIGNED, EmergencyStatusEnum.EN_ROUTE, EmergencyStatusEnum.ON_SCENE, EmergencyStatusEnum.TRANSPORTING].includes(e.status as any)
    ).length;

    // Calculate average response time (mock for now, should come from API)
    const avgResponseTime = '4.2m';

    return {
      callsInQueue: pending,
      criticalCalls: critical,
      dispatchedUnits: dispatched,
      avgResponseTime,
    };
  }, [pendingEmergencies, allEmergencies]);

  // Initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    pendingEmergencies,
    allEmergencies,
    rescueTeams,
    hospitals,
    stats,
    isLoading,
    error,
    isConnected,
    refreshData,
    assignEmergency,
    updateEmergencyStatus,
  };
}

export default useDispatchDashboard;

