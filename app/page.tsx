'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare,
  ArrowRight, Zap, Shield, Clock,
  CheckCircle2, X as XIcon,
  MapPin, ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import Counter from '@/components/Counter';
import LogoMarquee from '@/components/LogoMarquee';
import ClientLogoStrip from '@/components/ClientLogoStrip';
import dynamic from 'next/dynamic';
const MatrixBg = dynamic(() => import('@/components/MatrixBg'), { ssr: false });

/* ─── DATA ─── */

const INTEGRATIONS_ROW1 = [
  { name: 'Stripe', icon: 'stripe' },
  { name: 'Xero', icon: 'xero' },
  { name: 'HubSpot', icon: 'hubspot' },
  { name: 'Salesforce', icon: 'salesforce' },
  { name: 'Slack', icon: 'slack' },
  { name: 'Google', icon: 'google' },
  { name: 'Microsoft', icon: 'microsoft' },
  { name: 'Zapier', icon: 'zapier' },
  { name: 'Shopify', icon: 'shopify' },
  { name: 'Square', icon: 'square' },
  { name: 'Twilio', icon: 'twilio' },
  { name: 'AWS', icon: 'amazonaws' },
];

const INTEGRATIONS_ROW2 = [
  { name: 'Vercel', icon: 'vercel' },
  { name: 'OpenAI', icon: 'openai' },
  { name: 'Anthropic', icon: 'anthropic' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Cloudflare', icon: 'cloudflare' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Notion', icon: 'notion' },
  { name: 'Airtable', icon: 'airtable' },
  { name: 'Intercom', icon: 'intercom' },
  { name: 'Mailchimp', icon: 'mailchimp' },
];

const SERVICES = [
  { icon: Bot, title: 'AI Agents & Chatbots', desc: 'Custom AI agents that handle customer support, lead qualification, and internal operations 24/7.', large: true },
  { icon: Workflow, title: 'Business Automation', desc: 'Eliminate manual processes. Automate invoicing, scheduling, reporting, and workflows end-to-end.', large: true },
  { icon: Code2, title: 'Custom Software', desc: 'Bespoke applications built for your exact needs. Dashboards, portals, internal tools, and more.', large: false },
  { icon: Globe, title: 'Websites & Web Apps', desc: 'Lightning-fast, conversion-optimized websites that make your business look as good as it runs.', large: false },
  { icon: Link2, title: 'System Integrations', desc: 'Connect your CRM, ERP, accounting, and tools into one unified system. No more copy-pasting.', large: false },
  { icon: Palette, title: 'Branding & Design', desc: 'Logos, brand identity, and design systems that make your business unmistakable.', large: false },
  { icon: BarChart3, title: 'Data & Analytics', desc: 'Turn your business data into decisions. Custom dashboards, reporting, and AI-powered insights.', large: false },
  { icon: MessageSquare, title: 'AI Consulting', desc: 'Not sure where AI fits? We\'ll audit your operations and show you exactly where to automate.', large: false },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Get a Quote', desc: '60-second form. Tell us what you need, we scope it same day.' },
  { num: '02', title: 'Strategy Call', desc: 'We dive deep into your operations. Map every workflow. Find every bottleneck.' },
  { num: '03', title: 'Build Sprint', desc: '1-2 day rapid builds. You see progress in hours, not weeks.' },
  { num: '04', title: 'Launch & Scale', desc: 'Go live with confidence. We monitor, optimize, and scale with you.' },
];

const COMPETITORS = [
  { name: 'Traditional Agency', delivery: '8-12 weeks', ai: false, perth: 'Sometimes', support: 'Email only', price: '$$$' },
  { name: 'Freelancer', delivery: '4-8 weeks', ai: false, perth: 'Rarely', support: 'Limited', price: '$$' },
  { name: 'Offshore Team', delivery: '6-10 weeks', ai: false, perth: 'Never', support: 'Timezone issues', price: '$' },
];

const STACKMATE = { name: 'Stackmate', delivery: '1-2 days', ai: true, perth: 'Always', support: '24/7 + AI', price: 'Fair' };

