'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Home, Clock, Users, Globe, Zap, MessageSquare, BarChart3, ChevronDown, MapPin, ArrowRight, CheckCircle2, Mail, Phone, Search, Target } from 'lucide-react';
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

const SERVICES = [
  {
    icon: Home,
    title: 'Property listing websites with lead capture',
    desc: 'Dedicated single-property sites with integrated enquiry forms, click-to-call, and real-time lead notifications straight to your phone.',
  },
  {
    icon: Search,
    title: 'AI-powered property appraisal tools',
    desc: 'Embed an instant online appraisal widget on your site. Vendors enter their address, get an estimate, and you capture a qualified seller lead.',
  },
  {
    icon: MessageSquare,
    title: 'Automated email and SMS nurture sequences',
    desc: 'Drip campaigns that keep you top-of-mind with buyers, sellers, and past clients -- triggered automatically based on behaviour and lifecycle stage.',
  },
  {
    icon: Zap,
    title: 'CRM integration and pipeline automation',
    desc: 'Connect your existing CRM to every lead source. Automate task creation, status updates, and handoffs so nothing slips through the cracks.',
  },
  {
    icon: Users,
    title: 'Open home registration and follow-up systems',
    desc: 'Digital sign-in at open homes with instant SMS follow-up, feedback requests, and automatic CRM entry. No more illegible clipboards.',
  },
  {
    icon: Target,
    title: 'Market report generation and distribution',
    desc: 'Branded suburb market reports generated and sent on autopilot. Position yourself as the local expert without lifting a finger.',
  },
];

const STATS = [
  { value: '25+', label: 'Perth real estate professionals helped' },
  { value: '5x', label: 'Increase in qualified leads' },
  { value: '< 2 days', label: 'Typical build time' },
  { value: '90%', label: 'Of follow-ups automated' },
];

const FAQS = [
  {
    q: 'Will this integrate with my existing CRM and portals like REIWA or Domain?',
    a: 'Yes. We build integrations that connect with the tools you already use -- whether that is Rex, Agentbox, Eagle, or portal feeds from REIWA, Domain, and realestate.com.au. Data flows automatically so you never double-handle leads.',
  },
  {
    q: 'How much does it cost?',
    a: 'Every agency is different. A single-property listing site might start from a few hundred dollars; a full lead-capture and automation stack is a larger investment. We scope everything upfront with fixed pricing -- no hourly surprises.',
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

export default function RealEstatePage() {
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
    name: 'Real Estate Lead Capture & Automation',
    provider: {
      '@type': 'Organization',
      name: 'Stackmate',
      url: 'https://stackmate.digital',
      areaServed: { '@type': 'City', name: 'Perth', containedInPlace: { '@type': 'State', name: 'Western Australia' } },
    },
    description: 'AI-powered lead capture, nurture sequences, and automation systems for Perth real estate agents.',
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
            <p className="eyebrow mb-4">Real Estate</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
              Turn every listing into a<br />
              <span className="text-sm-accent">lead machine</span>
            </h1>
            <p className="text-lg md:text-xl text-sm-muted font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              Perth real estate agents need more than a website. You need systems that capture every enquiry, nurture leads automatically, and give you back the hours you are currently losing to admin. We build exactly that.
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

        {/* ====== WHAT WE BUILD ====== */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">What we build</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
              Systems that sell while you sleep
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <StaggerItem key={service.title} index={i}>
                <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full hover:border-sm-accent/20 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-sm-accent mb-4" />
                  <h3 className="font-display font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm-muted font-body leading-relaxed text-sm">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </section>

        {/* ====== STATS ====== */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">By the numbers</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
              Results that speak for themselves
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StaggerItem key={stat.label} index={i}>
                <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 text-center bg-sm-surface/20">
                  <div className="text-3xl md:text-4xl font-display font-bold text-sm-accent mb-2">{stat.value}</div>
                  <p className="text-sm text-sm-muted font-body">{stat.label}</p>
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

        {/* ====== FREE AUDIT CTA ====== */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="shimmer-border border border-white/[0.06] rounded-2xl p-8 text-center">
              <p className="eyebrow mb-4">Free audit</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                Find out what you are leaving on the table
              </h2>
              <p className="text-sm-muted font-body max-w-xl mx-auto mb-8 leading-relaxed">
                We will review your current digital presence, lead flow, and follow-up process -- then show you exactly where the gaps are and how to fix them. No cost, no obligation.
              </p>
              <a
                href="/audit"
                className="inline-flex items-center gap-2 bg-sm-accent hover:bg-sm-accent/90 text-sm-dark font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                FREE AUDIT <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </AnimatedSection>
        </section>

        {/* ====== FINAL CTA ====== */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6">
              Ready to close more deals<br />
              <span className="text-sm-accent">on autopilot?</span>
            </h2>
            <p className="text-lg text-sm-muted font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop losing leads to slow follow-ups and outdated tech. Let us build the systems that keep your pipeline full and your weekends free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-2 bg-sm-accent hover:bg-sm-accent/90 text-sm-dark font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="/audit"
                className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-sm-accent/40 text-sm-text font-display font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                FREE AUDIT
              </a>
            </div>
          </AnimatedSection>
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
