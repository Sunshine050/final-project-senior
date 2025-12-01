// Emergency Types
export type EmergencyStatus =
  | 'pending'
  | 'assigned'
  | 'en_route'
  | 'on_scene'
  | 'transporting'
  | 'completed'
  | 'cancelled';

export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical';

// Explicit re-exports to ensure Next.js can resolve them
export type { EmergencyStatus as EmergencyStatusType };
export type { EmergencySeverity as EmergencySeverityType };

// Export as const for type checking
export const EmergencyStatusEnum = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  EN_ROUTE: 'en_route',
  ON_SCENE: 'on_scene',
  TRANSPORTING: 'transporting',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const EmergencySeverityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export interface EmergencyLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Emergency {
  id: string;
  callerName: string;
  callerPhone: string;
  description: string;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  address: string;
  location: EmergencyLocation;
  assignedHospitalId?: string;
  assignedRescueTeamId?: string;
  dispatcherId?: string;
  patientCount: number;
  emergencyType?: string;
  notes?: string;
  estimatedArrival?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyListResponse {
  data: Emergency[];
  total: number;
  page: number;
  limit: number;
}

// Rescue Team Types
export interface RescueTeamLocation {
  type: string;
  coordinates: [number, number];
}

export interface RescueTeam {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email?: string;
  location: RescueTeamLocation;
  isActive: boolean;
  capacity: number;
  availableCapacity: number;
  services: string[];
  distance?: number;
}

export interface RescueTeamListResponse {
  data: RescueTeam[];
  total: number;
}

// Hospital Types
export interface Hospital {
  id: string;
  name: string;
  type: string;
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
  operatingHours?: {
    open: string;
    close: string;
    is24Hours: boolean;
  };
  services: string[];
  distance?: number;
}

export interface HospitalListResponse {
  data: Hospital[];
  total: number;
}

// Auth Types
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
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  targetUserId?: string;
  targetOrganizationId?: string;
  targetRole?: string;
  isRead: boolean;
  readAt?: Date;
  emergencyId?: string;
  priority: number;
  expiresAt?: Date;
  createdAt: Date;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
}

// WebSocket Event Types
export interface EmergencyEventPayload {
  emergencyId: string;
  status?: string;
  severity?: string;
  assignedHospitalId?: string;
  assignedRescueTeamId?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  callerName?: string;
  description?: string;
  timestamp: Date;
}

export interface HospitalBedUpdatePayload {
  hospitalId: string;
  hospitalName: string;
  totalBeds: number;
  availableBeds: number;
  timestamp: Date;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  targetUserId?: string;
  targetOrganizationId?: string;
  targetRole?: string;
  timestamp: Date;
}

// Dashboard Stats
export interface RescueDashboardStats {
  activeMissions: number;
  completedToday: number;
  criticalCases: number;
  availableTeams: number;
}

