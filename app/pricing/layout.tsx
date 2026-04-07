import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Web Development & AI Automation Packages | Stackmate',
  description: 'Stackmate pricing for web development, AI automation, and business systems. Transparent pricing for tradies, restaurants, e-commerce, local services, corporate, and enterprise. Perth, Australia.',
  keywords: ['stackmate pricing', 'web development pricing perth', 'AI automation pricing australia', 'website packages perth', 'business automation pricing', 'web development cost perth'],
  openGraph: {
    title: 'Pricing — Web Development & AI Automation Packages | Stackmate',
    description: 'Transparent pricing for web development, AI automation, and business systems. From sole traders to enterprise.',
    url: 'https://stackmate.digital/pricing',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Web Development & AI Automation Packages | Stackmate',
    description: 'Transparent pricing for web development, AI automation, and business systems.',
  },
  alternates: {
    canonical: 'https://stackmate.digital/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
