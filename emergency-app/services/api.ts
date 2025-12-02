import axios, { AxiosError } from 'axios';
import type { Hospital, LongdoPoi, Organization, SosPayload } from '../types';

// NOTE: ผูกตรง ๆ กับ IP เครื่องคุณ เพื่อให้มือถือยิงมาหา backend ได้แน่นอน
// ถ้า IP เปลี่ยน ให้แก้ที่นี่แล้ว reload ใหม่
const API_BASE_URL = 'http://192.168.1.3:3000';

const LONGDO_MAP_KEY = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const submitSos = async (payload: SosPayload) => {
  const { data } = await api.post('/sos', payload);
  return data;
};

export const fetchNearbyHospitals = async (lat: number, lng: number, radius = 10) => {
  const { data } = await api.get<Hospital[]>('/hospitals/nearby', {
    params: { lat, lng, radius },
  });
  return data;
};

export const fetchOrganizations = async () => {
  const { data } = await api.get<Organization[]>('/organizations');
  return data;
};

export const fetchLongdoHospitals = async (lat: number, lng: number, limit = 6) => {
  if (!LONGDO_MAP_KEY) {
    return [];
  }

  try {
    const { data } = await axios.get('https://api.longdo.com/POIService/json/search', {
      params: {
        key: LONGDO_MAP_KEY,
        keyword: 'โรงพยาบาล',
        limit,
        bbox: `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`,
      },
    });

    const pois: LongdoPoi[] = data?.data?.map((item: any) => ({
      id: item.id ?? item.dname,
      name: item.name_th ?? item.name ?? 'โรงพยาบาล',
      lat: item.lat,
      lon: item.lon,
      tel: item.tel,
      address: item.address_th ?? item.address,
      distance: item.dist,
    }));

    return pois ?? [];
  } catch (error) {
    console.warn('Longdo Map API error', (error as AxiosError)?.message);
    return [];
  }
};

export const getEmergencyContacts = async () => {
  try {
    const data = await fetchOrganizations();
    return data.filter((org) => ['dispatch_center', 'rescue_team'].includes(org.type));
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.code === 'ECONNABORTED' || axiosError.message === 'Network Error') {
      console.warn('Cannot connect to backend. Make sure backend is running at', API_BASE_URL);
      return [];
    }
    throw error;
  }
};

export const handleApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<{ message?: string }>;
  const message =
    axiosError.response?.data?.message ||
    axiosError.message ||
    'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
  throw new Error(message);
};

export default api;

