'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import PricingCalculator from '@/components/PricingCalculator';

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

interface ApiPackage {
  id: string;
  industry: string;
  tier: string;
  tierLabel: string;
  upfrontPrice: number;
  monthlyPrice: number;
  features: string[];
  sortOrder: number;
}

const INDUSTRY_LABELS: Record<string, { label: string; href: string }> = {
  tradies: { label: 'Tradies', href: '/tradies' },
  restaurants: { label: 'Restaurants', href: '/restaurants' },
  ecommerce: { label: 'E-Commerce', href: '/ecommerce' },
  'local-services': { label: 'Local Services', href: '/real-estate' },
  corporate: { label: 'Corporate', href: '/corporate' },
  enterprise: { label: 'Enterprise', href: '/mining' },
};

const INDUSTRY_ORDER = ['tradies', 'restaurants', 'ecommerce', 'local-services', 'corporate', 'enterprise'];

function formatPrice(cents: number): string {
  return 'A$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function PricingPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => { setPackages(d.packages || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const grouped = INDUSTRY_ORDER
    .map(industry => ({
      industry,
      ...(INDUSTRY_LABELS[industry] || { label: industry, href: '#' }),
      packages: packages.filter(p => p.industry === industry).sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter(g => g.packages.length > 0);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Stackmate Pricing',
        description: 'Transparent pricing for web development, AI automation, and business systems across all industries.',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        url: 'https://stackmate.digital/pricing',
      }) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Pricing</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Transparent pricing for every business
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Every package includes a custom-built solution, not a template. Upfront build cost plus a monthly fee that covers hosting, maintenance, support, SEO/GEO, and reporting. No lock-in contracts. No hidden fees.
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

      {/* ===== PRICING SECTIONS ===== */}
      {loaded && grouped.length === 0 ? (
        <section className="py-24 bg-sm-card/20">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatedSection>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Contact us for custom pricing
                </h2>
                <p className="text-sm-muted max-w-xl mx-auto mb-8">
                  Every project is unique. Get a free audit and we will provide a detailed quote tailored to your business.
                </p>
                <a
                  href="/audit"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
                >
                  GET YOUR FREE AUDIT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ) : (
        grouped.map((group, gi) => (
          <section key={group.industry} className={`py-24 ${gi % 2 === 0 ? 'bg-sm-card/20' : ''}`}>
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="text-center mb-12">
                <p className="eyebrow mb-4">{group.label}</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  {group.label} Packages
                </h2>
                <a href={group.href} className="inline-flex items-center gap-1 text-sm text-sm-accent hover:underline">
                  View full {group.label.toLowerCase()} page <ArrowRight className="w-3 h-3" />
                </a>
              </AnimatedSection>
              <div className="grid md:grid-cols-3 gap-6">
                {group.packages.map((pkg, i) => {
                  const isHighlight = i === group.packages.length - 1;
                  return (
                    <StaggerItem
                      key={pkg.id}
                      index={i}
                      className={`${isHighlight ? 'shimmer-border' : 'shimmer-border-subtle'} border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 flex flex-col`}
                    >
                      <h3 className="text-2xl font-display font-bold">{pkg.tierLabel}</h3>
                      <p className="text-sm text-sm-muted mb-2 capitalize">{pkg.tier}</p>
                      <div className="mb-4">
                        <p className="text-xl font-display font-bold text-sm-accent">From {formatPrice(pkg.upfrontPrice)}</p>
                        <p className="text-sm text-sm-muted">{formatPrice(pkg.monthlyPrice)}/mo</p>
                      </div>
                      <div className="space-y-3 flex-1">
                        {pkg.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-sm-accent shrink-0 mt-0.5" />
                            <span className="text-sm text-sm-light">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setQuoteOpen(true)}
                        className={`mt-8 w-full group inline-flex items-center justify-center gap-2 px-8 py-4 font-display font-bold rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98] ${
                          isHighlight
                            ? 'bg-sm-accent text-black hover:bg-sm-accent-light'
                            : 'border border-sm-border text-white hover:bg-white/5'
                        }`}
                      >
                        Get a Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </StaggerItem>
                  );
                })}
              </div>
            </div>
          </section>
        ))
      )}

      {/* ===== NOTE ===== */}
      {grouped.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-sm-muted">
              All prices in AUD. GST not included. Monthly fees cover hosting, maintenance, support, SEO/GEO, and reporting.
            </p>
          </div>
        </section>
      )}

      {/* ===== CALCULATOR ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="eyebrow mb-4">Calculator</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Build your estimate
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <PricingCalculator onQuoteClick={() => setQuoteOpen(true)} />
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
              <p className="eyebrow mb-4">Not Sure?</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Need help choosing the right package?
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                Get a free audit and we will recommend the best fit for your business. No cost, no obligation.
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
