"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SosModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sos_controller_1 = require("./sos.controller");
const sos_service_1 = require("./sos.service");
const emergency_request_schema_1 = require("../../schemas/emergency-request.schema");
const emergency_response_schema_1 = require("../../schemas/emergency-response.schema");
let SosModule = class SosModule {
};
exports.SosModule = SosModule;
exports.SosModule = SosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: emergency_request_schema_1.EmergencyRequest.name, schema: emergency_request_schema_1.EmergencyRequestSchema },
                { name: emergency_response_schema_1.EmergencyResponse.name, schema: emergency_response_schema_1.EmergencyResponseSchema },
            ]),
        ],
        controllers: [sos_controller_1.SosController],
        providers: [sos_service_1.SosService],
        exports: [sos_service_1.SosService],
    })
], SosModule);
//# sourceMappingURL=sos.module.js.map