# Emergency Care System Backend

A complete NestJS backend with MongoDB for emergency care system.

## Features

- **Authentication**: JWT-based authentication with Google OAuth support
- **Role-Based Access Control**: Admin, User, Hospital Staff, Rescue Team, Dispatcher
- **Emergency Management**: Create, assign, and track emergency requests
- **Hospital Management**: Find hospitals with geospatial queries
- **Rescue Team Management**: Track available rescue teams
- **Swagger Documentation**: Full API documentation

## Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
```

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/emergency-care

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/oauth/google/callback

# App
PORT=3000
NODE_ENV=development
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- Swagger UI: http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/oauth/google` - Google OAuth authentication
- `GET /auth/profile` - Get current user profile (requires auth)

### Emergency (SOS)
- `POST /sos` - Create emergency request
- `POST /sos/:id/assign` - Assign emergency to hospital/rescue team
- `PUT /sos/:id/status` - Update emergency status
- `GET /sos/all` - Get all emergencies
- `GET /sos/dashboard/active-emergencies` - Get active emergencies for hospital
- `GET /sos/rescue/assigned-cases` - Get assigned cases for rescue team
- `GET /sos/:id` - Get emergency by ID

### Hospitals
- `GET /hospitals` - Get all hospitals
- `GET /hospitals/nearby` - Find nearby hospitals (geospatial query)
- `GET /hospitals/:id` - Get hospital by ID

### Rescue Teams
- `GET /rescue-teams` - Get all rescue teams
- `GET /rescue-teams/available` - Get available rescue teams
- `GET /rescue-teams/:id` - Get rescue team by ID

### Organizations
- `POST /organizations` - Create organization (admin only)
- `GET /organizations` - Get all organizations
- `GET /organizations/:id` - Get organization by ID
- `PUT /organizations/:id` - Update organization (admin only)
- `DELETE /organizations/:id` - Delete organization (admin only)

## User Roles

- `admin` - Full access to all endpoints
- `user` - Basic user access
- `hospital_staff` - Hospital staff access
- `rescue_team` - Rescue team access
- `dispatcher` - Dispatch center access

## Project Structure

```
src/
├── common/
│   ├── decorators/     # Custom decorators
│   ├── enums/          # Enums (roles, status, etc.)
│   ├── filters/        # Exception filters
│   └── guards/         # Auth guards
├── modules/
│   ├── auth/           # Authentication module
│   ├── hospital/       # Hospital module
│   ├── organization/   # Organization module
│   ├── rescue/         # Rescue team module
│   ├── sos/            # Emergency/SOS module
│   └── user/           # User module
├── schemas/            # MongoDB schemas
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

## License

ISC

