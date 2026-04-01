'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

const STEPS = [
  {
    num: '01',
    title: 'Get a Quote',
    desc: '60-second form. Tell us what your business needs — the systems, the problems, the goals. We scope it same day.',
    detail: 'No sales calls. No back-and-forth emails. Just fill out the form and we get to work understanding your requirements. You\'ll hear from us within hours, not days.',
  },
  {
    num: '02',
    title: 'Strategy Call',
    desc: 'We dive deep into your operations. Map every workflow. Find every bottleneck. Identify every opportunity.',
    detail: 'This is where we earn our money. We don\'t just build what you ask for — we figure out what you actually need. Most businesses are losing 15-25 hours a week to processes that should be automated.',
  },
  {
    num: '03',
    title: 'Build Sprint',
    desc: '1-2 day rapid builds. You see progress in hours, not weeks. Real working software, not mockups.',
    detail: 'While other agencies are still writing proposals, we\'re shipping code. Our AI-accelerated development process means we build in days what takes traditional agencies months. You get daily updates and working demos.',
  },
  {
    num: '04',
    title: 'Launch & Scale',
    desc: 'Go live with confidence. We monitor, optimize, and scale with you as your business grows.',
    detail: 'Launch isn\'t the end — it\'s the beginning. We provide ongoing monitoring, performance optimization, and scaling support. When your business grows, your systems grow with it.',
  },
];

function Step({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-[120px_1fr] gap-6 py-12 border-b border-sm-border last:border-0"
    >
      <span className="text-6xl md:text-7xl font-display font-bold text-sm-border">
        {step.num}
      </span>
      <div>
        <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">{step.title}</h3>
        <p className="text-lg text-sm-light mb-4">{step.desc}</p>
        <p className="text-sm text-sm-muted leading-relaxed">{step.detail}</p>
      </div>
    </motion.div>
  );
}

export default function ProcessPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Process</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Quote to launch in days.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            No 12-week timelines. No endless revisions. We scope fast, build faster, and ship before your competitors finish their first meeting.
          </p>
        </motion.div>
      </section>

      <section className="pb-24 max-w-5xl mx-auto px-6">
        {STEPS.map((step, i) => (
          <Step key={step.num} step={step} index={i} />
        ))}
      </section>

      <section className="py-20 bg-white text-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to start?</h2>
          <p className="text-black/60 mb-8">60 seconds to submit. 24 hours to scope. 1-2 days to build.</p>
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
