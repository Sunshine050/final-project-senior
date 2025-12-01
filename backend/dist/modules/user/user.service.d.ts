import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByOrganization(organizationId: string): Promise<UserDocument[]>;
    updateUser(id: string, updateData: Partial<User>): Promise<UserDocument>;
    deactivateUser(id: string): Promise<UserDocument>;
}
