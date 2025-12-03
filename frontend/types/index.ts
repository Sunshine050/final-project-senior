export enum EmergencyStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  EN_ROUTE = "en_route",
  ON_SCENE = "on_scene",
  TRANSPORTING = "transporting",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum EmergencySeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
  HOSPITAL_STAFF = "hospital_staff",
  RESCUE_TEAM = "rescue_team",
  DISPATCHER = "dispatcher",
}

export enum OrganizationType {
  HOSPITAL = "hospital",
  RESCUE_TEAM = "rescue_team",
  DISPATCH_CENTER = "dispatch_center",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organizationId?: string;
}

export interface Emergency {
  id: string;
  callerName: string;
  callerPhone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  description?: string;
  notes?: string;
  patientCount: number;
  patients: Array<{
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
  }>;
  assignedHospitalId?: string;
  assignedHospital?: Organization;
  assignedRescueTeamId?: string;
  assignedRescueTeam?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  address?: string;
  phone?: string;
  email?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  capacity?: number;
  availableCapacity?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

