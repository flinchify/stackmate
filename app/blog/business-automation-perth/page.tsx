import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = {
  title: 'Business Automation Perth | AI-Powered Workflows | Stackmate',
  description: 'Perth\'s leading business automation company. We automate invoicing, scheduling, customer management, and workflows with AI. 1-2 day delivery.',
  keywords: ['business automation Perth', 'workflow automation Perth WA', 'AI automation Perth', 'process automation Western Australia'],
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Stackmate',
  description: 'Business automation and AI workflow solutions in Perth, Western Australia.',
  url: 'https://stackmate.digital', address: { '@type': 'PostalAddress', addressLocality: 'Perth', addressRegion: 'WA', addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
  areaServed: { '@type': 'City', name: 'Perth' },
};

export default function BusinessAutomationPerth() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-6 mb-4">Business Automation in Perth: The Complete Guide for 2026</h1>
        <p className="text-lg text-sm-light mb-10">How Perth businesses are saving 15-25 hours per week with AI-powered automation.</p>
        <div className="border-t border-sm-border pt-8 space-y-6 text-sm-light leading-relaxed">
          <p>Perth businesses lose thousands of hours every year to manual processes that should be automated. Invoicing, appointment booking, customer follow-ups, reporting — all of it can run on autopilot with the right <strong className="text-white">business automation</strong> setup.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">What Can Be Automated?</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">Customer enquiries</strong> — AI agents handle calls, chats, and emails 24/7</li>
            <li><strong className="text-white">Invoicing</strong> — automatic generation and payment reminders</li>
            <li><strong className="text-white">Scheduling</strong> — online booking with calendar sync and reminders</li>
            <li><strong className="text-white">Lead follow-up</strong> — automated email/SMS sequences</li>
            <li><strong className="text-white">Reporting</strong> — daily/weekly/monthly reports generated automatically</li>
            <li><strong className="text-white">Data entry</strong> — sync between CRM, accounting, and other tools</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Why Perth Businesses Choose Stackmate</h2>
          <p>We&apos;re not a generic SaaS platform. We build <strong className="text-white">custom automation</strong> tailored to how your specific business operates. Every workflow is mapped, optimised, and connected into one unified system.</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>1-2 day delivery — not 8-12 week agency timelines</li>
            <li>Perth-based — same timezone, local understanding</li>
            <li>AI-native — we lead with AI, not bolt it on</li>
            <li>Integrates with Xero, HubSpot, Stripe, and 100+ tools</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Industries We Automate in Perth</h2>
          <p><strong className="text-white">Mining & Resources:</strong> Safety compliance, shift reporting, fleet management, DMIRS automation.</p>
          <p><strong className="text-white">Trades & Services:</strong> Job booking, quoting, invoicing, customer management.</p>
          <p><strong className="text-white">Hospitality:</strong> Reservation systems, review management, marketing automation.</p>
          <p><strong className="text-white">Professional Services:</strong> Client onboarding, document management, billing.</p>
        </div>
        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Automate your business in 1-2 days</h3>
          <p className="text-sm-muted mb-4">Get a custom automation quote. 60 seconds to submit.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">Get a Quote</QuoteButton>
        </div>
      </article>
    </main>
  );
}
