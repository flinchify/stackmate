'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface ClientQuote {
  id: string; accessCode: string; clientName: string; clientEmail: string; title: string;
  description: string; items: { description: string; amount: number }[]; subtotal: number;
  gst: number; total: number; validUntil: string; status: string; paymentType: string;
  monthlyAmount?: number; setupFee?: number; paymentTerms: string; cancellationPolicy: string;
  createdAt: string; acceptedAt?: string; notes?: string;
}

export default function ClientQuotePage() {
  const { code } = useParams<{ code: string }>();
  const [quote, setQuote] = useState<ClientQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/quote/${code}`)
      .then(r => r.json())
      .then(data => { if (data.quote) setQuote(data.quote); else setError('Quote not found.'); })
      .catch(() => setError('Failed to load quote.'))
      .finally(() => setLoading(false));
  }, [code]);

  const handleAction = async (action: 'accept' | 'reject') => {
    setActionLoading(true);
    const res = await fetch(`/api/quote/${code}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
    const data = await res.json();
    if (data.quote) setQuote(data.quote);
    setActionLoading(false);
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center"><p className="text-sm-muted">Loading quote...</p></main>;
  if (error || !quote) return <main className="min-h-screen flex items-center justify-center"><p className="text-sm-muted">{error || 'Quote not found.'}</p></main>;

  const isExpired = new Date(quote.validUntil) < new Date() && !['accepted', 'rejected'].includes(quote.status);
  const canAct = ['sent', 'viewed'].includes(quote.status) && !isExpired;

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Stackmate" width={32} height={32} className="invert" />
            <span className="font-display font-bold text-lg">stackmate</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-sm border ${
            quote.status === 'accepted' ? 'border-green-500/30 text-green-400 bg-green-400/10' :
            quote.status === 'rejected' ? 'border-red-500/30 text-red-400 bg-red-400/10' :
            isExpired ? 'border-red-500/30 text-red-400 bg-red-400/10' :
            'border-orange-500/30 text-orange-400 bg-orange-400/10'
          } capitalize`}>
            {isExpired ? 'Expired' : quote.status}
          </span>
        </div>

        {/* Quote info */}
        <div className="mb-8">
          <p className="text-sm text-sm-muted mb-1">Quote for</p>
          <h1 className="text-3xl font-display font-bold mb-1">{quote.clientName}</h1>
          <h2 className="text-xl text-sm-light mb-4">{quote.title}</h2>
          <p className="text-sm text-sm-light leading-relaxed">{quote.description}</p>
        </div>

        {/* Line items */}
        <div className="border border-sm-border rounded-sm overflow-hidden mb-6">
          <div className="p-4 bg-sm-card/50 border-b border-sm-border flex justify-between text-xs text-sm-muted font-semibold uppercase tracking-wider">
            <span>Description</span><span>Amount</span>
          </div>
          {quote.items.map((item, i) => (
            <div key={i} className="p-4 border-b border-sm-border last:border-0 flex justify-between">
              <span className="text-sm text-sm-light">{item.description}</span>
              <span className="text-sm font-semibold">${item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="p-4 bg-sm-card/30 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-sm-muted">Subtotal</span><span>${quote.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-sm-muted">GST (10%)</span><span>${quote.gst.toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-display font-bold border-t border-sm-border pt-2 mt-2">
              <span>Total</span><span className="text-orange-400">${quote.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Subscription info */}
        {quote.paymentType === 'subscription' && quote.monthlyAmount && (
          <div className="p-4 rounded-sm border border-orange-500/20 bg-orange-500/5 mb-6">
            <p className="text-sm font-semibold text-orange-400 mb-1">Subscription</p>
            <p className="text-sm text-sm-light">
              {quote.setupFee ? `$${quote.setupFee.toLocaleString()} setup fee + ` : ''}
              ${quote.monthlyAmount.toLocaleString()}/month ongoing
            </p>
          </div>
        )}

        {/* Terms */}
        <div className="space-y-4 mb-8 text-sm">
          <div className="flex items-center gap-2 text-sm-muted"><Clock className="w-4 h-4" /> Valid until: {new Date(quote.validUntil).toLocaleDateString()}</div>
          <details className="group">
            <summary className="cursor-pointer text-sm-muted hover:text-white transition-colors flex items-center gap-2"><FileText className="w-4 h-4" /> Payment Terms</summary>
            <p className="mt-2 text-sm-light pl-6">{quote.paymentTerms}</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer text-sm-muted hover:text-white transition-colors flex items-center gap-2"><FileText className="w-4 h-4" /> Cancellation Policy</summary>
            <p className="mt-2 text-sm-light pl-6">{quote.cancellationPolicy}</p>
          </details>
        </div>

        {quote.notes && <p className="text-sm text-sm-muted mb-8">{quote.notes}</p>}

        {/* Actions */}
        {canAct && (
          <div className="flex gap-3">
            <button onClick={() => handleAction('accept')} disabled={actionLoading}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-bold rounded-sm transition-all hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Accept Quote
            </button>
            <button onClick={() => handleAction('reject')} disabled={actionLoading}
              className="px-6 py-4 border border-sm-border text-sm-muted font-semibold rounded-sm hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Decline
            </button>
          </div>
        )}

        {quote.status === 'accepted' && (
          <div className="p-6 rounded-sm border border-green-500/20 bg-green-500/5 text-center">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="font-display font-bold text-lg mb-1">Quote Accepted</p>
            <p className="text-sm text-sm-muted">We&apos;ll send payment details to {quote.clientEmail} shortly.</p>
          </div>
        )}

        {(quote.status === 'rejected' || isExpired) && (
          <div className="p-6 rounded-sm border border-sm-border bg-sm-card/30 text-center">
            <p className="text-sm text-sm-muted">{isExpired ? 'This quote has expired.' : 'This quote was declined.'} Contact us for a new quote.</p>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-sm-muted">
          <p>Stackmate &middot; Perth, Western Australia &middot; stackmate.digital</p>
        </div>
      </div>
    </main>
  );
}
