import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Ordering, Booking & Retention Systems for Restaurants | Stackmate',
  description: 'AI-powered ordering, table booking, and customer retention systems for Perth restaurants and hospitality venues. Reduce no-shows, automate marketing, and fill more seats.',
  keywords: ['restaurant ordering system perth', 'AI restaurant booking', 'hospitality automation perth', 'restaurant website perth', 'online ordering system perth', 'restaurant marketing automation', 'table booking system perth'],
  openGraph: {
    title: 'AI Ordering, Booking & Retention Systems for Restaurants | Stackmate',
    description: 'AI-powered ordering, table booking, and customer retention systems for Perth restaurants.',
    url: 'https://stackmate.digital/restaurants',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Ordering, Booking & Retention Systems for Restaurants | Stackmate',
    description: 'AI-powered ordering, table booking, and customer retention systems for Perth restaurants.',
  },
  alternates: { canonical: 'https://stackmate.digital/restaurants' },
};

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
