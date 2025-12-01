import { Document, Types } from 'mongoose';
import { EmergencyStatus, EmergencySeverity } from '../common/enums';
export type EmergencyRequestDocument = EmergencyRequest & Document;
export declare class EmergencyRequest {
    requesterId?: Types.ObjectId;
    callerName: string;
    callerPhone: string;
    description: string;
    severity: EmergencySeverity;
    status: EmergencyStatus;
    address: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    assignedHospitalId?: Types.ObjectId;
    assignedRescueTeamId?: Types.ObjectId;
    dispatcherId?: Types.ObjectId;
    patientCount: number;
    patients: Array<{
        name?: string;
        age?: number;
        gender?: string;
        condition?: string;
    }>;
    emergencyType?: string;
    notes?: string;
    statusHistory: Array<{
        status: EmergencyStatus;
        timestamp: Date;
        updatedBy?: Types.ObjectId;
        notes?: string;
    }>;
    estimatedArrival?: Date;
    actualArrival?: Date;
    completedAt?: Date;
    priorityScore: number;
}
export declare const EmergencyRequestSchema: import("mongoose").Schema<EmergencyRequest, import("mongoose").Model<EmergencyRequest, any, any, any, Document<unknown, any, EmergencyRequest, any, {}> & EmergencyRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmergencyRequest, Document<unknown, {}, import("mongoose").FlatRecord<EmergencyRequest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EmergencyRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
