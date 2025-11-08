import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { LenisProvider } from '@/components/LenisProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tokenized Subscription Extension – Share Subs Securely',
  description: 'Monetize Your Subscriptions with Tokens – Secure, Decentralized Sharing. Lenders mint tokens, borrowers rent via proxies, with blockchain escrow and AI matching.',
  openGraph: {
    title: 'Tokenized Subscription Extension – Share Subs Securely',
    description:
      'Monetize Your Subscriptions with Tokens – Secure, Decentralized Sharing. Lenders mint tokens, borrowers rent via proxies, with blockchain escrow and AI matching.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tokenized Subscription Extension',
      },
    ],
    url: 'https://example.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`gradient-bg min-h-screen ${inter.className}`}>
        <LenisProvider>
          <Providers>
            {children}
          </Providers>
        </LenisProvider>
      </body>
    </html>
  );
}
