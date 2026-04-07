import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tradie Packages — Websites, Quoting & AI Systems | Stackmate',
  description: 'Packages for Perth tradies: professional websites, automated quoting, AI receptionists, and job management systems. Choose Starter, Growth, or Pro. Get a quote today.',
  keywords: ['tradie packages perth', 'tradie website perth', 'trade business packages', 'plumber website perth', 'electrician website perth', 'tradie booking system', 'perth trade business software', 'AI for tradies'],
  openGraph: {
    title: 'Tradie Packages — Websites, Quoting & AI Systems | Stackmate',
    description: 'Packages for Perth tradies: professional websites, automated quoting, AI receptionists, and job management systems.',
    url: 'https://stackmate.digital/tradies',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tradie Packages — Websites, Quoting & AI Systems | Stackmate',
    description: 'Packages for Perth tradies: professional websites, automated quoting, AI receptionists, and job management systems.',
  },
  alternates: {
    canonical: 'https://stackmate.digital/tradies',
  },
};

export default function TradiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
