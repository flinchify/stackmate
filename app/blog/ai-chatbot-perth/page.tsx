import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = {
  title: 'AI Chatbot & Agent Development Perth | Stackmate',
  description: 'Custom AI chatbots and agents for Perth businesses. 24/7 customer support, lead qualification, and booking automation. Built in 1-2 days.',
  keywords: ['AI chatbot Perth', 'AI agent Perth', 'chatbot development Perth', 'hire AI developer Perth WA', 'AI customer support Perth'],
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Stackmate',
  description: 'Custom AI chatbot and agent development in Perth, Western Australia.',
  url: 'https://stackmate.digital', address: { '@type': 'PostalAddress', addressLocality: 'Perth', addressRegion: 'WA', addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
  areaServed: { '@type': 'City', name: 'Perth' },
};

export default function AIChatbotPerth() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-6 mb-4">AI Chatbots & Agents for Perth Businesses</h1>
        <p className="text-lg text-sm-light mb-10">Stop losing leads to voicemail. Deploy an AI agent that handles customer enquiries 24/7.</p>
        <div className="border-t border-sm-border pt-8 space-y-6 text-sm-light leading-relaxed">
          <p>Every missed call is a missed customer. Every slow email reply is a lead gone to your competitor. Perth businesses are deploying <strong className="text-white">AI chatbots and agents</strong> that handle customer interactions around the clock — booking appointments, answering questions, qualifying leads, and routing complex issues to humans.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">What Our AI Agents Do</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Answer customer questions in natural conversation</li>
            <li>Book appointments by checking real-time calendar availability</li>
            <li>Qualify leads and route hot prospects to your sales team</li>
            <li>Handle complaints with empathy and escalation logic</li>
            <li>Process orders and payments</li>
            <li>Work across phone, chat, email, SMS, and social media</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Not a Generic Chatbot</h2>
          <p>We don&apos;t install a widget and call it done. Stackmate builds <strong className="text-white">custom AI agents</strong> trained on your business, your services, your pricing, and your brand voice. They integrate with your existing tools — CRM, calendar, payment processor — so everything connects.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Hire an AI Developer in Perth</h2>
          <p>If you&apos;re looking to <strong className="text-white">hire an AI developer in Perth</strong>, Stackmate delivers custom AI solutions in 1-2 days. Not weeks, not months. We handle everything from strategy to deployment.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Cost Comparison</h2>
          <p>A full-time receptionist costs $55-65K/year. An AI agent from Stackmate costs a fraction of that and works 24/7 without sick days, breaks, or overtime. Most businesses see ROI in the first month.</p>
        </div>
        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Deploy an AI agent for your business</h3>
          <p className="text-sm-muted mb-4">Custom-built, live in 1-2 days.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">Get a Quote</QuoteButton>
        </div>
      </article>
    </main>
  );
}
