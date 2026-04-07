import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lead Capture & Automation for Perth Real Estate Agents | Stackmate',
  description: 'AI-powered lead capture, nurture sequences, and automation systems for Perth real estate agents. Convert more listings, automate follow-ups, and close faster.',
  keywords: ['real estate automation perth', 'real estate website perth', 'property lead capture', 'real estate CRM perth', 'real estate AI perth', 'agent automation western australia', 'property marketing automation'],
  openGraph: {
    title: 'Lead Capture & Automation for Perth Real Estate Agents | Stackmate',
    description: 'AI-powered lead capture, nurture sequences, and automation for Perth real estate agents.',
    url: 'https://stackmate.digital/real-estate',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lead Capture & Automation for Perth Real Estate Agents | Stackmate',
    description: 'AI-powered lead capture and automation for Perth real estate agents.',
  },
  alternates: { canonical: 'https://stackmate.digital/real-estate' },
};

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
