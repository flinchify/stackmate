'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const INDUSTRIES = [
  { value: 'mining', label: 'Mining & Resources' },
  { value: 'oil-gas', label: 'Oil & Gas' },
  { value: 'construction', label: 'Construction' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail & E-Commerce' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'agency', label: 'Agency / Marketing' },
  { value: 'other', label: 'Other' },
];

const EMPLOYEE_RANGES = ['1-5', '6-20', '21-50', '51-200', '200+'];

const SERVICES = [
  { value: 'ai-agents', label: 'AI Agents & Chatbots' },
  { value: 'automation', label: 'Business Automation' },
  { value: 'custom-software', label: 'Custom Software' },
  { value: 'website', label: 'Website / Web App' },
  { value: 'integrations', label: 'System Integrations' },
  { value: 'branding', label: 'Branding & Design' },
  { value: 'data-analytics', label: 'Data & Analytics' },
  { value: 'consulting', label: 'AI Consulting' },
];

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    employees: '',
    services: [] as string[],
    description: '',
    email: '',
    phone: '',
    urgency: 'standard' as 'standard' | 'fast' | 'asap',
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const toggleService = (value: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((s) => s !== value)
        : [...prev.services, value],
    }));
  };

  const canAdvance = () => {
    switch (step) {
      case 0: return form.companyName && form.industry && form.employees;
      case 1: return form.services.length > 0;
      case 2: return form.description.length > 10;
      case 3: return form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setSubmitted(false);
    setError('');
    setForm({ companyName: '', industry: '', employees: '', services: [], description: '', email: '', phone: '', urgency: 'standard' });
    onClose();
  };

  const steps = ['Company', 'Services', 'Details', 'Contact'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-sm-card border border-sm-border rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-sm-muted" />
            </button>

            {submitted ? (
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">Quote Request Sent</h3>
                <p className="text-sm-light mb-6">
                  We'll review your requirements and get back to you within 24 hours with a custom proposal.
                </p>
                <button onClick={reset} className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
                  Done
                </button>
              </motion.div>
            ) : (
              <div className="p-8">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                  {steps.map((label, i) => (
                    <div key={label} className="flex-1">
                      <div className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-white' : 'bg-sm-border'}`} />
                      <p className={`text-xs mt-1 transition-colors duration-300 ${i <= step ? 'text-white' : 'text-sm-muted'}`}>{label}</p>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <h3 className="text-xl font-display font-bold mb-6">Tell us about your business</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Company Name</label>
                          <input
                            type="text"
                            value={form.companyName}
                            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Industry</label>
                          <select
                            value={form.industry}
                            onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
                          >
                            <option value="">Select industry</option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind.value} value={ind.value}>{ind.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Team Size</label>
                          <div className="flex gap-2 flex-wrap">
                            {EMPLOYEE_RANGES.map((range) => (
                              <button
                                key={range}
                                onClick={() => setForm({ ...form, employees: range })}
                                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                                  form.employees === range
                                    ? 'bg-white text-black border-white'
                                    : 'border-sm-border text-sm-light hover:border-white/30'
                                }`}
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <h3 className="text-xl font-display font-bold mb-6">What do you need?</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {SERVICES.map((svc) => (
                          <button
                            key={svc.value}
                            onClick={() => toggleService(svc.value)}
                            className={`p-3 rounded-lg border text-sm text-left transition-all ${
                              form.services.includes(svc.value)
                                ? 'bg-white text-black border-white'
                                : 'border-sm-border text-sm-light hover:border-white/30'
                            }`}
                          >
                            {svc.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-sm-muted mt-3">Select all that apply</p>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <h3 className="text-xl font-display font-bold mb-6">Project details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Describe what you need</label>
                          <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 transition-colors resize-none h-32"
                            placeholder="Tell us about your project, goals, and any specific requirements..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Timeline</label>
                          <div className="flex gap-2">
                            {[
                              { value: 'standard', label: 'Standard (2-4 weeks)' },
                              { value: 'fast', label: 'Fast (1-2 weeks)' },
                              { value: 'asap', label: 'ASAP' },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setForm({ ...form, urgency: opt.value as 'standard' | 'fast' | 'asap' })}
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                                  form.urgency === opt.value
                                    ? 'bg-white text-black border-white'
                                    : 'border-sm-border text-sm-light hover:border-white/30'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <h3 className="text-xl font-display font-bold mb-6">How do we reach you?</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Email</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="you@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-sm-light mb-1.5">Phone (optional)</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="+61 4XX XXX XXX"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p className="text-red-400 text-sm mt-4">{error}</p>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                      step === 0 ? 'opacity-0 pointer-events-none' : 'text-sm-light hover:text-white'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => Math.min(3, s + 1))}
                      disabled={!canAdvance()}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canAdvance() || submitting}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {submitting ? 'Sending...' : 'Get My Quote'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
