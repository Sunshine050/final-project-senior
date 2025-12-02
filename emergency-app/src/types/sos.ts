export enum EmergencyGrade {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3',
  LEVEL_4 = 'LEVEL_4',
}

export enum EmergencyType {
  ACCIDENT = 'ACCIDENT',
  UNCONSCIOUS = 'UNCONSCIOUS',
  FALL = 'FALL',
  FIRE = 'FIRE',
  OTHER = 'OTHER',
}

export enum EmergencyStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  ON_SCENE = 'on_scene',
  TRANSPORTING = 'transporting',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface EmergencyResponse {
  id: string;
  callerName: string;
  callerPhone: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: EmergencyStatus;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  assignedHospitalId?: string;
  assignedRescueTeamId?: string;
  dispatcherId?: string;
  patientCount: number;
  emergencyType?: string;
  notes?: string;
  estimatedArrival?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyRequest {
  callerName: string;
  callerPhone: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  emergencyType?: EmergencyType;
  patientCount?: number;
  patients?: Array<{
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
  }>;
  notes?: string;
}

