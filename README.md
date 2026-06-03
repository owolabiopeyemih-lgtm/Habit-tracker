# Habityn

> Build routines that actually stick.

A mobile-first habit tracking web application with a polished dark/light theme, streak tracking, per-habit analytics, push reminders, and a clean design system built on React and Express.

![Habityn OG](client/public/og-image.svg)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [PWA Support](#pwa-support)
- [Scripts](#scripts)

---

## Features

### Core
- **Habit management** — Create, edit, archive, and delete habits with a custom icon, colour, and category
- **Daily check-ins** — One-tap completion toggle with spring-physics animation and haptic feedback
- **Streaks** — Consecutive-day tracking; streak resets on a missed day and your all-time best is preserved
- **Category filter** — Filter habits by Health, Fitness, Nutrition, Learning, Productivity, Wellness, Mindfulness, or Personal
- **Frequency scheduling** — Every day, weekdays, weekends, or fully custom days of the week

### Analytics
- **Progress ring** — Live radial arc showing today's completion percentage
- **Per-habit dot track** — Coloured dots in the progress card that fill as each habit is completed
- **Streak hero card** — Shows current streak, last-7-days mini calendar (perfect / partial / missed), and personal best comparison
- **Stat cards** — Longest streak, completion rate, active days, total check-ins
- **Daily chart** — Bar chart of completions for the selected week or month (Recharts)
- **Habit breakdown** — Ranked list with per-habit colour bars and "PERFECT" badge for 100% completion

### UX & Design
- **Dark / light theme** — CSS custom property tokens; toggled via the sun/moon icon in the header; persisted to `localStorage`; respects `prefers-color-scheme` on first visit; no flash of wrong theme
- **Floating pill navigation** — Compact bottom nav where the active item expands to show its label
- **Success modal** — Animated SVG ring draw + habit icon spring-bounce after creating a habit; auto-dismisses with a countdown bar
- **Shimmer skeletons** — Content-shaped loading placeholders
- **Empty state mockups** — Ghost habit cards shown when no habits exist so users understand the interface immediately
- **Push reminders** — Web Push API; per-habit reminder times set in the form; requires browser permission
- **Responsive** — Mobile-first; works on all screen sizes

### Developer Experience
- **Monorepo** — npm workspaces with a single `npm run dev` that starts both client and server
- **In-memory MongoDB** — No database setup required for local development; data resets on restart
- **TypeScript** — End-to-end type safety across client and server

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 (CSS variable colour tokens) |
| State / data fetching | TanStack React Query |
| Routing | React Router DOM 6 |
| Charts | Recharts |
| Icons | Lucide React |
| Date utilities | date-fns |
| HTTP client | Axios |
| Backend | Express.js + TypeScript |
| Database | MongoDB via Mongoose (in-memory fallback for dev) |
| Push notifications | web-push (VAPID) |
| Scheduled jobs | node-cron |
| Dev runner | concurrently + tsx watch |

---

## Project Structure

```
Habityn/
├── client/                       # React SPA
│   ├── public/
│   │   ├── favicon.svg           # Brand mark favicon
│   │   ├── og-image.svg          # Open Graph social card
│   │   ├── manifest.json         # PWA manifest
│   │   └── sw.js                 # Service worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── habits/
│   │   │   │   ├── HabitCard.tsx      # Individual habit row
│   │   │   │   ├── HabitForm.tsx      # Multi-step create / edit form
│   │   │   │   └── CategoryFilter.tsx # Filter chip row
│   │   │   ├── progress/
│   │   │   │   ├── StatCard.tsx       # Stat tile
│   │   │   │   └── WeeklyChart.tsx    # Recharts bar chart
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── SuccessModal.tsx   # Post-creation celebration
│   │   │   └── Layout.tsx             # Header + floating nav shell
│   │   ├── hooks/
│   │   │   ├── useHabits.ts
│   │   │   ├── useCheckins.ts
│   │   │   ├── useProgress.ts
│   │   │   └── useNotifications.ts
│   │   ├── lib/
│   │   │   ├── theme.tsx              # ThemeProvider + useTheme
│   │   │   ├── api.ts                 # Axios instance
│   │   │   ├── constants.ts           # Category metadata, colours, icons
│   │   │   └── deviceId.ts            # Persistent anonymous device ID
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Today view
│   │   │   ├── Progress.tsx           # Analytics view
│   │   │   └── Settings.tsx           # Preferences + archived habits
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── index.css                  # Tailwind + CSS theme tokens
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                       # Express API
│   └── src/
│       ├── models/
│       │   ├── Habit.ts
│       │   ├── CheckIn.ts
│       │   └── Subscription.ts
│       ├── routes/
│       │   ├── habits.ts          # GET / POST / PUT /api/habits
│       │   ├── checkins.ts        # POST /api/checkins
│       │   ├── progress.ts        # GET /api/progress
│       │   └── notifications.ts   # POST /api/notifications/subscribe
│       ├── jobs/
│       │   └── reminderJob.ts     # Cron job for push reminders
│       ├── utils/
│       │   └── streaks.ts         # Streak calculation logic
│       ├── middleware/
│       │   └── errorHandler.ts
│       └── index.ts               # App entry point
│
├── .env.example
├── package.json                  # Root workspace
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

No database installation is required for local development — the server uses an in-memory MongoDB instance automatically.

### Installation

```bash
# Clone the repository
git clone https://github.com/owolabiopeyemih-lgtm/Habit-tracker.git
cd Habit-tracker

# Install all dependencies (client + server)
npm install
```

### Running locally

```bash
npm run dev
```

This starts both servers concurrently:

| Service | URL |
|---|---|
| Client (Vite) | http://localhost:5173 |
| API (Express) | http://localhost:5000 |

The client proxies `/api/*` requests to the Express server automatically via Vite's proxy config.

### Production build

```bash
npm run build
```

Outputs compiled assets to `client/dist/` and `server/dist/`.

---

## Environment Variables

Copy `.env.example` to `.env` in the project root and fill in the values:

```env
# MongoDB Atlas connection string (optional — falls back to in-memory)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/habityn

# Express server port
PORT=5000

# Allowed client origin for CORS
CLIENT_URL=http://localhost:5173

# VAPID keys for Web Push notifications
# Generate with: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:your@email.com
```

> **VAPID keys** are required to send push notifications. Generate a key pair with:
> ```bash
> npx web-push generate-vapid-keys
> ```
> Then paste the output into your `.env`.

---

## API Reference

All endpoints require the `x-device-id` header, which the client sets automatically from a persisted browser UUID. This provides per-device data isolation without requiring user accounts.

### Habits

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/habits` | List all habits for the device |
| `POST` | `/api/habits` | Create a new habit |
| `PUT` | `/api/habits/:id` | Update a habit (name, status, reminder, etc.) |

### Check-ins

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/checkins` | Toggle today's completion for a habit |

### Progress

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress?period=week&habitId=` | Streak stats and daily breakdown |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notifications/subscribe` | Save a push subscription for a habit |
| `DELETE` | `/api/notifications/subscribe/:habitId` | Remove a push subscription |

---

## Design System

Habityn uses a CSS custom property token system so every colour adapts to dark/light mode at runtime without a full re-render.

### Theme tokens (excerpt)

```css
/* Dark (default) */
:root {
  --color-cream:      17 17 22;     /* Page background */
  --color-cream-dark: 28 28 34;     /* Card surface */
  --color-ink:        240 240 238;  /* Primary text */
  --color-leaf-600:   168 255 0;    /* Neon accent */
  --accent:           #A8FF00;
}

/* Light */
:root[data-theme='light'] {
  --color-cream:      250 250 247;
  --color-cream-dark: 240 237 232;
  --color-ink:        28 25 23;
  --color-leaf-600:   58 140 0;     /* Forest green */
  --accent:           #3A8C00;
}
```

All Tailwind colour utilities (`bg-cream`, `text-ink`, `border-leaf-600`, etc.) reference these channels via `rgb(var(--color-X) / <alpha-value>)`, which means opacity modifiers (`bg-cream/90`) work correctly in both themes.

### Motion tokens

```css
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast:       150ms;
--dur-normal:     250ms;
```

---

## PWA Support

Habityn ships as an installable PWA:

- **`manifest.json`** — App name, icons, display mode, theme colour
- **`sw.js`** — Service worker for offline caching and push notification delivery
- **Web Push** — Habit reminder notifications delivered via VAPID-signed payloads

To install, open the app in Chrome/Edge and use the browser's "Install app" prompt.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start client + server in development mode |
| `npm run build` | Production build for client and server |
| `npm install` | Install all workspace dependencies |

---

## Licence

MIT
