import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RescueController } from './rescue.controller';
import { RescueService } from './rescue.service';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [RescueController],
  providers: [RescueService],
  exports: [RescueService],
})
export class RescueModule {}

