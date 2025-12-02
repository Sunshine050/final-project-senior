import { Document, Types } from 'mongoose';
import { Role } from '../common/enums';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    organizationId?: Types.ObjectId;
    googleId?: string;
    facebookId?: string;
    avatar?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    refreshToken?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
