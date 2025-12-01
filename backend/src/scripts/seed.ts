import { NestFactory } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User } from '../schemas/user.schema';
import { Organization } from '../schemas/organization.schema';
import { Role, OrganizationType } from '../common/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const organizationModel = app.get<Model<Organization>>(getModelToken(Organization.name));

  console.log('🌱 Starting database seed...');

  // Clear existing data
  await userModel.deleteMany({});
  await organizationModel.deleteMany({});

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
  await userModel.create({
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
  await userModel.create({
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
  for (let i = 0; i < rescueTeams.length; i++) {
    await userModel.create({
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
  }

  // Create regular user
  await userModel.create({
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

