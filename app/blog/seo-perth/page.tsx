import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteButton from '@/components/QuoteButton';

export const metadata: Metadata = {
  title: 'SEO & AI Search Optimisation Perth | Stackmate',
  description: 'SEO and AI search optimisation for Perth businesses. Rank on Google, ChatGPT, Perplexity, and Gemini. Local SEO, technical SEO, and GEO.',
  keywords: ['SEO Perth', 'AI search optimisation Perth', 'local SEO Perth WA', 'GEO optimisation', 'SEO agency Perth', 'Google ranking Perth'],
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Stackmate',
  description: 'SEO and AI search optimisation services in Perth, Western Australia.',
  url: 'https://stackmate.digital', address: { '@type': 'PostalAddress', addressLocality: 'Perth', addressRegion: 'WA', addressCountry: 'AU' },
  geo: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
  areaServed: { '@type': 'City', name: 'Perth' },
};

export default function SEOPerth() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-6 mb-4">SEO & AI Search Optimisation in Perth</h1>
        <p className="text-lg text-sm-light mb-10">It&apos;s not just Google anymore. Your business needs to rank on AI search engines too.</p>
        <div className="border-t border-sm-border pt-8 space-y-6 text-sm-light leading-relaxed">
          <p>SEO in 2026 isn&apos;t what it was. Google still matters, but now your potential customers are also searching on <strong className="text-white">ChatGPT, Perplexity, Gemini, and Claude</strong>. If your business doesn&apos;t show up in AI search results, you&apos;re invisible to a growing segment of your market.</p>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Traditional SEO + AI Search (GEO)</h2>
          <p>We handle both:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong className="text-white">Google SEO</strong> — technical audits, keyword targeting, content strategy, local pack ranking</li>
            <li><strong className="text-white">Local SEO</strong> — Google Maps, &quot;near me&quot; searches, Google Business Profile optimisation</li>
            <li><strong className="text-white">GEO (Generative Engine Optimisation)</strong> — structured data, llms.txt, AI-crawler-friendly markup so ChatGPT and Perplexity recommend your business</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">What Is GEO?</h2>
          <p>GEO is optimising your website so AI search engines can understand and recommend your business. This includes:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Schema.org structured data (LocalBusiness, Service, FAQ)</li>
            <li>llms.txt and llms-full.txt files for AI crawlers</li>
            <li>AI-plugin manifests</li>
            <li>Clean, crawlable content architecture</li>
            <li>Authoritative, specific content that AI models cite</li>
          </ul>
          <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">Perth Local SEO</h2>
          <p>For Perth businesses, local SEO is critical. When someone searches &quot;plumber near me&quot; or &quot;AI developer Perth,&quot; you need to be in the top results. We optimise for:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Google Maps local pack</li>
            <li>Location-specific landing pages</li>
            <li>Perth/WA keyword targeting</li>
            <li>Review management and citation building</li>
            <li>NAP consistency across directories</li>
          </ul>
        </div>
        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Get found on Google and AI search</h3>
          <p className="text-sm-muted mb-4">SEO + GEO optimisation for Perth businesses.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">Get a Quote</QuoteButton>
        </div>
      </article>
    </main>
  );
}
