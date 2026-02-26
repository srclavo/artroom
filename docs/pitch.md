# ArtRoom

### The Web3 Creative Marketplace Where Designers Own Their Future

---

## The Problem

The $50B+ digital design economy is broken for creators.

| Pain Point | Today's Reality |
|---|---|
| **Exploitative fees** | Platforms take 30-50% of every sale |
| **No crypto-native payments** | Designers can't receive stablecoins or on-chain payments |
| **Zero ownership** | Creators don't own their distribution — platforms do |
| **Fragmented workflows** | Sell on one platform, find jobs on another, showcase on a third |
| **AI is eating design** | No infrastructure for creators to monetize AI-ready design assets |

Creators are locked into Web2 marketplaces that extract value instead of creating it.

---

## The Solution

**ArtRoom** is a Web3-native creative marketplace where designers sell digital assets, earn in crypto, and own their creative economy.

One platform. Multiple revenue streams. On-chain payments.

### How it works:

```
Designer uploads asset  -->  Buyer pays (Card / USDC / SOL)  -->  Creator receives payout instantly
                                      |
                              Smart payment routing:
                              - Stripe (card / Apple Pay)
                              - Circle (USDC on Polygon, Base, Ethereum)
                              - Solana (SOL via Phantom wallet)
```

---

## Product Highlights

### 1. Creative Marketplace
A curated marketplace for premium digital assets across 7 categories:

- **Branding** — Logo kits, brand guidelines, identity systems
- **UI/UX** — Design systems, component libraries, app templates
- **Typography** — Custom typefaces, font pairings, lettering packs
- **Illustration** — Digital art, icon sets, character designs
- **3D** — Models, textures, scene files
- **Motion** — Animations, transitions, video templates
- **Templates** — Ready-to-use design files

Each asset includes licensing tiers (Personal / Commercial / Extended), preview galleries, and instant download after purchase.

### 2. Creator Studios
Public profiles with verified badges, follower systems, and full design portfolios — like a Web3-native Dribbble meets Gumroad.

### 3. Multi-Rail Payments (The Web3 Core)
Buyers choose how they pay. Creators choose how they earn.

| Method | Provider | Networks | Status |
|---|---|---|---|
| **Credit Card** | Stripe | Visa, Mastercard, Amex | Integrated |
| **Apple Pay** | Stripe | Apple devices | Integrated |
| **USDC** | Circle | Polygon, Base, Ethereum, Solana | Integrated |
| **SOL** | Phantom | Solana (Devnet / Mainnet) | Integrated |

**USDC buyers get a 5% discount** — incentivizing crypto adoption.

### 4. Solana Wallet Integration
Full Phantom wallet support with:
- One-click wallet connect
- Real-time SOL balance display
- On-chain transaction signing with `@solana/web3.js`
- Automatic transaction confirmation (~5s)
- Explorer link for every transaction (Solscan)
- Silent reconnect on return visits

### 5. Creator Dashboard
Real-time analytics for creators:
- Total earnings, pending payouts, average sale value
- Earnings charts (powered by Recharts)
- Upload workflow with drag-drop to Supabase Storage
- Profile management with social links and skills
- Transaction history with payment method breakdown

### 6. Skill Vault (AI-Ready Design Packs)
A new revenue model for designers: sell reusable creative skill packs that AI tools can consume.

- Brand Builder, Component Architect, Type Engine, Motion Director
- Built by verified designers, installable by AI agents
- Revenue per install — passive income at scale

### 7. Job Board
Companies post design roles. Creators apply directly from their ArtRoom profiles — portfolio, stats, and reputation all in one place.

---

## Web3 Architecture

```
                        +------------------+
                        |   ArtRoom App    |
                        |  (Next.js 16)    |
                        +--------+---------+
                                 |
                  +--------------+--------------+
                  |              |              |
           +------+------+ +----+----+ +-------+-------+
           |   Stripe    | | Circle  | |    Solana     |
           | Card/Apple  | |  USDC   | | SOL/Phantom   |
           +------+------+ +----+----+ +-------+-------+
                  |              |              |
                  v              v              v
           +-----------+  +-----------+  +-------------+
           |  Fiat      |  | Polygon  |  | Solana      |
           |  Rails     |  | Base     |  | Blockchain  |
           |           |  | Ethereum |  |             |
           +-----------+  | Solana   |  +-------------+
                          +-----------+
                                 |
                        +--------+---------+
                        |    Supabase      |
                        |  PostgreSQL +    |
                        |  RLS + Storage   |
                        +------------------+
```

### Payment Flow (Solana)

1. Buyer clicks "Pay with Solana" in the payment modal
2. ArtRoom detects Phantom wallet via `window.phantom.solana`
3. USD price converts to SOL using real-time rate
4. `SystemProgram.transfer()` sends lamports to creator's wallet
5. Transaction signed via `provider.signAndSendTransaction()`
6. Confirmation in ~5 seconds on Solana
7. Purchase recorded in Supabase with `transaction_hash`
8. Buyer gets instant download access

### Payment Flow (Circle USDC)

1. Buyer selects USDC and chooses network (Polygon / Base / Ethereum / Solana)
2. ArtRoom calls Circle API to create a payment intent
3. Circle returns a one-time deposit address
4. Buyer sends exact USDC amount to the address
5. ArtRoom polls Circle API every 10 seconds for confirmation
6. On confirmation, purchase is recorded and asset unlocked
7. 30-minute expiry window with live countdown

### Database Schema

14 tables with full Row-Level Security:

