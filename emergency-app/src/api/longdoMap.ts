// src/api/longdoMap.ts
import { NearbyHospital } from "../types/hospital";
import Constants from "expo-constants";

// Haversine distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
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

// อ่าน API key จาก app.json extra หรือ environment variable
const LONGDO_API_KEY = 
  Constants.expoConfig?.extra?.longdoMapKey || 
  process.env.EXPO_PUBLIC_LONGDO_MAP_API_KEY ||
  "bc7aa650e38fc00dc32b5902a0f07757";

export const findNearbyHospitalsLongdo = async (
  latitude: number,
  longitude: number,
  radiusKm = 10
): Promise<NearbyHospital[]> => {
  if (!LONGDO_API_KEY) {
    console.error("Missing EXPO_PUBLIC_LONGDO_MAP_API_KEY");
    return [];
  }

  try {
    // URL ใหม่ 2025 (ใช้ได้แน่นอน)
    const url = new URL("https://search.longdo.com/mapsearch/json/search");
    url.searchParams.append("key", LONGDO_API_KEY);
    url.searchParams.append("keyword", "โรงพยาบาล");
    url.searchParams.append("lat", latitude.toString());
    url.searchParams.append("lon", longitude.toString());
    url.searchParams.append("span", `${radiusKm}km`);
    url.searchParams.append("limit", "30");
    url.searchParams.append("locale", "th");

    console.log("Calling Longdo →", url.toString());

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

    // Longdo คืน { data: [...] }
    const data: any[] = json.data || [];

    const hospitals: NearbyHospital[] = data
      .map((place: any): NearbyHospital | null => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        if (isNaN(lat) || isNaN(lon)) return null;

        const distance = getDistance(latitude, longitude, lat, lon);
        if (distance > radiusKm) return null;

        return {
          id: place.id || `longdo_${lat}_${lon}`,
          name: (place.name || place.title || "โรงพยาบาล").trim(),
          address: place.address || "",
          city: place.province || place.aoi || "",
          state: place.province || "",
          latitude: lat,
          longitude: lon,
          contactPhone: place.phone || place.tel || "",
          distance: Number(distance.toFixed(2)),
          status: "ACTIVE",
          availableBeds: undefined,
          totalBeds: undefined,
          icuBeds: undefined,
        } as NearbyHospital;
      })
      .filter((item): item is NearbyHospital => item !== null)
      .sort((a, b) => a.distance! - b.distance!);

    console.log(`Longdo Map พบ ${hospitals.length} โรงพยาบาลในรัศมี ${radiusKm} กม.`);
    return hospitals;
  } catch (error) {
    console.error("Longdo Map API ล้ม:", error);
    return [];
  }
};
