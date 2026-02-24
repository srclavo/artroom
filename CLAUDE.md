# ArtRoom — Creative Marketplace

## Project Overview
ArtRoom is a creative marketplace built with Next.js where designers sell digital assets (branding, UI kits, typography, illustrations, 3D, motion). It includes a marketplace, studio profiles, job board, skill vault, portfolio templates, and a creator dashboard.

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (CSS-based config via `@tailwindcss/postcss`)
- **Backend:** Supabase (PostgreSQL + Auth + RLS + Storage)
- **Auth:** `@supabase/ssr` with cookie-based sessions
- **Payments:** Stripe (card) + Circle (USDC) — scaffolded, not fully wired
- **Package Manager:** pnpm
- **Fonts:** Syne (display headings), DM Sans (body text)

## Key Conventions
- All UI text is in **English** (product targets English-speaking users)
- Font classes: `font-[family-name:var(--font-syne)]` and `font-[family-name:var(--font-dm-sans)]`
- Light mode design: white bg, `#e8e8e8` borders, `#0a0a0a` text, `#E8001A` accent
- Next.js 16 uses `use(params)` pattern for async params in dynamic routes
- `useSearchParams` requires a `<Suspense>` boundary
- Supabase typed client produces `never` types on `.select()` with joins and `.update()` — use `as unknown as Type` or `as never` casts

## Project Structure
```
src/
  app/
    page.tsx                          # Home/Marketplace (real Supabase data)
    (auth)/login/page.tsx             # Login (real)
    (auth)/register/page.tsx          # Register (real)
    (marketplace)/design/[id]/        # Design detail (real)
    (marketplace)/studio/[username]/  # Studio profile (real)
    (marketplace)/portfolio/[id]/     # Portfolio detail (MOCK)
    artist/[handle]/                  # Artist page (real)
    dashboard/
      layout.tsx                      # Dashboard layout with auth guard
      page.tsx                        # Overview with real stats
      uploads/page.tsx                # Upload to Supabase Storage (real)
      settings/page.tsx               # Profile persistence (real)
      earnings/page.tsx               # Earnings from purchases (real)
    gallery/page.tsx                  # Gallery (MOCK - hardcoded data)
    jobs/page.tsx                     # Jobs board (MOCK)
    jobs/[id]/page.tsx                # Job detail (MOCK)
    skills/page.tsx                   # Skill Vault (MOCK)
    api/
      designs/route.ts                # GET/POST designs (real)
      webhooks/stripe/route.ts        # Stripe webhook (scaffold)
      webhooks/circle/route.ts        # Circle webhook (scaffold)
  components/
    layout/                           # Navbar, Footer, Sidebar
    marketplace/                      # DesignCard, MasonryGrid, FilterTabs, etc.
    dashboard/                        # StatsCards, EarningsChart
    payment/                          # PaymentModal (MOCK - no real charges)
    ui/                               # Button, Input, Badge (reusable)
  hooks/
    useAuth.ts                        # Auth + profile (real)
    useDesigns.ts                     # Fetch designs with filters (real)
    useLike.ts                        # Optimistic likes (real)
    useFollow.ts                      # Optimistic follow/unfollow (real)
    useProfile.ts                     # Profile + designs + portfolios (real)
    useSearch.ts                      # Debounced search (real)
    usePayment.ts                     # Payment modal state (UI only)
  lib/
    supabase/client.ts                # Browser Supabase client
    supabase/server.ts                # Server Supabase client
    stripe/client.ts                  # Stripe SDK init
    circle/client.ts                  # Circle API helper
  types/
    database.ts                       # Supabase Database type
    design.ts                         # DesignWithCreator, DesignInsert
    user.ts                           # Profile, StudioProfile
  constants/
    categories.ts                     # CATEGORY_MAP with labels/colors
    routes.ts                         # ROUTES object for all app paths
supabase/
  migrations/001_initial_schema.sql   # 7 tables, indexes, RLS, triggers
  migrations/002_creator_sales_policy.sql
  setup-storage.sql                   # 4 buckets + RLS policies
  seed.ts                             # 8 users, 16 designs, 12 portfolios
```

## Database Tables
profiles, designs, portfolios, purchases, jobs, likes, follows

## Storage Buckets
thumbnails (public), design-files (private), avatars (public), covers (public)

## Sprint Status
- **Sprint 1:** UI pages — COMPLETE
- **Sprint 2:** Supabase integration — COMPLETE (core pages connected to real data)
- **Pending:** Gallery/Jobs/Skills/Portfolio detail still use mock data; Payments not wired; AI chat is mock

## Test Credentials
All passwords: `Test1234!`
- maya@artroom.test, james@artroom.test, kira@artroom.test, alex@artroom.test
- orion@artroom.test, nova@artroom.test, kai@artroom.test, seb@artroom.test

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `npx tsx supabase/seed.ts` — seed database (needs SUPABASE_SERVICE_ROLE_KEY in .env.local)

## Workflow Orchestration

### 1. Plan Node Default
•Enter plan mode for any non-trivial task (three or more steps, or involving architectural decisions).
•If something goes wrong, stop and re-plan immediately rather than continuing blindly.
•Use plan mode for verification steps, not just implementation.
•Write detailed specifications upfront to reduce ambiguity.

### 2. Subagent Strategy
•Use subagents liberally to keep the main context window clean.
•Offload research, exploration, and parallel analysis to subagents.
•For complex problems, allocate more compute via subagents.
•Assign one task per subagent to ensure focused execution.

### 3. Self-Improvement Loop
•After any correction from the user, update tasks/lessons.md with the relevant pattern.
•Create rules for yourself that prevent repeating the same mistake.
•Iterate on these lessons rigorously until the mistake rate declines.
•Review lessons at the start of each session when relevant to the project.

### 4. Verification Before Done
•Never mark a task complete without proving it works.
•Diff behavior between main and your changes when relevant.
•Ask yourself: “Would a staff engineer approve this?”
•Run tests, check logs, and demonstrate correctness.

### 5. Demand Elegance (Balanced)
•For non-trivial changes, pause and ask whether there is a more elegant solution.
•If a fix feels hacky, implement the solution you would choose knowing everything you now know.
•Do not over-engineer simple or obvious fixes.
•Critically evaluate your own work before presenting it.

### 6. Autonomous Bug Fixing
•When given a bug report, fix it without asking for unnecessary guidance.
•Review logs, errors, and failing tests, then resolve them.
•Avoid requiring context switching from the user.
•Fix failing CI tests proactively.

## Task Management
1.Plan First: Write the plan to tasks/todo.md with checkable items.
2.Verify Plan: Review before starting implementation.
3.Track Progress: Mark items complete as you go.
4.Explain Changes: Provide a high-level summary at each step.
5.Document Results: Add a review section to tasks/todo.md.
6.Capture Lessons: Update tasks/lessons.md after corrections.

## Core Principles
•Simplicity First: Make every change as simple as possible. Minimize code impact.
•No Laziness: Identify root causes. Avoid temporary fixes. Apply senior developer standards.
•Minimal Impact: Touch only what is necessary. Avoid introducing new bugs.


