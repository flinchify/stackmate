'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Bot, Workflow, Code2, Globe, Link2, Palette, BarChart3, MessageSquare,
  ArrowRight, Zap, Shield, Clock, MapPin,
  ChevronRight, CheckCircle2, X as XIcon, ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
// Counter no longer used in By The Numbers
import LogoMarquee from '@/components/LogoMarquee';
import ClientLogoStrip from '@/components/ClientLogoStrip';
import dynamic from 'next/dynamic';
const MatrixBg = dynamic(() => import('@/components/MatrixBg'), { ssr: false });

// Keep all existing data arrays
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
  { name: 'Stripe', icon: 'stripe' },
  { name: 'Xero', icon: 'xero' },
  { name: 'HubSpot', icon: 'hubspot' },
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
  { name: 'Monday', icon: 'monday' },
  { name: 'Jira', icon: 'jira' },
];

const INTEGRATIONS_ROW3 = [
  { name: 'Resend', icon: 'resend' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Redis', icon: 'redis' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Prisma', icon: 'prisma' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Python', icon: 'python' },
  { name: 'Sentry', icon: 'sentry' },
  { name: 'Linear', icon: 'linear' },
  { name: 'Datadog', icon: 'datadog' },
  { name: 'Plaid', icon: 'plaid' },
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

// CodeBlock component for hero
function CodeBlock({ lines }: { lines: string[] }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex];
      if (currentCharIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          const updatedLines = [...displayedLines];
          if (updatedLines[currentLineIndex]) {
            updatedLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          } else {
            updatedLines[currentLineIndex] = currentLine[0];
          }
          setDisplayedLines(updatedLines);
          setCurrentCharIndex(currentCharIndex + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentCharIndex(0);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, displayedLines, lines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-sm-surface rounded-lg border border-sm-border font-mono text-sm overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-sm-card border-b border-sm-border">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm-muted text-xs ml-2">stackmate.config.ts</span>
      </div>
      
      {/* Code content */}
      <div className="p-4 text-sm-text">
        {displayedLines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line}
            {i === displayedLines.length - 1 && currentLineIndex < lines.length && showCursor && (
              <span className="bg-sm-accent w-2 h-5 inline-block ml-0.5 cursor-blink"></span>
            )}
          </div>
        ))}
        {currentLineIndex >= lines.length && showCursor && (
          <span className="bg-sm-accent w-2 h-5 inline-block cursor-blink"></span>
        )}
      </div>
    </div>
  );
}

