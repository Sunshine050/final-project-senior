import { NearbyHospital } from '../types/hospital';
import axios from 'axios';

const LONGDO_MAP_KEY = 'bc7aa650e38fc00dc32b5902a0f07757';

export const findNearbyHospitalsLongdo = async (
  lat: number,
  lng: number,
  radius: number = 10
): Promise<NearbyHospital[]> => {
  if (!LONGDO_MAP_KEY) {
    return [];
  }

  try {
    const { data } = await axios.get('https://api.longdo.com/POIService/json/search', {
      params: {
        key: LONGDO_MAP_KEY,
        keyword: 'โรงพยาบาล',
        limit: 20,
        bbox: `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`,
      },
    });

    const hospitals: NearbyHospital[] = (data?.data || []).map((item: any) => ({
      id: item.id?.toString() || item.dname || Math.random().toString(),
      name: item.name_th || item.name || 'โรงพยาบาล',
      address: item.address_th || item.address,
      city: item.province_th || item.province,
      latitude: item.lat,
      longitude: item.lon,
      distance: item.dist ? item.dist / 1000 : undefined, // Convert to km
      contactPhone: item.tel,
    }));

    return hospitals;
  } catch (error) {
    console.warn('Longdo Map API error:', error);
    return [];
  }
};