const INDUSTRIES = [
  {
    title: 'Mining & Resources',
    desc: 'Fleet tracking, safety compliance, automated reporting, and operational dashboards built for WA mining operations.',
    highlights: ['Safety compliance automation', 'Fleet & asset tracking', 'Real-time operational dashboards'],
  },
  {
    title: 'Local Businesses',
    desc: 'Booking systems, AI receptionists, automated marketing, and customer management that runs itself.',
    highlights: ['AI phone & chat agents', 'Automated booking & invoicing', 'Customer lifecycle management'],
  },
  {
    title: 'Agencies & Enterprises',
    desc: 'White-label tools, client portals, workflow automation, and data pipelines that scale with you.',
    highlights: ['White-label platforms', 'Client reporting portals', 'Multi-team workflow automation'],
  },
];

const DELIVERABLES = [
  'Custom-designed logos and brand identity',
  'AI agents that handle calls, chats, and emails',
  'Backend automation workflows',
  'Admin dashboards and analytics',
  'Payment systems and invoicing',
  'CRM and client management tools',
  'API integrations with existing systems',
  'Mobile-responsive web applications',
];

const FAQS = [
  { q: 'How fast does Stackmate deliver projects?', a: 'Most projects are delivered within 1-2 business days. We use AI-accelerated development to build 10x faster than traditional agencies.' },
  { q: 'What industries does Stackmate work with?', a: 'We work with mining and resources companies, local businesses (trades, hospitality, retail), agencies, and enterprises across Western Australia and beyond.' },
  { q: 'Is Stackmate based in Perth?', a: 'Yes. Stackmate is based in Perth, Western Australia. We offer in-person meetings, same-timezone support, and deep understanding of WA business and mining regulations.' },
  { q: 'What does the free AI audit include?', a: 'Our free AI audit includes an operations scan, AI opportunity map, ROI projection, and a prioritised action plan showing exactly where automation can save your business time and money. We respond within 48 hours.' },
  { q: 'Do I own the code Stackmate builds?', a: 'Yes. Upon full payment, you own 100% of the code, designs, and systems we build. No lock-in, no proprietary platforms. Everything is yours.' },
  { q: 'What technologies does Stackmate use?', a: 'We build with Next.js, React, TypeScript, Node.js, PostgreSQL, and integrate with Stripe, Xero, HubSpot, OpenAI, and 100+ other platforms. Modern stack, no legacy tech.' },
];

