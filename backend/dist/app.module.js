"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const sos_module_1 = require("./modules/sos/sos.module");
const hospital_module_1 = require("./modules/hospital/hospital.module");
const rescue_module_1 = require("./modules/rescue/rescue.module");
const user_module_1 = require("./modules/user/user.module");
const organization_module_1 = require("./modules/organization/organization.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
const notification_module_1 = require("./modules/notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI') || 'mongodb://localhost:27017/emergency-care',
                }),
                inject: [config_1.ConfigService],
            }),
            websocket_module_1.WebSocketModule,
            auth_module_1.AuthModule,
            sos_module_1.SosModule,
            hospital_module_1.HospitalModule,
            rescue_module_1.RescueModule,
            user_module_1.UserModule,
            organization_module_1.OrganizationModule,
            notification_module_1.NotificationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map