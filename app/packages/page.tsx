'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Wrench, UtensilsCrossed, Home, ShoppingCart, HardHat, Settings, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const INDUSTRIES = [
  { icon: Wrench, title: 'Tradies', desc: 'Websites, quoting systems, AI receptionists, and job management for trade businesses.', href: '/tradies', industry: 'tradies' },
  { icon: UtensilsCrossed, title: 'Restaurants', desc: 'Online ordering, reservation systems, loyalty automation, and AI phone agents for hospitality.', href: '/restaurants', industry: 'restaurants' },
  { icon: Home, title: 'Real Estate', desc: 'Lead capture, CRM automation, appraisal tools, and vendor reporting for agents and agencies.', href: '/real-estate', industry: 'local-services' },
  { icon: ShoppingCart, title: 'E-Commerce', desc: 'Custom storefronts, AI product recommendations, cart recovery, and inventory automation.', href: '/ecommerce', industry: 'ecommerce' },
  { icon: HardHat, title: 'Mining', desc: 'Safety compliance, operational dashboards, fleet tracking, and AI predictive maintenance.', href: '/mining', industry: 'enterprise' },
  { icon: Settings, title: 'Custom', desc: 'Don\'t fit a category? We build systems for any industry. Tell us what you need.', href: '/packages/custom', industry: '' },
];

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function formatPrice(cents: number): string {
  return 'A$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function PackagesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [apiPackages, setApiPackages] = useState<{ industry: string; upfrontPrice: number }[]>([]);

  useEffect(() => {
    fetch('/api/packages').then(r => r.json()).then(d => setApiPackages(d.packages || [])).catch(() => {});
  }, []);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Stackmate',
        url: 'https://stackmate.digital',
        description: 'Custom websites, AI automation, and business systems for every industry. From sole traders to enterprise.',
        areaServed: { '@type': 'State', name: 'Western Australia' },
        sameAs: [
          'https://www.linkedin.com/company/stackmate',
          'https://instagram.com/stackmate.digital',
        ],
      }) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Packages</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Packages for every business
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            From sole traders to enterprise. Pick your industry, choose your tier, get a quote.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/audit"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
            >
              GET YOUR FREE AUDIT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 border border-sm-border text-white font-display font-bold rounded-xl transition-all hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]"
            >
              GET A QUOTE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ===== INDUSTRY CARDS ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">Industries</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Choose your industry
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Every package is built for how your industry actually works. Pick your vertical and explore the tiers available for your business.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((industry, i) => {
              const isCustom = i === INDUSTRIES.length - 1;
              const industryPkgs = industry.industry ? apiPackages.filter(p => p.industry === industry.industry) : [];
              const minPrice = industryPkgs.length > 0 ? Math.min(...industryPkgs.map(p => p.upfrontPrice)) : 0;
              return (
                <StaggerItem
                  key={industry.title}
                  index={i}
                  className={`${isCustom ? 'shimmer-border' : 'shimmer-border-subtle'} border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 group hover:border-sm-accent/20 transition-all duration-300`}
                >
                  <industry.icon className="w-10 h-10 text-sm-accent mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">{industry.title}</h3>
                  <p className="text-sm text-sm-muted leading-relaxed mb-4">{industry.desc}</p>
                  {minPrice > 0 && (
                    <p className="text-sm font-display font-bold text-sm-accent mb-4">From {formatPrice(minPrice)}</p>
                  )}
                  <Link
                    href={industry.href}
                    className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-sm-accent group-hover:gap-3 transition-all"
                  >
                    View Packages <ArrowRight className="w-4 h-4" />
                  </Link>
                </StaggerItem>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
              <p className="eyebrow mb-4">Not Sure?</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Not sure which package is right for you?
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                Get a free audit and we will recommend the best fit for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/audit"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
                >
                  GET YOUR FREE AUDIT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="group inline-flex items-center gap-2 px-8 py-4 border border-sm-border text-white font-display font-bold rounded-xl transition-all hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]"
                >
                  GET A QUOTE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stackmate" width={28} height={28} className="invert" />
              <span className="font-display font-bold text-lg">stackmate</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-sm-muted">
              <a href="/services" className="hover:text-sm-accent transition-colors">ENTERPRISE</a>
              <a href="/clients" className="hover:text-sm-accent transition-colors">CLIENTS</a>
              <a href="/tools" className="hover:text-sm-accent transition-colors">TOOLS</a>
              <a href="/blog" className="hover:text-sm-accent transition-colors">BLOG</a>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sm-muted">
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-sm-accent transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-sm-accent transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Perth, WA
            </div>
            <div>&copy; {new Date().getFullYear()} Stackmate. All rights reserved.</div>
          </div>
        </AnimatedSection>
      </footer>
    </main>
  );
}
