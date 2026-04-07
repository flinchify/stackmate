'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Clock, Package, Globe, Zap, MessageSquare, BarChart3, ChevronDown, MapPin, ArrowRight, CheckCircle2, CreditCard, Search, TrendingUp, Truck } from 'lucide-react';
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

const CAPABILITIES = [
  {
    icon: Globe,
    title: 'Custom storefront',
    desc: 'Headless or full-stack e-commerce built from scratch. No templates, no compromises. Designed to convert and built to scale.',
  },
  {
    icon: Zap,
    title: 'AI product recommendation engine',
    desc: 'Machine learning that analyses browsing behaviour and purchase history to surface the right products at the right time.',
  },
  {
    icon: MessageSquare,
    title: 'Abandoned cart recovery automation',
    desc: 'Multi-channel recovery flows across email, SMS, and retargeting that bring customers back and close the sale.',
  },
  {
    icon: Package,
    title: 'Inventory sync across channels',
    desc: 'Real-time stock synchronisation between your online store, marketplaces, POS, and warehouse. One source of truth.',
  },
  {
    icon: BarChart3,
    title: 'Customer analytics dashboard',
    desc: 'Live dashboards tracking revenue, conversion rates, customer lifetime value, and product performance in one place.',
  },
  {
    icon: TrendingUp,
    title: 'Automated email marketing flows',
    desc: 'Welcome sequences, post-purchase nurture, win-back campaigns, and VIP segmentation that run on autopilot.',
  },
];

const STATS = [
  { value: '35+', label: 'E-commerce stores built' },
  { value: '2.4x', label: 'Average revenue increase post-launch' },
  { value: '< 3 days', label: 'Typical store build time' },
  { value: '67%', label: 'Average cart recovery rate' },
];

const FAQS = [
  {
    q: 'Should I use Shopify or a custom-built store?',
    a: 'It depends on your goals. Shopify is great for getting started quickly, but custom stores give you full control over design, performance, and integrations. If you need AI-powered features, complex product logic, or integrations with Australian systems like Xero and Australia Post, a custom build is almost always the better long-term investment. We build both and can advise based on your specific situation.',
  },
  {
    q: 'What payment processors do you integrate with?',
    a: 'We integrate with all major Australian payment gateways including Stripe, Square, PayPal, Afterpay, Zip Pay, and direct bank transfers. We also handle multi-currency setups for stores selling internationally and can integrate with your existing EFTPOS or POS system for unified reporting.',
  },
  {
    q: 'How long does it take to build an e-commerce store?',
    a: 'A standard custom store with product catalogue, checkout, and payment processing can be live in under 3 days. More complex builds with AI recommendations, inventory sync across multiple channels, and custom automation flows typically take 5-10 days. Either way, we move significantly faster than traditional agencies.',
  },
  {
    q: 'What are the ongoing costs after launch?',
    a: 'Hosting for a custom store typically runs $20-50/month depending on traffic. There are no Stackmate lock-in fees or recurring platform charges. Payment processing fees are set by your gateway provider (usually 1.5-2.9% per transaction). We offer optional maintenance and support plans if you want ongoing optimisation and updates.',
  },
  {
    q: 'Will my store be optimised for SEO?',
    a: 'Every store we build ships with technical SEO baked in from day one: server-side rendering for fast crawlability, structured product data (schema markup), optimised meta tags, image compression, clean URL structures, and mobile-first design. We also set up Google Merchant Centre integration and product feed automation so your products appear in Google Shopping results.',
  },
];

/* ── Page ── */

export default function EcommercePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* JSON-LD Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'E-Commerce Development',
        description: 'Custom e-commerce stores, AI-powered product recommendations, and automated inventory systems for Perth businesses.',
        provider: {
          '@type': 'Organization',
          name: 'Stackmate',
          url: 'https://stackmate.digital',
          areaServed: {
            '@type': 'Place',
            name: 'Perth, Western Australia',
          },
        },
        serviceType: 'E-Commerce Development',
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: { '@type': 'GeoCoordinates', latitude: -31.9505, longitude: 115.8605 },
          geoRadius: '50000',
        },
      }) }} />

      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">E-Commerce</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            An online store that sells while you sleep
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            Perth businesses deserve more than a templated storefront with a &ldquo;buy now&rdquo; button. We build custom e-commerce systems with AI-powered product recommendations, automated inventory management, and checkout flows engineered to convert. Your store works harder than you do.
          </p>
        </motion.div>
      </section>

      {/* ====== PAIN POINTS ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            Why most Perth e-commerce stores underperform
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <StaggerItem key={point.title} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full">
                <point.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-lg font-display font-bold mb-2">{point.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{point.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== WHAT WE BUILD ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">What We Build</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            E-commerce systems that think, sell, and scale
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <StaggerItem key={cap.title} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full hover:border-sm-accent/20 transition-all duration-300">
                <cap.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-lg font-display font-bold mb-2">{cap.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{cap.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">Results</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            Numbers that speak for themselves
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StaggerItem key={stat.label} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-sm-accent mb-2">{stat.value}</div>
                <div className="text-sm text-sm-muted">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-center mb-12">
            Common questions
          </h2>
        </AnimatedSection>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }} />

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <StaggerItem key={faq.q} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-sm-surface/20 transition-all duration-200"
                >
                  <span className="font-display font-semibold text-lg pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-sm-muted transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm text-sm-muted leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== FREE AUDIT CTA ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="shimmer-border-subtle border border-white/[0.06] rounded-2xl p-12 bg-sm-accent/5 text-center">
            <p className="eyebrow mb-6">Free Audit</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              Not sure where to start with e-commerce?
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-8">
              We&apos;ll audit your current online presence and show you exactly where you&apos;re losing sales, what to automate, and how to build a store that actually converts. Free, no obligation.
            </p>
            <a
              href="/audit"
              className="inline-block px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              GET YOUR FREE E-COMMERCE AUDIT
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-8">
            Ready to sell more with less effort?
          </h2>
          <button
            onClick={() => setQuoteOpen(true)}
            className="px-10 py-5 bg-sm-accent text-sm-bg font-mono text-lg uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
          >
            GET YOUR FREE QUOTE
          </button>
        </AnimatedSection>
      </section>

      {/* ====== FOOTER ====== */}
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
