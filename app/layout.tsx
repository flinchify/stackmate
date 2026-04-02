import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stackmate.digital'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  title: {
    default: 'Stackmate | AI-Powered Business Systems, Perth WA',
    template: '%s | Stackmate',
  },
  description:
    'Stackmate is Perth\'s fastest AI systems integrator. We build custom AI agents, business automation, websites, and software for mining companies, agencies, and local businesses in Western Australia. 1-2 day delivery. Get a free quote or AI audit in 60 seconds.',
  alternates: {
    canonical: 'https://stackmate.digital',
  },
  authors: [{ name: 'Miles Cass', url: 'https://www.linkedin.com/in/miles-cass-0a01973b7/' }],
  creator: 'Miles Cass',
  publisher: 'Stackmate',
  keywords: [
    'AI automation Perth',
    'business systems Perth',
    'AI integration Western Australia',
    'custom software Perth',
    'mining automation',
    'business automation Australia',
    'AI agents Perth',
    'systems integrator WA',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://stackmate.digital',
    siteName: 'Stackmate',
    title: 'Stackmate | AI-Powered Business Systems, Perth WA',
    description:
      'Perth\'s fastest AI systems integrator. Custom automation, AI agents, and business infrastructure.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stackmate | AI-Powered Business Systems',
    description:
      'Perth\'s fastest AI systems integrator. Custom automation and AI agents.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Stackmate',
  url: 'https://stackmate.digital',
  logo: 'https://stackmate.digital/logo.png',
  description:
    'AI-powered business systems integrator based in Perth, Western Australia.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Perth',
    addressRegion: 'WA',
    addressCountry: 'AU',
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
    geoRadius: '50000',
  },
  sameAs: [
    'https://www.linkedin.com/in/miles-cass-0a01973b7/',
    'https://instagram.com/milescass_',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-sm-bg">{children}</body>
    </html>
  );
}
