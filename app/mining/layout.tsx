import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Operational Dashboards & Safety Automation for WA Mining | Stackmate',
  description: 'Custom operational dashboards, safety compliance automation, and AI-powered reporting for Western Australian mining companies. Built for the Pilbara and beyond.',
  keywords: ['mining software western australia', 'mining dashboard perth', 'safety automation mining', 'mining compliance software', 'operational dashboard mining WA', 'mining AI automation', 'pilbara mining software'],
  openGraph: {
    title: 'Operational Dashboards & Safety Automation for WA Mining | Stackmate',
    description: 'Custom dashboards and safety automation for Western Australian mining operations.',
    url: 'https://stackmate.digital/mining',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operational Dashboards & Safety Automation for WA Mining | Stackmate',
    description: 'Custom dashboards and safety automation for WA mining operations.',
  },
  alternates: { canonical: 'https://stackmate.digital/mining' },
};

export default function MiningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
