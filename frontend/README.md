# Emergency Care Frontend

Next.js web application for Emergency Care System (EMS 1669) staff dashboard.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running at `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard pages (role-based)
│   │   ├── dispatcher/   # Dispatcher dashboard
│   │   ├── hospital/      # Hospital staff dashboard
│   │   ├── rescue/        # Rescue team dashboard
│   │   └── admin/         # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── contexts/             # React contexts (Auth)
├── lib/                  # API client, utilities
└── types/                # TypeScript types
```

## 🔐 Authentication

- Login at `/login`
- JWT token stored in `localStorage`
- Auto-redirect based on user role after login

## 👥 Roles

- **dispatcher** → `/dashboard/dispatcher`
- **hospital_staff** → `/dashboard/hospital`
- **rescue_team** → `/dashboard/rescue`
- **admin** → `/dashboard/admin`

## 🔌 API Integration

All API calls go through `lib/api.ts` which:
- Uses `NEXT_PUBLIC_API_URL` from `.env.local`
- Automatically adds JWT token to requests
- Handles 401 errors (auto-logout)

## 📝 Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

