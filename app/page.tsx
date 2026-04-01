'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare,
  ArrowRight, Zap, Shield, Clock,
  ChevronRight, CheckCircle2, X as XIcon,
  MapPin
} from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import Counter from '@/components/Counter';
import LogoMarquee from '@/components/LogoMarquee';
import ClientLogoStrip from '@/components/ClientLogoStrip';

const INTEGRATIONS_ROW1 = [
  { name: 'Stripe' }, { name: 'Xero' }, { name: 'HubSpot' }, { name: 'Salesforce' },
  { name: 'Slack' }, { name: 'Google Workspace' }, { name: 'Microsoft 365' },
  { name: 'Zapier' }, { name: 'Make' }, { name: 'Shopify' }, { name: 'Square' },
  { name: 'Twilio' }, { name: 'SendGrid' }, { name: 'AWS' },
];

const INTEGRATIONS_ROW2 = [
  { name: 'Vercel' }, { name: 'OpenAI' }, { name: 'Anthropic' }, { name: 'PostgreSQL' },
  { name: 'Firebase' }, { name: 'Supabase' }, { name: 'Cloudflare' },
  { name: 'GitHub' }, { name: 'Figma' }, { name: 'Notion' }, { name: 'Airtable' },
  { name: 'Calendly' }, { name: 'Intercom' }, { name: 'Mailchimp' },
];

