'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HardHat, Clock, Shield, Globe, Zap, BarChart3, ChevronDown, MapPin, ArrowRight, CheckCircle2, AlertTriangle, FileText, Radio, Activity } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Spreadsheet-based safety reporting',
    desc: 'Manual incident tracking in spreadsheets creates audit risk, delays corrective actions, and means critical safety data sits in someone\'s inbox instead of a centralised system. When DMIRS comes knocking, you need answers in minutes, not days.',
  },
  {
    icon: Activity,
    title: 'No real-time visibility across sites',
    desc: 'Operational decisions are being made on yesterday\'s data. Production figures, equipment status, and workforce allocation are collated manually and reported hours or days after the fact. By the time you see the numbers, the shift is already over.',
  },
  {
    icon: Clock,
    title: 'Compliance paperwork consuming supervisor hours',
    desc: 'Your supervisors are spending more time filling out forms than managing operations. Pre-start checklists, hazard reports, and compliance documentation eat into productive hours every single shift.',
  },
  {
    icon: AlertTriangle,
    title: 'Siloed systems that don\'t talk to each other',
    desc: 'Fleet management in one system, safety in another, production in a third. No unified operational view means no one has the full picture. Data gets re-entered, errors compound, and reporting takes forever.',
  },
];

const DELIVERABLES = [
  {
    icon: BarChart3,
    title: 'Real-time operational dashboards',
    desc: 'Live production, safety, and equipment data visualised in custom dashboards accessible from the pit to the boardroom. Built for the metrics that matter to your operation.',
  },
  {
    icon: Shield,
    title: 'Automated safety incident reporting',
    desc: 'Digital incident capture with automated workflows for investigation, corrective actions, and regulatory notifications. Eliminate paper-based reporting and ensure nothing falls through the cracks.',
  },
  {
    icon: FileText,
    title: 'Compliance document automation',
    desc: 'Automated generation and management of compliance documentation, pre-start checklists, and regulatory submissions. Always audit-ready, always up to date.',
  },
  {
    icon: Radio,
    title: 'Fleet and asset tracking integration',
    desc: 'Unified view of fleet utilisation, maintenance schedules, and asset location. Integrates with existing telematics and GPS systems to give you one source of truth.',
  },
  {
    icon: Zap,
    title: 'AI-powered anomaly detection',
    desc: 'Machine learning models that flag operational anomalies, predict equipment failures, and identify safety risks before they become incidents. Proactive, not reactive.',
  },
  {
    icon: Globe,
    title: 'Shift handover and communication systems',
    desc: 'Digital shift handover tools that ensure critical information transfers cleanly between crews. Structured handover logs, action tracking, and real-time communication across remote sites.',
  },
];

const STATS = [
  { value: '15+', label: 'WA mining and resources clients' },
  { value: '70%', label: 'Reduction in compliance admin time' },
  { value: 'Real-time', label: 'Operational data across all sites' },
  { value: '< 1 week', label: 'Dashboard deployment time' },
];

const FAQS = [
  {
    q: 'How do you handle data security for mining operations?',
    a: 'All systems are built with enterprise-grade security as standard. Data is encrypted at rest and in transit, access is role-based with full audit logging, and we can deploy on-premises or in private cloud environments to meet your security policies. We work within your existing IT governance frameworks and can provide full security documentation for your compliance team.',
  },
  {
    q: 'Can you integrate with our existing systems like SAP or Pronto?',
    a: 'Yes. We build custom integrations with SAP, Pronto, Ellipse, and other enterprise systems commonly used in WA mining. Our approach is to work with your existing infrastructure, not replace it. We connect your systems so data flows automatically and you get a unified view without ripping out what already works.',
  },
  {
    q: 'How do you deploy to remote and regional sites?',
    a: 'We design for the realities of remote operations. Dashboards work on low-bandwidth connections, offline-capable mobile apps ensure data capture continues without connectivity, and we handle deployment to site-based infrastructure. We have deployed systems across the Pilbara, Goldfields, and Mid West regions.',
  },
  {
    q: 'What compliance standards do your systems support?',
    a: 'Our systems are built to support WA Mine Safety and Inspection Act requirements, DMIRS reporting obligations, and ISO 45001 safety management standards. We work with your safety and compliance teams to ensure every workflow aligns with your regulatory obligations and internal policies.',
  },
  {
    q: 'What does ongoing support look like?',
    a: 'Every deployment includes 30 days of full support. After that, we offer monthly support plans that cover system maintenance, updates, user training, and priority response for operational issues. We understand that mining runs around the clock, so our support is structured to match your operational tempo.',
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
        name: 'Operational Dashboards & Safety Automation for WA Mining',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'State', name: 'Western Australia' },
        description: 'Custom operational dashboards, safety compliance automation, and AI-powered reporting for Western Australian mining companies.',
        serviceType: 'Mining Technology and Automation',
      }) }} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Mining &amp; Resources</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Operational visibility from the pit to the boardroom
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Western Australian mining operations need more than spreadsheets and end-of-shift reports. We build real-time operational dashboards, safety compliance automation, and AI-powered reporting systems that give you complete visibility across every site, every shift, every day.
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

      {/* ===== PAIN POINTS ===== */}
      <section className="py-24">
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

      {/* ===== WHAT WE BUILD ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">What We Build</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Purpose-built systems for mining operations
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Not generic enterprise software. Not off-the-shelf dashboards. Custom systems engineered for the realities of Western Australian mining -- remote sites, harsh conditions, and zero tolerance for downtime.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DELIVERABLES.map((item, i) => (
              <StaggerItem key={item.title} index={i} className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20">
                <item.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-lg font-display font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">Results</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Measurable impact on mining operations
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StaggerItem key={stat.label} index={i} className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-sm-accent mb-2">{stat.value}</p>
                <p className="text-sm text-sm-muted">{stat.label}</p>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-sm-card/20">
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
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
              <p className="eyebrow mb-4">Free Audit</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Find out where your operation is losing visibility
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                We will audit your current operational systems, identify where data gaps and manual processes are costing you time and money, and deliver a clear roadmap for modernisation. No cost, no obligation.
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
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to modernise your mining operations?
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              Tell us about your operation and we will show you exactly what we can build. Most dashboards are deployed within a week.
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
