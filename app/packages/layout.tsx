import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Packages for Every Business | Stackmate',
  description: 'From sole traders to enterprise. Pick your industry, choose your tier, get a quote. Custom websites, AI automation, and business systems for tradies, restaurants, real estate, e-commerce, and mining.',
  keywords: ['business packages perth', 'website packages', 'AI automation packages', 'custom software packages', 'business systems perth'],
  openGraph: {
    title: 'Packages for Every Business | Stackmate',
    description: 'From sole traders to enterprise. Pick your industry, choose your tier, get a quote.',
    url: 'https://stackmate.digital/packages',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Packages for Every Business | Stackmate',
    description: 'From sole traders to enterprise. Pick your industry, choose your tier, get a quote.',
  },
  alternates: { canonical: 'https://stackmate.digital/packages' },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
