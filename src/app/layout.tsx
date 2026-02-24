import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, DM_Mono } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://artroom.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ArtRoom — Creative Design Marketplace',
    template: '%s | ArtRoom',
  },
  description:
    'Discover, buy, and sell creative designs. Instant USDC payouts for creators worldwide.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    siteName: 'ArtRoom',
    title: 'ArtRoom — Creative Design Marketplace',
    description: 'Discover, buy, and sell creative designs. Instant USDC payouts for creators worldwide.',
    url: APP_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ArtRoom' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtRoom — Creative Design Marketplace',
    description: 'Discover, buy, and sell creative designs. Instant USDC payouts for creators worldwide.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-[#0a0a0a] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-[13px] focus:font-bold"
        >
          Skip to content
        </a>
        <Providers>
          <div id="main-content">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
