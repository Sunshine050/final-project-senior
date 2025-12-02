import api from '../../../services/api';
import { CreateEmergencyRequest, EmergencyResponse } from '../../types/sos';

export const createEmergencyRequest = async (
  payload: CreateEmergencyRequest
): Promise<EmergencyResponse> => {
  const { data } = await api.post<EmergencyResponse>('/sos', payload);
  return data;
};

export const getEmergencyById = async (id: string): Promise<EmergencyResponse> => {
  const { data } = await api.get<EmergencyResponse>(`/sos/${id}`);
  return data;
};

export const cancelEmergency = async (id: string): Promise<void> => {
  await api.put(`/sos/${id}/status`, { status: 'CANCELLED' });
};

