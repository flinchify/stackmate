'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare,
  ArrowRight, Zap, Shield, Clock,
  ChevronRight, CheckCircle2, X as XIcon,
  MapPin, ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import Counter from '@/components/Counter';
import LogoMarquee from '@/components/LogoMarquee';
import ClientLogoStrip from '@/components/ClientLogoStrip';
import dynamic from 'next/dynamic';
const MatrixBg = dynamic(() => import('@/components/MatrixBg'), { ssr: false });

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

const SERVICES: { icon: typeof Bot; title: string; desc: string; span?: string }[] = [
  { icon: Bot, title: 'AI Agents & Chatbots', desc: 'Custom AI agents that handle customer support, lead qualification, and internal operations 24/7.', span: 'md:col-span-2 md:row-span-2' },
  { icon: Workflow, title: 'Business Automation', desc: 'Eliminate manual processes. Automate invoicing, scheduling, reporting, and workflows end-to-end.', span: 'md:row-span-2' },
  { icon: Code2, title: 'Custom Software', desc: 'Bespoke applications built for your exact needs. Dashboards, portals, internal tools, and more.' },
  { icon: Globe, title: 'Websites & Web Apps', desc: 'Lightning-fast, conversion-optimized websites that make your business look as good as it runs.' },
  { icon: Link2, title: 'System Integrations', desc: 'Connect your CRM, ERP, accounting, and tools into one unified system. No more copy-pasting.', span: 'md:col-span-2' },
  { icon: Palette, title: 'Branding & Design', desc: 'Logos, brand identity, and design systems that make your business unmistakable.' },
  { icon: BarChart3, title: 'Data & Analytics', desc: 'Turn your business data into decisions. Custom dashboards, reporting, and AI-powered insights.' },
  { icon: MessageSquare, title: 'AI Consulting', desc: 'Not sure where AI fits? We\'ll audit your operations and show you exactly where to automate.' },
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

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div className={`rounded-2xl border transition-all duration-300 ${
        open ? 'glass border-sm-accent/20' : 'glass hover:border-white/[0.12]'
      }`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <span className="font-display font-semibold text-sm-text pr-4">{faq.q}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className={`shrink-0 ${open ? 'text-sm-accent' : 'text-sm-subtle'}`}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
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
    </motion.div>
  );
}

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const heroWords = ['We', 'build', 'systems', 'that', 'run', 'your', 'business.'];

  return (
    <main className="relative">
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY }}
      >
        {/* Gradient Orbs */}
        <motion.div 
          style={{ y: orb1Y }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[600px] bg-gradient-to-br from-sm-accent/20 to-sm-accent-light/10 rounded-full blur-[120px] pointer-events-none animate-float" 
        />
        <motion.div 
          style={{ y: orb2Y }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-gradient-to-tl from-sm-accent-light/15 to-sm-accent/5 rounded-full blur-[100px] pointer-events-none animate-float-reverse" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sm-bg/50" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-sm-text uppercase tracking-wider">ACCEPTING NEW CLIENTS</span>
          </motion.div>

          {/* Hero Headline */}
          <h1 className="mb-8 text-[clamp(3rem,8vw,8rem)] font-display font-extrabold tracking-[-0.04em] leading-[0.95]">
            {heroWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.25em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-lg md:text-xl text-sm-muted max-w-xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            AI agents. Custom software. Full business automation. Delivered in 1-2 days, not months. Perth&apos;s fastest systems integrator.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.button
              onClick={() => setQuoteOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-display font-bold text-lg rounded-full transition-all duration-300 hover:scale-[1.02] glow-amber"
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                Get a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            <motion.a
              href="/audit"
              className="px-8 py-4 border border-sm-border text-sm-text font-display font-semibold text-lg rounded-full hover:border-sm-accent/60 hover:bg-sm-accent/5 transition-all duration-300"
              whileTap={{ scale: 0.97 }}
            >
              Free AI Audit
            </motion.a>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="flex items-center justify-center gap-8 text-sm-muted mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sm-accent" />
              <span className="text-sm">1-2 Day Delivery</span>
            </div>
            <div className="w-px h-4 bg-sm-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sm-accent" />
              <span className="text-sm">Perth Based</span>
            </div>
            <div className="w-px h-4 bg-sm-border" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sm-accent" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </motion.div>

          {/* Client Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <p className="text-xs text-sm-muted uppercase tracking-widest mb-6 text-center">Our Clients</p>
            <ClientLogoStrip />
          </motion.div>
        </div>
      </motion.section>

      {/* ====== STATS SECTION ====== */}
      <section className="border-y border-sm-border bg-sm-surface/30">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedSection>
            <div className="text-5xl md:text-6xl font-display font-extrabold gradient-text">
              <Counter target={50} suffix="+" />
            </div>
            <p className="text-sm text-sm-muted mt-2">Projects Delivered</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-5xl md:text-6xl font-display font-extrabold gradient-text">
              <Counter target={98} suffix="%" />
            </div>
            <p className="text-sm text-sm-muted mt-2">Client Satisfaction</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-5xl md:text-6xl font-display font-extrabold gradient-text">
              <Counter target={10} suffix="x" />
            </div>
            <p className="text-sm text-sm-muted mt-2">Faster Than Agencies</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-5xl md:text-6xl font-display font-extrabold gradient-text">
              24/7
            </div>
            <p className="text-sm text-sm-muted mt-2">Support & Monitoring</p>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== SERVICES SECTION ====== */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">WHAT WE BUILD</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Everything your business needs to run on autopilot
            </h2>
          </AnimatedSection>

          {/* True Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
            {SERVICES.map((service, i) => (
              <StaggerItem key={service.title} index={i} className={service.span || ''}>
                <motion.div 
                  className={`group glass rounded-2xl h-full cursor-pointer transition-all duration-300 ${
                    service.span?.includes('row-span-2') ? 'p-10' : 'p-8'
                  }`}
                  whileHover={{ y: -4, borderColor: 'rgba(255, 122, 0, 0.2)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className={`mb-5 rounded-xl bg-sm-surface border border-sm-border group-hover:bg-sm-accent/15 group-hover:border-sm-accent/30 transition-all duration-300 inline-flex items-center justify-center ${
                    service.span?.includes('row-span-2') ? 'p-4' : 'p-3'
                  }`}>
                    <service.icon className={`text-sm-accent group-hover:text-sm-accent-light transition-colors duration-300 ${
                      service.span?.includes('row-span-2') ? 'w-8 h-8' : 'w-6 h-6'
                    }`} />
                  </div>
                  <h3 className={`font-display font-semibold mb-3 ${
                    service.span?.includes('row-span-2') ? 'text-2xl' : 'text-lg'
                  }`}>{service.title}</h3>
                  <p className={`text-sm-muted leading-relaxed ${
                    service.span?.includes('row-span-2') ? 'text-base' : 'text-sm'
                  }`}>{service.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROCESS SECTION ====== */}
      <section id="process" className="py-24 md:py-32 bg-sm-surface/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">OUR PROCESS</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              From quote to launch in days, not months
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <StaggerItem key={step.num} index={i}>
                <motion.div 
                  className="relative group glass rounded-2xl p-8 md:p-10 overflow-hidden h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Giant Background Number */}
                  <div className="absolute -top-6 -right-4 pointer-events-none select-none">
                    <span className="text-[10rem] font-display font-black text-white opacity-[0.03] leading-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-sm-accent/10 border border-sm-accent/20 text-sm-accent text-xs font-bold rounded-full mb-5 tracking-wider">
                      STEP {step.num}
                    </span>
                    <h3 className="text-2xl font-display font-bold mb-3">{step.title}</h3>
                    <p className="text-sm-muted text-base leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <motion.button
              onClick={() => setQuoteOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-display font-bold rounded-full transition-all duration-300 hover:scale-[1.02] glow-amber"
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== COMPARISON SECTION ====== */}
      <section id="compare" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">WHY STACKMATE</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              See how we stack up
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {/* Stackmate Hero Card */}
            <AnimatedSection>
              <div className="p-8 rounded-2xl border-2 border-sm-accent/50 bg-gradient-to-r from-sm-accent/5 to-sm-accent-light/5 glow-amber">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
                  <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                    <Image src="/logo.png" alt="" width={32} height={32} className="invert" />
                    <span className="font-display font-bold text-xl text-sm-accent">Stackmate</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <span className="text-xs text-sm-muted md:hidden">Delivery:</span>
                    <span className="text-sm-accent font-bold">{STACKMATE.delivery}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <span className="text-xs text-sm-muted md:hidden">AI:</span>
                    <CheckCircle2 className="w-6 h-6 text-sm-accent" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <span className="text-xs text-sm-muted md:hidden">Perth:</span>
                    <span className="text-sm-accent font-bold">{STACKMATE.perth}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <span className="text-xs text-sm-muted md:hidden">Support:</span>
                    <span className="text-sm-accent font-bold">{STACKMATE.support}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1">
                    <span className="text-xs text-sm-muted md:hidden">Price:</span>
                    <span className="text-sm-accent font-bold">{STACKMATE.price}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Competitor Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {COMPETITORS.map((comp, i) => (
                <StaggerItem key={comp.name} index={i}>
                  <div className="p-6 rounded-2xl border border-sm-border bg-sm-card">
                    <h4 className="font-display font-semibold text-sm-text mb-4">{comp.name}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-sm-muted">Delivery:</span>
                        <span className="text-sm-text">{comp.delivery}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm-muted">AI-Powered:</span>
                        <XIcon className="w-5 h-5 text-red-400/50" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm-muted">Perth Based:</span>
                        <span className="text-sm-text">{comp.perth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm-muted">Support:</span>
                        <span className="text-sm-text">{comp.support}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm-muted">Pricing:</span>
                        <span className="text-sm-text">{comp.price}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== INDUSTRIES SECTION ====== */}
      <section className="py-24 md:py-32 bg-sm-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">INDUSTRIES WE SERVE</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Built for businesses that move fast
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((ind, i) => (
              <StaggerItem key={ind.title} index={i}>
                <motion.div 
                  className="glass rounded-2xl p-8 h-full relative border-t border-sm-accent/20"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sm-accent to-transparent" />
                  <h3 className="text-xl font-display font-bold mb-4">{ind.title}</h3>
                  <p className="text-sm-muted mb-6 leading-relaxed">{ind.desc}</p>
                  <ul className="space-y-2">
                    {ind.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm text-sm-text">
                        <div className="w-1.5 h-1.5 bg-sm-accent rounded-full" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHAT WE DELIVER ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">WHAT YOU GET</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Custom logos, AI agents, backend flows. You name it, we build it.
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Custom-designed logos and brand identity',
              'AI agents that handle calls, chats, and emails',
              'Backend automation workflows',
              'Admin dashboards and analytics',
              'Payment systems and invoicing',
              'CRM and client management tools',
              'API integrations with existing systems',
              'Mobile-responsive web applications',
            ].map((item, i) => (
              <StaggerItem key={item} index={i}>
                <div className="flex items-center gap-4 p-6 glass rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-sm-accent shrink-0" />
                  <span className="text-sm-text">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== THE STACKMATE EFFECT ====== */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sm-accent/50 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-6">THE STACKMATE EFFECT</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-8 gradient-text">
              When you become a Stackmate, you enter a new era of AI adoption and API integration.
            </h2>
            <p className="text-xl text-sm-muted max-w-3xl mx-auto leading-relaxed">
              Your business stops running on manual effort and starts running on systems that think, connect, and scale without you.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sm-accent/50 to-transparent" />
      </section>

      {/* ====== INTEGRATIONS ====== */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <AnimatedSection className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">INTEGRATIONS</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              We connect with everything you already use
            </h2>
          </AnimatedSection>
        </div>
        <div className="space-y-6">
          <LogoMarquee items={INTEGRATIONS_ROW1} direction="left" speed={35} />
          <LogoMarquee items={INTEGRATIONS_ROW2} direction="right" speed={40} />
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Common questions</h2>
          </AnimatedSection>

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How fast does Stackmate deliver projects?', acceptedAnswer: { '@type': 'Answer', text: 'Most projects are delivered within 1-2 business days. We use AI-accelerated development to build 10x faster than traditional agencies.' } },
              { '@type': 'Question', name: 'What industries does Stackmate work with?', acceptedAnswer: { '@type': 'Answer', text: 'We work with mining and resources companies, local businesses (trades, hospitality, retail), agencies, and enterprises across Western Australia and beyond.' } },
              { '@type': 'Question', name: 'Is Stackmate based in Perth?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Stackmate is based in Perth, Western Australia. We offer in-person meetings, same-timezone support, and deep understanding of WA business and mining regulations.' } },
              { '@type': 'Question', name: 'What does the free AI audit include?', acceptedAnswer: { '@type': 'Answer', text: 'Our free AI audit includes an operations scan, AI opportunity map, ROI projection, and a prioritised action plan showing exactly where automation can save your business time and money. We respond within 48 hours.' } },
              { '@type': 'Question', name: 'Do I own the code Stackmate builds?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upon full payment, you own 100% of the code, designs, and systems we build. No lock-in, no proprietary platforms. Everything is yours.' } },
              { '@type': 'Question', name: 'What technologies does Stackmate use?', acceptedAnswer: { '@type': 'Answer', text: 'We build with Next.js, React, TypeScript, Node.js, PostgreSQL, and integrate with Stripe, Xero, HubSpot, OpenAI, and 100+ other platforms. Modern stack, no legacy tech.' } },
            ]
          }) }} />

          <div className="space-y-3">
            {[
              { q: 'How fast does Stackmate deliver projects?', a: 'Most projects are delivered within 1-2 business days. We use AI-accelerated development to build 10x faster than traditional agencies.' },
              { q: 'What industries does Stackmate work with?', a: 'We work with mining and resources companies, local businesses (trades, hospitality, retail), agencies, and enterprises across Western Australia and beyond.' },
              { q: 'Is Stackmate based in Perth?', a: 'Yes. Stackmate is based in Perth, Western Australia. We offer in-person meetings, same-timezone support, and deep understanding of WA business and mining regulations.' },
              { q: 'What does the free AI audit include?', a: 'Our free AI audit includes an operations scan, AI opportunity map, ROI projection, and a prioritised action plan showing exactly where automation can save your business time and money. We respond within 48 hours.' },
              { q: 'Do I own the code Stackmate builds?', a: 'Yes. Upon full payment, you own 100% of the code, designs, and systems we build. No lock-in, no proprietary platforms. Everything is yours.' },
              { q: 'What technologies does Stackmate use?', a: 'We build with Next.js, React, TypeScript, Node.js, PostgreSQL, and integrate with Stripe, Xero, HubSpot, OpenAI, and 100+ other platforms. Modern stack, no legacy tech.' },
            ].map((faq, index) => (
              <FAQItem key={faq.q} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== FREE AUDIT CTA ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-r from-sm-accent via-sm-accent-light to-sm-accent">
                <div className="h-full w-full bg-sm-bg rounded-3xl" />
              </div>
              
              <div className="relative z-10 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-sm-accent mb-4">FREE FOR EVERY BUSINESS</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
                  Not sure where AI fits? Get a free audit.
                </h2>
                <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                  We&apos;ll analyse your business operations and show you exactly where AI and automation can save time, cut costs, and help you scale. No cost, no obligation. We respond within 48 hours.
                </p>
                <motion.a
                  href="/audit"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-display font-bold rounded-full transition-all duration-300 hover:scale-[1.02] glow-amber"
                  whileTap={{ scale: 0.97 }}
                >
                  Get Your Free AI Audit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 md:py-32 border-t border-sm-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6">
              Ready to build something that actually works?
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Get a custom quote in 60 seconds. No fluff, no sales calls unless you want one. Just tell us what you need and we&apos;ll scope it.
            </p>
            <motion.button
              onClick={() => setQuoteOpen(true)}
              className="group px-10 py-5 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-display font-bold text-lg rounded-full transition-all duration-300 hover:scale-[1.02] glow-amber"
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-12 border-t border-sm-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stackmate" width={28} height={28} className="invert" />
              <span className="font-display font-bold">stackmate</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-sm-muted">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#process" className="hover:text-white transition-colors">Process</a>
              <a href="#compare" className="hover:text-white transition-colors">Why Us</a>
              <a href="/clients" className="hover:text-white transition-colors">Clients</a>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-sm-muted">
              <MapPin className="w-3.5 h-3.5" />
              Perth, WA
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8 border-t border-sm-border text-xs text-sm-muted">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="hidden md:block">•</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="hidden md:block">•</span>
            <span>&copy; {new Date().getFullYear()} Stackmate. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}