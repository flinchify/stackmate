'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { UtensilsCrossed, Clock, CalendarCheck, Phone, Users, Globe, Zap, MessageSquare, BarChart3, ChevronDown, MapPin, ArrowRight, CheckCircle2, Mail, Star } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

/* ── Inline animation helpers ── */

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

/* ── Data ── */

const PAIN_POINTS = [
  {
    icon: BarChart3,
    title: 'Third-party apps taking 30% of every order',
    desc: 'UberEats, DoorDash, and Menulog are eating your margins. Every order through their platform is profit you never see. Your food, your brand, their cut.',
  },
  {
    icon: CalendarCheck,
    title: 'No-shows costing you thousands',
    desc: 'Empty tables on a Friday night with a full waitlist. Wasted prep, wasted staff hours, wasted revenue. Without a system, no-shows are just part of the game.',
  },
  {
    icon: Users,
    title: 'One-time diners who never come back',
    desc: 'Great meal, great service, and then silence. Without a retention system, every customer walks out the door and forgets you exist within a week.',
  },
  {
    icon: Phone,
    title: 'Staff answering phones instead of serving',
    desc: 'Peak service and the phone is ringing off the hook. Missed calls mean missed bookings. Your team should be on the floor, not stuck on hold.',
  },
];

const SOLUTIONS = [
  {
    icon: Globe,
    title: 'Custom online ordering',
    desc: 'Your own branded ordering system with zero commission fees. Direct orders, direct revenue, direct customer data. Works on mobile, desktop, and in-venue QR.',
  },
  {
    icon: CalendarCheck,
    title: 'AI table booking with no-show protection',
    desc: 'Automated booking confirmations, SMS reminders, and deposit collection. Customers confirm or cancel ahead of time so you can fill empty seats before service.',
  },
  {
    icon: Mail,
    title: 'Automated SMS and email loyalty campaigns',
    desc: 'Trigger-based marketing that brings diners back. Birthday offers, re-engagement sequences, and seasonal promotions that run on autopilot.',
  },
  {
    icon: MessageSquare,
    title: 'AI phone agent for reservations',
    desc: 'An AI voice agent that answers calls, takes bookings, handles dietary questions, and never puts anyone on hold. Works 24/7 so you never miss a reservation.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Menu management dashboard',
    desc: 'Update menus, prices, specials, and availability from one central dashboard. Changes go live instantly across your website, ordering system, and booking pages.',
  },
  {
    icon: Star,
    title: 'Review collection and response automation',
    desc: 'Automatically request Google reviews after every visit. AI-drafted responses to every review, positive or negative, to protect your reputation while you focus on service.',
  },
];

const STATS = [
  { value: '30+', label: 'Perth hospitality businesses helped' },
  { value: '85%', label: 'Average reduction in no-shows' },
  { value: '$0', label: 'Commission on orders through your own system' },
  { value: '< 48hrs', label: 'To launch your ordering system' },
];

const FAQS = [
  {
    q: 'How much does it cost to build a custom ordering and booking system?',
    a: 'Every restaurant is different, so we scope and quote based on your specific needs. Most projects start from a few thousand dollars and scale based on features like AI phone agents, loyalty automation, and multi-location support. We provide a detailed quote within 24 hours of your enquiry.',
  },
  {
    q: 'How long does it take to go live?',
    a: 'Most ordering systems launch within 48 hours. Booking systems with AI no-show protection typically take 3-5 days. Full-stack builds including loyalty, phone agents, and review automation are delivered within 1-2 weeks. We move fast because we build in-house, not offshore.',
  },
  {
    q: 'Will it integrate with my existing POS?',
    a: 'Yes. We integrate with all major POS systems used across Perth including Square, Lightspeed, Kounta, and Impos. If you use something niche, we build a custom integration so orders and bookings sync automatically.',
  },
  {
    q: 'How does the AI booking system reduce no-shows?',
    a: 'The system sends automated SMS confirmations and reminders at strategic intervals before the reservation. If a customer does not confirm, their table is released and the next person on the waitlist is notified. Optional deposit collection adds another layer of commitment. The result is an average 85% reduction in no-shows across our clients.',
  },
  {
    q: 'Do you provide ongoing support after launch?',
    a: 'Absolutely. Every build comes with 30 days of included support. After that, we offer ongoing maintenance plans that cover updates, monitoring, campaign management, and priority support. Most of our restaurant clients stay on a monthly plan because the system keeps generating value.',
  },
];

