# ArtRoom

Creative design marketplace where artists sell designs and get paid instantly in USDC or traditional payment methods.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe Connect (card, Apple Pay) + Circle (USDC) + Solana/Phantom
- **Charts:** Recharts
- **Icons:** Lucide React

## Features

- **Marketplace** — Browse, search, and filter designs by category
- **Payments** — Card, Apple Pay, USDC (multi-chain), and SOL payments
- **Creator Dashboard** — Analytics, earnings, uploads, and settings
- **Job Fair** — Post and browse creative jobs with filters
- **Collections** — Save designs to custom boards
- **Reviews & Ratings** — Star ratings with distribution visualization
- **Search** — Live search with debounced results across designs, creators, and jobs
- **Trending & Recommendations** — Algorithm-driven content discovery
- **Reports** — Content moderation system
- **Notifications** — Real-time notification system
- **PWA** — Installable web app with offline-ready manifest

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your Supabase, Stripe, Circle, and Solana credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (marketplace)/        # Public marketplace routes (design, collection, portfolio, studio)
    api/                  # API routes (stripe, circle, search, webhooks)
    dashboard/            # Creator dashboard (analytics, uploads, earnings, settings, jobs)
    jobs/                 # Job fair (browse, detail, post)
    search/               # Search results
  components/
    cart/                 # Shopping cart drawer
    dashboard/            # Dashboard components (stats, charts)
    layout/               # Navbar, Footer, MobileNav
    marketplace/          # DesignCard, MasonryGrid, FilterTabs, ReviewSection
    notifications/        # Notification dropdown
    payment/              # PaymentModal, CardPayment, USDCPayment, ApplePayButton
    providers/            # Context providers
    ui/                   # Reusable UI (Button, Badge, Modal, Avatar, Toast, ReportButton)
  constants/              # Routes, categories, networks, Solana config
  contexts/               # React contexts (Cart, SolanaWallet)
  hooks/                  # Custom hooks (useAuth, usePayment, useLike, useDesigns, etc.)
  lib/                    # Utilities (supabase clients, stripe, circle, utils)
  types/                  # TypeScript types (database, design, job, payment, user)
supabase/
  migrations/             # SQL migrations (001-004)
public/                   # Static assets, manifest, favicons
```

## Environment Variables

See `.env.local.example` for all required variables.

## Deployment

See [DEPLOY.md](DEPLOY.md) for full deployment instructions.

## License

MIT
