'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HardHat, FileText, Activity, Clock, AlertTriangle, CheckCircle2, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const PACKAGES = [
  {
    tier: 'Starter',
    subtitle: 'Small Operation',
    features: [
      'Safety compliance dashboard',
      'Incident reporting',
      'Basic fleet tracking',
      'Document management',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    subtitle: 'Mid-Size',
    features: [
      'Everything in Starter',
      'Real-time operational dashboards',
      'Automated shift reporting',
      'Equipment maintenance scheduling',
      'Environmental compliance',
    ],
    highlight: false,
  },
  {
    tier: 'Pro',
    subtitle: 'Enterprise',
    features: [
      'Everything in Growth',
      'AI predictive maintenance',
      'IoT sensor integration',
      'Multi-site command centre',
      'Regulatory automation',
      'Custom data pipelines',
    ],
    highlight: true,
  },
];

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Spreadsheet-based safety reporting',
    desc: 'Manual incident tracking in spreadsheets creates audit risk, delays corrective actions, and means critical safety data sits in someone\'s inbox instead of a centralised system.',
  },
  {
    icon: Activity,
    title: 'No real-time visibility across sites',
    desc: 'Operational decisions are being made on yesterday\'s data. Production figures, equipment status, and workforce allocation are collated manually and reported hours or days after the fact.',
  },
  {
    icon: Clock,
    title: 'Compliance paperwork consuming supervisor hours',
    desc: 'Your supervisors are spending more time filling out forms than managing operations. Pre-start checklists, hazard reports, and compliance documentation eat into productive hours every single shift.',
  },
  {
    icon: AlertTriangle,
    title: 'Siloed systems that don\'t talk to each other',
    desc: 'Fleet management in one system, safety in another, production in a third. No unified operational view means no one has the full picture.',
  },
];

const FAQS = [
  {
    q: 'Which package is right for my operation?',
    a: 'Small operations that need safety compliance and basic fleet tracking should start with Starter. Mid-size operations that need real-time dashboards, shift reporting, and maintenance scheduling will benefit from Growth. Enterprise operations requiring AI predictive maintenance, IoT integration, and multi-site command centres should look at Pro. Not sure? Get a free audit and we will recommend the right tier.',
  },
  {
    q: 'Can you integrate with our existing systems like SAP or Pronto?',
    a: 'Yes. We build custom integrations with SAP, Pronto, Ellipse, and other enterprise systems commonly used in WA mining. Our approach is to work with your existing infrastructure, not replace it.',
  },
  {
    q: 'How do you deploy to remote and regional sites?',
    a: 'We design for the realities of remote operations. Dashboards work on low-bandwidth connections, offline-capable mobile apps ensure data capture continues without connectivity, and we handle deployment to site-based infrastructure.',
  },
  {
    q: 'What compliance standards do your systems support?',
    a: 'Our systems are built to support WA Mine Safety and Inspection Act requirements, DMIRS reporting obligations, and ISO 45001 safety management standards.',
  },
  {
    q: 'What does ongoing support look like?',
    a: 'Every deployment includes 30 days of full support. After that, we offer monthly support plans that cover system maintenance, updates, user training, and priority response for operational issues.',
  },
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

export default function MiningPage() {
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
        name: 'Mining Packages — Operational Dashboards & Safety Automation',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'State', name: 'Western Australia' },
        description: 'Packages for WA mining operations — from safety compliance dashboards to enterprise AI predictive maintenance, IoT integration, and multi-site command centres.',
        serviceType: 'Mining Technology and Automation',
      }) }} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Packages for Mining</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Choose the right system for your operation
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Western Australian mining operations run on data, compliance, and uptime. Whether you are a single-site operation needing safety compliance or an enterprise running multiple sites across the Pilbara, we have a package built for your scale. No lock-in contracts. Quote-based pricing tailored to your operation.
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
              Three tiers. Built for mining.
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Every package is quote-based and scoped to your operation. Pick the tier that matches your scale and we will build it to your requirements.
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
                If none of the packages above fit your operation, we can scope a custom solution from scratch. Multi-system integrations, bespoke reporting pipelines, legacy system modernisation — whatever your operation requires, we will build it.
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
              Legacy systems are holding your operation back
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
              Common questions from mining operations
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
                Not sure which package fits your operation?
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                We will audit your current operational systems, identify where manual processes and data gaps are costing you time and compliance risk, and recommend the right package for your operation. No cost, no obligation.
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
              Ready to modernise your mining operations?
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              Tell us about your operation and we will match you with the right package. Most dashboards are deployed within a week.
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
