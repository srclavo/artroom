# ArtRoom — Funcionalidades Implementadas

## Auth & Usuarios
- Login / Register con email y password
- Sesión persistente con cookies SSR (`@supabase/ssr`)
- Middleware que refresca session en cada request

## Perfiles
- Editar display name, bio, website, wallet address
- Subir avatar (Supabase Storage)
- Página pública de artista (`/artist/[handle]`, `/studio/[username]`)

## Diseños & Marketplace
- Upload de diseños con wizard de 3 pasos (archivos, detalles, precio)
- Home page con masonry grid, filtros por categoría, tabs (Studios, Portfolios)
- Design detail page con likes, reviews, colecciones, reporte
- Trending y Recommended con scoring real desde DB
- Search funcional (diseños + perfiles + jobs)

## Pagos (Stripe)
- Card payment con Stripe Elements + PaymentElement
- Apple Pay / Google Pay via `PaymentRequestButtonElement`
- Stripe Connect onboarding para creators (Express accounts)
- Split de pagos: 88% creator / 12% plataforma
- PaymentIntent API con `application_fee_amount` + `transfer_data`
- Webhooks de Stripe: `payment_intent.succeeded` y `payment_intent.payment_failed`

## Pagos (Crypto)
- Solana/Phantom: transferencia real de SOL, firma con wallet
- USDC via Circle: deposit address real, polling de status, countdown timer

## Compra & Descarga
- Verificación de compra por usuario
- Download gateado: signed URL de 5 min desde Supabase Storage
- Purchase recording para Solana

## Carrito
- Carrito con `localStorage`, max 20 items, deduplicación
- CartDrawer slide-in, checkout multi-item

## Jobs / Freelance
- Browse jobs con filtros (tipo, nivel, remoto, salario, búsqueda)
- Detalle de job + jobs similares por skills
- Publicar job desde formulario
- Dashboard de jobs: toggle active/closed, delete

## Social
- Likes con UI optimista
- Follows con contador
- Reviews con star rating (solo si compraste)
- Colecciones: crear, añadir/remover diseños, compartir
- Reportes: inserción a DB

## Notificaciones
- Notificaciones de venta (al creator) y compra (al buyer)
- Bell icon con badge de unread, polling cada 30s
- Mark as read / mark all as read

## Dashboard
- Overview: stats reales (views, likes, followers, earnings), top designs, chart con recharts
- Uploads: wizard completo de 3 pasos
- Earnings: datos de purchases reales, banner de Stripe Connect
- Settings: edición de profile + Stripe Connect status
- Jobs: gestión de publicaciones (toggle status, delete)

## SEO / PWA / Infraestructura
- Metadata con OG tags, Twitter cards, title templates
- Sitemap dinámico desde Supabase
- robots.txt
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Manifest PWA
- Loading skeletons, error boundary, custom 404
- Toast notification system
- Deploy en Vercel (https://artroom-five.vercel.app)
