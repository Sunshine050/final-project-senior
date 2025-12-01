import { NestFactory } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../schemas/user.schema';
import { Organization } from '../schemas/organization.schema';
import { EmergencyRequest } from '../schemas/emergency-request.schema';
import { EmergencyResponse } from '../schemas/emergency-response.schema';
import { Role, OrganizationType, EmergencyStatus, EmergencySeverity } from '../common/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const organizationModel = app.get<Model<Organization>>(getModelToken(Organization.name));
  const emergencyRequestModel = app.get<Model<EmergencyRequest>>(getModelToken(EmergencyRequest.name));
  const emergencyResponseModel = app.get<Model<EmergencyResponse>>(getModelToken(EmergencyResponse.name));

  console.log('🌱 Starting database seed...');

  // Clear existing data
  await userModel.deleteMany({});
  await organizationModel.deleteMany({});
  await emergencyRequestModel.deleteMany({});
  await emergencyResponseModel.deleteMany({});

  console.log('📦 Creating organizations...');

  // Create hospitals
  const hospitals = await organizationModel.insertMany([
    {
      name: 'Bangkok General Hospital',
      type: OrganizationType.HOSPITAL,
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
      type: OrganizationType.HOSPITAL,
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
      type: OrganizationType.HOSPITAL,
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

  // Create rescue teams
  const rescueTeams = await organizationModel.insertMany([
    {
      name: 'Ruamkatanyu Foundation',
      type: OrganizationType.RESCUE_TEAM,
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
      type: OrganizationType.RESCUE_TEAM,
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
      type: OrganizationType.RESCUE_TEAM,
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

  // Create dispatch center
  const dispatchCenter = await organizationModel.create({
    name: 'Bangkok Emergency Dispatch Center',
    type: OrganizationType.DISPATCH_CENTER,
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

  // Create admin user
  const adminUser = await userModel.create({
    email: 'admin@emergency.com',
    password: hashedPassword,
    firstName: 'System',
    lastName: 'Admin',
    phone: '+66812345678',
    role: Role.ADMIN,
    isActive: true,
    isEmailVerified: true,
  });

  // Create dispatcher user
  const dispatcherUser = await userModel.create({
    email: 'dispatcher@emergency.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Dispatcher',
    phone: '+66812345679',
    role: Role.DISPATCHER,
    organizationId: dispatchCenter._id as Types.ObjectId,
    isActive: true,
    isEmailVerified: true,
  });

  // Create hospital staff users
  for (let i = 0; i < hospitals.length; i++) {
    await userModel.create({
      email: `hospital${i + 1}@emergency.com`,
      password: hashedPassword,
      firstName: `Hospital${i + 1}`,
      lastName: 'Staff',
      phone: `+6681234567${i}`,
      role: Role.HOSPITAL_STAFF,
      organizationId: hospitals[i]._id as Types.ObjectId,
      isActive: true,
      isEmailVerified: true,
    });
  }

  // Create rescue team users
  const rescueTeamUsers: UserDocument[] = [];
  for (let i = 0; i < rescueTeams.length; i++) {
    const rescueUser = await userModel.create({
      email: `rescue${i + 1}@emergency.com`,
      password: hashedPassword,
      firstName: `Rescue${i + 1}`,
      lastName: 'Team',
      phone: `+6681234568${i}`,
      role: Role.RESCUE_TEAM,
      organizationId: rescueTeams[i]._id as Types.ObjectId,
      isActive: true,
      isEmailVerified: true,
    });
    rescueTeamUsers.push(rescueUser);
  }

  // Create regular user
  const citizenUser = await userModel.create({
    email: 'user@emergency.com',
    password: hashedPassword,
    firstName: 'Regular',
    lastName: 'User',
    phone: '+66812345690',
    role: Role.USER,
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
      severity: EmergencySeverity.CRITICAL,
      status: EmergencyStatus.EN_ROUTE,
      address: 'Rama IV Rd, Khlong Toei, Bangkok 10110',
      location: {
        type: 'Point',
        coordinates: [100.5499, 13.7225],
      },
      assignedHospitalId: hospitals[0]._id as Types.ObjectId,
      assignedRescueTeamId: rescueTeams[0]._id as Types.ObjectId,
      dispatcherId: dispatcherUser._id,
      patientCount: 3,
      emergencyType: 'Traffic Accident',
      notes: 'Two critical patients requiring immediate transport.',
      statusHistory: [
        {
          status: EmergencyStatus.PENDING,
          timestamp: new Date(now.getTime() - 1000 * 60 * 25),
          notes: 'Emergency reported by passerby',
        },
        {
          status: EmergencyStatus.ASSIGNED,
          timestamp: new Date(now.getTime() - 1000 * 60 * 20),
          updatedBy: dispatcherUser._id,
          notes: 'Assigned to Ruamkatanyu Foundation',
        },
        {
          status: EmergencyStatus.EN_ROUTE,
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
      severity: EmergencySeverity.HIGH,
      status: EmergencyStatus.ON_SCENE,
      address: 'Sathorn Square, Bang Rak, Bangkok',
      location: {
        type: 'Point',
        coordinates: [100.5299, 13.7253],
      },
      assignedHospitalId: hospitals[1]._id as Types.ObjectId,
      assignedRescueTeamId: rescueTeams[1]._id as Types.ObjectId,
      dispatcherId: dispatcherUser._id,
      patientCount: 1,
      emergencyType: 'Medical Emergency',
      notes: 'Suspected stroke, FAST positive.',
      statusHistory: [
        {
          status: EmergencyStatus.PENDING,
          timestamp: new Date(now.getTime() - 1000 * 60 * 40),
          notes: 'Caller is office colleague',
        },
        {
          status: EmergencyStatus.ASSIGNED,
          timestamp: new Date(now.getTime() - 1000 * 60 * 35),
          updatedBy: dispatcherUser._id,
          notes: 'Assigned to Por Tek Tung Foundation',
        },
        {
          status: EmergencyStatus.EN_ROUTE,
          timestamp: new Date(now.getTime() - 1000 * 60 * 28),
          notes: 'Unit departed base',
        },
        {
          status: EmergencyStatus.ON_SCENE,
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
      severity: EmergencySeverity.CRITICAL,
      status: EmergencyStatus.TRANSPORTING,
      address: 'Rama II Frontage Rd, Chom Thong, Bangkok',
      location: {
        type: 'Point',
        coordinates: [100.4375, 13.6762],
      },
      assignedHospitalId: hospitals[2]._id as Types.ObjectId,
      assignedRescueTeamId: rescueTeams[2]._id as Types.ObjectId,
      dispatcherId: dispatcherUser._id,
      patientCount: 1,
      emergencyType: 'Trauma',
      notes: 'Patient intubated, en route to trauma center.',
      statusHistory: [
        {
          status: EmergencyStatus.PENDING,
          timestamp: new Date(now.getTime() - 1000 * 60 * 50),
        },
        {
          status: EmergencyStatus.ASSIGNED,
          timestamp: new Date(now.getTime() - 1000 * 60 * 45),
          updatedBy: dispatcherUser._id,
        },
        {
          status: EmergencyStatus.EN_ROUTE,
          timestamp: new Date(now.getTime() - 1000 * 60 * 35),
        },
        {
          status: EmergencyStatus.ON_SCENE,
          timestamp: new Date(now.getTime() - 1000 * 60 * 20),
        },
        {
          status: EmergencyStatus.TRANSPORTING,
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
      severity: EmergencySeverity.MEDIUM,
      status: EmergencyStatus.ASSIGNED,
      address: 'Lat Phrao 101 Alley, Wang Thonglang, Bangkok',
      location: {
        type: 'Point',
        coordinates: [100.604, 13.7822],
      },
      assignedHospitalId: hospitals[0]._id as Types.ObjectId,
      assignedRescueTeamId: rescueTeams[1]._id as Types.ObjectId,
      dispatcherId: dispatcherUser._id,
      patientCount: 4,
      emergencyType: 'Fire Incident',
      notes: 'Awaiting rescue team arrival for triage.',
      statusHistory: [
        {
          status: EmergencyStatus.PENDING,
          timestamp: new Date(now.getTime() - 1000 * 60 * 15),
        },
        {
          status: EmergencyStatus.ASSIGNED,
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

  await emergencyResponseModel.insertMany(
    emergencyRequests
      .filter((request) => request.assignedRescueTeamId)
      .map((request) => ({
        emergencyRequestId: request._id,
        organizationId: request.assignedRescueTeamId as Types.ObjectId,
        responderId: rescueTeamUsers.find((user) =>
          user.organizationId?.equals(request.assignedRescueTeamId as Types.ObjectId),
        )?._id,
        responseType: 'rescue',
        dispatchTime: request.statusHistory?.[0]?.timestamp || new Date(),
        arrivalTime: request.statusHistory?.find((s) => s.status === EmergencyStatus.ON_SCENE)?.timestamp,
        notes: request.notes,
      })),
  );
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

