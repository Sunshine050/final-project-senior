// ฟังก์ชันคำนวณระยะทางแบบเร็ว (Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getNearbyPublicHospitals = async (
  lat: number,
  lng: number,
  radiusKm = 50
): Promise<any[]> => {
  try {
    // ข้อมูลโรงพยาบาลทั้งประเทศจาก MOPH (เปิดให้ใช้ฟรี)
    const response = await fetch(
      "https://covid19.th-stat.com/json/hospital/hospital.json"
    );
    // หรือใช้ไฟล์ล่าสุดจาก GitHub คนอัพเดทบ่อยมาก
    // https://raw.githubusercontent.com/rmdisnake/thai-hospital-data/main/hospitals.json

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const allHospitals = await response.json();

    const nearby = allHospitals
      .map((h: any) => {
        if (!h.latitude || !h.longitude) return null;

        const distance = getDistance(lat, lng, h.latitude, h.longitude);
        if (distance <= radiusKm) {
          return {
            id: h.code || h.name,
            name: h.name,
            address: h.address || "",
            city: h.province || "",
            latitude: h.latitude,
            longitude: h.longitude,
            contactPhone: h.telephone || h.phone || "",
            distance,
            // เพิ่มเติมได้
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance - b.distance);

    return nearby;
  } catch (error) {
    console.error("Failed to fetch public hospitals:", error);
    return [];
  }
};

