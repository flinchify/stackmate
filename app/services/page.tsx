'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const SERVICES = [
  {
    icon: Bot,
    title: 'AI Agents & Chatbots',
    desc: 'Custom AI agents that handle customer support, lead qualification, and internal operations 24/7.',
    details: [
      'Natural language conversations — not robotic IVR',
      'Book appointments by checking real-time availability',
      'Generate and send quotes based on your pricing rules',
      'Handle complaints with empathy and intelligent escalation',
      'Learn and improve from every interaction',
      'Works across phone, chat, email, and SMS',
    ],
  },
  {
    icon: Workflow,
    title: 'Business Automation',
    desc: 'Eliminate manual processes. Automate invoicing, scheduling, reporting, and workflows end-to-end.',
    details: [
      'Automated invoicing and payment follow-ups',
      'Smart scheduling with conflict detection',
      'Report generation on autopilot',
      'Multi-step workflow automation across tools',
      'Trigger-based actions (new lead → assign → notify → follow up)',
      'Eliminates 15-25 hours/week of manual admin',
    ],
  },
  {
    icon: Code2,
    title: 'Custom Software',
    desc: 'Bespoke applications built for your exact needs. Dashboards, portals, internal tools.',
    details: [
      'Admin dashboards with real-time data',
      'Client portals with secure access',
      'Internal tools tailored to your workflow',
      'Booking and reservation systems',
      'Inventory and asset management',
      'Built to scale — not a template',
    ],
  },
  {
    icon: Globe,
    title: 'Websites & Web Apps',
    desc: 'Lightning-fast, conversion-optimized websites that make your business look as good as it runs.',
    details: [
      'Sub-second load times',
      'Mobile-first responsive design',
      'SEO-optimized from day one',
      'AI-crawler friendly (llms.txt, structured data)',
      'Conversion-focused layouts',
      'CMS integration if needed',
    ],
  },
  {
    icon: Link2,
    title: 'System Integrations',
    desc: 'Connect your CRM, ERP, accounting, and tools into one unified system.',
    details: [
      'Xero, MYOB, QuickBooks integration',
      'HubSpot, Salesforce, Pipedrive CRM sync',
      'Stripe, Square payment processing',
      'Custom API development and webhooks',
      'Data migration between platforms',
      'Real-time sync — no more copy-pasting',
    ],
  },
  {
    icon: Palette,
    title: 'Branding & Design',
    desc: 'Logos, brand identity, and design systems that make your business unmistakable.',
    details: [
      'Custom logo design',
      'Full brand identity packages',
      'Design systems and style guides',
      'Business card and collateral design',
      'Social media asset creation',
      'Brand strategy consultation',
    ],
  },
  {
    icon: BarChart3,
    title: 'Data & Analytics',
    desc: 'Turn your business data into decisions. Custom dashboards, reporting, and AI-powered insights.',
    details: [
      'Custom analytics dashboards',
      'Automated reporting (daily, weekly, monthly)',
      'AI-powered insight generation',
      'Data pipeline construction',
      'KPI tracking and alerting',
      'Cross-platform data aggregation',
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Consulting',
    desc: 'Not sure where AI fits? We audit your operations and show you exactly where to automate.',
    details: [
      'Full operations audit',
      'AI readiness assessment',
      'ROI projections for automation',
      'Implementation roadmap',
      'Tool and platform recommendations',
      'Ongoing advisory support',
    ],
  },
  {
    icon: Globe,
    title: 'SEO & GEO Optimization',
    desc: 'Rank locally, rank globally. We make sure your business gets found by the right people at the right time.',
    details: [
      'Technical SEO audits and fixes',
      'Local SEO for Google Maps and "near me" searches',
      'GEO optimization for AI search engines (ChatGPT, Perplexity, Gemini)',
      'Keyword research and content strategy',
      'Schema markup and structured data',
      'Monthly ranking reports and adjustments',
    ],
  },
  {
    icon: Palette,
    title: 'Creatives & Content',
    desc: 'Scroll-stopping visuals, social content, and brand assets that make your business impossible to ignore.',
    details: [
      'Social media content creation',
      'Ad creative design (Meta, Google, TikTok)',
      'Video editing and motion graphics',
      'Photography direction and retouching',
      'Brand asset libraries',
      'Content calendars and strategy',
    ],
  },
  {
    icon: BarChart3,
    title: 'Performance Analysis',
    desc: 'Stop guessing. We track every metric that matters and turn data into growth decisions.',
    details: [
      'Google Analytics 4 setup and configuration',
      'Conversion tracking and funnel analysis',
      'A/B testing frameworks',
      'Custom KPI dashboards',
      'Competitor benchmarking',
      'Monthly performance reports with actionable insights',
    ],
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-xl border border-sm-border bg-sm-card/30 hover:bg-sm-card/60 hover:border-white/10 transition-all duration-300"
    >
      <service.icon className="w-10 h-10 text-sm-light mb-5" />
      <h3 className="text-xl font-display font-bold mb-2">{service.title}</h3>
      <p className="text-sm text-sm-muted mb-5">{service.desc}</p>
      <ul className="space-y-2">
        {service.details.map((d) => (
          <li key={d} className="flex items-start gap-2 text-sm text-sm-light">
            <span className="text-sm-muted mt-1">—</span>
            {d}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Services</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Everything your business needs. Nothing it doesn&apos;t.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            We build AI agents, custom software, automation workflows, websites, integrations, and more. All delivered in 1-2 days from Perth, WA.
          </p>
        </motion.div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-24 bg-sm-card/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
            <div>
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-sm-border bg-sm-card">
                <Image src="/miles.png" alt="Miles Cass — Founder of Stackmate" fill className="object-cover" />
              </div>
            </div>
            <div>
              <p className="text-sm text-sm-muted uppercase tracking-widest mb-3">The Builder</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Miles Cass</h2>
              <div className="space-y-4 text-sm-light leading-relaxed">
                <p>
                  I started building at 17. Not because someone told me to — because I saw how broken most business software was and knew I could do it better. By 19, I&apos;d shipped full-stack platforms, built AI-powered marketplaces, and delivered production systems for real businesses.
                </p>
                <p>
                  I don&apos;t come from a traditional agency background. I come from actually building things — writing code, designing interfaces, deploying infrastructure, and solving problems that matter. Every system Stackmate delivers has my hands on it.
                </p>
                <p>
                  My stack runs deep: Next.js, React, TypeScript, Node, PostgreSQL, AI/ML integrations, Stripe payments, real-time systems, and everything in between. I build full products — not mockups, not wireframes — working software that goes live and makes money.
                </p>
                <p>
                  Stackmate exists because Perth businesses deserve better than 12-week agency timelines and cookie-cutter WordPress sites. I build in days what others quote in months, because I actually know how to build.
                </p>
                <p className="text-white font-semibold">
                  If you want someone who talks, hire an agency. If you want someone who builds, talk to me.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <a href="https://www.linkedin.com/in/milescass" target="_blank" rel="noopener noreferrer" className="text-sm text-sm-muted hover:text-white transition-colors">LinkedIn</a>
                  <a href="https://instagram.com/milescass_" target="_blank" rel="noopener noreferrer" className="text-sm text-sm-muted hover:text-white transition-colors">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Need something not listed?</h2>
          <p className="text-black/60 mb-8">We build custom. If it involves technology, automation, or AI — we can do it.</p>
          <button onClick={() => setQuoteOpen(true)}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-display font-bold rounded-xl transition-all hover:bg-black/80 hover:scale-[1.03] active:scale-[0.98]"
          >
            Get a Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}
