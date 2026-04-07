import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Commerce Packages — Stores, AI & Automation | Stackmate',
  description: 'Packages for Perth e-commerce businesses: custom storefronts, AI product recommendations, cart recovery, inventory automation, and ERP integration. Choose Starter, Growth, or Pro.',
  keywords: ['ecommerce packages perth', 'ecommerce website perth', 'online store perth', 'shopify alternative perth', 'AI product recommendations', 'ecommerce automation perth', 'custom online store western australia'],
  openGraph: {
    title: 'E-Commerce Packages — Stores, AI & Automation | Stackmate',
    description: 'Packages for Perth e-commerce businesses: custom storefronts, AI recommendations, and inventory automation.',
    url: 'https://stackmate.digital/ecommerce',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Packages — Stores, AI & Automation | Stackmate',
    description: 'Packages for Perth e-commerce businesses: custom storefronts, AI recommendations, and inventory automation.',
  },
  alternates: { canonical: 'https://stackmate.digital/ecommerce' },
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
