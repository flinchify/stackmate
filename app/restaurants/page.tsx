'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { UtensilsCrossed, CalendarCheck, Phone, Users, BarChart3, CheckCircle2, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
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

const PACKAGES = [
  {
    tier: 'Starter',
    subtitle: 'Single Venue',
    features: [
      'Website with menu',
      'Online ordering system',
      'Google integration',
      'Basic reservation system',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    subtitle: 'Busy Venue',
    features: [
      'Everything in Starter',
      'AI phone ordering',
      'Loyalty and retention system',
      'Automated marketing (SMS/email)',
      'Review management',
    ],
    highlight: false,
  },
  {
    tier: 'Pro',
    subtitle: 'Multi-Venue / Chain',
    features: [
      'Everything in Growth',
      'Multi-location dashboard',
      'Inventory automation',
      'Staff scheduling',
      'Delivery platform integrations',
      'Analytics',
    ],
    highlight: true,
  },
];

const PAIN_POINTS = [
  {
    icon: BarChart3,
    title: 'Third-party apps taking 30% of every order',
    desc: 'UberEats, DoorDash, and Menulog are eating your margins. Every order through their platform is profit you never see.',
  },
  {
    icon: CalendarCheck,
    title: 'No-shows costing you thousands',
    desc: 'Empty tables on a Friday night with a full waitlist. Wasted prep, wasted staff hours, wasted revenue.',
  },
  {
    icon: Users,
    title: 'One-time diners who never come back',
    desc: 'Great meal, great service, and then silence. Without a retention system, every customer walks out the door and forgets you exist.',
  },
  {
    icon: Phone,
    title: 'Staff answering phones instead of serving',
    desc: 'Peak service and the phone is ringing off the hook. Missed calls mean missed bookings. Your team should be on the floor, not stuck on hold.',
  },
];

const FAQS = [
  {
    q: 'Which package is right for my restaurant?',
    a: 'If you are a single venue getting set up with online ordering and reservations, Starter covers the essentials. If you are a busy venue that needs AI phone ordering, loyalty automation, and review management, Growth is the right fit. Running multiple locations or a chain? Pro gives you the full operational stack. Not sure? Get a free audit and we will recommend the right tier.',
  },
  {
    q: 'How long does it take to go live?',
    a: 'Most ordering systems launch within 48 hours. Booking systems with AI no-show protection typically take 3-5 days. Full-stack builds including loyalty, phone agents, and review automation are delivered within 1-2 weeks.',
  },
  {
    q: 'Will it integrate with my existing POS?',
    a: 'Yes. We integrate with all major POS systems used across Perth including Square, Lightspeed, Kounta, and Impos. If you use something niche, we build a custom integration so orders and bookings sync automatically.',
  },
  {
    q: 'How does the AI booking system reduce no-shows?',
    a: 'The system sends automated SMS confirmations and reminders at strategic intervals before the reservation. If a customer does not confirm, their table is released and the next person on the waitlist is notified. Optional deposit collection adds another layer of commitment.',
  },
  {
    q: 'Do you provide ongoing support after launch?',
    a: 'Absolutely. Every build comes with 30 days of included support. After that, we offer ongoing maintenance plans that cover updates, monitoring, campaign management, and priority support.',
  },
];

/* ── Page ── */

export default function RestaurantPackagesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* JSON-LD Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Restaurant Technology Packages',
        description: 'Ordering, booking, and retention system packages for Perth restaurants and hospitality venues. From single-venue essentials to multi-location operational stacks.',
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

      {/* JSON-LD FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }) }} />

      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ====== HERO ====== */}
      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-4">Packages for Restaurants</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Choose the right system<br />for your venue
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            Perth restaurants need more than a website. Whether you run a single venue or a chain across the city, there is a package built to match where you are now and where you are heading.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="/audit"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              GET YOUR FREE AUDIT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.12] text-sm-light font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-surface/30 transition-all duration-200 font-medium"
            >
              GET A QUOTE
            </button>
          </div>
        </motion.div>
      </section>

      {/* ====== PACKAGE CARDS ====== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">Packages</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-center mb-4">
            Three tiers. One goal.
          </h2>
          <p className="text-sm-muted text-center max-w-2xl mx-auto mb-16">
            Every package is built to reduce your dependency on third-party platforms, automate front-of-house operations, and bring customers back through the door.
          </p>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => (
            <StaggerItem key={pkg.tier} index={i}>
              <div className={`${pkg.highlight ? 'shimmer-border' : 'shimmer-border-subtle'} border border-white/[0.06] rounded-xl p-8 bg-sm-surface/20 h-full flex flex-col`}>
                <p className="text-2xl font-display font-bold">{pkg.tier}</p>
                <p className="text-sm text-sm-muted mb-6">{pkg.subtitle}</p>
                <ul className="space-y-3 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sm-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-sm-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setQuoteOpen(true)}
                  className={`mt-8 w-full py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-200 font-medium ${
                    pkg.highlight
                      ? 'bg-sm-accent text-sm-bg hover:bg-sm-accent-light'
                      : 'border border-white/[0.12] text-sm-light hover:bg-sm-surface/30'
                  }`}
                >
                  Get a Quote
                </button>
              </div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* ====== CUSTOM SECTION ====== */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="shimmer-border border border-white/[0.06] rounded-2xl p-12 bg-sm-accent/5 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4">
              Need something different? We build custom.
            </h2>
            <p className="text-sm-muted max-w-xl mx-auto mb-8">
              If your venue does not fit neatly into a tier, we will scope a custom solution around your exact requirements. No templates, no compromises.
            </p>
            <a
              href="/packages/custom"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
            >
              EXPLORE CUSTOM BUILDS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </AnimatedSection>
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

      {/* ====== FAQ ====== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="eyebrow mb-4 text-center">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-center mb-12">
            Common questions from restaurant owners
          </h2>
        </AnimatedSection>

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
