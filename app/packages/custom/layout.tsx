import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Packages | Stackmate',
  description: 'We build systems for any industry. If your business does not fit a standard category, tell us what you need and we will design a custom solution. Websites, automation, AI, and integrations built to your specifications.',
  keywords: ['custom software perth', 'custom business systems', 'bespoke software development', 'custom automation perth', 'tailored business solutions'],
  openGraph: {
    title: 'Custom Packages | Stackmate',
    description: 'We build systems for any industry. Tell us what you need.',
    url: 'https://stackmate.digital/packages/custom',
    siteName: 'Stackmate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Packages | Stackmate',
    description: 'We build systems for any industry. Tell us what you need.',
  },
  alternates: { canonical: 'https://stackmate.digital/packages/custom' },
};

export default function CustomPackageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