/* ── Page ── */

export default function RestaurantsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* JSON-LD Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Ordering, Booking & Retention Systems for Restaurants',
        description: 'AI-powered ordering, table booking, and customer retention systems for Perth restaurants and hospitality venues.',
        provider: {
          '@type': 'Organization',
          name: 'Stackmate',
          url: 'https://stackmate.digital',
          areaServed: {
            '@type': 'City',
            name: 'Perth',
            containedInPlace: { '@type': 'State', name: 'Western Australia' },
          },
        },
        serviceType: 'Restaurant Technology Solutions',
        areaServed: {
          '@type': 'City',
          name: 'Perth',
          containedInPlace: { '@type': 'State', name: 'Western Australia' },
        },
      }) }} />

      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Restaurants &amp; Hospitality</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Fill more seats. Waste less food.<br />Run a tighter service.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            Perth restaurants need more than a website. They need systems that handle ordering, booking, and retention automatically &mdash; so you can focus on what happens in the kitchen and on the floor.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => setQuoteOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              GET YOUR FREE QUOTE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.12] text-sm-light font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-surface/30 transition-all duration-200 font-medium"
            >
              FREE RESTAURANT AUDIT
            </a>
          </div>
        </motion.div>
      </section>

      {/* ====== PAIN POINTS ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-4">
            Sound familiar?
          </h2>
          <p className="text-sm-muted text-center max-w-2xl mx-auto mb-16">
            Most Perth restaurants are bleeding money to problems that technology solved years ago. Here is what we hear every week.
          </p>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <StaggerItem key={point.title} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full">
                <point.icon className="w-8 h-8 text-sm-accent mb-4" />
                <h3 className="text-lg font-display font-bold mb-2">{point.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{point.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== WHAT WE BUILD ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">What We Build</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-4">
            Systems that run your front-of-house
          </h2>
          <p className="text-sm-muted text-center max-w-2xl mx-auto mb-16">
            Every tool is built bespoke for your venue. No templates, no subscriptions to platforms that own your data, no compromises.
          </p>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((solution, i) => (
            <StaggerItem key={solution.title} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 bg-sm-surface/20 h-full hover:border-sm-accent/20 transition-all duration-300">
                <solution.icon className="w-8 h-8 text-sm-light mb-4" />
                <h3 className="text-lg font-display font-bold mb-2">{solution.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{solution.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">By The Numbers</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-16">
            Results that speak for themselves
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StaggerItem key={stat.label} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl p-6 text-center bg-sm-surface/20">
                <p className="text-3xl md:text-4xl font-display font-bold text-sm-accent mb-2">{stat.value}</p>
                <p className="text-sm text-sm-muted">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-center mb-12">
            Common questions from restaurant owners
          </h2>
        </AnimatedSection>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }} />

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <StaggerItem key={faq.q} index={i}>
              <div className="shimmer-border-subtle border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-sm-surface/20 transition-all duration-200"
                >
                  <span className="font-display font-semibold text-lg pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-sm-muted flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
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
            <p className="eyebrow mb-6">Free Restaurant Audit</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              Not sure where to start? Get a free restaurant audit.
            </h2>
            <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-8">
              We&apos;ll analyse your ordering, booking, and retention setup and show you exactly where you&apos;re losing revenue. No cost, no obligation. We respond within 48 hours.
            </p>
            <a
              href="/audit"
              className="inline-block px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              GET YOUR FREE RESTAURANT AUDIT
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Ready to take back control of your restaurant?
          </h2>
          <p className="text-lg text-sm-muted max-w-2xl mx-auto mb-8">
            Stop paying commissions to third-party apps. Stop losing money to no-shows. Start building systems that work for you, not against you.
          </p>
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
