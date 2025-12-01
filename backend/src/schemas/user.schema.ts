import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'User email address' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'User password (hashed)' })
  @Prop({ required: false })
  password?: string;

  @ApiProperty({ description: 'User first name' })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ description: 'User phone number' })
  @Prop()
  phone?: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  @Prop({ required: true, enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ description: 'Organization ID reference' })
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId?: Types.ObjectId;

  @ApiProperty({ description: 'Google OAuth ID' })
  @Prop()
  googleId?: string;

  @ApiProperty({ description: 'Profile picture URL' })
  @Prop()
  avatar?: string;

  @ApiProperty({ description: 'Whether the user account is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether email is verified' })
  @Prop({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Last login timestamp' })
  @Prop()
  lastLogin?: Date;

  @ApiProperty({ description: 'Refresh token for JWT' })
  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ googleId: 1 });

