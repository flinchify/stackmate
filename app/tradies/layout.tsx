import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Websites & Quote Systems for Perth Tradies | Stackmate',
  description: 'Custom websites, automated quoting, and AI-powered systems built for Perth tradies. Get more jobs, less admin. From plumbers to sparkies — Stackmate builds the tech that runs your trade business.',
  keywords: ['tradie website perth', 'trade business automation', 'quote system tradies', 'plumber website perth', 'electrician website perth', 'tradie booking system', 'perth trade business software', 'AI for tradies'],
  openGraph: {
    title: 'Websites & Quote Systems for Perth Tradies | Stackmate',
    description: 'Custom websites, automated quoting, and AI-powered systems built for Perth tradies. Get more jobs, less admin.',
    url: 'https://stackmate.digital/tradies',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Websites & Quote Systems for Perth Tradies | Stackmate',
    description: 'Custom websites, automated quoting, and AI-powered systems built for Perth tradies.',
  },
  alternates: {
    canonical: 'https://stackmate.digital/tradies',
  },
};

export default function TradiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
