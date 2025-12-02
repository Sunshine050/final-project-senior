import { NearbyHospital } from '../types/hospital';

export interface EmergencyItem {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  type: 'hospital' | 'police' | 'fire' | 'rescue';
  distance?: number;
  latitude: number;
  longitude: number;
}

// Mock data for emergency places (ตำรวจ, ดับเพลิง, กู้ภัย)
export const getNearbyEmergencyPlaces = async (
  lat: number,
  lng: number
): Promise<EmergencyItem[]> => {
  // In real app, this would call your backend API
  // For now, return mock data
  return [
    {
      id: 'police-1',
      name: 'สถานีตำรวจภูธรเชียงใหม่',
      phone: '053-221-100',
      address: '123 ถนนเจริญเมือง',
      type: 'police',
      distance: 2.5,
      latitude: 18.7883,
      longitude: 98.9853,
    },
    {
      id: 'fire-1',
      name: 'หน่วยดับเพลิงเชียงใหม่',
      phone: '053-221-199',
      address: '456 ถนนช้างคลาน',
      type: 'fire',
      distance: 3.2,
      latitude: 18.7950,
      longitude: 98.9900,
    },
    {
      id: 'rescue-1',
      name: 'มูลนิธิกู้ภัยเชียงใหม่',
      phone: '053-221-1554',
      address: '789 ถนนนิมมานเหมินทร์',
      type: 'rescue',
      distance: 1.8,
      latitude: 18.8000,
      longitude: 98.9800,
    },
  ];
};

