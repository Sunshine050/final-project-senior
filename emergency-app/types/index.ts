import { EmergencySeverity } from '../constants/emergencyTypes';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  organizationId?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SosPayload {
  severity: EmergencySeverity;
  emergencyType: string;
  description?: string;
  additionalNotes?: string;
  requesterName?: string;
  requesterPhone?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email?: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  isActive: boolean;
  capacity: number;
  availableCapacity: number;
  operatingHours?: {
    open: string;
    close: string;
    is24Hours: boolean;
  };
  services: string[];
  distance?: number;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  services?: string[];
}

export interface LongdoPoi {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tel?: string;
  address?: string;
  distance?: number;
}

export interface ApiErrorShape {
  message: string;
  statusCode?: number;
}

