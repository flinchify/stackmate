import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Packages — Ordering, Booking & AI Systems | Stackmate',
  description: 'Packages for Perth restaurants: online ordering, reservation systems, AI phone agents, loyalty automation, and multi-venue dashboards. Choose Starter, Growth, or Pro.',
  keywords: ['restaurant packages perth', 'restaurant ordering system perth', 'AI restaurant booking', 'hospitality automation perth', 'restaurant website perth', 'online ordering system perth', 'restaurant marketing automation'],
  openGraph: {
    title: 'Restaurant Packages — Ordering, Booking & AI Systems | Stackmate',
    description: 'Packages for Perth restaurants: online ordering, reservation systems, AI phone agents, and loyalty automation.',
    url: 'https://stackmate.digital/restaurants',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Packages — Ordering, Booking & AI Systems | Stackmate',
    description: 'Packages for Perth restaurants: online ordering, reservation systems, AI phone agents, and loyalty automation.',
  },
  alternates: { canonical: 'https://stackmate.digital/restaurants' },
};

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
