import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = {
  title: 'Best AI Website Developer in Perth WA | Stackmate',
  description: 'Looking for the best AI website developer in Perth? Stackmate delivers custom AI-powered websites, web apps, and business systems in 1-2 days. Perth\'s fastest.',
  keywords: ['AI website developer Perth', 'best web developer Perth', 'website developer Perth WA', 'AI web development Perth', 'custom website Perth'],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Stackmate',
  description: 'Perth\'s fastest AI website developer. Custom AI-powered websites, web apps, and business systems delivered in 1-2 days.',
  url: 'https://stackmate.digital',
  telephone: '',
  email: 'hello@stackmate.digital',
  address: { '@type': 'PostalAddress', addressLocality: 'Perth', addressRegion: 'WA', addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
  areaServed: { '@type': 'City', name: 'Perth' },
  priceRange: '$$',
  openingHours: 'Mo-Fr 08:00-18:00',
  sameAs: [],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '47', bestRating: '5' },
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Website Development', description: 'Custom AI-powered websites delivered in 1-2 days' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Agent Development', description: 'Custom AI agents and chatbots for business automation' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Automation', description: 'End-to-end business process automation with AI' } },
  ],
};

export default function AIWebDevPerth() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>
        <div className="mt-6 mb-10">
          <span className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">Perth AI</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-4 mb-4">Best AI Website Developer in Perth, WA</h1>
          <p className="text-lg text-sm-light">Why Perth businesses are choosing Stackmate for AI-powered website development, custom software, and business automation.</p>
        </div>
        <div className="border-t border-sm-border pt-8 space-y-6 text-sm-light leading-relaxed">
          <p>If you&apos;re searching for the <strong className="text-white">best AI website developer in Perth</strong>, you&apos;ve found them. Stackmate is Perth&apos;s fastest AI systems integrator — we build custom websites, AI agents, and business automation systems in 1-2 days.</p>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Why Stackmate Is Perth&apos;s Top AI Developer</h2>
          <p>Traditional web agencies in Perth take 8-12 weeks to deliver a website. We deliver in <strong className="text-white">1-2 days</strong>. Not because we cut corners — because we use AI-accelerated development that&apos;s 10x faster than traditional methods.</p>
          <p>Every website we build is:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">AI-powered</strong> — intelligent chatbots, automated workflows, and smart features built in</li>
            <li><strong className="text-white">Lightning fast</strong> — sub-second load times, optimised for Core Web Vitals</li>
            <li><strong className="text-white">SEO-ready</strong> — structured data, sitemaps, and AI-crawler friendly from day one</li>
            <li><strong className="text-white">Mobile-first</strong> — designed for the 70%+ of users browsing on phones</li>
            <li><strong className="text-white">Perth-built</strong> — by a local developer who understands WA business</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">AI Website Development Services in Perth</h2>
          <p>We don&apos;t just build websites. We build <strong className="text-white">business systems</strong> that happen to have a website attached:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Custom AI agents that handle customer enquiries 24/7</li>
            <li>Automated booking and quoting systems</li>
            <li>E-commerce with AI-powered product recommendations</li>
            <li>Client portals and admin dashboards</li>
            <li>API integrations with Xero, HubSpot, Stripe, and 100+ tools</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Hire AI Developers in Perth</h2>
          <p>Looking to <strong className="text-white">hire an AI developer in Perth</strong>? Stackmate offers both project-based and ongoing engagement models. Whether you need a one-off build or a long-term technology partner, we scale to fit.</p>
          <p>Our founder Miles Cass has built full-stack AI platforms, custom marketplaces, and production business systems. You&apos;re not hiring a junior dev — you&apos;re hiring the builder who does it all.</p>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Perth Web Developer vs AI Systems Integrator</h2>
          <p>Most Perth web developers build static websites. We build <strong className="text-white">intelligent systems</strong>:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">Web developer:</strong> Builds a website that displays information</li>
            <li><strong className="text-white">Stackmate:</strong> Builds a system that runs your business — answers calls, books appointments, sends invoices, follows up leads, and reports to you automatically</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Industries We Serve in Perth</h2>
          <p>We work with every type of business in Perth and Western Australia:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">Mining & Resources</strong> — safety compliance, fleet tracking, operational dashboards</li>
            <li><strong className="text-white">Trades & Services</strong> — booking systems, AI receptionists, automated quoting</li>
            <li><strong className="text-white">Hospitality</strong> — reservation systems, customer management, marketing automation</li>
            <li><strong className="text-white">Professional Services</strong> — client portals, reporting, workflow automation</li>
            <li><strong className="text-white">Agencies</strong> — white-label platforms, client dashboards, content tools</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Get Started Today</h2>
          <p>Ready for a website that actually works for your business? Get a custom quote in 60 seconds — no sales calls, no 12-week timelines. Just fast, AI-powered development from Perth&apos;s best.</p>
        </div>

        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Get a quote in 60 seconds</h3>
          <p className="text-sm-muted mb-4">Perth&apos;s fastest AI developer. 1-2 day delivery.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Get a Quote
          </QuoteButton>
        </div>
      </article>
    </main>
  );
}
