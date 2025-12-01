'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Emergency,
  RescueTeam,
  RescueDashboardStats,
  EmergencyEventPayload,
} from '@/types/emergency';
import emergencyService from '@/services/emergencyService';
import rescueService from '@/services/rescueService';
import { useWebSocket } from './useWebSocket';

interface UseRescueDashboardReturn {
  // Data
  cases: Emergency[];
  rescueTeams: RescueTeam[];
  stats: RescueDashboardStats;
  
  // Loading states
  isLoading: boolean;
  isCasesLoading: boolean;
  isTeamsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // WebSocket status
  isConnected: boolean;
  
  // Actions
  refreshCases: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateCaseStatus: (id: string, status: string, notes?: string) => Promise<void>;
}

export function useRescueDashboard(): UseRescueDashboardReturn {
  // State
  const [cases, setCases] = useState<Emergency[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [isCasesLoading, setIsCasesLoading] = useState(true);
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket handlers
  const handleEmergencyNew = useCallback((data: EmergencyEventPayload) => {
    // Refresh cases when new emergency is created
    refreshCases();
  }, []);

  const handleEmergencyAssigned = useCallback((data: EmergencyEventPayload) => {
    // Update or add the assigned case
    setCases((prevCases) => {
      const existingIndex = prevCases.findIndex((c) => c.id === data.emergencyId);
      if (existingIndex >= 0) {
        // Update existing case
        const updatedCases = [...prevCases];
        updatedCases[existingIndex] = {
          ...updatedCases[existingIndex],
          status: (data.status as Emergency['status']) || updatedCases[existingIndex].status,
          assignedHospitalId: data.assignedHospitalId,
          assignedRescueTeamId: data.assignedRescueTeamId,
        };
        return updatedCases;
      }
      // If not found, refresh to get the new case
      refreshCases();
      return prevCases;
    });
  }, []);

  const handleStatusUpdate = useCallback((data: EmergencyEventPayload) => {
    setCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id === data.emergencyId) {
          return {
            ...c,
            status: (data.status as Emergency['status']) || c.status,
          };
        }
        return c;
      }).filter((c) => {
        // Remove completed or cancelled cases from active list
        return !['completed', 'cancelled'].includes(c.status);
      });
    });
  }, []);

  // WebSocket connection
  const { isConnected } = useWebSocket({
    autoConnect: true,
    onEmergencyNew: handleEmergencyNew,
    onEmergencyAssigned: handleEmergencyAssigned,
    onStatusUpdate: handleStatusUpdate,
  });

  // Fetch assigned cases
  const refreshCases = useCallback(async () => {
    try {
      setIsCasesLoading(true);
      setError(null);
      const data = await emergencyService.getRescueAssignedCases();
      setCases(data);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
      setError('Failed to load assigned cases');
    } finally {
      setIsCasesLoading(false);
    }
  }, []);

  // Fetch rescue teams
  const refreshTeams = useCallback(async () => {
    try {
      setIsTeamsLoading(true);
      const response = await rescueService.getAllRescueTeams();
      setRescueTeams(response.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
      // Don't set error for teams as it's secondary data
    } finally {
      setIsTeamsLoading(false);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshCases(), refreshTeams()]);
  }, [refreshCases, refreshTeams]);

  // Update case status
  const updateCaseStatus = useCallback(async (id: string, status: string, notes?: string) => {
    try {
      await emergencyService.updateEmergencyStatus(id, {
        status: status as Emergency['status'],
        notes,
      });
      // Optimistically update local state
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === id ? { ...c, status: status as Emergency['status'] } : c
        ).filter((c) => !['completed', 'cancelled'].includes(c.status))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      throw err;
    }
  }, []);

  // Calculate stats
  const stats = useMemo((): RescueDashboardStats => {
    const activeMissions = cases.filter((c) =>
      ['assigned', 'en_route', 'on_scene', 'transporting'].includes(c.status)
    ).length;

    const completedToday = cases.filter((c) => {
      if (c.status !== 'completed') return false;
      const today = new Date();
      const caseDate = new Date(c.updatedAt);
      return (
        caseDate.getDate() === today.getDate() &&
        caseDate.getMonth() === today.getMonth() &&
        caseDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const criticalCases = cases.filter((c) => c.severity === 'critical').length;

    const availableTeams = rescueTeams.filter((t) => t.availableCapacity > 0).length;

    return {
      activeMissions,
      completedToday,
      criticalCases,
      availableTeams,
    };
  }, [cases, rescueTeams]);

  // Initial fetch
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Combined loading state
  const isLoading = isCasesLoading && isTeamsLoading;

  return {
    cases,
    rescueTeams,
    stats,
    isLoading,
    isCasesLoading,
    isTeamsLoading,
    error,
    isConnected,
    refreshCases,
    refreshTeams,
    refreshAll,
    updateCaseStatus,
  };
}

export default useRescueDashboard;

