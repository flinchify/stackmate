import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mining Packages — Dashboards, Safety & AI Systems | Stackmate',
  description: 'Packages for WA mining operations: safety compliance dashboards, operational reporting, AI predictive maintenance, and IoT integration. Choose Starter, Growth, or Pro.',
  keywords: ['mining packages western australia', 'mining software western australia', 'mining dashboard perth', 'safety automation mining', 'mining compliance software', 'operational dashboard mining WA', 'mining AI automation'],
  openGraph: {
    title: 'Mining Packages — Dashboards, Safety & AI Systems | Stackmate',
    description: 'Packages for WA mining operations: safety compliance, operational dashboards, and AI predictive maintenance.',
    url: 'https://stackmate.digital/mining',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mining Packages — Dashboards, Safety & AI Systems | Stackmate',
    description: 'Packages for WA mining operations: safety compliance, operational dashboards, and AI systems.',
  },
  alternates: { canonical: 'https://stackmate.digital/mining' },
};

export default function MiningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
