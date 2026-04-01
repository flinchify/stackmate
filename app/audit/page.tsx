'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle, Brain, Search, BarChart3, Zap } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

export default function AuditPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    employees: '',
    description: '',
  });

  const inputClass = 'w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-orange-500/30 transition-colors';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.description) {
      setError('Please fill in company name, email, and what your business does.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          industry: form.industry || 'other',
          employees: form.employees || '1-5',
          services: ['consulting'],
          description: `[FREE AI AUDIT REQUEST] Contact: ${form.contactName}. Phone: ${form.phone}. Website: ${form.website}. Business: ${form.description}`,
          email: form.email,
          urgency: 'standard',
        }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-orange-400 uppercase tracking-widest mb-4">Free AI Audit</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Find out where AI can transform your business.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            We&apos;ll analyse your operations and show you exactly where automation and AI can save time, cut costs, and scale your business. Completely free. Response within 48 hours.
          </p>
        </motion.div>
      </section>

      {/* What you get */}
      <section className="pb-16 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Search, title: 'Operations Scan', desc: 'We map your current workflows and identify manual bottlenecks.' },
            { icon: Brain, title: 'AI Opportunity Map', desc: 'Specific recommendations for where AI and automation fit your business.' },
            { icon: BarChart3, title: 'ROI Projection', desc: 'Estimated time and cost savings for each automation opportunity.' },
            { icon: Zap, title: 'Action Plan', desc: 'Prioritised roadmap — what to automate first for maximum impact.' },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl border border-sm-border bg-sm-card/30"
            >
              <item.icon className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="font-display font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-sm-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 max-w-2xl mx-auto px-6">
        {submitted ? (
          <motion.div
            className="text-center p-12 rounded-xl border border-sm-border bg-sm-card/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Audit Request Received</h2>
            <p className="text-sm-light">We&apos;ll review your business and send your AI audit within 48 hours. Check your email.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-display font-bold mb-2">Request Your Free Audit</h2>
            <p className="text-sm text-sm-muted mb-6">Takes 2 minutes. We respond within 48 hours.</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Company Name *</label>
                <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputClass} placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Your Name</label>
                <input type="text" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className={inputClass} placeholder="John Smith" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+61 4XX XXX XXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-sm-light mb-1.5">Website (optional)</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} placeholder="https://yourcompany.com" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Industry</label>
                <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  <option value="mining">Mining & Resources</option>
                  <option value="construction">Construction</option>
                  <option value="retail">Retail & E-Commerce</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="agency">Agency / Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-sm-light mb-1.5">Team Size</label>
                <select value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  <option value="1-5">1-5</option>
                  <option value="6-20">6-20</option>
                  <option value="21-50">21-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-sm-light mb-1.5">Tell us about your business and what you do *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none h-32`} placeholder="What does your business do? What manual processes take the most time? What would you automate if you could?" />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {submitting ? 'Submitting...' : 'Get My Free AI Audit'}
            </button>
            <p className="text-xs text-sm-muted text-center">No cost. No obligation. We respond within 48 hours.</p>
          </form>
        )}
      </section>
    </main>
  );
}
