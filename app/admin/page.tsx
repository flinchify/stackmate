'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Eye, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Plus, Users, FileText } from 'lucide-react';

interface Quote {
  id: string;
  companyName: string;
  industry: string;
  employees: string;
  services: string[];
  otherService?: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  links?: string[];
  socials?: Record<string, string>;
  urgency: string;
  status: string;
  createdAt: string;
  estimate: { setupMin: number; setupMax: number; monthlyMin: number; monthlyMax: number; confidence: string; notes: string[] };
}

interface Client {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  heroUrl: string;
  createdAt: string;
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
  const [tab, setTab] = useState<'quotes' | 'clients'>('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Quote | null>(null);

  // Client form
  const [newClient, setNewClient] = useState({ name: '', url: '', logoUrl: '', heroUrl: '' });

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quotes', { headers: { 'x-admin-secret': secret } });
      if (res.ok) { const data = await res.json(); setQuotes(data.quotes); setAuthenticated(true); }
      else alert('Invalid admin secret');
    } catch { alert('Failed to fetch'); }
    finally { setLoading(false); }
  }, [secret]);

  const fetchClients = useCallback(async () => {
    const res = await fetch('/api/admin/clients');
    if (res.ok) { const data = await res.json(); setClients(data.clients); }
  }, []);

  const login = async () => { await fetchQuotes(); await fetchClients(); };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/quotes', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret }, body: JSON.stringify({ id, status }) });
    fetchQuotes();
  };

  const addClient = async () => {
    if (!newClient.name || !newClient.url || !newClient.logoUrl || !newClient.heroUrl) return alert('Fill all fields');
    await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret }, body: JSON.stringify(newClient) });
    setNewClient({ name: '', url: '', logoUrl: '', heroUrl: '' });
    fetchClients();
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Remove this client?')) return;
    await fetch('/api/admin/clients', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret }, body: JSON.stringify({ id }) });
    fetchClients();
  };

  const inputClass = 'w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-white/30 transition-colors text-sm';

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={(e) => { e.preventDefault(); login(); }}>
            <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin secret" className={`${inputClass} mb-4`} />
            <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50">
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          <button onClick={() => { fetchQuotes(); fetchClients(); }} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-sm-border rounded-lg text-sm hover:bg-sm-card transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tab === 'quotes' ? 'bg-white text-black' : 'border border-sm-border text-sm-light hover:border-white/30'}`}
          >
            <FileText className="w-4 h-4" /> Quotes ({quotes.length})
          </button>
          <button onClick={() => setTab('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tab === 'clients' ? 'bg-white text-black' : 'border border-sm-border text-sm-light hover:border-white/30'}`}
          >
            <Users className="w-4 h-4" /> Clients ({clients.length})
          </button>
        </div>

        {/* QUOTES TAB */}
        {tab === 'quotes' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {['new', 'reviewing', 'quoted', 'accepted', 'rejected'].map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <div key={status} className={`p-4 rounded-xl border border-sm-border ${config.bg}`}>
                    <p className={`text-2xl font-display font-bold ${config.color}`}>{quotes.filter((q) => q.status === status).length}</p>
                    <p className="text-xs text-sm-muted capitalize">{status}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-3">
                {quotes.length === 0 && <div className="text-center py-16 text-sm-muted">No quotes yet.</div>}
                {quotes.map((quote) => {
                  const config = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
                  const Icon = config.icon;
                  return (
                    <button key={quote.id} onClick={() => setSelected(quote)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === quote.id ? 'border-white/20 bg-sm-card/60' : 'border-sm-border bg-sm-card/30 hover:bg-sm-card/50'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{quote.companyName}</h3>
                          <p className="text-xs text-sm-muted">{quote.email}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${config.bg} ${config.color}`}>
                          <Icon className="w-3 h-3" /> {quote.status}
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

              {selected && (
                <div className="hidden lg:block w-[420px] p-6 rounded-xl border border-sm-border bg-sm-card/30 sticky top-6 self-start max-h-[85vh] overflow-y-auto">
                  <h2 className="text-xl font-display font-bold mb-1">{selected.companyName}</h2>
                  <p className="text-sm text-sm-muted mb-6">{selected.email} {selected.phone && `| ${selected.phone}`}</p>

                  <div className="space-y-4 mb-6">
                    <div><p className="text-xs text-sm-muted mb-1">Industry</p><p className="text-sm">{selected.industry}</p></div>
                    <div><p className="text-xs text-sm-muted mb-1">Team Size</p><p className="text-sm">{selected.employees}</p></div>
                    {selected.location && <div><p className="text-xs text-sm-muted mb-1">Location</p><p className="text-sm">{selected.location}</p></div>}
                    {selected.website && <div><p className="text-xs text-sm-muted mb-1">Website</p><a href={selected.website} target="_blank" rel="noopener" className="text-sm text-white underline">{selected.website}</a></div>}
                    <div>
                      <p className="text-xs text-sm-muted mb-1">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.services.map((s) => (<span key={s} className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">{s}</span>))}
                      </div>
                      {selected.otherService && <p className="text-xs text-sm-light mt-1">Other: {selected.otherService}</p>}
                    </div>
                    <div><p className="text-xs text-sm-muted mb-1">Description</p><p className="text-sm text-sm-light">{selected.description}</p></div>
                    <div><p className="text-xs text-sm-muted mb-1">Urgency</p><p className="text-sm capitalize">{selected.urgency}</p></div>
                    {selected.links && selected.links.length > 0 && (
                      <div>
                        <p className="text-xs text-sm-muted mb-1">Links</p>
                        {selected.links.map((l, i) => (<a key={i} href={l} target="_blank" rel="noopener" className="block text-sm text-white underline truncate">{l}</a>))}
                      </div>
                    )}
                    {selected.socials && Object.entries(selected.socials).some(([, v]) => v) && (
                      <div>
                        <p className="text-xs text-sm-muted mb-1">Socials</p>
                        {Object.entries(selected.socials).filter(([, v]) => v).map(([k, v]) => (
                          <p key={k} className="text-xs text-sm-light"><span className="text-sm-muted capitalize">{k}:</span> {v}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-sm-dark border border-sm-border mb-6">
                    <p className="text-xs text-sm-muted mb-2">Auto-Estimate (internal)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div><p className="text-xs text-sm-muted">Setup</p><p className="font-display font-bold">${selected.estimate.setupMin.toLocaleString()} - ${selected.estimate.setupMax.toLocaleString()}</p></div>
                      <div><p className="text-xs text-sm-muted">Monthly</p><p className="font-display font-bold">${selected.estimate.monthlyMin.toLocaleString()} - ${selected.estimate.monthlyMax.toLocaleString()}/mo</p></div>
                    </div>
                    <p className="text-xs text-sm-muted mt-2">Confidence: {selected.estimate.confidence}</p>
                    {selected.estimate.notes.length > 0 && (
                      <ul className="mt-2 space-y-1">{selected.estimate.notes.map((n, i) => (<li key={i} className="text-xs text-sm-muted">— {n}</li>))}</ul>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-sm-muted mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['new', 'reviewing', 'quoted', 'accepted', 'rejected'].map((status) => (
                        <button key={status} onClick={() => updateStatus(selected.id, status)}
                          className={`px-3 py-1.5 rounded-md text-xs border transition-all capitalize ${selected.status === status ? 'bg-white text-black border-white' : 'border-sm-border text-sm-muted hover:border-white/30'}`}
                        >{status}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* CLIENTS TAB */}
        {tab === 'clients' && (
          <div>
            {/* Add client form */}
            <div className="p-6 rounded-xl border border-sm-border bg-sm-card/30 mb-8">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Client</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-sm-muted mb-1">Client Name</label>
                  <input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className={inputClass} placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-xs text-sm-muted mb-1">Website URL</label>
                  <input value={newClient.url} onChange={(e) => setNewClient({ ...newClient, url: e.target.value })} className={inputClass} placeholder="https://acmecorp.com.au" />
                </div>
                <div>
                  <label className="block text-xs text-sm-muted mb-1">Logo URL (image link)</label>
                  <input value={newClient.logoUrl} onChange={(e) => setNewClient({ ...newClient, logoUrl: e.target.value })} className={inputClass} placeholder="https://...logo.png" />
                </div>
                <div>
                  <label className="block text-xs text-sm-muted mb-1">Hero Screenshot URL (image link)</label>
                  <input value={newClient.heroUrl} onChange={(e) => setNewClient({ ...newClient, heroUrl: e.target.value })} className={inputClass} placeholder="https://...screenshot.png" />
                </div>
              </div>
              <button onClick={addClient} className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">Add Client</button>
            </div>

            {/* Client list */}
            {clients.length === 0 ? (
              <div className="text-center py-16 text-sm-muted">No clients added yet. Add one above.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="p-4 rounded-xl border border-sm-border bg-sm-card/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={client.logoUrl} alt="" className="w-8 h-8 rounded-md object-cover" />
                        <div>
                          <p className="font-semibold text-sm">{client.name}</p>
                          <p className="text-xs text-sm-muted">{client.url.replace(/^https?:\/\//, '')}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteClient(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-sm-muted hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={client.heroUrl} alt="" className="w-full aspect-video object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
