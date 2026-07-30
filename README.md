# Trakio — Smart Price Tracker

Never miss a deal. Track product prices from any e-commerce site and get instant alerts when prices drop.

> **Live:** [trakio.app](https://trakio-blush.vercel.app)

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth:** Supabase (Google OAuth)
- **Database:** Supabase PostgreSQL
- **Scraping:** Firecrawl API
- **Email:** Resend
- **Charts:** Recharts
- **Animations:** Motion
- **Theming:** next-themes (light / dark / system)
- **Deployment:** Vercel

## Features

- Track prices from any e-commerce URL (Amazon, Flipkart, Myntra, etc.)
- Price history charts with 7d / 30d / 90d / All range selectors
- Target price alerts with savings progress tracking
- Real-time email notifications on price drops
- Animated dashboard with per-user stats
- Dark mode with interactive dot-field background
- Paginated product listing with search

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — add a product URL to start tracking |
| `/products` | Dashboard with product grid, metrics, and pagination |
| `/products/[id]` | Product detail with chart, target tracker, and insights |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Firecrawl (product scraping)
FIRECRAWL_API_KEY=

# Resend (email alerts)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Cron job auth
CRON_SECRET=
```

## Cron Job

Price checks run via an external cron trigger:

```bash
curl -X POST https://your-app.vercel.app/api/cron/check-prices \
  -H "Authorization: Bearer $CRON_SECRET"
```

The endpoint scrapes all tracked products, updates prices, records history, and sends email alerts for price drops.

## Database

Supabase PostgreSQL with two tables:

- **products** — URL, name, current price, target price, alert status
- **price_history** — timestamped price snapshots per product

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production app |
