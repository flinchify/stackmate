'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Building2, FileText, Users, Globe, BarChart3, CheckCircle2, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

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

const PACKAGES = [
  {
    tier: 'Starter',
    subtitle: 'Corporate Starter',
    features: [
      'Professional corporate website',
      'Trust/about pages',
      'Team profiles',
      'Contact system',
      'Basic SEO',
      'Maintenance',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    subtitle: 'Corporate Growth',
    features: [
      'Everything in Starter',
      'Content marketing structure',
      'Case studies',
      'Stronger SEO/GEO',
      'Monthly optimization',
      'Analytics',
    ],
    highlight: false,
  },
  {
    tier: 'Pro',
    subtitle: 'Corporate Pro',
    features: [
      'Everything in Growth',
      'Custom internal tools',
      'Client portal',
      'Advanced analytics',
      'AI automation',
      'Full SEO/GEO program',
    ],
    highlight: true,
  },
];

const PAIN_POINTS = [
  {
    icon: Globe,
    title: 'Outdated website eroding trust',
    desc: 'Your website is the first impression for clients, partners, and recruits. An outdated site signals an outdated business. If your competitors look more professional online, you are losing opportunities before the first meeting.',
  },
  {
    icon: FileText,
    title: 'No content strategy driving inbound',
    desc: 'Without structured case studies, thought leadership, and SEO-optimised content, your website is a digital brochure that generates no leads. Your competitors are ranking for the keywords your clients are searching.',
  },
  {
    icon: Users,
    title: 'Manual processes slowing the team',
    desc: 'Client onboarding, reporting, and internal workflows still running on email chains and shared drives. Every manual touchpoint is a bottleneck that scales linearly with headcount.',
  },
  {
    icon: BarChart3,
    title: 'No visibility into what is working',
    desc: 'Without proper analytics and attribution, marketing spend is a guess. You cannot optimise what you cannot measure, and most corporate websites have zero conversion tracking.',
  },
];

const FAQS = [
  {
    q: 'Which package is right for my business?',
    a: 'If you need a professional corporate web presence with team profiles and a contact system, Starter covers the essentials. If you are ready to invest in content marketing, case studies, and SEO, Growth will drive inbound leads. If you need custom internal tools, client portals, and AI automation, Pro is the right fit. Not sure? Get a free audit and we will recommend the right tier.',
  },
  {
    q: 'How long does it take to deliver?',
    a: 'Most corporate websites are live within 1-2 weeks. Larger builds with custom portals, internal tools, and AI integrations typically take 2-4 weeks depending on scope.',
  },
  {
    q: 'Can you integrate with our existing systems?',
    a: 'Yes. We integrate with CRMs, ERPs, project management tools, and internal systems. Whether you use Salesforce, HubSpot, or custom infrastructure, we build around your existing stack.',
  },
  {
    q: 'What does ongoing support include?',
    a: 'Every build includes 30 days of support. After that, monthly plans cover hosting, maintenance, content updates, SEO/GEO optimization, analytics reporting, and priority support.',
  },
  {
    q: 'Do you work with businesses outside Perth?',
    a: 'Yes. While we are based in Perth, we work with corporate clients across Australia. All communication and delivery is remote-friendly.',
  },
];

function formatPrice(cents: number): string {
  return 'A$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CorporatePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [apiPackages, setApiPackages] = useState<{ tier: string; tierLabel: string; upfrontPrice: number; monthlyPrice: number; features: string[] }[]>([]);

  useEffect(() => {
    fetch('/api/packages?industry=corporate').then(r => r.json()).then(d => setApiPackages(d.packages || [])).catch(() => {});
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Corporate Packages -- Websites, Portals & AI Automation',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'Country', name: 'Australia' },
        description: 'Corporate web development packages -- from professional websites to custom portals, AI automation, and full SEO/GEO programs.',
        serviceType: 'Corporate Web Development',
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Packages for Corporate</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Choose the right package for your business
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            From professional corporate websites to full-stack digital infrastructure with AI automation, client portals, and content marketing systems. Built for Australian businesses that need to look and operate at the level they compete.
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
              Three tiers. One goal. Professional digital infrastructure.
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Every package is quote-based and tailored to your business. Pick the tier that fits your stage and goals, and we will build it to spec.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => {
              const apiPkg = apiPackages.find(a => a.tier === pkg.tier.toLowerCase());
              const features = apiPkg ? apiPkg.features : pkg.features;
              return (
                <StaggerItem
                  key={pkg.tier}
                  index={i}
                  className={`${pkg.highlight ? 'shimmer-border' : 'shimmer-border-subtle'} border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 flex flex-col`}
                >
                  <h3 className="text-2xl font-display font-bold">{pkg.tier}</h3>
                  <p className="text-sm text-sm-muted mb-2">({apiPkg ? apiPkg.tierLabel : pkg.subtitle})</p>
                  {apiPkg && (
                    <div className="mb-4">
                      <p className="text-xl font-display font-bold text-sm-accent">From {formatPrice(apiPkg.upfrontPrice)}</p>
                      <p className="text-sm text-sm-muted">{formatPrice(apiPkg.monthlyPrice)}/mo</p>
                    </div>
                  )}
                  <div className="space-y-3 flex-1">
                    {features.map((feature) => (
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
              );
            })}
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
                If none of the packages above fit your requirements, we can scope a custom solution from scratch. Enterprise integrations, bespoke internal tools, complex automation workflows -- whatever your business needs, we will build it.
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
              Your digital presence should match your ambition
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
              Common questions about corporate packages
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
                We will audit your current digital presence, identify gaps and opportunities, and recommend the right package for your business. No cost, no obligation.
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
              Ready to upgrade your digital infrastructure?
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              Tell us about your business and we will match you with the right package. Most corporate websites are live within two weeks.
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
