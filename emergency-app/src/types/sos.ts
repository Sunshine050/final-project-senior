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
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface EmergencyResponse {
  id: string;
  description: string;
  grade: EmergencyGrade;
  type: EmergencyType;
  status: EmergencyStatus;
  createdAt: string;
  updatedAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface CreateEmergencyRequest {
  description: string;
  grade: EmergencyGrade;
  type: EmergencyType;
}

