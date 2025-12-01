"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = exports.Organization = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../common/enums");
let Organization = class Organization {
};
exports.Organization = Organization;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.OrganizationType, description: 'Type of organization' }),
    (0, mongoose_1.Prop)({ required: true, enum: enums_1.OrganizationType }),
    __metadata("design:type", String)
], Organization.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization address' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone number' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Organization.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact email' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Organization.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'GeoJSON location for geospatial queries' }),
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    }),
    __metadata("design:type", Object)
], Organization.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the organization is active' }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Organization.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization capacity (beds for hospitals, vehicles for rescue)' }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Organization.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current available capacity' }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Organization.prototype, "availableCapacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Operating hours' }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Organization.prototype, "operatingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of services provided' }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Organization.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata' }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Organization.prototype, "metadata", void 0);
exports.Organization = Organization = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Organization);
exports.OrganizationSchema = mongoose_1.SchemaFactory.createForClass(Organization);
exports.OrganizationSchema.index({ location: '2dsphere' });
exports.OrganizationSchema.index({ type: 1 });
exports.OrganizationSchema.index({ isActive: 1 });
//# sourceMappingURL=organization.schema.js.map