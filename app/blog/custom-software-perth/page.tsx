import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = {
  title: 'Custom Software Development Perth | Stackmate',
  description: 'Custom software development in Perth WA. Dashboards, portals, booking systems, and business tools built in 1-2 days. Perth\'s fastest developer.',
  keywords: ['custom software Perth', 'software development Perth', 'app development Perth WA', 'custom app developer Perth', 'bespoke software Western Australia'],
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Stackmate',
  description: 'Custom software development in Perth, Western Australia. Dashboards, portals, and business tools.',
  url: 'https://stackmate.digital', address: { '@type': 'PostalAddress', addressLocality: 'Perth', addressRegion: 'WA', addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
  areaServed: { '@type': 'City', name: 'Perth' },
};

export default function CustomSoftwarePerth() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-6 mb-4">Custom Software Development in Perth, WA</h1>
        <p className="text-lg text-sm-light mb-10">Stop forcing your business into off-the-shelf software. Get systems built for exactly how you operate.</p>
        <div className="border-t border-sm-border pt-8 space-y-6 text-sm-light leading-relaxed">
          <p>Off-the-shelf software gets you 80% of the way. The last 20% — the part that makes your business unique — requires <strong className="text-white">custom software</strong>. Stackmate builds bespoke applications for Perth businesses in 1-2 days.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">What We Build</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">Admin dashboards</strong> — real-time business data, KPI tracking, team management</li>
            <li><strong className="text-white">Client portals</strong> — secure login, document sharing, project tracking</li>
            <li><strong className="text-white">Booking systems</strong> — online scheduling with payment, reminders, and calendar sync</li>
            <li><strong className="text-white">Inventory management</strong> — stock tracking, alerts, supplier integration</li>
            <li><strong className="text-white">Quoting tools</strong> — instant price calculations, proposal generation, e-signatures</li>
            <li><strong className="text-white">Internal tools</strong> — anything your team needs to work faster</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Perth Software Development Done Right</h2>
          <p>Traditional software agencies in Perth quote 3-6 months and $50-150K for custom builds. We deliver in <strong className="text-white">1-2 days</strong> using AI-accelerated development. Same quality, fraction of the time and cost.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Our Tech Stack</h2>
          <p>Next.js, React, TypeScript, Node.js, PostgreSQL, Stripe, AI/ML integrations. Modern, fast, scalable. No WordPress, no legacy tech, no technical debt.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Mining & Industrial Software</h2>
          <p>WA mining operations have unique requirements: DMIRS compliance, FIFO management, remote site operation, offline capability. We build purpose-fit software that generic tools can&apos;t match.</p>
        </div>
        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Get custom software in 1-2 days</h3>
          <p className="text-sm-muted mb-4">Tell us what you need. We&apos;ll scope it same day.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">Get a Quote</QuoteButton>
        </div>
      </article>
    </main>
  );
}
