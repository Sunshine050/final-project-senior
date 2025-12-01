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
const emergency_request_schema_1 = require("../schemas/emergency-request.schema");
const emergency_response_schema_1 = require("../schemas/emergency-response.schema");
const enums_1 = require("../common/enums");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const organizationModel = app.get((0, mongoose_1.getModelToken)(organization_schema_1.Organization.name));
    const emergencyRequestModel = app.get((0, mongoose_1.getModelToken)(emergency_request_schema_1.EmergencyRequest.name));
    const emergencyResponseModel = app.get((0, mongoose_1.getModelToken)(emergency_response_schema_1.EmergencyResponse.name));
    console.log('🌱 Starting database seed...');
    await userModel.deleteMany({});
    await organizationModel.deleteMany({});
    await emergencyRequestModel.deleteMany({});
    await emergencyResponseModel.deleteMany({});
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
    const adminUser = await userModel.create({
        email: 'admin@emergency.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        phone: '+66812345678',
        role: enums_1.Role.ADMIN,
        isActive: true,
        isEmailVerified: true,
    });
    const dispatcherUser = await userModel.create({
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
    const rescueTeamUsers = [];
    for (let i = 0; i < rescueTeams.length; i++) {
        const rescueUser = await userModel.create({
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
        rescueTeamUsers.push(rescueUser);
    }
    const citizenUser = await userModel.create({
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
    console.log('🚑 Creating sample emergency cases...');
    const now = new Date();
    const emergencySeedData = [
        {
            callerName: 'Somchai Prasert',
            callerPhone: '+66912340001',
            description: 'Multi-vehicle collision on Rama IV road. Two passengers unconscious.',
            severity: enums_1.EmergencySeverity.CRITICAL,
            status: enums_1.EmergencyStatus.EN_ROUTE,
            address: 'Rama IV Rd, Khlong Toei, Bangkok 10110',
            location: {
                type: 'Point',
                coordinates: [100.5499, 13.7225],
            },
            assignedHospitalId: hospitals[0]._id,
            assignedRescueTeamId: rescueTeams[0]._id,
            dispatcherId: dispatcherUser._id,
            patientCount: 3,
            emergencyType: 'Traffic Accident',
            notes: 'Two critical patients requiring immediate transport.',
            statusHistory: [
                {
                    status: enums_1.EmergencyStatus.PENDING,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 25),
                    notes: 'Emergency reported by passerby',
                },
                {
                    status: enums_1.EmergencyStatus.ASSIGNED,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 20),
                    updatedBy: dispatcherUser._id,
                    notes: 'Assigned to Ruamkatanyu Foundation',
                },
                {
                    status: enums_1.EmergencyStatus.EN_ROUTE,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 10),
                    notes: 'Rescue unit en route',
                },
            ],
            estimatedArrival: new Date(now.getTime() + 1000 * 60 * 8),
            priorityScore: 100,
        },
        {
            callerName: 'Prapaiporn T.',
            callerPhone: '+66912340002',
            description: 'Stroke symptoms reported at office building. Patient conscious but unstable.',
            severity: enums_1.EmergencySeverity.HIGH,
            status: enums_1.EmergencyStatus.ON_SCENE,
            address: 'Sathorn Square, Bang Rak, Bangkok',
            location: {
                type: 'Point',
                coordinates: [100.5299, 13.7253],
            },
            assignedHospitalId: hospitals[1]._id,
            assignedRescueTeamId: rescueTeams[1]._id,
            dispatcherId: dispatcherUser._id,
            patientCount: 1,
            emergencyType: 'Medical Emergency',
            notes: 'Suspected stroke, FAST positive.',
            statusHistory: [
                {
                    status: enums_1.EmergencyStatus.PENDING,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 40),
                    notes: 'Caller is office colleague',
                },
                {
                    status: enums_1.EmergencyStatus.ASSIGNED,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 35),
                    updatedBy: dispatcherUser._id,
                    notes: 'Assigned to Por Tek Tung Foundation',
                },
                {
                    status: enums_1.EmergencyStatus.EN_ROUTE,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 28),
                    notes: 'Unit departed base',
                },
                {
                    status: enums_1.EmergencyStatus.ON_SCENE,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 10),
                    notes: 'Vitals monitored, preparing transport',
                },
            ],
            estimatedArrival: new Date(now.getTime() + 1000 * 60 * 5),
            priorityScore: 80,
        },
        {
            callerName: 'Krit Charoen',
            callerPhone: '+66912340003',
            description: 'Motorbike crash on Rama II frontage road. Severe bleeding reported.',
            severity: enums_1.EmergencySeverity.CRITICAL,
            status: enums_1.EmergencyStatus.TRANSPORTING,
            address: 'Rama II Frontage Rd, Chom Thong, Bangkok',
            location: {
                type: 'Point',
                coordinates: [100.4375, 13.6762],
            },
            assignedHospitalId: hospitals[2]._id,
            assignedRescueTeamId: rescueTeams[2]._id,
            dispatcherId: dispatcherUser._id,
            patientCount: 1,
            emergencyType: 'Trauma',
            notes: 'Patient intubated, en route to trauma center.',
            statusHistory: [
                {
                    status: enums_1.EmergencyStatus.PENDING,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 50),
                },
                {
                    status: enums_1.EmergencyStatus.ASSIGNED,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 45),
                    updatedBy: dispatcherUser._id,
                },
                {
                    status: enums_1.EmergencyStatus.EN_ROUTE,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 35),
                },
                {
                    status: enums_1.EmergencyStatus.ON_SCENE,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 20),
                },
                {
                    status: enums_1.EmergencyStatus.TRANSPORTING,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
                    notes: 'Departed scene heading to Ramathibodi Hospital',
                },
            ],
            estimatedArrival: new Date(now.getTime() + 1000 * 60 * 3),
            priorityScore: 100,
        },
        {
            callerName: 'Nattaporn S.',
            callerPhone: '+66912340004',
            description: 'House fire smoke inhalation victims awaiting evaluation.',
            severity: enums_1.EmergencySeverity.MEDIUM,
            status: enums_1.EmergencyStatus.ASSIGNED,
            address: 'Lat Phrao 101 Alley, Wang Thonglang, Bangkok',
            location: {
                type: 'Point',
                coordinates: [100.604, 13.7822],
            },
            assignedHospitalId: hospitals[0]._id,
            assignedRescueTeamId: rescueTeams[1]._id,
            dispatcherId: dispatcherUser._id,
            patientCount: 4,
            emergencyType: 'Fire Incident',
            notes: 'Awaiting rescue team arrival for triage.',
            statusHistory: [
                {
                    status: enums_1.EmergencyStatus.PENDING,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 15),
                },
                {
                    status: enums_1.EmergencyStatus.ASSIGNED,
                    timestamp: new Date(now.getTime() - 1000 * 60 * 12),
                    updatedBy: dispatcherUser._id,
                },
            ],
            estimatedArrival: new Date(now.getTime() + 1000 * 60 * 6),
            priorityScore: 60,
        },
    ];
    const emergencyRequests = await emergencyRequestModel.insertMany(emergencySeedData);
    console.log(`✅ Seeded ${emergencyRequests.length} emergency cases`);
    await emergencyResponseModel.insertMany(emergencyRequests
        .filter((request) => request.assignedRescueTeamId)
        .map((request) => ({
        emergencyRequestId: request._id,
        organizationId: request.assignedRescueTeamId,
        responderId: rescueTeamUsers.find((user) => user.organizationId?.equals(request.assignedRescueTeamId))?._id,
        responseType: 'rescue',
        dispatchTime: request.statusHistory?.[0]?.timestamp || new Date(),
        arrivalTime: request.statusHistory?.find((s) => s.status === enums_1.EmergencyStatus.ON_SCENE)?.timestamp,
        notes: request.notes,
    })));
    console.log('✅ Created emergency response records');
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