import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EmergencyStatus, EmergencySeverity } from '../common/enums';

export type EmergencyRequestDocument = EmergencyRequest & Document;

@Schema({ timestamps: true })
export class EmergencyRequest {
  @ApiProperty({ description: 'Caller/requester user ID' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  requesterId?: Types.ObjectId;

  @ApiProperty({ description: 'Caller name (for anonymous requests)' })
  @Prop({ required: true })
  callerName: string;

  @ApiProperty({ description: 'Caller phone number' })
  @Prop({ required: true })
  callerPhone: string;

  @ApiProperty({ description: 'Emergency description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ enum: EmergencySeverity, description: 'Emergency severity level' })
  @Prop({ required: true, enum: EmergencySeverity, default: EmergencySeverity.MEDIUM })
  severity: EmergencySeverity;

  @ApiProperty({ enum: EmergencyStatus, description: 'Current status of emergency' })
  @Prop({ required: true, enum: EmergencyStatus, default: EmergencyStatus.PENDING })
  status: EmergencyStatus;

  @ApiProperty({ description: 'Emergency location address' })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ description: 'GeoJSON location' })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };

  @ApiProperty({ description: 'Assigned hospital ID' })
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  assignedHospitalId?: Types.ObjectId;

  @ApiProperty({ description: 'Assigned rescue team ID' })
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  assignedRescueTeamId?: Types.ObjectId;

  @ApiProperty({ description: 'Dispatcher who handled the case' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  dispatcherId?: Types.ObjectId;

  @ApiProperty({ description: 'Number of patients/victims' })
  @Prop({ default: 1 })
  patientCount: number;

  @ApiProperty({ description: 'Patient information' })
  @Prop({ type: [Object], default: [] })
  patients: Array<{
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
  }>;

  @ApiProperty({ description: 'Emergency type/category' })
  @Prop()
  emergencyType?: string;

  @ApiProperty({ description: 'Additional notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Status history' })
  @Prop({ type: [Object], default: [] })
  statusHistory: Array<{
    status: EmergencyStatus;
    timestamp: Date;
    updatedBy?: Types.ObjectId;
    notes?: string;
  }>;

  @ApiProperty({ description: 'Estimated arrival time' })
  @Prop()
  estimatedArrival?: Date;

  @ApiProperty({ description: 'Actual arrival time' })
  @Prop()
  actualArrival?: Date;

  @ApiProperty({ description: 'Completion time' })
  @Prop()
  completedAt?: Date;

  @ApiProperty({ description: 'Priority score for sorting' })
  @Prop({ default: 0 })
  priorityScore: number;
}

export const EmergencyRequestSchema = SchemaFactory.createForClass(EmergencyRequest);

// Indexes
EmergencyRequestSchema.index({ location: '2dsphere' });
EmergencyRequestSchema.index({ status: 1 });
EmergencyRequestSchema.index({ severity: 1 });
EmergencyRequestSchema.index({ assignedHospitalId: 1 });
EmergencyRequestSchema.index({ assignedRescueTeamId: 1 });
EmergencyRequestSchema.index({ createdAt: -1 });
EmergencyRequestSchema.index({ status: 1, severity: 1 });

