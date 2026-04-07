'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Globe, Package, Search, CheckCircle2, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

/* ── Inline animation components ── */

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

/* ── Data ── */

const PACKAGES = [
  {
    tier: 'Starter',
    subtitle: 'New Store',
    features: [
      'Custom Shopify or headless store',
      'Product catalog',
      'Payment processing',
      'Shipping integration',
      'Basic analytics',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    subtitle: 'Scaling Store',
    features: [
      'Everything in Starter',
      'AI product recommendations',
      'Abandoned cart recovery',
      'Automated email flows',
      'Inventory management',
      'Multi-channel selling',
    ],
    highlight: false,
  },
  {
    tier: 'Pro',
    subtitle: 'Enterprise',
    features: [
      'Everything in Growth',
      'Custom ERP integration',
      'AI-powered pricing',
      'Wholesale portal',
      'Advanced analytics and BI dashboard',
      'API marketplace',
    ],
    highlight: true,
  },
];

const PAIN_POINTS = [
  {
    icon: Globe,
    title: 'Template stores that all look the same',
    desc: 'Generic Shopify themes erode trust before a customer even adds to cart. If your store looks like every other store, buyers assume your products are the same too.',
  },
  {
    icon: ShoppingCart,
    title: 'Cart abandonment bleeding revenue',
    desc: 'Without automated recovery flows, every abandoned cart is money walking out the door. Most Perth stores lose 60-80% of potential sales at checkout.',
  },
  {
    icon: Package,
    title: 'Manual inventory updates across platforms',
    desc: 'Selling on your website, marketplaces, and in-store with no sync system means overselling, stockouts, and hours wasted on spreadsheets every week.',
  },
  {
    icon: Search,
    title: 'No idea what your customers actually want',
    desc: 'Zero personalisation means every visitor gets the same experience. No product recommendations, no behavioural targeting, no data-driven upsells.',
  },
];

const FAQS = [
  {
    q: 'Which package is right for my store?',
    a: 'If you are launching a new store and need a solid foundation with payments and shipping, Starter is the right starting point. If you are scaling and need AI recommendations, cart recovery, and inventory management, Growth will drive your next phase. Enterprise-level stores that need ERP integration, dynamic pricing, and wholesale capabilities should look at Pro. Not sure? Get a free audit and we will recommend the right tier.',
  },
  {
    q: 'What payment processors do you integrate with?',
    a: 'We integrate with all major Australian payment gateways including Stripe, Square, PayPal, Afterpay, Zip Pay, and direct bank transfers. We also handle multi-currency setups for stores selling internationally.',
  },
  {
    q: 'How long does it take to build an e-commerce store?',
    a: 'A standard custom store with product catalogue, checkout, and payment processing can be live in under 3 days. More complex builds with AI recommendations, inventory sync, and custom automation typically take 5-10 days.',
  },
  {
    q: 'What are the ongoing costs after launch?',
    a: 'Hosting for a custom store typically runs $20-50/month depending on traffic. There are no Stackmate lock-in fees or recurring platform charges. We offer optional maintenance and support plans if you want ongoing optimisation.',
  },
  {
    q: 'Will my store be optimised for SEO?',
    a: 'Every store we build ships with technical SEO baked in from day one: server-side rendering, structured product data, optimised meta tags, image compression, clean URL structures, and mobile-first design.',
  },
];

/* ── Page ── */

export default function EcommercePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'E-Commerce Packages — Custom Stores & Automation',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'State', name: 'Western Australia' },
        description: 'E-commerce packages for Perth businesses — from custom Shopify stores to enterprise platforms with AI recommendations, inventory sync, and ERP integration.',
        serviceType: 'E-Commerce Development',
      }) }} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Packages for E-Commerce</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Choose the right package for your online store
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Whether you are launching your first store or scaling an enterprise operation, we have a package built for where your business is today. Custom stores, AI-powered selling, and automation that runs while you sleep. No lock-in contracts. No template compromises.
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

      {/* ===== PACKAGE CARDS ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">Our Packages</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Three tiers. One goal. More sales, less friction.
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Every package is quote-based and tailored to your store. Pick the tier that matches your stage of growth, and we will build it to spec.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <StaggerItem
                key={pkg.tier}
                index={i}
                className={`${pkg.highlight ? 'shimmer-border' : 'shimmer-border-subtle'} border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 flex flex-col`}
              >
                <h3 className="text-2xl font-display font-bold">{pkg.tier}</h3>
                <p className="text-sm text-sm-muted mb-6">({pkg.subtitle})</p>
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
                    pkg.highlight
                      ? 'bg-sm-accent text-black hover:bg-sm-accent-light'
                      : 'border border-sm-border text-white hover:bg-white/5'
                  }`}
                >
                  Get a Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CUSTOM SECTION ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-surface/20 text-center">
              <p className="eyebrow mb-4">Custom Builds</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Need something different? We build custom.
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                If none of the packages above fit your situation, we can scope a custom solution from scratch. Complex product configurators, headless multi-storefront architectures, bespoke marketplace integrations — whatever your store needs, we will build it.
              </p>
              <a
                href="/packages/custom"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
              >
                EXPLORE CUSTOM BUILDS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PAIN POINTS ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Why most Perth e-commerce stores underperform
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <StaggerItem key={point.title} index={i} className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20">
                <point.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">{point.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{point.desc}</p>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Common questions about e-commerce packages
            </h2>
          </AnimatedSection>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q}>
                <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-sm-surface/20">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-display font-bold text-lg">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-sm-muted shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-6 text-sm text-sm-muted leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FREE AUDIT CTA ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
              <p className="eyebrow mb-4">Free Audit</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Not sure which package you need?
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                We will audit your current store, show you exactly where you are losing sales, and recommend the right package to fix it. No cost, no obligation.
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

      {/* ===== FINAL CTA ===== */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to sell more with less effort?
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              Tell us about your store and we will match you with the right package. Most builds are live within days, not months.
            </p>
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
            >
              GET A QUOTE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
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
