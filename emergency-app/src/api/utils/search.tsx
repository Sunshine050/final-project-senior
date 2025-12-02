import { getAllHospitals } from '../hospital/hospital';

export const search = async (query: string, category: string) => {
  try {
    if (!query) return [];

    switch (category) {
      case 'nearby':
        // ใช้ hospital API สำหรับค้นหาโรงพยาบาล
        const hospitals = await getAllHospitals(query);
        return hospitals;

      case 'emergency-number':
        // ค้นหาตามเบอร์โทรศัพท์
        const hospitalsByPhone = await getAllHospitals(query);
        return hospitalsByPhone.filter((h: any) => 
          h.contactPhone?.includes(query)
        );

      default:
        console.warn(`Unknown search category: ${category}`);
        return [];
    }
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
};

