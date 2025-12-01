import api from '@/lib/api';
import { RescueTeam, RescueTeamListResponse } from '@/types/emergency';

export const rescueService = {
  /**
   * Get all rescue teams
   */
  async getAllRescueTeams(): Promise<RescueTeamListResponse> {
    const response = await api.get<RescueTeamListResponse>('/rescue-teams');
    return response.data;
  },

  /**
   * Get available rescue teams
   */
  async getAvailableRescueTeams(): Promise<RescueTeam[]> {
    const response = await api.get<RescueTeam[]>('/rescue-teams/available');
    return response.data;
  },

  /**
   * Get rescue team by ID
   */
  async getRescueTeamById(id: string): Promise<RescueTeam> {
    const response = await api.get<RescueTeam>(`/rescue-teams/${id}`);
    return response.data;
  },
};

export default rescueService;

