'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Wrench, Clock, FileText, Phone, Users, Globe, Zap, MessageSquare, BarChart3, ChevronDown, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Still quoting from the ute?',
    desc: 'Scribbling estimates on the back of a receipt loses you jobs. By the time you send a proper quote, the customer has already called someone else. Manual quoting is costing you thousands every month.',
  },
  {
    icon: Clock,
    title: 'No-shows and double bookings',
    desc: 'Without a proper scheduling system, jobs overlap, customers get forgotten, and your reputation takes a hit. You need a booking system that works while you are on-site.',
  },
  {
    icon: Globe,
    title: 'Invisible on Google',
    desc: 'When someone searches "plumber near me" or "electrician Perth," your competitors show up first. If you do not have a properly optimised website and Google Business profile, you are handing work to the bloke down the road.',
  },
  {
    icon: MessageSquare,
    title: 'Chasing invoices at 9pm',
    desc: 'You finish a 10-hour day on the tools and then spend your evening chasing payments, sending follow-ups, and doing admin. Automated invoicing and payment reminders fix this overnight.',
  },
];

const DELIVERABLES = [
  {
    icon: Globe,
    title: 'Mobile-first trade website',
    desc: 'Fast, professional site built for your trade. Loads in under a second, looks great on every device, and is designed to convert visitors into booked jobs.',
  },
  {
    icon: FileText,
    title: 'Instant quote calculator',
    desc: 'Customers select their job type, answer a few questions, and get a ballpark price instantly. You get a qualified lead with all the details before you even pick up the phone.',
  },
  {
    icon: Clock,
    title: 'Online booking system',
    desc: 'Let customers book available time slots directly from your website. Syncs with your calendar, sends reminders, and eliminates no-shows.',
  },
  {
    icon: Phone,
    title: 'AI receptionist',
    desc: 'Never miss a call again. When you are on a roof or under a house, our AI answers the phone, takes job details, and books the customer in. Works 24/7.',
  },
  {
    icon: BarChart3,
    title: 'Google Business optimisation',
    desc: 'We set up and optimise your Google Business Profile so you rank in local searches. Photos, reviews strategy, service areas, and weekly posts handled for you.',
  },
  {
    icon: Zap,
    title: 'Automated invoicing',
    desc: 'Job done? Invoice sent automatically. Payment overdue? Follow-up sent. Integrates with Xero, MYOB, or QuickBooks so your bookkeeper stays happy.',
  },
];

const STATS = [
  { value: '40+', label: 'Perth trade businesses helped' },
  { value: '3x', label: 'Average increase in online enquiries' },
  { value: '< 2 days', label: 'Typical build time' },
  { value: '24/7', label: 'AI handles calls while you work' },
];

const FAQS = [
  {
    q: 'How much does a tradie website cost?',
    a: 'It depends on what you need, but most trade websites start from $1,500. If you want a quote calculator, booking system, or AI receptionist bundled in, we will put together a custom package. No lock-in contracts, no hidden fees. Get a free audit first and we will tell you exactly what you need and what it will cost.',
  },
  {
    q: 'How long does it take to build?',
    a: 'Most tradie websites and systems are live within 1-2 business days. We do not do 8-week agency timelines. You brief us, we build it, you are live. If your project is more complex (custom quoting logic, integrations with trade software), it might take 3-5 days.',
  },
  {
    q: 'What trades do you work with?',
    a: 'All of them. Plumbers, electricians, builders, painters, landscapers, concreters, roofers, tilers, cabinet makers, pest control, air conditioning, solar installers — if you are a tradie in Perth, we have built for someone in your trade.',
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Yes. Every build includes 30 days of free support. After that, we offer affordable monthly plans that cover hosting, maintenance, content updates, and priority support. Most tradies pay less than $100/month to keep everything running.',
  },
  {
    q: 'Can I see examples of tradie websites you have built?',
    a: 'Absolutely. Get in touch and we will walk you through real examples from trades like yours. We do not use templates — every site is custom-built for the specific trade and business, so yours will be unique to you.',
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

export default function TradiesPage() {
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
        name: 'Tradie Websites & Business Systems',
        provider: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.digital' },
        areaServed: { '@type': 'State', name: 'Western Australia' },
        description: 'Custom websites, automated quoting, and AI-powered business systems for Perth tradies.',
        serviceType: 'Web Development and Business Automation',
      }) }} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Websites for Tradies</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Your trade deserves a website that actually books jobs
          </h1>
          <p className="text-lg text-sm-light max-w-2xl mb-8">
            Most Perth tradies lose work every week because they do not have a proper website, quoting system, or way for customers to book online. Your competitors do. We build the digital systems that turn enquiries into jobs — fast, affordable, and built specifically for your trade.
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
              Good tradies lose work to bad websites
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
              Everything a modern trade business needs
            </h2>
            <p className="text-sm-muted max-w-2xl mx-auto">
              Not templates. Not drag-and-drop builders. Custom-built systems designed for how tradies actually work — on-site, on the tools, on the go.
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
              Numbers that matter to tradies
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
              Common questions from tradies
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
                Find out what is costing you jobs
              </h2>
              <p className="text-sm-muted max-w-xl mx-auto mb-8">
                We will audit your current online presence, show you where you are losing customers, and give you a clear plan to fix it. No cost, no obligation, no sales pitch.
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
              Ready to get more jobs without the admin?
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              Tell us about your trade and we will show you exactly what we can build. Most systems are live within 48 hours.
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
