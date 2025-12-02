import Constants from "expo-constants";
import { NearbyHospital } from "../../types/hospital";

const API_BASE_URL = 
  Constants.expoConfig?.extra?.apiBaseUrl || 
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.3:3000";

interface HospitalResponse {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  isActive: boolean;
  capacity: number;
  availableCapacity: number;
  services: string[];
}

interface HospitalListResponse {
  data: HospitalResponse[];
  total: number;
}

export const getAllHospitals = async (query?: string): Promise<NearbyHospital[]> => {
  try {
    const url = `${API_BASE_URL}/api/hospitals${query ? `?search=${encodeURIComponent(query)}` : ""}`;
    console.log(`🔍 Fetching hospitals from: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: HospitalListResponse = await response.json();
    console.log(`✅ Found ${data.total} hospitals`);

    return data.data.map((h) => ({
      id: h._id,
      name: h.name,
      address: h.address,
      city: "",
      state: "",
      latitude: h.location.coordinates[1],
      longitude: h.location.coordinates[0],
      contactPhone: h.phone,
      distance: undefined,
      status: h.isActive ? "ACTIVE" : "INACTIVE",
      availableBeds: h.availableCapacity,
      totalBeds: h.capacity,
      icuBeds: undefined,
    })) as NearbyHospital[];
  } catch (error) {
    console.error("❌ Error fetching hospitals:", error);
    return [];
  }
};

