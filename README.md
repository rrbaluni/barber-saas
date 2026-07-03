# FadeZone — Barber Shop Booking SaaS

A full-stack barbershop appointment booking system built with **React**, **Express**, and **PostgreSQL/SQLite**. Deploy to Render for free in minutes.

## Features

- **Customer booking flow** — pick a barber, service, date, and time slot
- **Real-time availability** — auto-generated 30min slots with conflict detection
- **My Bookings** — look up and cancel appointments by email
- **Admin dashboard** — manage bookings, barbers, services, hours, and time-off
- **Dual database** — SQLite for local dev, PostgreSQL for production
- **TypeScript** — strict mode end-to-end
- **Input validation** — Zod schemas on all API endpoints
- **Docker** — multi-stage production build

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Tailwind CSS, Vite |
| Backend | Express 4, TypeScript (tsx runner), Zod |
| Database | PostgreSQL (production) / SQLite (dev) via adapter pattern |
| Deploy | Render (free tier), Docker |

## Quick Start

### Prerequisites

- Node.js 22+
- npm

### Local development

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Seed the database (SQLite)
cd ../backend && npm run seed

# 3. Start backend (terminal 1)
npm run dev

# 4. Start frontend (terminal 2)
cd ../frontend && npm run dev
```

Frontend runs at `http://localhost:5173` (proxies API to backend).

## Deploy to Render (free)

1. Push this repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your repo — Render auto-detects `render.yaml`
4. Click **Apply** — it creates a PostgreSQL database and web service
5. Your app is live at `https://barber-saas.onrender.com`

The `render.yaml` provisions:
- Free PostgreSQL database (1GB)
- Free web service (512MB RAM, auto-sleeps after 15min idle)
- Automatic HTTPS and health checks

## Project Structure

```
barber-saas/
├── backend/
│   └── src/
│       ├── db/           # Database adapters (SQLite + PostgreSQL)
│       ├── middleware/    # Error handler, Zod validation
│       ├── routes/        # API route handlers
│       ├── schemas.ts     # Zod validation schemas
│       ├── types.ts       # Shared TypeScript types
│       ├── index.ts       # Express app entry point
│       └── seed.ts        # Database seeder
├── frontend/
│   └── src/
│       ├── components/    # Shared UI components
│       ├── pages/         # Route pages (Home, Booking, Admin, etc.)
│       ├── App.tsx
│       └── main.tsx
├── .github/workflows/    # CI pipeline
├── Dockerfile
└── render.yaml
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/barbers` | List active barbers |
| GET | `/api/barbers/:id` | Barber detail + services |
| GET | `/api/barbers/:id/availability?date=` | Available time slots |
| GET | `/api/services` | List active services |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings?email=` | Look up bookings |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

### Admin endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/bookings` | All bookings (optional `?date=`) |
| PATCH | `/api/admin/bookings/:id/status` | Update status |
| POST | `/api/admin/barbers` | Add barber |
| PATCH | `/api/admin/barbers/:id` | Update barber |
| POST | `/api/admin/services` | Add service |
| PATCH | `/api/admin/services/:id` | Update service |
| GET | `/api/admin/hours` | Business hours |
| PUT | `/api/admin/hours/:id` | Update hours |
| GET/POST/DELETE | `/api/admin/time-off` | Manage time off |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For production | PostgreSQL connection string (omit for SQLite) |
| `PORT` | No | Server port (default 3001) |
