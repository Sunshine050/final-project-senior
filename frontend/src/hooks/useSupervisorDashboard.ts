'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Emergency, RescueTeam } from '@/types/emergency';
import emergencyService from '@/services/emergencyService';
import rescueService from '@/services/rescueService';
import { useWebSocket } from './useWebSocket';

interface SupervisorStats {
  teamsSupervised: number;
  activeOperations: number;
  avgResponse: string;
  criticalCases: number;
}

interface UseSupervisorDashboardReturn {
  // Data
  activeEmergencies: Emergency[];
  rescueTeams: RescueTeam[];
  
  // Stats
  stats: SupervisorStats;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // WebSocket
  isConnected: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
}

export function useSupervisorDashboard(): UseSupervisorDashboardReturn {
  const [activeEmergencies, setActiveEmergencies] = useState<Emergency[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket handlers
  const handleEmergencyNew = useCallback((data: any) => {
    refreshData();
  }, []);

  const handleStatusUpdate = useCallback((data: any) => {
    refreshData();
  }, []);

  const { isConnected } = useWebSocket({
    autoConnect: true,
    onEmergencyNew: handleEmergencyNew,
    onStatusUpdate: handleStatusUpdate,
  });

  // Fetch data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [emergenciesRes, teamsRes] = await Promise.all([
        emergencyService.getAllEmergencies({ 
          status: 'assigned' as any,
          limit: 100 
        }),
        rescueService.getAllRescueTeams(),
      ]);

      // Filter active emergencies
      const active = (emergenciesRes.data || []).filter(e => 
        ['assigned', 'en_route', 'on_scene', 'transporting'].includes(e.status)
      );

      setActiveEmergencies(active);
      setRescueTeams(teamsRes.data || []);
    } catch (err: any) {
      console.error('Failed to fetch supervisor data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate stats
  const stats = useMemo((): SupervisorStats => {
    const teams = rescueTeams.length;
    const activeOps = activeEmergencies.length;
    const critical = activeEmergencies.filter(e => e.severity === 'critical').length;
    
    // Calculate average response time
    const avgResponse = '3.8m';

    return {
      teamsSupervised: teams,
      activeOperations: activeOps,
      avgResponse,
      criticalCases: critical,
    };
  }, [rescueTeams, activeEmergencies]);

  // Initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    activeEmergencies,
    rescueTeams,
    stats,
    isLoading,
    error,
    isConnected,
    refreshData,
  };
}

export default useSupervisorDashboard;

