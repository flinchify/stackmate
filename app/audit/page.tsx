'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle, Brain, Search, BarChart3, Zap } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

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
    mailingList: true,
  });

  const inputClass = 'w-full px-4 py-3 bg-sm-surface border border-sm-border rounded-xl text-sm-text placeholder-sm-muted focus:outline-none focus:border-sm-accent/50 transition-colors';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.description) {
      setError('Please fill in company name, email, and what your business does.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          website: form.website,
          industry: form.industry || 'other',
          employees: form.employees || '1-5',
          description: form.description,
        }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const heroWords = ['Find', 'out', 'where', 'AI', 'can', 'transform', 'your', 'business.'];

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 max-w-6xl mx-auto px-6 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-sm-accent/15 to-sm-accent-light/10 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gradient-to-tl from-sm-accent-light/10 to-sm-accent/5 rounded-full blur-[80px] pointer-events-none animate-float-reverse" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
          >
            <div className="w-2 h-2 bg-sm-accent rounded-full animate-pulse" />
            <span className="text-xs font-medium text-sm-accent uppercase tracking-wider">FREE AI AUDIT</span>
          </motion.div>

          <div className="mb-6 leading-none">
            {heroWords.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                <span className="text-4xl md:text-6xl font-display font-extrabold tracking-[-0.02em] mr-4">
                  {word}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p 
            className="text-lg text-sm-muted max-w-2xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            We&apos;ll analyse your operations and show you exactly where automation and AI can save time, cut costs, and scale your business. Completely free. Response within 48 hours.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: Search, 
              title: 'Operations Scan', 
              desc: 'We map your current workflows and identify manual bottlenecks.' 
            },
            { 
              icon: Brain, 
              title: 'AI Opportunity Map', 
              desc: 'Specific recommendations for where AI and automation fit your business.' 
            },
            { 
              icon: BarChart3, 
              title: 'ROI Projection', 
              desc: 'Estimated time and cost savings for each automation opportunity.' 
            },
            { 
              icon: Zap, 
              title: 'Action Plan', 
              desc: 'Prioritised roadmap — what to automate first for maximum impact.' 
            },
          ].map((item, index) => (
            <StaggerItem key={item.title} index={index}>
              <motion.div
                className="glass rounded-2xl p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 p-3 rounded-xl bg-sm-surface">
                  <item.icon className="w-8 h-8 text-sm-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-sm-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-24 max-w-2xl mx-auto px-6">
        {submitted ? (
          <AnimatedSection>
            <div className="text-center glass rounded-2xl p-12">
              <CheckCircle className="w-16 h-16 text-sm-accent mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-2">Audit Request Received</h2>
              <p className="text-sm-muted">
                We&apos;ll review your business and send your AI audit within 48 hours. Check your email.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold mb-2">Request Your Free Audit</h2>
              <p className="text-sm text-sm-muted mb-8">Takes 2 minutes. We respond within 48 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sm-text mb-2">Company Name *</label>
                    <input 
                      type="text" 
                      value={form.companyName} 
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })} 
                      className={inputClass} 
                      placeholder="Acme Corp" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sm-text mb-2">Your Name</label>
                    <input 
                      type="text" 
                      value={form.contactName} 
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })} 
                      className={inputClass} 
                      placeholder="John Smith" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sm-text mb-2">Email *</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      className={inputClass} 
                      placeholder="you@company.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sm-text mb-2">Phone (optional)</label>
                    <input 
                      type="tel" 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      className={inputClass} 
                      placeholder="+61 4XX XXX XXX" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sm-text mb-2">Website (optional)</label>
                  <input 
                    type="url" 
                    value={form.website} 
                    onChange={(e) => setForm({ ...form, website: e.target.value })} 
                    className={inputClass} 
                    placeholder="https://yourcompany.com" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sm-text mb-2">Industry</label>
                    <select 
                      value={form.industry} 
                      onChange={(e) => setForm({ ...form, industry: e.target.value })} 
                      className={inputClass}
                    >
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
                    <label className="block text-sm font-medium text-sm-text mb-2">Team Size</label>
                    <select 
                      value={form.employees} 
                      onChange={(e) => setForm({ ...form, employees: e.target.value })} 
                      className={inputClass}
                    >
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
                  <label className="block text-sm font-medium text-sm-text mb-2">
                    Tell us about your business and what you do *
                  </label>
                  <textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    className={`${inputClass} resize-none h-32`} 
                    placeholder="What does your business do? What manual processes take the most time? What would you automate if you could?" 
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-display font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] glow-amber disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {submitting ? 'Submitting...' : 'Get My Free AI Audit'}
                  {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-2 text-sm text-sm-muted cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.mailingList} 
                      onChange={e => setForm({ ...form, mailingList: e.target.checked })}
                      className="rounded"
                    />
                    Keep me updated on AI & automation tips
                  </label>
                </div>

                <p className="text-xs text-sm-muted text-center">
                  No cost. No obligation. We respond within 48 hours.
                </p>
              </form>
            </div>
          </AnimatedSection>
        )}
      </section>
    </main>
  );
}