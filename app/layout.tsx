import './globals.css';
import type { Metadata } from 'next';
import { TrackerProvider } from '@/components/TrackerProvider';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import Chatbot from '@/components/Chatbot';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vektorlabs.ai';
const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'VektorLabs — Your Business, Running Without You',
    template: '%s | VektorLabs',
  },
  description:
    'We build premium websites and automated systems that bring your business customers — even when you\u0027re not there. Free preview in 24 hours.',
  keywords: [
    'business automation',
    'premium website',
    'small business growth',
    'customer follow-up system',
    'business website',
    'lead generation',
  ],
  authors: [{ name: 'VektorLabs' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VektorLabs',
    title: 'VektorLabs — Your Business, Running Without You',
    description:
      'We build premium websites and automated systems that bring your business customers. Free preview in 24 hours.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VektorLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VektorLabs — Your Business, Running Without You',
    description:
      'Premium websites and automated systems that bring your business customers. Free preview in 24 hours.',
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
          <Chatbot />
        </TrackerProvider>
      </body>
    </html>
  );
}
