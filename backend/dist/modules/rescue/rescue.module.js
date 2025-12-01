"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const rescue_controller_1 = require("./rescue.controller");
const rescue_service_1 = require("./rescue.service");
const organization_schema_1 = require("../../schemas/organization.schema");
let RescueModule = class RescueModule {
};
exports.RescueModule = RescueModule;
exports.RescueModule = RescueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema },
            ]),
        ],
        controllers: [rescue_controller_1.RescueController],
        providers: [rescue_service_1.RescueService],
        exports: [rescue_service_1.RescueService],
    })
], RescueModule);
//# sourceMappingURL=rescue.module.js.map