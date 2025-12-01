import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SosController } from './sos.controller';
import { SosService } from './sos.service';
import { EmergencyRequest, EmergencyRequestSchema } from '../../schemas/emergency-request.schema';
import { EmergencyResponse, EmergencyResponseSchema } from '../../schemas/emergency-response.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyRequest.name, schema: EmergencyRequestSchema },
      { name: EmergencyResponse.name, schema: EmergencyResponseSchema },
    ]),
  ],
  controllers: [SosController],
  providers: [SosService],
  exports: [SosService],
})
export class SosModule {}

