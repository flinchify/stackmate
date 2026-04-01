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
