'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, X as XIcon, Zap, MapPin, Clock, Shield, Brain, Rocket } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';
import Counter from '@/components/Counter';

const COMPETITORS = [
  { name: 'Traditional Agency', delivery: '8-12 weeks', ai: false, perth: 'Sometimes', support: 'Email only', price: '$$$' },
  { name: 'Freelancer', delivery: '4-8 weeks', ai: false, perth: 'Rarely', support: 'Limited', price: '$$' },
  { name: 'Offshore Team', delivery: '6-10 weeks', ai: false, perth: 'Never', support: 'Timezone issues', price: '$' },
];

const STACKMATE = { name: 'Stackmate', delivery: '1-2 days', ai: true, perth: 'Always', support: '24/7 + AI', price: 'Fair' };

const REASONS = [
  { icon: Zap, title: '1-2 Day Delivery', desc: 'While other agencies are writing proposals, we\'re shipping. AI-accelerated development means you get working software in days, not months.' },
  { icon: Brain, title: 'AI-Native', desc: 'We don\'t bolt AI onto legacy processes. Every system we build is AI-first — smarter, faster, and more capable than anything a traditional agency can deliver.' },
  { icon: MapPin, title: 'Perth Based', desc: 'Same timezone. Same city. We understand WA business, mining regulations, and local market dynamics. No offshore communication gaps.' },
  { icon: Clock, title: '24/7 Support', desc: 'Your systems don\'t sleep. Neither does our monitoring. AI-powered support catches issues before your customers do.' },
  { icon: Shield, title: 'You Own Everything', desc: 'No proprietary lock-in. No hostage code. Everything we build is yours. Want to leave? Take it all with you.' },
  { icon: Rocket, title: 'Built to Scale', desc: 'We don\'t build fragile prototypes. Every system is engineered to handle 10x your current load from day one.' },
];

function AnimatedDiv({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export default function WhyUsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Why Stackmate</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            We&apos;re not another agency. We&apos;re faster.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            10x faster than traditional agencies. AI-native from the ground up. Perth-based, globally capable.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="pb-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { target: 50, suffix: '+', label: 'Projects Delivered' },
            { target: 98, suffix: '%', label: 'Client Satisfaction' },
            { target: 10, suffix: 'x', label: 'Faster Than Agencies' },
            { target: 1, suffix: '-2 days', label: 'Average Delivery' },
          ].map((stat, i) => (
            <AnimatedDiv key={stat.label} index={i} className="text-center p-6 rounded-xl border border-sm-border bg-sm-card/30">
              <div className="text-3xl font-display font-bold">
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-sm-muted mt-1">{stat.label}</p>
            </AnimatedDiv>
          ))}
        </div>
      </section>

      {/* Reasons */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, i) => (
            <AnimatedDiv key={reason.title} index={i}
              className="p-8 rounded-xl border border-sm-border bg-sm-card/30 hover:bg-sm-card/60 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <reason.icon className="w-8 h-8 text-sm-light mb-4" />
              <h3 className="text-lg font-display font-bold mb-2">{reason.title}</h3>
              <p className="text-sm text-sm-muted leading-relaxed">{reason.desc}</p>
            </AnimatedDiv>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-sm-card/20">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedDiv className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">See how we compare</h2>
          </AnimatedDiv>

          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-6 gap-4 px-6 text-sm text-sm-muted">
              <div></div><div>Delivery</div><div>AI-Powered</div><div>Perth Based</div><div>Support</div><div>Pricing</div>
            </div>

            <AnimatedDiv>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 rounded-xl border-2 border-white/20 bg-white/5">
                <div className="col-span-2 md:col-span-1 font-display font-bold text-lg flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={24} height={24} className="invert" /> Stackmate
                </div>
                <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Delivery:</span><span className="text-green-400 font-semibold">{STACKMATE.delivery}</span></div>
                <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">AI:</span><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
                <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Perth:</span><span className="text-green-400 font-semibold">{STACKMATE.perth}</span></div>
                <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Support:</span><span className="text-green-400 font-semibold">{STACKMATE.support}</span></div>
                <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Price:</span><span className="text-green-400 font-semibold">{STACKMATE.price}</span></div>
              </div>
            </AnimatedDiv>

            {COMPETITORS.map((comp, i) => (
              <AnimatedDiv key={comp.name} index={i}>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 rounded-xl border border-sm-border bg-sm-card/30">
                  <div className="col-span-2 md:col-span-1 font-semibold text-sm-light">{comp.name}</div>
                  <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Delivery:</span><span className="text-sm-muted">{comp.delivery}</span></div>
                  <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">AI:</span><XIcon className="w-5 h-5 text-red-400/50" /></div>
                  <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Perth:</span><span className="text-sm-muted">{comp.perth}</span></div>
                  <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Support:</span><span className="text-sm-muted">{comp.support}</span></div>
                  <div className="flex items-center gap-2"><span className="md:hidden text-sm-muted text-sm">Price:</span><span className="text-sm-muted">{comp.price}</span></div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedDiv className="text-center mb-10">
            <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">From first contact to handover</h2>
          </AnimatedDiv>
          <div className="space-y-3">
            {[
              { q: 'What happens after I get a quote?', a: 'We scope your project, send a detailed proposal with pricing, and once accepted, we start building immediately. Most projects go from accepted to delivered in 1-2 days.' },
              { q: 'How do I receive the finished product?', a: 'You get a private delivery portal with your project status, all deliverables (live URLs, repo access, credentials, design files), a handover checklist, and ongoing support contact. Everything in one place.' },
              { q: 'What if I already have an SEO person or dev team?', a: 'No problem. We build the site/system, push the code to your GitHub, and give your team full access — Vercel, repo, CMS, environment variables. Your SEO person manages content, we handle the infrastructure.' },
              { q: 'How does monthly SEO/GEO management work?', a: 'We run monthly audits, publish content, build backlinks, optimize structured data, and track your rankings across Google and AI search engines (ChatGPT, Perplexity, Gemini). You get a monthly report with scores, traffic, and next steps.' },
              { q: 'Do I own what you build?', a: 'Yes. 100%. Code, designs, systems — all yours. No proprietary lock-in. If you want to leave, you take everything with you.' },
              { q: 'What if I need changes after delivery?', a: 'Monthly clients get ongoing changes included. One-time projects include a 30-day warranty for bug fixes. After that, changes are billed at our standard rate or you can add a maintenance plan.' },
              { q: 'How does payment work?', a: 'Setup fees are due before work begins. Monthly subscriptions bill at the start of each period. We send invoices through our portal with 14-day payment terms. Late payments incur a 2% monthly fee.' },
              { q: 'Can I cancel a subscription?', a: '30 days written notice. No refund on setup fees. Ongoing work stops at the end of your billing period. You keep everything built to date.' },
            ].map(faq => (
              <details key={faq.q} className="group p-5 rounded-sm border border-sm-border bg-sm-card/30 cursor-pointer">
                <summary className="font-display font-semibold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-sm-muted group-open:rotate-45 transition-transform duration-200 text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm text-sm-light leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Convinced yet?</h2>
          <p className="text-black/60 mb-8">Get a quote in 60 seconds and see the difference yourself.</p>
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