// Australia Map component
function AustraliaMap() {
  return (
    <div className="relative w-full h-48">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Australia outline */}
        <path
          d="M 150,50 C 200,30 250,40 280,60 C 310,80 330,110 340,150 C 350,190 340,230 320,260 C 300,290 270,310 240,320 C 210,330 180,320 160,300 C 140,280 120,250 110,220 C 100,190 90,160 100,130 C 110,100 130,70 150,50 Z"
          fill="none"
          stroke="rgba(255,122,0,0.3)"
          strokeWidth="1"
          className="transition-colors duration-300"
        />
        
        {/* Perth dot */}
        <circle
          cx="120"
          cy="160"
          r="4"
          fill="#FF7A00"
          className="animate-pulse-dot"
        />
        
        {/* Sydney dot */}
        <circle
          cx="310"
          cy="180"
          r="3"
          fill="#FF7A00"
          className="animate-pulse-dot"
          style={{ animationDelay: '0.5s' }}
        />
        
        {/* Melbourne dot */}
        <circle
          cx="285"
          cy="220"
          r="3"
          fill="#FF7A00"
          className="animate-pulse-dot"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

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

// Speed comparison animation
function SpeedComparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const competitors = [
    { name: 'Traditional Agency', weeks: 10, color: 'rgba(255,255,255,0.15)' },
    { name: 'Freelancer', weeks: 6, color: 'rgba(255,255,255,0.15)' },
    { name: 'Offshore Team', weeks: 8, color: 'rgba(255,255,255,0.15)' },
    { name: 'Stackmate', weeks: 0.3, color: '#FF7A00' },
  ];

  const maxWeeks = 10;

  return (
    <div ref={ref} className="shimmer-border border border-white/[0.06] rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-sm-muted mb-1">Delivery speed</div>
          <div className="font-display font-bold text-xl">How fast we ship vs the rest</div>
        </div>
        <div className="font-mono text-xs text-sm-muted">Time to launch (weeks)</div>
      </div>
      <div className="space-y-4">
        {competitors.map((comp, i) => (
          <div key={comp.name} className="flex items-center gap-4">
            <div className={`w-40 shrink-0 text-sm font-mono ${comp.name === 'Stackmate' ? 'text-sm-accent font-bold' : 'text-sm-muted'}`}>
              {comp.name}
            </div>
            <div className="flex-1 relative h-8 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: comp.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${Math.max((comp.weeks / maxWeeks) * 100, 5)}%` } : {}}
                transition={{ duration: 1.2, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className={`text-xs font-mono font-bold shrink-0 ml-3 ${comp.name === 'Stackmate' ? 'text-sm-accent' : 'text-sm-muted'}`}>
                {comp.name === 'Stackmate' ? '2 days' : `${comp.weeks} weeks`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Typing word rotator for hero
function TypingRotator({ words }: { words: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % words.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayText(currentWord.substring(0, displayText.length - 1)), 60);
    } else {
      timeout = setTimeout(() => setDisplayText(currentWord.substring(0, displayText.length + 1)), 120);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, words]);

  return (
    <span className="text-sm-accent">
      {displayText}
      <span className="inline-block w-[3px] h-[0.85em] bg-sm-accent ml-0.5 align-middle cursor-blink"></span>
    </span>
  );
}

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroWords = ['business', 'company', 'startup', 'operation', 'enterprise', 'agency', 'practice', 'venture'];

  const codeLines = [
    '// stackmate.config.ts',
    'export const project = {',
    '  client: "Acme Mining",',
    '  services: ["ai-agent", "automation"],',
    '  delivery: "2 days",',
    '  status: "building..."',
    '}'
  ];

  const tabGroups = [
    {
      title: 'AI & Agents',
      services: [
        { icon: Bot, title: 'AI Agents & Chatbots', desc: 'Custom AI agents that handle customer support, lead qualification, and internal operations 24/7.' },
        { icon: MessageSquare, title: 'AI Consulting', desc: 'Not sure where AI fits? We\'ll audit your operations and show you exactly where to automate.' },
      ]
    },
    {
      title: 'Software',
      services: [
        { icon: Code2, title: 'Custom Software', desc: 'Bespoke applications built for your exact needs. Dashboards, portals, internal tools, and more.' },
        { icon: Globe, title: 'Websites & Web Apps', desc: 'Lightning-fast, conversion-optimized websites that make your business look as good as it runs.' },
      ]
    },
    {
      title: 'Integration',
      services: [
        { icon: Workflow, title: 'Business Automation', desc: 'Eliminate manual processes. Automate invoicing, scheduling, reporting, and workflows end-to-end.' },
        { icon: Link2, title: 'System Integrations', desc: 'Connect your CRM, ERP, accounting, and tools into one unified system. No more copy-pasting.' },
      ]
    },
    {
      title: 'Strategy',
      services: [
        { icon: Palette, title: 'Branding & Design', desc: 'Logos, brand identity, and design systems that make your business unmistakable.' },
        { icon: BarChart3, title: 'Data & Analytics', desc: 'Turn your business data into decisions. Custom dashboards, reporting, and AI-powered insights.' },
      ]
    }
  ];

  const faqs = [
    { q: 'How fast does Stackmate deliver projects?', a: 'Most projects are delivered within 1-2 business days. We use AI-accelerated development to build 10x faster than traditional agencies.' },
    { q: 'What industries does Stackmate work with?', a: 'We work with mining and resources companies, local businesses (trades, hospitality, retail), agencies, and enterprises across Western Australia and beyond.' },
    { q: 'Is Stackmate based in Perth?', a: 'Yes. Stackmate is based in Perth, Western Australia. We offer in-person meetings, same-timezone support, and deep understanding of WA business and mining regulations.' },
    { q: 'What does the free AI audit include?', a: 'Our free AI audit includes an operations scan, AI opportunity map, ROI projection, and a prioritised action plan showing exactly where automation can save your business time and money. We respond within 48 hours.' },
    { q: 'Do I own the code Stackmate builds?', a: 'Yes. Upon full payment, you own 100% of the code, designs, and systems we build. No lock-in, no proprietary platforms. Everything is yours.' },
    { q: 'What technologies does Stackmate use?', a: 'We build with Next.js, React, TypeScript, Node.js, PostgreSQL, and integrate with Stripe, Xero, HubSpot, OpenAI, and 100+ other platforms. Modern stack, no legacy tech.' },
  ];

  return (
    <main className="relative">
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <section className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Content */}
          <div>
            <AnimatedSection>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
                We build systems that run your<br /> <TypingRotator words={heroWords} />
              </h1>
            </AnimatedSection>

            <AnimatedSection>
              <p className="text-lg text-sm-muted max-w-lg mb-8 leading-relaxed">
                AI agents. Custom software. Full business automation. Delivered in 1-2 days, not months. Perth&apos;s fastest systems integrator.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider hover:bg-sm-accent-light transition-all duration-200 font-medium"
                >
                  GET A QUOTE
                </button>
                <button className="corner-bracket-btn px-8 py-4 text-sm-text font-mono text-sm uppercase tracking-wider hover:text-sm-accent transition-all duration-200">
                  <span className="bracket tl"></span>
                  <span className="bracket tr"></span>
                  <span className="bracket bl"></span>
                  <span className="bracket br"></span>
                  FREE AUDIT
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <p className="text-xs text-sm-subtle">No obligation required</p>
            </AnimatedSection>
          </div>

          {/* Right side - Code block */}
          <div className="lg:mt-16">
            <AnimatedSection>
              <CodeBlock lines={codeLines} />
            </AnimatedSection>
          </div>
        </div>

        {/* Client logos */}
        <AnimatedSection>
          <div className="mt-20">
            <p className="text-xs font-mono text-sm-muted uppercase tracking-widest mb-6 text-center">Businesses we&apos;ve built for</p>
            <ClientLogoStrip />
          </div>
        </AnimatedSection>
      </section>

      {/* ====== BY THE NUMBERS ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">By the numbers</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            Built different. Built faster.
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '50+', label: 'Projects delivered' },
            { value: '98%', label: 'Client satisfaction' },
            { value: '1-2d', label: 'Average delivery' },
            { value: '24/7', label: 'Support & monitoring' },
          ].map((stat, i) => (
            <StaggerItem key={stat.label} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 text-center bg-sm-surface/20">
                <div className="text-4xl font-display font-bold text-sm-accent mb-2">{stat.value}</div>
                <div className="text-sm text-sm-muted font-mono uppercase tracking-wider">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </div>

        {/* Speed comparison animation */}
        <AnimatedSection>
          <SpeedComparison />
        </AnimatedSection>
      </section>

      {/* ====== WHAT WE BUILD ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">What we build</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            Everything your business needs to run on autopilot
          </h2>
        </AnimatedSection>

        {/* Tab navigation */}
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabGroups.map((tab, i) => (
              <button
                key={tab.title}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all duration-200 ${
                  activeTab === i
                    ? 'text-sm-accent border-b-2 border-sm-accent'
                    : 'text-sm-muted hover:text-sm-accent'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {tabGroups[activeTab].services.map((service, i) => (
              <div key={service.title} className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/30 hover:bg-sm-surface/50 transition-all duration-200">
                <service.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ====== OUR PROCESS ====== */}
      <section id="process" className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            From quote to launch in days, not months
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="shimmer-border-subtle border border-white/[0.06] rounded-2xl p-8">
            {/* Desktop flow */}
            <div className="hidden md:block">
              <div className="relative flex items-center justify-between mb-12">
                {/* Connecting line */}
                <div className="absolute top-8 left-8 right-8 h-px border-t border border-white/[0.08] dash-flow"></div>
                
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.num} className="relative flex-1 text-center">
                    <div className="w-16 h-16 rounded-full bg-sm-accent text-sm-bg flex items-center justify-center font-mono font-bold text-lg mx-auto mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-sm-muted max-w-48 mx-auto">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile flow */}
            <div className="md:hidden space-y-8">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sm-accent text-sm-bg flex items-center justify-center font-mono font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-sm-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ====== WHY STACKMATE ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">Why Stackmate</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            See how we stack up
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {/* Header */}
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 font-mono text-xs uppercase tracking-wider text-sm-muted">
            <div></div>
            <div>DELIVERY</div>
            <div>AI</div>
            <div>PERTH</div>
            <div>SUPPORT</div>
            <div>PRICE</div>
          </div>

          {/* Stackmate row */}
          <AnimatedSection>
            <div className="shimmer-border border border-white/[0.06] rounded-xl p-6 bg-sm-accent/5">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                <div className="col-span-2 md:col-span-1 font-display font-bold text-lg flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={24} height={24} className="invert" />
                  Stackmate
                </div>
                <div className="text-sm-accent font-mono font-semibold">{STACKMATE.delivery}</div>
                <div><CheckCircle2 className="w-5 h-5 text-sm-accent" /></div>
                <div className="text-sm-accent font-mono font-semibold">{STACKMATE.perth}</div>
                <div className="text-sm-accent font-mono font-semibold">{STACKMATE.support}</div>
                <div className="text-sm-accent font-mono font-semibold">{STACKMATE.price}</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Competitor rows */}
          {COMPETITORS.map((comp, i) => (
            <StaggerItem key={comp.name} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                  <div className="col-span-2 md:col-span-1 font-semibold text-sm-muted">{comp.name}</div>
                  <div className="text-sm-muted font-mono">{comp.delivery}</div>
                  <div><XIcon className="w-5 h-5 text-red-400/50" /></div>
                  <div className="text-sm-muted font-mono">{comp.perth}</div>
                  <div className="text-sm-muted font-mono">{comp.support}</div>
                  <div className="text-sm-muted font-mono">{comp.price}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== INDUSTRIES ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">Industries</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
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
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 h-full hover:border-sm-accent/20 transition-all duration-300">
                <h3 className="text-xl font-display font-bold mb-3">{ind.title}</h3>
                <p className="text-sm text-sm-muted mb-6 leading-relaxed">{ind.desc}</p>
                <ul className="space-y-2">
                  {ind.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-sm-accent rounded-full"></div>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== WHAT YOU GET ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">What you get</p>
          <div className="font-mono text-xs uppercase tracking-wider text-center text-sm-accent mb-8">INCLUDED</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
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
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-lg p-4 bg-sm-surface/20 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sm-accent shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== THE STACKMATE EFFECT ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        {/* Giant quote marks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[20rem] font-serif text-sm-accent opacity-[0.05] leading-none">&ldquo;</div>
        </div>
        
        <AnimatedSection>
          <div className="text-center relative z-10">
            <p className="eyebrow mb-6">The Stackmate Effect</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-6">
              When you become a Stackmate, you enter a new era of AI adoption and API integration.
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto">
              Your business stops running on manual effort and starts running on systems that think, connect, and scale without you.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ====== INTEGRATIONS ====== */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <AnimatedSection>
            <p className="eyebrow mb-4 text-center">Integrations</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center">
              We connect with everything you already use
            </h2>
          </AnimatedSection>
        </div>
        <div className="space-y-4">
          <LogoMarquee items={INTEGRATIONS_ROW1} direction="left" speed={35} />
          <LogoMarquee items={INTEGRATIONS_ROW2} direction="right" speed={40} />
          <LogoMarquee items={INTEGRATIONS_ROW3} direction="left" speed={45} />
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-center mb-12">
            Common questions
          </h2>
        </AnimatedSection>
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a }
          }))
        }) }} />

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <StaggerItem key={faq.q} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-sm-surface/20 transition-all duration-200"
                >
                  <span className="font-display font-semibold text-lg pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-sm-muted transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm text-sm-muted leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== FREE AUDIT CTA ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="shimmer-border border border-white/[0.06] rounded-2xl p-12 bg-sm-accent/5 text-center">
            <p className="eyebrow mb-6">Free Audit</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              Not sure where AI fits? Get a free audit.
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-8">
              We&apos;ll analyse your business operations and show you exactly where AI and automation can save time, cut costs, and help you scale. No cost, no obligation. We respond within 48 hours.
            </p>
            <button
              onClick={() => setQuoteOpen(true)}
              className="px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              GET YOUR FREE AI AUDIT
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-8">
            Ready to build something that actually works?
          </h2>
          <button
            onClick={() => setQuoteOpen(true)}
            className="px-10 py-5 bg-sm-accent text-sm-bg font-mono text-lg uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
          >
            GET YOUR FREE QUOTE
          </button>
        </AnimatedSection>
      </section>

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
              <a href="#process" className="hover:text-sm-accent transition-colors">PROCESS</a>
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
