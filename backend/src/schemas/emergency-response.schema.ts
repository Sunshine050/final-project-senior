import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EmergencyResponseDocument = EmergencyResponse & Document;

@Schema({ timestamps: true })
export class EmergencyResponse {
  @ApiProperty({ description: 'Emergency request ID' })
  @Prop({ type: Types.ObjectId, ref: 'EmergencyRequest', required: true })
  emergencyRequestId: Types.ObjectId;

  @ApiProperty({ description: 'Responding organization ID' })
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @ApiProperty({ description: 'Responder user ID' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  responderId?: Types.ObjectId;

  @ApiProperty({ description: 'Response type (rescue, hospital, etc.)' })
  @Prop({ required: true })
  responseType: string;

  @ApiProperty({ description: 'Dispatch time' })
  @Prop({ required: true })
  dispatchTime: Date;

  @ApiProperty({ description: 'Arrival time at scene' })
  @Prop()
  arrivalTime?: Date;

  @ApiProperty({ description: 'Departure time from scene' })
  @Prop()
  departureTime?: Date;

  @ApiProperty({ description: 'Arrival at hospital time' })
  @Prop()
  hospitalArrivalTime?: Date;

  @ApiProperty({ description: 'Vehicle/unit identifier' })
  @Prop()
  vehicleId?: string;

  @ApiProperty({ description: 'Team members involved' })
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  teamMembers: Types.ObjectId[];

  @ApiProperty({ description: 'Actions taken at scene' })
  @Prop({ type: [String], default: [] })
  actionsTaken: string[];

  @ApiProperty({ description: 'Medical procedures performed' })
  @Prop({ type: [String], default: [] })
  medicalProcedures: string[];

  @ApiProperty({ description: 'Equipment used' })
  @Prop({ type: [String], default: [] })
  equipmentUsed: string[];

  @ApiProperty({ description: 'Patient vitals recorded' })
  @Prop({ type: [Object], default: [] })
  patientVitals: Array<{
    timestamp: Date;
    heartRate?: number;
    bloodPressure?: string;
    oxygenSaturation?: number;
    temperature?: number;
    notes?: string;
  }>;

  @ApiProperty({ description: 'Response notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Response outcome' })
  @Prop()
  outcome?: string;

  @ApiProperty({ description: 'Distance traveled in km' })
  @Prop()
  distanceTraveled?: number;

  @ApiProperty({ description: 'Response duration in minutes' })
  @Prop()
  responseDuration?: number;
}

export const EmergencyResponseSchema = SchemaFactory.createForClass(EmergencyResponse);

// Indexes
EmergencyResponseSchema.index({ emergencyRequestId: 1 });
EmergencyResponseSchema.index({ organizationId: 1 });
EmergencyResponseSchema.index({ dispatchTime: -1 });

