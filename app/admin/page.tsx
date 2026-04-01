'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Quote {
  id: string;
  companyName: string;
  industry: string;
  employees: string;
  services: string[];
  description: string;
  email: string;
  phone?: string;
  urgency: string;
  status: string;
  createdAt: string;
  estimate: {
    setupMin: number;
    setupMax: number;
    monthlyMin: number;
    monthlyMax: number;
    confidence: string;
    notes: string[];
  };
}

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  new: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  reviewing: { icon: Eye, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  quoted: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  accepted: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
};

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Quote | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        headers: { 'x-admin-secret': secret },
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes);
        setAuthenticated(true);
      } else {
        alert('Invalid admin secret');
      }
    } catch {
      alert('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  }, [secret]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ id, status }),
    });
    fetchQuotes();
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={(e) => { e.preventDefault(); fetchQuotes(); }}>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Quote Dashboard</h1>
            <p className="text-sm text-sm-muted">{quotes.length} total quotes</p>
          </div>
          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-sm-border rounded-lg text-sm hover:bg-sm-card transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {['new', 'reviewing', 'quoted', 'accepted', 'rejected'].map((status) => {
            const config = STATUS_CONFIG[status];
            const count = quotes.filter((q) => q.status === status).length;
            return (
              <div key={status} className={`p-4 rounded-xl border border-sm-border ${config.bg}`}>
                <p className={`text-2xl font-display font-bold ${config.color}`}>{count}</p>
                <p className="text-xs text-sm-muted capitalize">{status}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6">
          {/* Quote list */}
          <div className="flex-1 space-y-3">
            {quotes.length === 0 && (
              <div className="text-center py-16 text-sm-muted">
                <p>No quotes yet. They'll appear here when customers submit the form.</p>
              </div>
            )}
            {quotes.map((quote) => {
              const config = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
              const Icon = config.icon;
              return (
                <button
                  key={quote.id}
                  onClick={() => setSelected(quote)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === quote.id ? 'border-white/20 bg-sm-card/60' : 'border-sm-border bg-sm-card/30 hover:bg-sm-card/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{quote.companyName}</h3>
                      <p className="text-xs text-sm-muted">{quote.email}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {quote.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-sm-muted">
                    <span>{quote.industry}</span>
                    <span>{quote.employees} employees</span>
                    <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="hidden lg:block w-[400px] p-6 rounded-xl border border-sm-border bg-sm-card/30 sticky top-6 self-start">
              <h2 className="text-xl font-display font-bold mb-1">{selected.companyName}</h2>
              <p className="text-sm text-sm-muted mb-6">{selected.email} {selected.phone && `| ${selected.phone}`}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-sm-muted mb-1">Industry</p>
                  <p className="text-sm">{selected.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-sm-muted mb-1">Team Size</p>
                  <p className="text-sm">{selected.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-sm-muted mb-1">Services</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.services.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-sm-muted mb-1">Description</p>
                  <p className="text-sm text-sm-light">{selected.description}</p>
                </div>
                <div>
                  <p className="text-xs text-sm-muted mb-1">Urgency</p>
                  <p className="text-sm capitalize">{selected.urgency}</p>
                </div>
              </div>

              {/* Estimate (internal only) */}
              <div className="p-4 rounded-lg bg-sm-dark border border-sm-border mb-6">
                <p className="text-xs text-sm-muted mb-2">Auto-Estimate (internal)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-sm-muted">Setup</p>
                    <p className="font-display font-bold">${selected.estimate.setupMin.toLocaleString()} - ${selected.estimate.setupMax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sm-muted">Monthly</p>
                    <p className="font-display font-bold">${selected.estimate.monthlyMin.toLocaleString()} - ${selected.estimate.monthlyMax.toLocaleString()}/mo</p>
                  </div>
                </div>
                <p className="text-xs text-sm-muted mt-2">Confidence: {selected.estimate.confidence}</p>
                {selected.estimate.notes.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {selected.estimate.notes.map((n, i) => (
                      <li key={i} className="text-xs text-sm-muted">- {n}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Status update */}
              <div>
                <p className="text-xs text-sm-muted mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['new', 'reviewing', 'quoted', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selected.id, status)}
                      className={`px-3 py-1.5 rounded-md text-xs border transition-all capitalize ${
                        selected.status === status
                          ? 'bg-white text-black border-white'
                          : 'border-sm-border text-sm-muted hover:border-white/30'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
