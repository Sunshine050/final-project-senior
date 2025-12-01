import { Document, Types } from 'mongoose';
import { OrganizationType } from '../common/enums';
export type OrganizationDocument = Organization & Document;
export declare class Organization {
    name: string;
    type: OrganizationType;
    address: string;
    phone: string;
    email: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    isActive: boolean;
    capacity: number;
    availableCapacity: number;
    operatingHours: {
        open: string;
        close: string;
        is24Hours: boolean;
    };
    services: string[];
    metadata: Record<string, unknown>;
}
export declare const OrganizationSchema: import("mongoose").Schema<Organization, import("mongoose").Model<Organization, any, any, any, Document<unknown, any, Organization, any, {}> & Organization & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, Document<unknown, {}, import("mongoose").FlatRecord<Organization>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Organization> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
