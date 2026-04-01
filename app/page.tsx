'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare,
  ArrowRight, Zap, Shield, Clock, Users, ChevronRight, CheckCircle2, X as XIcon,
  MapPin
} from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import AnimatedText from '@/components/AnimatedText';
import FadeIn from '@/components/FadeIn';
import Counter from '@/components/Counter';

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
  { num: '01', title: 'Get a Quote', desc: '60-second form. Tell us what you need, we\'ll scope it within 24 hours.' },
  { num: '02', title: 'Strategy Call', desc: 'We dive deep into your operations. Map every workflow. Find every bottleneck.' },
  { num: '03', title: 'Build Sprint', desc: 'Rapid development. You see progress daily, not monthly. We ship fast.' },
  { num: '04', title: 'Launch & Scale', desc: 'Go live with confidence. We monitor, optimize, and scale with you.' },
];

const COMPETITORS = [
  { name: 'Traditional Agency', delivery: '8-12 weeks', ai: false, perth: 'Sometimes', support: 'Email only', price: '$$$' },
  { name: 'Freelancer', delivery: '4-8 weeks', ai: false, perth: 'Rarely', support: 'Limited', price: '$$' },
  { name: 'Offshore Team', delivery: '6-10 weeks', ai: false, perth: 'Never', support: 'Timezone issues', price: '$' },
];

const STACKMATE = { name: 'Stackmate', delivery: '1-4 weeks', ai: true, perth: 'Always', support: '24/7 + AI', price: 'Fair' };

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main className="relative">
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sm-dark via-sm-dark to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.03] rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sm-border bg-sm-card/50 backdrop-blur-sm mb-8">
              <MapPin className="w-3.5 h-3.5 text-sm-light" />
              <span className="text-xs text-sm-light tracking-wide uppercase">Perth, Western Australia</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </FadeIn>

          {/* Headline */}
          <AnimatedText
            text="We build the systems that run your business"
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-6"
            delay={0.2}
          />

          <FadeIn delay={0.5}>
            <p className="text-lg md:text-xl text-sm-light max-w-2xl mx-auto mb-10 leading-relaxed">
              AI agents. Custom software. Business automation. We handle the tech so you can focus on what matters. The fastest delivery in Western Australia.
            </p>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.7}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setQuoteOpen(true)}
                className="group relative px-8 py-4 bg-white text-black font-display font-bold text-lg rounded-xl hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  Get a Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <a
                href="#services"
                className="px-8 py-4 border border-sm-border text-sm-light font-display font-semibold text-lg rounded-xl hover:border-white/30 hover:text-white transition-all duration-300"
              >
                See What We Build
              </a>
            </div>
          </FadeIn>

          {/* Trust markers */}
          <FadeIn delay={0.9}>
            <div className="flex items-center justify-center gap-8 mt-16 text-sm-muted">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">1-4 Week Delivery</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Perth Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-5 h-8 border-2 border-sm-muted rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-sm-muted rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="border-y border-sm-border bg-sm-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={50} suffix="+" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Projects Delivered</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={98} suffix="%" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Client Satisfaction</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold">
              <Counter target={2} suffix="x" />
            </div>
            <p className="text-sm text-sm-muted mt-1">Faster Than Agencies</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold">
              24/7
            </div>
            <p className="text-sm text-sm-muted mt-1">Support & Monitoring</p>
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">What We Build</p>
            </FadeIn>
            <AnimatedText
              text="Everything your business needs to run on autopilot"
              as="h2"
              className="text-3xl md:text-5xl font-display font-bold tracking-tight"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 0.05}>
                <div className="group p-6 rounded-xl border border-sm-border bg-sm-card/30 hover:bg-sm-card/60 hover:border-white/10 transition-all duration-300 h-full">
                  <service.icon className="w-8 h-8 text-sm-light mb-4 group-hover:text-white transition-colors" />
                  <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-sm-muted leading-relaxed">{service.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROCESS ====== */}
      <section id="process" className="py-24 md:py-32 bg-sm-card/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Our Process</p>
            </FadeIn>
            <AnimatedText
              text="From quote to launch in weeks, not months"
              as="h2"
              className="text-3xl md:text-5xl font-display font-bold tracking-tight"
            />
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="group flex items-start gap-6 py-8 border-b border-sm-border hover:pl-4 transition-all duration-300">
                  <span className="text-4xl md:text-5xl font-display font-bold text-sm-border group-hover:text-white/20 transition-colors shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-2">{step.title}</h3>
                    <p className="text-sm-muted">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="text-center mt-12">
              <button
                onClick={() => setQuoteOpen(true)}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-display font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ====== COMPARISON ====== */}
      <section id="compare" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Why Stackmate</p>
            </FadeIn>
            <AnimatedText
              text="See how we stack up"
              as="h2"
              className="text-3xl md:text-5xl font-display font-bold tracking-tight"
            />
          </div>

          {/* Comparison cards */}
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-6 text-sm text-sm-muted">
              <div className="col-span-1"></div>
              <div>Delivery</div>
              <div>AI-Powered</div>
              <div>Perth Based</div>
              <div>Support</div>
              <div>Pricing</div>
            </div>

            {/* Stackmate row — highlighted */}
            <FadeIn>
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
            </FadeIn>

            {/* Competitor rows */}
            {COMPETITORS.map((comp, i) => (
              <FadeIn key={comp.name} delay={0.1 + i * 0.05}>
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INDUSTRIES ====== */}
      <section className="py-24 md:py-32 bg-sm-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Industries We Serve</p>
            </FadeIn>
            <AnimatedText
              text="Built for businesses that move fast"
              as="h2"
              className="text-3xl md:text-5xl font-display font-bold tracking-tight"
            />
          </div>

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
              <FadeIn key={ind.title} delay={i * 0.1}>
                <div className="p-8 rounded-xl border border-sm-border bg-sm-dark h-full">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHAT WE DELIVER ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">What You Get</p>
            </FadeIn>
            <AnimatedText
              text="Custom logos, AI agents, backend flows. You name it, we build it."
              as="h2"
              className="text-3xl md:text-5xl font-display font-bold tracking-tight"
            />
          </div>

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
              <FadeIn key={item} delay={i * 0.04}>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-sm-border bg-sm-card/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm-light">{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 md:py-32 bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Image src="/logo.png" alt="Stackmate" width={60} height={60} className="mx-auto mb-8" />
          </FadeIn>
          <AnimatedText
            text="Ready to build something that actually works?"
            as="h2"
            className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6"
          />
          <FadeIn delay={0.3}>
            <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10">
              Get a custom quote in 60 seconds. No fluff, no sales calls unless you want one. Just tell us what you need and we'll scope it.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-display font-bold text-lg rounded-xl hover:bg-black/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>
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
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#process" className="hover:text-white transition-colors">Process</a>
              <a href="#compare" className="hover:text-white transition-colors">Why Us</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-sm-muted">
              <MapPin className="w-3.5 h-3.5" />
              Perth, WA
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-sm-border">
            <p className="text-xs text-sm-muted">&copy; {new Date().getFullYear()} Stackmate. All rights reserved. ABN pending.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
