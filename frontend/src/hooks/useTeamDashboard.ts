'use client';

import { useState, useEffect, useCallback } from 'react';
import { Emergency, EmergencyStatus } from '@/types/emergency';
import emergencyService from '@/services/emergencyService';
import { useWebSocket } from './useWebSocket';

interface UseTeamDashboardReturn {
  // Data
  currentMission: Emergency | null;
  allMissions: Emergency[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // WebSocket
  isConnected: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  updateMissionStatus: (id: string, status: EmergencyStatus, notes?: string) => Promise<void>;
}

export function useTeamDashboard(): UseTeamDashboardReturn {
  const [currentMission, setCurrentMission] = useState<Emergency | null>(null);
  const [allMissions, setAllMissions] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket handlers
  const handleStatusUpdate = useCallback((data: any) => {
    refreshData();
  }, []);

  const handleEmergencyAssigned = useCallback((data: any) => {
    refreshData();
  }, []);

  const { isConnected } = useWebSocket({
    autoConnect: true,
    onStatusUpdate: handleStatusUpdate,
    onEmergencyAssigned: handleEmergencyAssigned,
  });

  // Fetch assigned cases
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await emergencyService.getRescueAssignedCases();
      
      // Filter active missions
      const active = data.filter(e => 
        ['assigned', 'en_route', 'on_scene', 'transporting'].includes(e.status)
      );

      setAllMissions(active);
      
      // Set current mission (most recent or highest priority)
      if (active.length > 0) {
        const sorted = [...active].sort((a, b) => {
          // Prioritize by status (en_route > on_scene > transporting > assigned)
          const statusOrder: Record<string, number> = {
            'en_route': 4,
            'on_scene': 3,
            'transporting': 2,
            'assigned': 1,
          };
          return (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0);
        });
        setCurrentMission(sorted[0]);
      } else {
        setCurrentMission(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch team data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update mission status
  const updateMissionStatus = useCallback(async (
    id: string,
    status: EmergencyStatus,
    notes?: string
  ) => {
    try {
      await emergencyService.updateEmergencyStatus(id, { status, notes });
      await refreshData();
    } catch (err: any) {
      console.error('Failed to update mission status:', err);
      throw err;
    }
  }, [refreshData]);

  // Initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    currentMission,
    allMissions,
    isLoading,
    error,
    isConnected,
    refreshData,
    updateMissionStatus,
  };
}

export default useTeamDashboard;

