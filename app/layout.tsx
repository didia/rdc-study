import type {Metadata} from 'next';
import {GoogleAnalytics} from '@next/third-parties/google';

import config from '@/config';
import {Providers} from './providers';

import '../src/assets/styles/main.scss';

export const metadata: Metadata = {
  title: {
    default: config.siteTitle,
    template: `%s | RDC Etudes`,
  },
  description: config.siteDescription,
  keywords: config.siteKeywords,
  metadataBase: new URL(config.siteURL),
  openGraph: {
    siteName: config.siteTitle,
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
