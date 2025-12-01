"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const app_module_1 = require("../app.module");
const user_schema_1 = require("../schemas/user.schema");
const organization_schema_1 = require("../schemas/organization.schema");
const enums_1 = require("../common/enums");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const organizationModel = app.get((0, mongoose_1.getModelToken)(organization_schema_1.Organization.name));
    console.log('🌱 Starting database seed...');
    await userModel.deleteMany({});
    await organizationModel.deleteMany({});
    console.log('📦 Creating organizations...');
    const hospitals = await organizationModel.insertMany([
        {
            name: 'Bangkok General Hospital',
            type: enums_1.OrganizationType.HOSPITAL,
            address: '2 Soi Soonvijai 7, New Petchburi Rd, Bangkok 10310',
            phone: '+6627550000',
            email: 'info@bangkokgeneral.com',
            location: {
                type: 'Point',
                coordinates: [100.5685, 13.7462],
            },
            isActive: true,
            capacity: 200,
            availableCapacity: 45,
            operatingHours: {
                open: '00:00',
                close: '23:59',
                is24Hours: true,
            },
            services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Orthopedics'],
        },
        {
            name: 'Bumrungrad International Hospital',
            type: enums_1.OrganizationType.HOSPITAL,
            address: '33 Sukhumvit 3, Wattana, Bangkok 10110',
            phone: '+6620667000',
            email: 'info@bumrungrad.com',
            location: {
                type: 'Point',
                coordinates: [100.5561, 13.7447],
            },
            isActive: true,
            capacity: 580,
            availableCapacity: 120,
            operatingHours: {
                open: '00:00',
                close: '23:59',
                is24Hours: true,
            },
            services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology', 'Oncology'],
        },
        {
            name: 'Ramathibodi Hospital',
            type: enums_1.OrganizationType.HOSPITAL,
            address: '270 Rama VI Rd, Ratchathewi, Bangkok 10400',
            phone: '+6622011000',
            email: 'info@ramathibodi.ac.th',
            location: {
                type: 'Point',
                coordinates: [100.5342, 13.7649],
            },
            isActive: true,
            capacity: 1200,
            availableCapacity: 200,
            operatingHours: {
                open: '00:00',
                close: '23:59',
                is24Hours: true,
            },
            services: ['Emergency', 'ICU', 'Surgery', 'Trauma Center', 'Burn Unit'],
        },
    ]);
    console.log(`✅ Created ${hospitals.length} hospitals`);
    const rescueTeams = await organizationModel.insertMany([
        {
            name: 'Ruamkatanyu Foundation',
            type: enums_1.OrganizationType.RESCUE_TEAM,
            address: '1415 Krung Kasem Rd, Pomprab, Bangkok 10100',
            phone: '+6622246999',
            email: 'contact@ruamkatanyu.or.th',
            location: {
                type: 'Point',
                coordinates: [100.5098, 13.7518],
            },
            isActive: true,
            capacity: 20,
            availableCapacity: 15,
            services: ['Emergency Response', 'Accident Rescue', 'Medical Transport'],
        },
        {
            name: 'Por Tek Tung Foundation',
            type: enums_1.OrganizationType.RESCUE_TEAM,
            address: '326 Plabplachai Rd, Pomprab, Bangkok 10100',
            phone: '+6622236555',
            email: 'contact@portektung.or.th',
            location: {
                type: 'Point',
                coordinates: [100.5125, 13.7398],
            },
            isActive: true,
            capacity: 25,
            availableCapacity: 18,
            services: ['Emergency Response', 'Accident Rescue', 'Medical Transport', 'Disaster Relief'],
        },
        {
            name: 'Sawang Rescue Team',
            type: enums_1.OrganizationType.RESCUE_TEAM,
            address: '88 Charoenkrung Rd, Bangrak, Bangkok 10500',
            phone: '+6622345678',
            email: 'contact@sawangrescue.or.th',
            location: {
                type: 'Point',
                coordinates: [100.5167, 13.7267],
            },
            isActive: true,
            capacity: 15,
            availableCapacity: 10,
            services: ['Emergency Response', 'Water Rescue', 'Medical Transport'],
        },
    ]);
    console.log(`✅ Created ${rescueTeams.length} rescue teams`);
    const dispatchCenter = await organizationModel.create({
        name: 'Bangkok Emergency Dispatch Center',
        type: enums_1.OrganizationType.DISPATCH_CENTER,
        address: '1 City Hall, Bangkok 10200',
        phone: '1669',
        email: 'dispatch@bangkok.go.th',
        location: {
            type: 'Point',
            coordinates: [100.4923, 13.7563],
        },
        isActive: true,
        capacity: 50,
        availableCapacity: 50,
        operatingHours: {
            open: '00:00',
            close: '23:59',
            is24Hours: true,
        },
        services: ['Emergency Dispatch', 'Coordination', 'Call Center'],
    });
    console.log('✅ Created dispatch center');
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userModel.create({
        email: 'admin@emergency.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        phone: '+66812345678',
        role: enums_1.Role.ADMIN,
        isActive: true,
        isEmailVerified: true,
    });
    await userModel.create({
        email: 'dispatcher@emergency.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Dispatcher',
        phone: '+66812345679',
        role: enums_1.Role.DISPATCHER,
        organizationId: dispatchCenter._id,
        isActive: true,
        isEmailVerified: true,
    });
    for (let i = 0; i < hospitals.length; i++) {
        await userModel.create({
            email: `hospital${i + 1}@emergency.com`,
            password: hashedPassword,
            firstName: `Hospital${i + 1}`,
            lastName: 'Staff',
            phone: `+6681234567${i}`,
            role: enums_1.Role.HOSPITAL_STAFF,
            organizationId: hospitals[i]._id,
            isActive: true,
            isEmailVerified: true,
        });
    }
    for (let i = 0; i < rescueTeams.length; i++) {
        await userModel.create({
            email: `rescue${i + 1}@emergency.com`,
            password: hashedPassword,
            firstName: `Rescue${i + 1}`,
            lastName: 'Team',
            phone: `+6681234568${i}`,
            role: enums_1.Role.RESCUE_TEAM,
            organizationId: rescueTeams[i]._id,
            isActive: true,
            isEmailVerified: true,
        });
    }
    await userModel.create({
        email: 'user@emergency.com',
        password: hashedPassword,
        firstName: 'Regular',
        lastName: 'User',
        phone: '+66812345690',
        role: enums_1.Role.USER,
        isActive: true,
        isEmailVerified: true,
    });
    const userCount = await userModel.countDocuments();
    console.log(`✅ Created ${userCount} users`);
    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Test accounts (password: password123):');
    console.log('  - Admin: admin@emergency.com');
    console.log('  - Dispatcher: dispatcher@emergency.com');
    console.log('  - Hospital Staff: hospital1@emergency.com, hospital2@emergency.com, hospital3@emergency.com');
    console.log('  - Rescue Team: rescue1@emergency.com, rescue2@emergency.com, rescue3@emergency.com');
    console.log('  - User: user@emergency.com');
    await app.close();
}
seed()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('❌ Seed error:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map