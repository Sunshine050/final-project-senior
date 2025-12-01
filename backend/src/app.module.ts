import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { SosModule } from './modules/sos/sos.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { RescueModule } from './modules/rescue/rescue.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/emergency-care',
      }),
      inject: [ConfigService],
    }),
    WebSocketModule, // Must be before other modules that use it
    AuthModule,
    SosModule,
    HospitalModule,
    RescueModule,
    UserModule,
    OrganizationModule,
    NotificationModule,
  ],
})
export class AppModule {}