/* ─── UTILITY COMPONENTS ─── */

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return (
    <p className="text-xs font-body uppercase tracking-[0.2em] text-sm-muted mb-5">{text}</p>
  );
}

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <StaggerItem index={index}>
      <div
        className={`rounded-xl border transition-all duration-300 ${
          open
            ? 'border-amber-500/20 bg-white/[0.02]'
            : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1]'
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <span className="font-display font-semibold text-white pr-4">{faq.q}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`shrink-0 ${open ? 'text-amber-500' : 'text-sm-subtle'}`}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </button>
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-sm-muted leading-relaxed">{faq.a}</p>
        </motion.div>
      </div>
    </StaggerItem>
  );
}

/* ─── MAIN PAGE ─── */

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const heroWords = 'We build systems that run your business.'.split(' ');

  return (
    <main className="relative bg-sm-bg min-h-screen">
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ════════════════════ HERO ════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Background orbs */}
        <motion.div
          className="orb orb-amber w-[600px] h-[600px] top-[10%] left-[15%] opacity-60"
          style={{ y: orb1Y }}
        />
        <motion.div
          className="orb orb-amber w-[500px] h-[500px] bottom-[10%] right-[10%] opacity-40"
          style={{ y: orb2Y }}
        />
        <div className="orb orb-white w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20"
          style={{ y: heroY }}
        >
          {/* Headline — word by word stagger */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display font-bold tracking-[-0.04em] leading-[1.05]">
              {heroWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Subline */}
          <motion.p
            className="text-lg md:text-xl text-sm-muted max-w-2xl mx-auto mb-14 leading-relaxed font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            AI agents. Custom software. Full business automation. Delivered in 1-2 days, not months. Perth&apos;s fastest systems integrator.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold text-lg rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
            >
              <span className="flex items-center gap-2">
                Get a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
            <a
              href="/audit"
              className="px-8 py-4 border border-white/[0.12] text-white/80 font-display font-semibold text-lg rounded-lg hover:border-amber-500/30 hover:text-white hover:bg-white/[0.02] transition-all duration-300"
            >
              Free AI Audit
            </a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-body">1-2 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-500/70" />
              <span className="text-sm font-body">Perth Based</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500/70" />
              <span className="text-sm font-body">24/7 Support</span>
            </div>
          </motion.div>

          {/* Client logos */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.1 }}
          >
            <p className="text-xs font-body text-sm-subtle uppercase tracking-[0.2em] mb-5">Trusted by</p>
            <ClientLogoStrip />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ════════════════════ STATS BAR ════════════════════ */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedSection>
            <div className="text-4xl md:text-5xl font-display font-bold text-white">
              <span aria-label="50+ projects delivered"><Counter target={50} suffix="+" /></span>
            </div>
            <p className="text-sm text-sm-muted mt-2 font-body">Projects Delivered</p>
            <noscript><span>50+</span></noscript>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-4xl md:text-5xl font-display font-bold text-white">
              <span aria-label="98% client satisfaction"><Counter target={98} suffix="%" /></span>
            </div>
            <p className="text-sm text-sm-muted mt-2 font-body">Client Satisfaction</p>
            <noscript><span>98%</span></noscript>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-4xl md:text-5xl font-display font-bold text-white">
              <span aria-label="10x faster than agencies"><Counter target={10} suffix="x" /></span>
            </div>
            <p className="text-sm text-sm-muted mt-2 font-body">Faster Than Agencies</p>
            <noscript><span>10x</span></noscript>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-4xl md:text-5xl font-display font-bold text-white">
              <span aria-label="24/7 support and monitoring">24/7</span>
            </div>
            <p className="text-sm text-sm-muted mt-2 font-body">Support & Monitoring</p>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════ SERVICES (Bento Grid) ════════════════════ */}
      <section id="services" className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <SectionEyebrow text="What We Build" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              Everything your business needs<br className="hidden md:block" /> to run on autopilot
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, i) => (
              <StaggerItem
                key={service.title}
                index={i}
                className={service.large ? 'lg:col-span-2' : ''}
              >
                <div className="group relative h-full p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-5 w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-sm-muted group-hover:text-amber-500 transition-colors duration-300" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-sm-muted leading-relaxed font-body">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ PROCESS (Timeline) ════════════════════ */}
      <section id="process" className="py-28 md:py-36">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <SectionEyebrow text="Our Process" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              From quote to launch<br className="hidden md:block" /> in days, not months
            </h2>
          </AnimatedSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] md:left-[43px] top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.06] via-amber-500/20 to-white/[0.06]" />

            <div className="space-y-0">
              {PROCESS_STEPS.map((step, i) => {
                return (
                  <StaggerItem key={step.num} index={i}>
                    <div className="group relative flex items-start gap-6 md:gap-10 py-10">
                      {/* Step number circle */}
                      <div className="relative z-10 shrink-0 w-[56px] md:w-[88px] h-[56px] md:h-[88px] rounded-full border border-white/[0.06] bg-sm-bg flex items-center justify-center group-hover:border-amber-500/30 transition-all duration-300">
                        <span className="text-xl md:text-3xl font-display font-bold text-sm-subtle group-hover:text-amber-500/60 transition-colors duration-300">
                          {step.num}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="pt-2 md:pt-5">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm-muted font-body leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </div>

          <AnimatedSection className="text-center mt-16">
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════ COMPARISON (Cards) ════════════════════ */}
      <section id="compare" className="py-28 md:py-36">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <SectionEyebrow text="Why Stackmate" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              See how we stack up
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {/* Stackmate card — highlighted */}
            <AnimatedSection>
              <div className="relative p-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] amber-glow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <Image src="/logo.png" alt="" width={28} height={28} className="invert" />
                    <span className="font-display font-bold text-xl text-white">Stackmate</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Delivery</p>
                      <p className="font-semibold text-amber-500">{STACKMATE.delivery}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">AI-Powered</p>
                      <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Perth Based</p>
                      <p className="font-semibold text-amber-500">{STACKMATE.perth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Support</p>
                      <p className="font-semibold text-amber-500">{STACKMATE.support}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Pricing</p>
                      <p className="font-semibold text-amber-500">{STACKMATE.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Competitor cards — muted */}
            {COMPETITORS.map((comp, i) => (
              <StaggerItem key={comp.name} index={i}>
                <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="md:w-48 shrink-0">
                      <span className="font-display font-semibold text-sm-muted">{comp.name}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Delivery</p>
                        <p className="text-sm-muted">{comp.delivery}</p>
                      </div>
                      <div>
                        <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">AI-Powered</p>
                        <XIcon className="w-5 h-5 text-red-500/40" />
                      </div>
                      <div>
                        <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Perth Based</p>
                        <p className="text-sm-muted">{comp.perth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Support</p>
                        <p className="text-sm-muted">{comp.support}</p>
                      </div>
                      <div>
                        <p className="text-xs text-sm-subtle uppercase tracking-wider mb-1 font-body">Pricing</p>
                        <p className="text-sm-muted">{comp.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ INDUSTRIES ════════════════════ */}
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <SectionEyebrow text="Industries We Serve" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              Built for businesses that move fast
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <StaggerItem key={ind.title} index={i}>
                <div className="group h-full p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-display font-bold text-white mb-3">{ind.title}</h3>
                  <p className="text-sm text-sm-muted font-body mb-6 leading-relaxed">{ind.desc}</p>
                  <ul className="space-y-3">
                    {ind.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm text-sm-muted font-body">
                        <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ WHAT WE DELIVER ════════════════════ */}
      <section className="py-28 md:py-36">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <SectionEyebrow text="What You Get" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              Custom logos, AI agents,<br className="hidden md:block" /> backend flows. You name it.
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-3">
            {DELIVERABLES.map((item, i) => (
              <StaggerItem key={item} index={i}>
                <div className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm-muted font-body">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ THE STACKMATE EFFECT ════════════════════ */}
      <section className="py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <SectionEyebrow text="The Stackmate Effect" />
            <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.15] mb-8">
              When you become a Stackmate, you enter a new era of AI adoption and API integration.
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto font-body leading-relaxed">
              Your business stops running on manual effort and starts running on systems that think, connect, and scale without you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════ INTEGRATIONS ════════════════════ */}
      <section id="integrations" className="py-28 md:py-36 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <AnimatedSection className="text-center">
            <SectionEyebrow text="Integrations" />
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1]">
              We connect with everything<br className="hidden md:block" /> you already use
            </h2>
          </AnimatedSection>
        </div>
        <div className="space-y-4">
          <LogoMarquee items={INTEGRATIONS_ROW1} direction="left" speed={35} />
          <LogoMarquee items={INTEGRATIONS_ROW2} direction="right" speed={40} />
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section className="py-28 md:py-36">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <SectionEyebrow text="FAQ" />
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Common questions</h2>
          </AnimatedSection>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }) }} />
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FREE AUDIT CTA ════════════════════ */}
      <section className="py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gradient-border p-10 md:p-16 rounded-2xl">
            <AnimatedSection className="text-center">
              <p className="text-sm text-amber-500 uppercase tracking-[0.2em] mb-5 font-body">Free for every business</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-5">
                Not sure where AI fits?<br className="hidden sm:block" /> Get a free audit.
              </h2>
              <p className="text-sm-muted max-w-2xl mx-auto mb-10 font-body leading-relaxed">
                We&apos;ll analyse your business operations and show you exactly where AI and automation can save time, cut costs, and help you scale. No cost, no obligation.
              </p>
              <a
                href="/audit"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
              >
                Get Your Free AI Audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ════════════════════ FINAL CTA ════════════════════ */}
      <section className="py-28 md:py-36 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tight leading-[1.1] mb-6">
              Ready to build something<br className="hidden sm:block" /> that actually works?
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-10 font-body leading-relaxed">
              Get a custom quote in 60 seconds. No fluff, no sales calls unless you want one. Just tell us what you need and we&apos;ll scope it.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold text-lg rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="py-14 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stackmate" width={28} height={28} className="invert" />
              <span className="font-display font-bold text-white">stackmate</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-sm-muted font-body">
              <a href="#services" className="hover:text-white transition-colors duration-200">Services</a>
              <a href="#process" className="hover:text-white transition-colors duration-200">Process</a>
              <a href="#compare" className="hover:text-white transition-colors duration-200">Why Us</a>
              <a href="/blog" className="hover:text-white transition-colors duration-200">Blog</a>
            </nav>
            <div className="flex items-center gap-2 text-sm text-sm-subtle font-body">
              <MapPin className="w-3.5 h-3.5" />
              Perth, WA
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 pt-10 border-t border-white/[0.04]">
            <a href="/privacy" className="text-xs text-sm-subtle hover:text-sm-muted transition-colors duration-200 font-body">Privacy Policy</a>
            <a href="/terms" className="text-xs text-sm-subtle hover:text-sm-muted transition-colors duration-200 font-body">Terms of Service</a>
            <span className="text-xs text-sm-subtle font-body">&copy; {new Date().getFullYear()} Stackmate. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
