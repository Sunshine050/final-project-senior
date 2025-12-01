import { Document, Types } from 'mongoose';
export type EmergencyResponseDocument = EmergencyResponse & Document;
export declare class EmergencyResponse {
    emergencyRequestId: Types.ObjectId;
    organizationId: Types.ObjectId;
    responderId?: Types.ObjectId;
    responseType: string;
    dispatchTime: Date;
    arrivalTime?: Date;
    departureTime?: Date;
    hospitalArrivalTime?: Date;
    vehicleId?: string;
    teamMembers: Types.ObjectId[];
    actionsTaken: string[];
    medicalProcedures: string[];
    equipmentUsed: string[];
    patientVitals: Array<{
        timestamp: Date;
        heartRate?: number;
        bloodPressure?: string;
        oxygenSaturation?: number;
        temperature?: number;
        notes?: string;
    }>;
    notes?: string;
    outcome?: string;
    distanceTraveled?: number;
    responseDuration?: number;
}
export declare const EmergencyResponseSchema: import("mongoose").Schema<EmergencyResponse, import("mongoose").Model<EmergencyResponse, any, any, any, Document<unknown, any, EmergencyResponse, any, {}> & EmergencyResponse & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmergencyResponse, Document<unknown, {}, import("mongoose").FlatRecord<EmergencyResponse>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EmergencyResponse> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