const SERVICES = [
  { icon: Bot, title: 'AI Agents & Chatbots', desc: 'Custom AI agents that handle customer support, lead qualification, and internal operations 24/7.' },
  { icon: Workflow, title: 'Business Automation', desc: 'Eliminate manual processes. Automate invoicing, scheduling, reporting, and workflows end-to-end.' },
  { icon: Code2, title: 'Custom Software', desc: 'Bespoke applications built for your exact needs. Dashboards, portals, internal tools, and more.' },
  { icon: Globe, title: 'Websites & Web Apps', desc: 'Lightning-fast, conversion-optimized websites that make your business look as good as it runs.' },
  { icon: Link2, title: 'System Integrations', desc: 'Connect your CRM, ERP, accounting, and tools into one unified system. No more copy-pasting.' },
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  // Typewriter for hero
  const [heroText, setHeroText] = useState('');
  const fullText = 'We build systems that run your business.';
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setHeroText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative">
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sm-border bg-sm-card/50 mb-8">
              <MapPin className="w-3.5 h-3.5 text-sm-light" />
              <span className="text-xs text-sm-light tracking-wide uppercase">Perth, Western Australia</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </motion.div>

          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold tracking-tight leading-[1.05]">
              {heroText}
              <motion.span
                className="inline-block w-[3px] h-[0.8em] bg-white ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              />
            </h1>
          </div>

          <motion.p
            className="text-lg md:text-xl text-sm-light max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            AI agents. Custom software. Full business automation. Delivered in 1-2 days, not months. Perth&apos;s fastest systems integrator.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="group relative px-8 py-4 bg-white text-black font-display font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <span className="flex items-center gap-2">
                Get a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <a
              href="#services"
              className="px-8 py-4 border border-sm-border text-sm-light font-display font-semibold text-lg rounded-xl hover:border-white/30 hover:text-white transition-all duration-200"
            >
              See What We Build
            </a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 mt-16 text-sm-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.1 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm">1-2 Day Delivery</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Perth Based</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </motion.div>

          {/* Worked with */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.4 }}
          >
            <p className="text-xs text-sm-muted uppercase tracking-widest mb-4 text-center">Built for</p>
            <ClientLogoStrip />
          </motion.div>
        </div>
      </motion.section>

      {/* ====== STATS BAR ====== */}
      <section className="border-y border-sm-border bg-sm-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedSection>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={50} suffix="+" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Projects Delivered</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={98} suffix="%" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Client Satisfaction</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={10} suffix="x" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Faster Than Agencies</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="text-3xl md:text-4xl font-display font-bold">
              24/7
            </div>
            <p className="text-sm text-sm-muted mt-1">Support & Monitoring</p>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">What We Build</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Everything your business needs to run on autopilot
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, i) => (
              <StaggerItem key={service.title} index={i}>
                <div className="group p-6 rounded-xl border border-sm-border bg-sm-card/30 hover:bg-sm-card/60 hover:border-white/10 transition-all duration-300 h-full hover:-translate-y-1">
                  <service.icon className="w-8 h-8 text-sm-light mb-4 group-hover:text-white transition-colors duration-300" />
                  <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-sm-muted leading-relaxed">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROCESS ====== */}
      <section id="process" className="py-24 md:py-32 bg-sm-card/20">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Our Process</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              From quote to launch in days, not months
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <StaggerItem key={step.num} index={i}>
                <div className="group flex items-start gap-6 py-8 border-b border-sm-border hover:pl-4 transition-all duration-300">
                  <span className="text-4xl md:text-5xl font-display font-bold text-sm-border group-hover:text-white/20 transition-colors duration-300 shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-2">{step.title}</h3>
                    <p className="text-sm-muted">{step.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== COMPARISON ====== */}
      <section id="compare" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Why Stackmate</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              See how we stack up
            </h2>
          </AnimatedSection>

          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-6 gap-4 px-6 text-sm text-sm-muted">
              <div className="col-span-1"></div>
              <div>Delivery</div>
              <div>AI-Powered</div>
              <div>Perth Based</div>
              <div>Support</div>
              <div>Pricing</div>
            </div>

            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 rounded-xl border-2 border-white/20 bg-white/5">
                <div className="col-span-2 md:col-span-1 font-display font-bold text-lg flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={24} height={24} className="invert" />
                  Stackmate
                </div>
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-sm-muted text-sm">Delivery:</span>
                  <span className="text-green-400 font-semibold">{STACKMATE.delivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-sm-muted text-sm">AI:</span>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-sm-muted text-sm">Perth:</span>
                  <span className="text-green-400 font-semibold">{STACKMATE.perth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-sm-muted text-sm">Support:</span>
                  <span className="text-green-400 font-semibold">{STACKMATE.support}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-sm-muted text-sm">Price:</span>
                  <span className="text-green-400 font-semibold">{STACKMATE.price}</span>
                </div>
              </div>
            </AnimatedSection>

            {COMPETITORS.map((comp, i) => (
              <StaggerItem key={comp.name} index={i}>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 rounded-xl border border-sm-border bg-sm-card/30">
                  <div className="col-span-2 md:col-span-1 font-semibold text-sm-light">{comp.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-sm-muted text-sm">Delivery:</span>
                    <span className="text-sm-muted">{comp.delivery}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-sm-muted text-sm">AI:</span>
                    <XIcon className="w-5 h-5 text-red-400/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-sm-muted text-sm">Perth:</span>
                    <span className="text-sm-muted">{comp.perth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-sm-muted text-sm">Support:</span>
                    <span className="text-sm-muted">{comp.support}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-sm-muted text-sm">Price:</span>
                    <span className="text-sm-muted">{comp.price}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INDUSTRIES ====== */}
      <section className="py-24 md:py-32 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Industries We Serve</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Built for businesses that move fast
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
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
                <div className="p-8 rounded-xl border border-sm-border bg-sm-dark h-full hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-display font-bold mb-3">{ind.title}</h3>
                  <p className="text-sm text-sm-muted mb-6">{ind.desc}</p>
                  <ul className="space-y-2">
                    {ind.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-sm-light">
                        <ChevronRight className="w-3 h-3 text-sm-muted" />
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

      {/* ====== WHAT WE DELIVER ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">What You Get</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Custom logos, AI agents, backend flows. You name it, we build it.
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4">
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
                <div className="flex items-center gap-3 p-4 rounded-lg border border-sm-border bg-sm-card/30 hover:bg-sm-card/50 transition-all duration-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm-light">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NEW ERA ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-6">The Stackmate Effect</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-6">
              When you become a Stackmate, you enter a new era of AI adoption and API integration.
            </h2>
            <p className="text-lg text-sm-light max-w-2xl mx-auto">
              Your business stops running on manual effort and starts running on systems that think, connect, and scale without you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== INTEGRATIONS ====== */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <AnimatedSection className="text-center">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Integrations</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              We connect with everything you already use
            </h2>
          </AnimatedSection>
        </div>
        <div className="space-y-4">
          <LogoMarquee items={INTEGRATIONS_ROW1} direction="left" speed={35} />
          <LogoMarquee items={INTEGRATIONS_ROW2} direction="right" speed={40} />
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 md:py-32 bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <Image src="/logo.png" alt="Stackmate" width={60} height={60} className="mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6">
              Ready to build something that actually works?
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10">
              Get a custom quote in 60 seconds. No fluff, no sales calls unless you want one. Just tell us what you need and we&apos;ll scope it.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-display font-bold text-lg rounded-xl transition-all duration-200 hover:bg-black/80 hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-12 border-t border-sm-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stackmate" width={28} height={28} className="invert" />
              <span className="font-display font-bold">stackmate</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-sm-muted">
              <a href="/services" className="hover:text-white transition-colors">Services</a>
              <a href="/process" className="hover:text-white transition-colors">Process</a>
              <a href="/why-us" className="hover:text-white transition-colors">Why Us</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-sm-muted">
              <MapPin className="w-3.5 h-3.5" />
              Perth, WA
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-sm-border">
            <a href="/privacy" className="text-xs text-sm-muted hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-xs text-sm-muted hover:text-white transition-colors">Terms of Service</a>
            <span className="text-xs text-sm-muted">&copy; {new Date().getFullYear()} Stackmate. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
