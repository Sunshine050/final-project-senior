# Emergency Care System - Frontend

A real-time emergency response management dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🚨 **Real-time Dashboard** - Live updates via WebSocket
- 📊 **Case Management** - View and manage emergency cases
- 👥 **Team Overview** - Monitor rescue team availability
- 🔐 **Authentication** - JWT-based auth with role support
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Create .env.local (optional - defaults work for local dev)
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:3000" >> .env.local
```

### Running

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Open http://localhost:3001 in your browser.

## Project Structure

```
src/
├── app/
│   ├── login/              # Login page
│   ├── rescue/
│   │   └── dashboard/      # Rescue team dashboard
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── rescue/             # Dashboard components
│   │   ├── CaseCard.tsx
│   │   ├── StatCard.tsx
│   │   ├── TeamCard.tsx
│   │   └── ...
│   └── ui/                 # Shadcn UI components
├── hooks/
│   ├── useWebSocket.ts     # WebSocket connection
│   └── useRescueDashboard.ts
├── services/
│   ├── authService.ts
│   ├── emergencyService.ts
│   ├── hospitalService.ts
│   └── rescueService.ts
├── types/
│   └── emergency.ts        # TypeScript types
└── lib/
    ├── api.ts              # Axios instance
    └── utils.ts
```

## Demo Accounts

After running `npm run seed` on the backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@emergency.com | password123 |
| Dispatcher | dispatcher@emergency.com | password123 |
| Rescue Team | rescue1@emergency.com | password123 |
| Hospital | hospital1@emergency.com | password123 |

## API Integration

The frontend connects to these backend endpoints:

### Authentication
- `POST /auth/login` - Login
- `GET /auth/profile` - Get profile

### Emergency (SOS)
- `GET /sos/rescue/assigned-cases` - Get assigned cases
- `PUT /sos/:id/status` - Update status

### Rescue Teams
- `GET /rescue-teams` - Get all teams
- `GET /rescue-teams/available` - Get available teams

## WebSocket Events

The dashboard listens for real-time updates:

- `emergency:new` - New emergency created
- `emergency:assigned` - Emergency assigned
- `emergency:status-update` - Status changed
- `notification:new` - New notification

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:3000 |
| NEXT_PUBLIC_WS_URL | WebSocket URL | http://localhost:3000 |

## License

ISC
