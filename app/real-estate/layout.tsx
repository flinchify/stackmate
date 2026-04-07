import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Packages — Lead Capture, CRM & AI Systems | Stackmate',
  description: 'Packages for Perth real estate agents: professional websites, lead capture, CRM automation, AI chatbots, and vendor reporting. Choose Starter, Growth, or Pro.',
  keywords: ['real estate packages perth', 'real estate automation perth', 'real estate website perth', 'property lead capture', 'real estate CRM perth', 'real estate AI perth', 'agent automation western australia'],
  openGraph: {
    title: 'Real Estate Packages — Lead Capture, CRM & AI Systems | Stackmate',
    description: 'Packages for Perth real estate agents: lead capture, CRM automation, AI chatbots, and vendor reporting.',
    url: 'https://stackmate.digital/real-estate',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Packages — Lead Capture, CRM & AI Systems | Stackmate',
    description: 'Packages for Perth real estate agents: lead capture, CRM automation, and AI chatbots.',
  },
  alternates: { canonical: 'https://stackmate.digital/real-estate' },
};

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
