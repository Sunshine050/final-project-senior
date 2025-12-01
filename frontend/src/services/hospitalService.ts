import api from '@/lib/api';
import { Hospital, HospitalListResponse } from '@/types/emergency';

export interface NearbyQueryParams {
  longitude: number;
  latitude: number;
  maxDistance?: number;
  limit?: number;
}

export const hospitalService = {
  /**
   * Get all hospitals
   */
  async getAllHospitals(): Promise<HospitalListResponse> {
    const response = await api.get<HospitalListResponse>('/hospitals');
    return response.data;
  },

  /**
   * Get nearby hospitals
   */
  async getNearbyHospitals(params: NearbyQueryParams): Promise<Hospital[]> {
    const response = await api.get<Hospital[]>('/hospitals/nearby', { params });
    return response.data;
  },

  /**
   * Get hospital by ID
   */
  async getHospitalById(id: string): Promise<Hospital> {
    const response = await api.get<Hospital>(`/hospitals/${id}`);
    return response.data;
  },

  /**
   * Update bed availability
   */
  async updateBedAvailability(id: string, availableBeds: number): Promise<Hospital> {
    const response = await api.patch<Hospital>(`/hospitals/${id}/beds`, { availableBeds });
    return response.data;
  },
};

export default hospitalService;

