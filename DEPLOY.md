# ArtRoom — Deploy Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- Vercel account
- Supabase project
- Stripe account (with Connect enabled)
- Circle developer account (for USDC)

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CIRCLE_API_KEY` | Circle API key |
| `CIRCLE_API_URL` | Circle API URL (`https://api.circle.com` for production) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (`mainnet-beta` or `devnet`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `https://artroom.vercel.app`) |

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run migrations in order:

```bash
# In Supabase SQL editor or via CLI
supabase db push
```

Migration files are in `supabase/migrations/`:
- `001_initial_schema.sql` — Core tables (profiles, designs, follows, likes, purchases, portfolios)
- `002_payments_and_jobs.sql` — Payment fields, jobs table
- `003_notifications_and_helpers.sql` — Notifications, helper functions
- `004_sprint4_features.sql` — Collections, reviews, reports, saved jobs, FTS indexes

3. Configure RLS policies (included in migrations)
4. Set up Supabase Storage bucket `designs` for file uploads

## Deploy to Vercel

### 1. Import Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework Preset: **Next.js**
4. Build Command: `pnpm build`
5. Install Command: `pnpm install`

### 2. Configure Environment Variables

Add all variables from `.env.local.example` in Vercel project settings > Environment Variables.

**Important:** Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://artroom.vercel.app`).

### 3. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Configure Circle Webhooks

1. Go to Circle Developer Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/circle`
3. Select notification types: `payments`

### 5. Configure Supabase

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set Site URL to your production URL
3. Add redirect URLs for OAuth providers:
   - `https://your-domain.com/auth/callback`
4. Configure OAuth providers (Google, GitHub) if using social login

### 6. Deploy

```bash
vercel --prod
```

Or push to `main` branch for automatic deployment.

## Post-Deploy Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication (register, login, logout)
- [ ] Test Stripe payment flow (use test card `4242 4242 4242 4242`)
- [ ] Verify webhook events are received
- [ ] Check sitemap at `/sitemap.xml`
- [ ] Verify OG images render on social media
- [ ] Test on mobile devices
- [ ] Monitor Vercel analytics for errors

## Custom Domain

1. Vercel project settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Stripe and Circle webhook URLs
6. Update Supabase Site URL and redirect URLs
