import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Commerce Stores & AI Product Systems | Stackmate',
  description: 'Custom e-commerce stores, AI-powered product recommendations, and automated inventory systems for Perth businesses. Sell more online with systems that scale.',
  keywords: ['ecommerce website perth', 'online store perth', 'shopify alternative perth', 'AI product recommendations', 'ecommerce automation perth', 'custom online store western australia', 'ecommerce development perth'],
  openGraph: {
    title: 'E-Commerce Stores & AI Product Systems | Stackmate',
    description: 'Custom e-commerce stores and AI-powered product systems for Perth businesses.',
    url: 'https://stackmate.digital/ecommerce',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Stores & AI Product Systems | Stackmate',
    description: 'Custom e-commerce stores and AI-powered product systems for Perth businesses.',
  },
  alternates: { canonical: 'https://stackmate.digital/ecommerce' },
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
