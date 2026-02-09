import './globals.css';
import type { Metadata } from 'next';
import { TrackerProvider } from '@/components/TrackerProvider';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vektorlabs.com';
const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'VektorLabs — AI Website Builder',
    template: '%s | VektorLabs',
  },
  description:
    'Strategic AI website builder that generates conversion-optimized websites using intelligence from billion-dollar brands. Custom websites in 72 hours.',
  keywords: [
    'AI website builder',
    'custom website',
    'web design',
    'conversion optimization',
    'business website',
    'e-commerce website',
  ],
  authors: [{ name: 'VektorLabs' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VektorLabs',
    title: 'VektorLabs — AI Website Builder',
    description:
      'Strategic AI website builder that generates conversion-optimized websites using intelligence from billion-dollar brands.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VektorLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VektorLabs — AI Website Builder',
    description:
      'Conversion-optimized websites powered by billion-dollar brand intelligence.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TrackerProvider>
          {children}
          <ExitIntentPopup />
        </TrackerProvider>
      </body>
    </html>
  );
}
