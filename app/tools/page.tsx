'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Zap, FileCode, Shield, BarChart3, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const TOOLS = [
  {
    icon: Globe,
    title: 'GEO Audit',
    desc: 'Check how your website performs in AI search engines like ChatGPT, Perplexity, and Gemini.',
    url: 'https://geoptie.com/free-geo-audit',
    tag: 'Free',
  },
  {
    icon: Search,
    title: 'SEO Audit',
    desc: 'Full technical SEO analysis — page speed, meta tags, structured data, crawlability.',
    url: 'https://pagespeed.web.dev/',
    tag: 'Free',
  },
  {
    icon: Zap,
    title: 'Page Speed Test',
    desc: 'Core Web Vitals — LCP, FID, CLS. See how fast your site loads on mobile and desktop.',
    url: 'https://pagespeed.web.dev/',
    tag: 'Free',
  },
  {
    icon: FileCode,
    title: 'Schema Markup Validator',
    desc: 'Test your structured data (JSON-LD) — make sure Google and AI engines can read your site.',
    url: 'https://validator.schema.org/',
    tag: 'Free',
  },
  {
    icon: Shield,
    title: 'Security Headers Check',
    desc: 'Scan your site for missing security headers — HSTS, CSP, X-Frame-Options.',
    url: 'https://securityheaders.com/',
    tag: 'Free',
  },
  {
    icon: BarChart3,
    title: 'GEO Content Checker',
    desc: 'Optimise your content to be cited by AI search engines.',
    url: 'https://geoptie.com/geo-content-checker',
    tag: 'Free',
  },
  {
    icon: Search,
    title: 'GEO Keyword Finder',
    desc: 'Find keywords that AI engines use when generating answers in your industry.',
    url: 'https://geoptie.com/geo-keyword-finder',
    tag: 'Free',
  },
  {
    icon: Globe,
    title: 'Backlink Finder',
    desc: 'Discover which websites AI models cite most. Find backlink opportunities.',
    url: 'https://geoptie.com/geo-backlink-finder',
    tag: 'Free',
  },
  {
    icon: FileCode,
    title: 'Rich Results Test',
    desc: 'Test if your pages are eligible for rich results in Google Search.',
    url: 'https://search.google.com/test/rich-results',
    tag: 'Free',
  },
  {
    icon: Globe,
    title: 'Mobile-Friendly Test',
    desc: 'Check if your website is optimised for mobile devices.',
    url: 'https://search.google.com/test/mobile-friendly',
    tag: 'Free',
  },
  {
    icon: Shield,
    title: 'SSL Checker',
    desc: 'Verify your SSL certificate is properly configured and not expired.',
    url: 'https://www.ssllabs.com/ssltest/',
    tag: 'Free',
  },
  {
    icon: BarChart3,
    title: 'Lighthouse Report',
    desc: 'Full Lighthouse audit — performance, accessibility, best practices, SEO score.',
    url: 'https://pagespeed.web.dev/',
    tag: 'Free',
  },
];

export default function ToolsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-orange-400 uppercase tracking-widest mb-4">Free Tools</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Audit your business for free.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            Use these tools to check your website&apos;s SEO, GEO (AI search visibility), performance, security, and more. All free, no signup required.
          </p>
        </motion.div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.a
              key={tool.title}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group p-6 rounded-xl border border-sm-border bg-sm-card/30 hover:border-orange-500/20 hover:bg-sm-card/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <tool.icon className="w-8 h-8 text-sm-light group-hover:text-orange-400 transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">{tool.tag}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sm-muted group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="font-display font-semibold mb-1">{tool.title}</h3>
              <p className="text-sm text-sm-muted">{tool.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sm-card/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Want us to run the audit for you?</h2>
          <p className="text-sm-muted mb-8">Get a comprehensive AI audit with actionable recommendations. Free, 48-hour response.</p>
          <a href="/audit" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-bold rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            Get Your Free AI Audit
          </a>
        </div>
      </section>
    </main>
  );
}
