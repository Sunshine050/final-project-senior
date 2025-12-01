import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationType } from '../common/enums';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @ApiProperty({ description: 'Organization name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ enum: OrganizationType, description: 'Type of organization' })
  @Prop({ required: true, enum: OrganizationType })
  type: OrganizationType;

  @ApiProperty({ description: 'Organization address' })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ description: 'Contact phone number' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ description: 'Contact email' })
  @Prop()
  email: string;

  @ApiProperty({ description: 'GeoJSON location for geospatial queries' })
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

  @ApiProperty({ description: 'Whether the organization is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Organization capacity (beds for hospitals, vehicles for rescue)' })
  @Prop({ default: 0 })
  capacity: number;

  @ApiProperty({ description: 'Current available capacity' })
  @Prop({ default: 0 })
  availableCapacity: number;

  @ApiProperty({ description: 'Operating hours' })
  @Prop({ type: Object })
  operatingHours: {
    open: string;
    close: string;
    is24Hours: boolean;
  };

  @ApiProperty({ description: 'List of services provided' })
  @Prop({ type: [String], default: [] })
  services: string[];

  @ApiProperty({ description: 'Additional metadata' })
  @Prop({ type: Object })
  metadata: Record<string, unknown>;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Create 2dsphere index for geospatial queries
OrganizationSchema.index({ location: '2dsphere' });
OrganizationSchema.index({ type: 1 });
OrganizationSchema.index({ isActive: 1 });

