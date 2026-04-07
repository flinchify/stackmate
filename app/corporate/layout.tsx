import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Packages — Websites, Portals & AI Automation | Stackmate',
  description: 'Corporate web development packages for Australian businesses. Professional websites, content marketing, client portals, AI automation, and full SEO/GEO programs. Get a quote today.',
  keywords: ['corporate website perth', 'corporate web development', 'business website packages', 'corporate portal development', 'AI automation corporate', 'perth corporate web design'],
  openGraph: {
    title: 'Corporate Packages — Websites, Portals & AI Automation | Stackmate',
    description: 'Corporate web development packages for Australian businesses. Professional websites, content marketing, client portals, and AI automation.',
    url: 'https://stackmate.digital/corporate',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Packages — Websites, Portals & AI Automation | Stackmate',
    description: 'Corporate web development packages for Australian businesses.',
  },
  alternates: {
    canonical: 'https://stackmate.digital/corporate',
  },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
