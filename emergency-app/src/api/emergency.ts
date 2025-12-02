import { NearbyHospital } from "../types/hospital";
import Constants from "expo-constants";

// อ่าน API key จาก app.json extra หรือ environment variable
const LONGDO_KEY = 
  Constants.expoConfig?.extra?.longdoMapKey || 
  process.env.EXPO_PUBLIC_LONGDO_MAP_API_KEY ||
  "bc7aa650e38fc00dc32b5902a0f07757";

interface EmergencyPlace {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  latitude: number;
  longitude: number;
  type: "hospital" | "police" | "fire" | "rescue";
  distance?: number;
}

// Haversine distance calculation
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const KEYWORDS = {
  police: "ตำรวจ",
  fire: "ดับเพลิง",
  rescue: "กู้ภัย|มูลนิธิ|กู้ชีพ",
};

// ค้นหาสถานที่จริงจาก Longdo Map API
const searchLongdo = async (
  keyword: string,
  lat: number,
  lon: number,
  radiusKm = 5
): Promise<any[]> => {
  if (!LONGDO_KEY) {
    console.warn("⚠️ Missing EXPO_PUBLIC_LONGDO_MAP_API_KEY");
    return [];
  }

  try {
    const url = new URL("https://search.longdo.com/mapsearch/json/search");
    url.searchParams.append("key", LONGDO_KEY);
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lon", lon.toString());
    url.searchParams.append("span", `${radiusKm}km`);
    url.searchParams.append("limit", "15");
    url.searchParams.append("locale", "th");

    console.log(`🔍 Longdo API: Searching "${keyword}" at (${lat}, ${lon}) within ${radiusKm}km`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Longdo HTTP ${response.status}`);
    }

    const json = await response.json();
    const data = json.data || [];
    console.log(`✅ Longdo API: Found ${data.length} results for "${keyword}"`);
    return data;
  } catch (e) {
    console.error(`❌ Longdo search error for "${keyword}":`, e);
    return [];
  }
};

export const getNearbyEmergencyPlaces = async (
  latitude: number,
  longitude: number
): Promise<EmergencyPlace[]> => {
  console.log(`🚀 getNearbyEmergencyPlaces called at (${latitude}, ${longitude})`);
  const results: EmergencyPlace[] = [];

  // ค้นหาทุกประเภทพร้อมกัน
  const searchPromises = Object.entries(KEYWORDS).map(async ([type, keyword]) => {
    console.log(`📡 Searching for type: ${type} with keyword: "${keyword}"`);
    const places = await searchLongdo(keyword, latitude, longitude, 10);

    return places.map((p: any, idx: number): EmergencyPlace | null => {
      const lat = parseFloat(p.lat);
      const lon = parseFloat(p.lon);
      if (isNaN(lat) || isNaN(lon)) {
        console.warn(`⚠️ Invalid coordinates for place: ${p.name}`);
        return null;
      }

      // ใช้ Haversine distance calculation
      const distance = getDistance(latitude, longitude, lat, lon);

      return {
        id: `${type}_${p.id || idx}_${Date.now()}`,
        name: (p.name || p.title || "ไม่ระบุชื่อ").trim(),
        phone: p.phone || p.tel || undefined,
        address: p.address || "",
        latitude: lat,
        longitude: lon,
        type: type as any,
        distance: Number(distance.toFixed(2)),
      };
    });
  });

  const allResults = await Promise.all(searchPromises);
  const validResults = allResults.flat().filter((item): item is EmergencyPlace => item !== null);
  results.push(...validResults);

  console.log(`📊 Total raw results: ${results.length}`);

  // เรียงตามระยะทาง + ลบซ้ำ
  const finalResults = results
    .filter(
      (v, i, a) =>
        a.findIndex((t) => t.name === v.name && t.type === v.type) === i
    )
    .sort((a, b) => (a.distance || 99) - (b.distance || 99))
    .slice(0, 30); // แสดงสูงสุด 30 ที่ใกล้ที่สุด

  console.log(`✅ Final results: ${finalResults.length} unique places`);
  return finalResults;
};
