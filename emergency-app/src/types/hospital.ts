export interface NearbyHospital {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  contactPhone?: string;
  status?: string;
  availableBeds?: number;
  totalBeds?: number;
  icuBeds?: number;
}

