# Trakio — Smart Price Tracker

Track product prices automatically and never miss the perfect deal.

> **Live:** [trakio.app](https://trakio-blush.vercel.app)

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth:** Supabase (Google OAuth)
- **Database:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **Deployment:** Vercel

## Features

- Track prices from Amazon, Flipkart, Myntra, and more
- Real-time price history charts (7d / 30d / 90d / All)
- Target price alerts with progress tracking
- Automatic daily price checks via cron
- Dark mode support

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Scripts

| Command         | Description          |
| --------------- | -------------------- |
| `npm run dev`   | Start dev server     |
| `npm run build` | Production build     |
| `npm run lint`  | Run ESLint           |
| `npm run start` | Start production app |
