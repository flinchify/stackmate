'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Globe, Zap, MessageSquare, BarChart3, Link, Shield, ArrowRight, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const CAPABILITIES = [
  {
    icon: Globe,
    title: 'Custom Websites',
    desc: 'Bespoke websites designed and built for your specific industry, brand, and customer base.',
  },
  {
    icon: Zap,
    title: 'Business Automation',
    desc: 'Automate repetitive tasks, workflows, and processes that consume your team\'s time.',
  },
  {
    icon: MessageSquare,
    title: 'AI Agents and Chatbots',
    desc: 'AI-powered assistants that handle customer enquiries, bookings, and support around the clock.',
  },
  {
    icon: BarChart3,
    title: 'Dashboards and Reporting',
    desc: 'Real-time dashboards that give you visibility into every part of your operation.',
  },
  {
    icon: Link,
    title: 'System Integrations',
    desc: 'Connect your existing tools and platforms so data flows automatically between systems.',
  },
  {
    icon: Shield,
    title: 'Compliance and Security',
    desc: 'Systems built with Australian privacy law, industry regulations, and enterprise security standards in mind.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Tell us what you need',
    desc: 'Get in touch with a brief description of your business and what you are looking to build. We respond within 24 hours.',
  },
  {
    number: '02',
    title: 'We scope and quote',
    desc: 'We will put together a detailed proposal with fixed pricing, clear deliverables, and a realistic timeline. No surprises.',
  },
  {
    number: '03',
    title: 'We build and launch',
    desc: 'We build your system, test it thoroughly, and deploy it. Most projects are live within one to two weeks.',
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

export default function CustomPackagePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Custom Packages — Bespoke Business Systems',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'State', name: 'Western Australia' },
        description: 'Custom-built websites, automation, AI agents, dashboards, integrations, and compliance systems designed for any industry.',
        serviceType: 'Custom Software Development and Business Automation',
      }) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Custom Package</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            We build systems for any industry
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Your business does not fit neatly into a category. That is fine. Tell us what you need and we will design a system built around your workflows, your customers, and your goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
            >
              GET A QUOTE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/audit"
              className="group inline-flex items-center gap-2 px-8 py-4 border border-sm-border text-white font-display font-bold rounded-xl transition-all hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]"
            >
              FREE AUDIT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ===== WHAT WE CAN BUILD ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What we can build
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Every project is different. Here is a sample of what we deliver for businesses across industries.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <StaggerItem key={cap.title} index={i} className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20">
                <cap.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">{cap.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{cap.desc}</p>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="eyebrow mb-4">Process</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              How it works
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <StaggerItem key={step.number} index={i} className="text-center md:text-left">
                <span className="inline-block text-5xl font-display font-bold text-sm-accent mb-4">{step.number}</span>
                <h3 className="text-xl font-display font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{step.desc}</p>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-10 md:p-14 bg-sm-accent/5 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to build something?
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                Tell us about your business and what you need. We will come back with a plan, a price, and a timeline.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-black font-display font-bold rounded-xl transition-all hover:bg-sm-accent-light hover:scale-[1.03] active:scale-[0.98]"
                >
                  GET A QUOTE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="/audit"
                  className="group inline-flex items-center gap-2 px-8 py-4 border border-sm-border text-white font-display font-bold rounded-xl transition-all hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]"
                >
                  FREE AUDIT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <a href="/packages" className="text-sm text-sm-muted hover:text-sm-accent transition-colors">
                Or browse our industry-specific packages
              </a>
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
