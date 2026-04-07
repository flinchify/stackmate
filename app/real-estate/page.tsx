'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Home, Mail, Clock, Globe, BarChart3, CheckCircle2, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

/* ------------------------------------------------------------------ */
/*  Inline animation components                                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const PACKAGES = [
  {
    tier: 'Starter',
    subtitle: 'Solo Agent',
    features: [
      'Professional agent website',
      'Property listings',
      'Lead capture forms',
      'Automated email drip campaigns',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    subtitle: 'Small Agency',
    features: [
      'Everything in Starter',
      'CRM integration',
      'AI lead qualification chatbot',
      'Automated appraisal booking',
      'Market report generation',
    ],
    highlight: false,
  },
  {
    tier: 'Pro',
    subtitle: 'Agency / Group',
    features: [
      'Everything in Growth',
      'Multi-agent portal',
      'Vendor reporting dashboards',
      'AI property matching',
      'REA/Domain API integration',
      'Commission tracking',
    ],
    highlight: true,
  },
];

const PAIN_POINTS = [
  {
    icon: Mail,
    title: 'Leads going cold in your inbox',
    desc: 'Enquiries come in at 9 pm on a Sunday and sit there until Monday arvo. No automated follow-up means warm leads turn ice-cold before you even see them.',
  },
  {
    icon: Clock,
    title: 'Hours lost on manual appraisal reports',
    desc: 'You are copy-pasting comparable sales into documents by hand, reformatting every time. No templates, no automation -- just wasted hours that could be spent listing.',
  },
  {
    icon: Globe,
    title: 'Losing listings to agents with better tech',
    desc: 'Vendors expect polished digital experiences. If your online presence looks like it was built in 2015, you are handing listings to the agent down the road.',
  },
  {
    icon: BarChart3,
    title: 'No idea which marketing actually works',
    desc: 'You spend thousands on REA, Domain, social ads, and letterbox drops but have zero attribution tracking. You cannot optimise what you cannot measure.',
  },
];

const FAQS = [
  {
    q: 'Which package is right for my agency?',
    a: 'Solo agents getting started with a professional online presence should start with Starter. Small agencies that need CRM, AI lead qualification, and automated appraisals will benefit from Growth. Larger agencies or groups that need multi-agent portals, vendor dashboards, and portal API integrations should look at Pro. Not sure? Get a free audit and we will recommend the right tier.',
  },
  {
    q: 'Will this integrate with my existing CRM and portals like REIWA or Domain?',
    a: 'Yes. We build integrations that connect with the tools you already use -- whether that is Rex, Agentbox, Eagle, or portal feeds from REIWA, Domain, and realestate.com.au.',
  },
  {
    q: 'How quickly can you deliver?',
    a: 'Most standalone builds ship in under two business days. Larger automation projects with CRM integrations and nurture sequences typically take one to two weeks from kickoff to go-live.',
  },
  {
    q: 'Is my data secure and compliant with Australian privacy law?',
    a: 'Absolutely. All data is stored in Australian-hosted infrastructure. We build with the Australian Privacy Act and APPs in mind, including proper consent handling and data retention policies.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer ongoing maintenance and optimisation plans so your systems keep performing as the market shifts. You also get direct access to our team -- no ticket queues.',
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ Item                                                          */
/* ------------------------------------------------------------------ */

function FAQItem({ faq, index }: { faq: typeof FAQS[number]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <StaggerItem index={index}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 hover:border-sm-accent/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display font-semibold text-sm-text text-lg">{faq.q}</h3>
          <ChevronDown className={`w-5 h-5 text-sm-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <p className="mt-4 text-sm-muted font-body leading-relaxed">{faq.a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </StaggerItem>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function RealEstatePackagesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Real Estate Packages -- Websites, Automation & AI',
    provider: {
      '@type': 'Organization',
      name: 'Stackmate',
      url: 'https://stackmate.digital',
      areaServed: { '@type': 'City', name: 'Perth', containedInPlace: { '@type': 'State', name: 'Western Australia' } },
    },
    description: 'Tiered packages for real estate agents and agencies -- from professional websites and lead capture to AI-powered property matching and portal API integrations.',
    serviceType: 'Technology Consulting',
    url: 'https://stackmate.digital/real-estate',
  };

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <main className="bg-sm-bg text-sm-text overflow-hidden">

        {/* ====== HERO ====== */}
        <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <p className="eyebrow mb-4">Packages for Real Estate</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
              Choose the right system<br />
              <span className="text-sm-accent">for your agency</span>
            </h1>
            <p className="text-lg md:text-xl text-sm-muted font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you are a solo agent building your first digital presence or a multi-office group that needs end-to-end automation, we have a package that fits. Pick a tier and start converting more leads today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/audit"
                className="inline-flex items-center gap-2 bg-sm-accent hover:bg-sm-accent/90 text-sm-dark font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                FREE AUDIT <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-sm-accent/40 text-sm-text font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Get a Quote
              </button>
            </div>
          </AnimatedSection>
        </section>

        {/* ====== PACKAGE CARDS ====== */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">Packages</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
              Three tiers, zero guesswork
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <StaggerItem key={pkg.tier} index={i}>
                <div
                  className={`${
                    pkg.highlight ? 'shimmer-border' : 'shimmer-border-subtle'
                  } border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 h-full flex flex-col`}
                >
                  <div className="mb-6">
                    <Home className="w-8 h-8 text-sm-accent mb-4" />
                    <h3 className="font-display font-bold text-2xl mb-1">{pkg.tier}</h3>
                    <p className="text-sm text-sm-muted font-body">{pkg.subtitle}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sm-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-sm-light font-body">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setQuoteOpen(true)}
                    className={`w-full inline-flex items-center justify-center gap-2 font-display font-bold px-6 py-3 rounded-lg transition-colors text-base ${
                      pkg.highlight
                        ? 'bg-sm-accent hover:bg-sm-accent/90 text-sm-dark'
                        : 'border border-white/[0.12] hover:border-sm-accent/40 text-sm-text'
                    }`}
                  >
                    Get a Quote <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </div>
        </section>

        {/* ====== CUSTOM SECTION ====== */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="shimmer-border border border-white/[0.06] rounded-2xl p-8 text-center">
              <p className="eyebrow mb-4">Custom builds</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                Need something different? We build custom.
              </h2>
              <p className="text-sm-muted font-body max-w-xl mx-auto mb-8 leading-relaxed">
                If none of the tiers above fit your workflow, we will scope a solution from scratch. Tell us what you need and we will design a system around the way your agency actually operates.
              </p>
              <a
                href="/packages/custom"
                className="inline-flex items-center gap-2 bg-sm-accent hover:bg-sm-accent/90 text-sm-dark font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Explore Custom Builds <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </AnimatedSection>
        </section>

        {/* ====== PAIN POINTS ====== */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">Sound familiar?</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
              The problems costing you listings
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {PAIN_POINTS.map((item, i) => (
              <StaggerItem key={item.title} index={i}>
                <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full">
                  <item.icon className="w-8 h-8 text-sm-accent mb-4" />
                  <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-sm-muted font-body leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
              Common questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </section>

      </main>

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
    </>
  );
}