| Table | Purpose |
|---|---|
| `profiles` | Users with roles (creator/buyer/company), wallet addresses, Stripe IDs |
| `designs` | Marketplace assets with pricing, licensing, and analytics |
| `portfolios` | Creator project showcases |
| `purchases` | Transaction records with payment method, network, and tx hash |
| `jobs` | Hiring board with salary ranges and skill requirements |
| `likes` | Design appreciation with unique constraints |
| `follows` | Creator discovery and social graph |
| `collections` | User-curated design groups |
| `reviews` | Asset ratings and feedback |
| `notifications` | Activity feed (sales, follows, purchases) |

Every table has RLS policies ensuring creators only edit their own assets and buyers only see their own purchases.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL + Auth + RLS + Storage) |
| **Auth** | `@supabase/ssr` with cookie-based sessions |
| **Payments (Fiat)** | Stripe (card + Apple Pay + Connect) |
| **Payments (USDC)** | Circle API (Polygon, Base, Ethereum, Solana) |
| **Payments (SOL)** | `@solana/web3.js` + Phantom Wallet |
| **Charts** | Recharts |
| **Package Manager** | pnpm |
| **Fonts** | Syne (display) + DM Sans (body) |

---

## Business Model

```
                    Buyer pays $100
                         |
                   +-----+-----+
                   |           |
              Platform Fee   Creator Payout
                 (30%)         (70%)
                  $30           $70
                   |             |
              ArtRoom        Creator's
              Revenue     Stripe/Wallet
```

### Revenue Streams

| Stream | Model |
|---|---|
| **Marketplace fees** | 30% platform fee on every sale |
| **Skill Vault** | Revenue share on AI skill pack installations |
| **Job Board** | Featured listings and premium placements |
| **Pro Accounts** | Lower fees, analytics, priority support (planned) |

### Why Crypto Matters for Revenue

- **Lower processing fees** — USDC on Polygon costs fractions of a cent vs 2.9% + $0.30 for card
- **Global reach** — No banking restrictions, instant settlement worldwide
- **Creator retention** — Designers with crypto wallets stay on platforms that support them
- **5% USDC discount** — Drives crypto adoption, reduces our Stripe processing costs

---

## Traction & Current State

### What's Built and Working

- 9+ fully functional pages with real Supabase data
- Complete auth flow (signup, login, persistent sessions)
- Full marketplace with filtering, search, and design detail pages
- Creator studio profiles with follow/like system (optimistic UI)
- Upload workflow: drag-drop files to Supabase Storage
- Creator dashboard with real earnings tracking
- Multi-payment modal (Card, Apple Pay, USDC, SOL)
- Phantom wallet integration with on-chain transfers
- Circle USDC payment intents with polling
- Responsive design (mobile-first)

### Architecture Metrics

| Metric | Value |
|---|---|
| Database tables | 14 |
| RLS policies | 16 |
| API routes | 10+ |
| Custom React hooks | 10 |
| Payment integrations | 4 (Card, Apple Pay, USDC, SOL) |
| Blockchain networks | 5 (Solana, Polygon, Base, Ethereum + devnet) |
| Storage buckets | 4 (thumbnails, design-files, avatars, covers) |
| Seeded test data | 8 users, 16 designs, 12 portfolios |

---

## Roadmap

### Phase 1 — Foundation (Current)
- [x] Marketplace with real data
- [x] Multi-rail payments (Card + USDC + SOL)
- [x] Creator dashboard and earnings
- [x] Phantom wallet integration
- [x] Upload and publishing workflow

### Phase 2 — Creator Economy
- [ ] Stripe Connect payouts to creator bank accounts
- [ ] NFT purchase receipts (proof of ownership on-chain)
- [ ] Token-gated premium content (hold NFT to access exclusive assets)
- [ ] Creator reputation scores based on sales and reviews

### Phase 3 — AI + Web3
- [ ] Skill Vault with real AI agent integrations
- [ ] On-chain skill licensing (smart contracts for usage tracking)
- [ ] AI-powered asset recommendations
- [ ] Generative design tools for creators

### Phase 4 — Decentralization
- [ ] DAO governance for platform decisions (fee changes, featured curation)
- [ ] $ART token for platform incentives and staking
- [ ] Decentralized storage (IPFS/Arweave) for permanent asset hosting
- [ ] Cross-chain payments (more L2s, Bitcoin Lightning)

---

## Competitive Landscape

| Feature | Creative Market | Gumroad | Dribbble | **ArtRoom** |
|---|---|---|---|---|
| Digital asset sales | Yes | Yes | No | **Yes** |
| Crypto payments | No | No | No | **Yes (USDC + SOL)** |
| Wallet integration | No | No | No | **Yes (Phantom)** |
| Multi-chain support | No | No | No | **Yes (4 networks)** |
| Creator studios | No | Limited | Yes | **Yes** |
| Job board | No | No | Yes | **Yes** |
| AI skill marketplace | No | No | No | **Yes** |
| On-chain transactions | No | No | No | **Yes** |
| Open fee structure | 50% | 10% | N/A | **30% (lower for crypto)** |

---

## The Team

<!-- Replace with your actual team info -->

| Name | Role | Background |
|---|---|---|
| [Name] | Founder / Full-Stack | [Background] |
| [Name] | Design Lead | [Background] |
| [Name] | Blockchain Engineer | [Background] |

---

## The Ask

We're looking for:

1. **Feedback** on our Web3 payment architecture and creator economy model
2. **Partnerships** with crypto wallets, L2 networks, and creative communities
3. **Support** to scale from hackathon MVP to production launch

---

## Try It

**Live Demo:** http://localhost:3000
**Repository:** https://github.com/srclavo/artroom
**Stack:** Next.js 16 + Supabase + Stripe + Circle + Solana

---

*ArtRoom — Where creativity meets the blockchain.*
