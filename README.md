# ArtRoom — Creative Marketplace on Solana

A creative marketplace where artists sell designs, UI kits, brand systems, and AI skills — powered by real Solana payments via Phantom wallet.

**Built for the Solana Graveyard Hackathon — Art Track (Exchange Art)**

## Features

- **Gallery** — Browse 50+ design assets across branding, UI/UX, typography, motion, illustration, and 3D
- **Artist Portfolios** — Full profile pages with work showcase, follow system, and direct hiring
- **Skill Vault** — AI prompt engineering skills that creators package and sell (installs into your Claude)
- **Job Fair** — Post and browse creative jobs with detailed listings, apply flow, and AI review
- **Studio** — Personal dashboard with saved work, purchases, messages, and uploads
- **Hire & Messages** — Commission artists directly with persistent conversations and AI pricing tips
- **Solana Payments** — Real on-chain transactions via Phantom wallet (devnet)

## Tech Stack

- **Frontend:** Vanilla HTML / CSS / JS — no frameworks, no build tools, no npm
- **Blockchain:** @solana/web3.js via CDN + Phantom browser API
- **State:** localStorage persistence via shared `state.js` module
- **Wallet:** `solana.js` module — Phantom detection, connect/disconnect, SOL transfers, dynamic USDC panel

## How It Works

1. Browse the Gallery, Skill Vault, or Artist Portfolios
2. Click **Buy** on any design or skill
3. Select the **USDC** payment tab — the panel transforms into a Solana checkout
4. Connect your **Phantom wallet**
5. Approve the transaction — it signs and confirms on-chain
6. View confirmation with a **Solana Explorer** link

## Architecture

```
artroom/
├── state.js              # Shared localStorage state (purchases, likes, follows, messages)
├── solana.js             # Phantom wallet + Solana payment integration
├── artroom-home.html     # Home — Art of the Week, filters, studios, portfolios
├── artroom-gallery.html  # Gallery — Full design marketplace with viewer + payments
├── artroom-artist.html   # Artist — Profile page with hire/message overlay
├── artroom-studio.html   # Studio — Personal dashboard, uploads, messages
├── artroom-skill-vault.html  # Skill Vault — AI skills marketplace
├── artroom-jobs.html     # Job Fair — Creative job listings + posting
├── artroom-create.html   # Create — Publishing tools for templates and assets
└── server.rb             # Simple Ruby WEBrick static file server
```

## Run Locally

```bash
ruby server.rb
# Open http://localhost:3000/artroom-home.html
```

Or use any static file server:

```bash
python3 -m http.server 3000
# Open http://localhost:3000/artroom-home.html
```

## Solana Integration

The `solana.js` module handles all blockchain interaction:

- **Wallet Detection** — Checks for Phantom via `window.phantom.solana`
- **Connect/Disconnect** — Persists wallet address in localStorage across pages
- **Dynamic Panel** — Hooks into `setPayMethod()` to rewrite the USDC tab at runtime
- **SOL Transfers** — Builds transactions with `SystemProgram.transfer`, signs via Phantom
- **CSS Injection** — Injects its own styles so no inline CSS editing needed across 7 files

Currently configured for **Solana devnet**. Switch `ArtWallet.NETWORK` and `ArtWallet.RPC_URL` for mainnet.

## License

MIT
