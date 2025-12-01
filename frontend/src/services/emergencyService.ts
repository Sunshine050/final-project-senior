import api from '@/lib/api';
import {
  Emergency,
  EmergencyListResponse,
  EmergencyStatus,
  EmergencySeverity,
} from '@/types/emergency';

export interface CreateEmergencyDto {
  callerName: string;
  callerPhone: string;
  description: string;
  severity: EmergencySeverity;
  address: string;
  location: {
    longitude: number;
    latitude: number;
  };
  patientCount?: number;
  emergencyType?: string;
  notes?: string;
}

export interface UpdateStatusDto {
  status: EmergencyStatus;
  notes?: string;
  estimatedArrival?: string;
}

export interface AssignEmergencyDto {
  hospitalId?: string;
  rescueTeamId?: string;
  notes?: string;
}

export interface QueryEmergencyParams {
  status?: EmergencyStatus;
  severity?: EmergencySeverity;
  hospitalId?: string;
  rescueTeamId?: string;
  page?: number;
  limit?: number;
}

export const emergencyService = {
  /**
   * Create a new emergency request
   */
  async createEmergency(data: CreateEmergencyDto): Promise<Emergency> {
    const response = await api.post<Emergency>('/sos', data);
    return response.data;
  },

  /**
   * Get all emergencies with optional filtering
   */
  async getAllEmergencies(params?: QueryEmergencyParams): Promise<EmergencyListResponse> {
    const response = await api.get<EmergencyListResponse>('/sos/all', { params });
    return response.data;
  },

  /**
   * Get emergency by ID
   */
  async getEmergencyById(id: string): Promise<Emergency> {
    const response = await api.get<Emergency>(`/sos/${id}`);
    return response.data;
  },

  /**
   * Get active emergencies for hospital dashboard
   */
  async getActiveEmergencies(): Promise<Emergency[]> {
    const response = await api.get<Emergency[]>('/sos/dashboard/active-emergencies');
    return response.data;
  },

  /**
   * Get assigned cases for rescue team
   */
  async getRescueAssignedCases(): Promise<Emergency[]> {
    const response = await api.get<Emergency[]>('/sos/rescue/assigned-cases');
    return response.data;
  },

  /**
   * Assign emergency to hospital/rescue team
   */
  async assignEmergency(id: string, data: AssignEmergencyDto): Promise<Emergency> {
    const response = await api.post<Emergency>(`/sos/${id}/assign`, data);
    return response.data;
  },

  /**
   * Update emergency status
   */
  async updateEmergencyStatus(id: string, data: UpdateStatusDto): Promise<Emergency> {
    const response = await api.put<Emergency>(`/sos/${id}/status`, data);
    return response.data;
  },
};

export default emergencyService;

