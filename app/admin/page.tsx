'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Eye, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Plus, Users, FileText, Receipt, Repeat, FolderKanban, DollarSign, Download, Search } from 'lucide-react';

interface Quote {
  id: string; companyName: string; industry: string; employees: string; services: string[];
  otherService?: string; description: string; email: string; phone?: string; location?: string;
  website?: string; links?: string[]; socials?: Record<string, string>; urgency: string;
  status: string; createdAt: string;
  estimate: { setupMin: number; setupMax: number; monthlyMin: number; monthlyMax: number; confidence: string; notes: string[] };
}

interface Invoice {
  id: string; quoteId: string; clientName: string; clientEmail: string; items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number; gst: number; total: number; status: string; issuedAt: string; dueAt: string; paidAt?: string; notes?: string;
}

interface RecurringService {
  id: string; clientName: string; clientEmail: string; service: string; description: string;
  monthlyAmount: number; startDate: string; nextBillingDate: string; status: string; notes?: string;
}

interface Project {
  id: string; clientName: string; clientEmail: string; title: string; description: string;
  status: string; priority: string; startDate?: string; dueDate?: string; completedDate?: string; notes?: string;
}

interface Client { id: string; name: string; url: string; logoUrl: string; heroUrl: string; createdAt: string; }

interface Audit {
  id: string; companyName: string; contactName?: string; email: string; phone?: string;
  website?: string; industry: string; employees: string; description: string;
  status: string; createdAt: string; completedAt?: string; notes?: string;
}

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  new: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  reviewing: { icon: Eye, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  quoted: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  accepted: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  paid: { icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
};

const inputClass = 'w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-orange-500/30 transition-colors text-sm';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<'quotes' | 'audits' | 'invoices' | 'recurring' | 'projects' | 'clients'>('quotes');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurring, setRecurring] = useState<RecurringService[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Quote | null>(null);

  const [newClient, setNewClient] = useState({ name: '', url: '', logoUrl: '', heroUrl: '' });
  const [newRecurring, setNewRecurring] = useState({ clientName: '', clientEmail: '', service: '', description: '', monthlyAmount: 0, startDate: '', nextBillingDate: '', status: 'active', notes: '' });
  const [newProject, setNewProject] = useState({ clientName: '', clientEmail: '', title: '', description: '', status: 'queued', priority: 'medium', dueDate: '', notes: '' });

  const headers = () => ({ 'x-admin-secret': secret, 'Content-Type': 'application/json' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const h = { 'x-admin-secret': secret };
      const [qRes, iRes, rRes, pRes, cRes] = await Promise.all([
        fetch('/api/admin/quotes', { headers: h }),
        fetch('/api/admin/invoices', { headers: h }),
        fetch('/api/admin/recurring', { headers: h }),
        fetch('/api/admin/projects', { headers: h }),
        fetch('/api/admin/clients'),
      ]);
      if (!qRes.ok) { alert('Invalid admin secret'); setLoading(false); return; }
      setAuthenticated(true);
      const results = await Promise.all([qRes.json(), iRes.json(), rRes.json(), pRes.json(), cRes.json()]);
      setQuotes(results[0].quotes || []);
      setInvoices(results[1].invoices || []);
      setRecurring(results[2].services || []);
      setProjects(results[3].projects || []);
      setClients(results[4].clients || []);
      // Fetch audits
      try {
        const aRes = await fetch('/api/admin/audits', { headers: h });
        if (aRes.ok) { const aData = await aRes.json(); setAudits(aData.audits || []); }
      } catch {}
    } catch { alert('Failed to fetch'); }
    finally { setLoading(false); }
  }, [secret]);

  const updateQuoteStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/quotes', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    const data = await res.json();
    if (data.invoice) {
      setInvoices(prev => [data.invoice, ...prev]);
    }
    fetchAll();
  };

  const addClientFn = async () => {
    if (!newClient.name || !newClient.url || !newClient.logoUrl || !newClient.heroUrl) return alert('Fill all fields');
    await fetch('/api/admin/clients', { method: 'POST', headers: headers(), body: JSON.stringify(newClient) });
    setNewClient({ name: '', url: '', logoUrl: '', heroUrl: '' });
    fetchAll();
  };

  const deleteClientFn = async (id: string) => {
    if (!confirm('Remove?')) return;
    await fetch('/api/admin/clients', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    fetchAll();
  };

  const addRecurringFn = async () => {
    if (!newRecurring.clientName || !newRecurring.service || !newRecurring.monthlyAmount) return alert('Fill required fields');
    await fetch('/api/admin/recurring', { method: 'POST', headers: headers(), body: JSON.stringify(newRecurring) });
    setNewRecurring({ clientName: '', clientEmail: '', service: '', description: '', monthlyAmount: 0, startDate: '', nextBillingDate: '', status: 'active', notes: '' });
    fetchAll();
  };

  const updateRecurringStatus = async (id: string, status: string) => {
    await fetch('/api/admin/recurring', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    fetchAll();
  };

  const addProjectFn = async () => {
    if (!newProject.clientName || !newProject.title) return alert('Fill required fields');
    await fetch('/api/admin/projects', { method: 'POST', headers: headers(), body: JSON.stringify(newProject) });
    setNewProject({ clientName: '', clientEmail: '', title: '', description: '', status: 'queued', priority: 'medium', dueDate: '', notes: '' });
    fetchAll();
  };

  const updateProjectStatus = async (id: string, status: string) => {
    await fetch('/api/admin/projects', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    fetchAll();
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    await fetch('/api/admin/invoices', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    fetchAll();
  };

  // LOGIN
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold mb-6 text-center">Stackmate Admin</h1>
          <form onSubmit={(e) => { e.preventDefault(); fetchAll(); }}>
            <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin secret" className={`${inputClass} mb-4`} />
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Loading...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const monthlyRecurring = recurring.filter(r => r.status === 'active').reduce((s, r) => s + r.monthlyAmount, 0);
  const activeProjects = projects.filter(p => ['queued', 'in-progress', 'review'].includes(p.status)).length;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Stackmate Admin</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-sm-muted">
              <span>Revenue: <strong className="text-orange-400">${totalRevenue.toLocaleString()}</strong></span>
              <span>MRR: <strong className="text-orange-400">${monthlyRecurring.toLocaleString()}/mo</strong></span>
              <span>Active: <strong className="text-white">{activeProjects} projects</strong></span>
            </div>
          </div>
          <button onClick={fetchAll} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-sm-border rounded-lg text-sm hover:bg-sm-card transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {([
            ['quotes', FileText, `Quotes (${quotes.length})`],
            ['audits', Search, `Audits (${audits.length})`],
            ['invoices', Receipt, `Invoices (${invoices.length})`],
            ['recurring', Repeat, `Recurring (${recurring.length})`],
            ['projects', FolderKanban, `Projects (${projects.length})`],
            ['clients', Users, `Clients (${clients.length})`],
          ] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tab === key ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'border border-sm-border text-sm-light hover:border-white/30'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* ====== QUOTES TAB ====== */}
        {tab === 'quotes' && (
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {quotes.length === 0 && <div className="text-center py-16 text-sm-muted">No quotes yet.</div>}
              {quotes.map((quote) => {
                const config = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
                const Icon = config.icon;
                return (
                  <button key={quote.id} onClick={() => setSelected(quote)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === quote.id ? 'border-orange-500/30 bg-sm-card/60' : 'border-sm-border bg-sm-card/30 hover:bg-sm-card/50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div><h3 className="font-semibold">{quote.companyName}</h3><p className="text-xs text-sm-muted">{quote.email}</p></div>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${config.bg} ${config.color}`}><Icon className="w-3 h-3" /> {quote.status}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-sm-muted">
                      <span>{quote.industry}</span><span>{quote.employees} employees</span><span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className="hidden lg:block w-[420px] p-6 rounded-xl border border-sm-border bg-sm-card/30 sticky top-6 self-start max-h-[85vh] overflow-y-auto">
                <h2 className="text-xl font-display font-bold mb-1">{selected.companyName}</h2>
                <p className="text-sm text-sm-muted mb-4">{selected.email} {selected.phone && `| ${selected.phone}`}</p>
                <div className="space-y-3 mb-4 text-sm">
                  <div><span className="text-sm-muted">Industry:</span> {selected.industry}</div>
                  <div><span className="text-sm-muted">Team:</span> {selected.employees}</div>
                  {selected.location && <div><span className="text-sm-muted">Location:</span> {selected.location}</div>}
                  {selected.website && <div><span className="text-sm-muted">Website:</span> <a href={selected.website} target="_blank" rel="noopener" className="text-orange-400 underline">{selected.website}</a></div>}
                  <div><span className="text-sm-muted">Services:</span> <div className="flex flex-wrap gap-1 mt-1">{selected.services.map(s => <span key={s} className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">{s}</span>)}</div></div>
                  {selected.otherService && <div><span className="text-sm-muted">Other:</span> {selected.otherService}</div>}
                  <div><span className="text-sm-muted">Description:</span><p className="text-sm-light mt-1">{selected.description}</p></div>
                  <div><span className="text-sm-muted">Urgency:</span> <span className="capitalize">{selected.urgency}</span></div>
                  {selected.links && selected.links.length > 0 && <div><span className="text-sm-muted">Links:</span>{selected.links.map((l, i) => <a key={i} href={l} target="_blank" rel="noopener" className="block text-orange-400 underline truncate text-xs">{l}</a>)}</div>}
                  {selected.socials && Object.entries(selected.socials).some(([, v]) => v) && <div><span className="text-sm-muted">Socials:</span>{Object.entries(selected.socials).filter(([, v]) => v).map(([k, v]) => <p key={k} className="text-xs"><span className="text-sm-muted capitalize">{k}:</span> {v}</p>)}</div>}
                </div>
                <div className="p-4 rounded-lg bg-sm-dark border border-sm-border mb-4">
                  <p className="text-xs text-sm-muted mb-2">Auto-Estimate</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-xs text-sm-muted">Setup</p><p className="font-display font-bold text-sm">${selected.estimate.setupMin.toLocaleString()} - ${selected.estimate.setupMax.toLocaleString()}</p></div>
                    <div><p className="text-xs text-sm-muted">Monthly</p><p className="font-display font-bold text-sm">${selected.estimate.monthlyMin.toLocaleString()} - ${selected.estimate.monthlyMax.toLocaleString()}/mo</p></div>
                  </div>
                  {selected.estimate.notes.length > 0 && <ul className="mt-2 space-y-1">{selected.estimate.notes.map((n, i) => <li key={i} className="text-xs text-sm-muted">— {n}</li>)}</ul>}
                </div>
                <div>
                  <p className="text-xs text-sm-muted mb-2">Status {selected.status === 'paid' && '— Invoice auto-generated'}</p>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'reviewing', 'quoted', 'accepted', 'paid', 'rejected'].map(status => (
                      <button key={status} onClick={() => updateQuoteStatus(selected.id, status)}
                        className={`px-3 py-1.5 rounded-md text-xs border transition-all capitalize ${selected.status === status ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted hover:border-white/30'}`}
                      >{status}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====== AUDITS TAB ====== */}
        {tab === 'audits' && (
          <div>
            {audits.length === 0 ? <div className="text-center py-16 text-sm-muted">No audit requests yet.</div> : (
              <div className="space-y-3">
                {audits.map(audit => {
                  const statusColors: Record<string, string> = { new: 'text-blue-400 bg-blue-400/10', 'in-progress': 'text-yellow-400 bg-yellow-400/10', completed: 'text-green-400 bg-green-400/10', sent: 'text-purple-400 bg-purple-400/10' };
                  return (
                    <div key={audit.id} className="p-5 rounded-xl border border-sm-border bg-sm-card/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{audit.companyName}</h3>
                          <p className="text-xs text-sm-muted">{audit.email} {audit.contactName && `— ${audit.contactName}`} {audit.phone && `| ${audit.phone}`}</p>
                          {audit.website && <a href={audit.website} target="_blank" rel="noopener" className="text-xs text-orange-400 underline">{audit.website}</a>}
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-md ${statusColors[audit.status] || ''}`}>{audit.status}</span>
                          <p className="text-xs text-sm-muted mt-1">{new Date(audit.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-sm text-sm-light mb-3">
                        <span className="text-sm-muted">Industry:</span> {audit.industry} <span className="text-sm-muted ml-2">Team:</span> {audit.employees}
                      </div>
                      <p className="text-sm text-sm-light mb-3">{audit.description}</p>
                      {audit.notes && <p className="text-xs text-sm-muted mb-3">Notes: {audit.notes}</p>}
                      <div className="flex gap-2">
                        {(['new', 'in-progress', 'completed', 'sent'] as const).map(s => (
                          <button key={s} onClick={async () => { await fetch('/api/admin/audits', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: audit.id, status: s }) }); fetchAll(); }}
                            className={`px-2 py-1 rounded text-xs border capitalize ${audit.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== INVOICES TAB ====== */}
        {tab === 'invoices' && (
          <div>
            {invoices.length === 0 ? <div className="text-center py-16 text-sm-muted">No invoices yet. Mark a quote as &quot;paid&quot; to auto-generate one.</div> : (
              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-5 rounded-xl border border-sm-border bg-sm-card/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-bold">{inv.id}</h3>
                        <p className="text-sm text-sm-muted">{inv.clientName} — {inv.clientEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-lg text-orange-400">${inv.total.toLocaleString()}</p>
                        <p className="text-xs text-sm-muted">incl. ${inv.gst.toLocaleString()} GST</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {inv.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-sm-light">{item.description}</span>
                          <span className="text-sm-muted">${item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-sm-muted">
                        <span>Issued: {new Date(inv.issuedAt).toLocaleDateString()}</span>
                        <span>Due: {new Date(inv.dueAt).toLocaleDateString()}</span>
                        {inv.paidAt && <span className="text-green-400">Paid: {new Date(inv.paidAt).toLocaleDateString()}</span>}
                      </div>
                      <div className="flex gap-2">
                        {['draft', 'sent', 'paid', 'overdue'].map(s => (
                          <button key={s} onClick={() => updateInvoiceStatus(inv.id, s)}
                            className={`px-2 py-1 rounded text-xs border capitalize ${inv.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                    {inv.notes && <p className="text-xs text-sm-muted mt-2">{inv.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== RECURRING TAB ====== */}
        {tab === 'recurring' && (
          <div>
            <div className="p-6 rounded-xl border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Recurring Service</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input value={newRecurring.clientName} onChange={e => setNewRecurring({ ...newRecurring, clientName: e.target.value })} className={inputClass} placeholder="Client name *" />
                <input value={newRecurring.clientEmail} onChange={e => setNewRecurring({ ...newRecurring, clientEmail: e.target.value })} className={inputClass} placeholder="Client email" />
                <select value={newRecurring.service} onChange={e => setNewRecurring({ ...newRecurring, service: e.target.value })} className={inputClass}>
                  <option value="">Service type *</option>
                  <option value="SEO">SEO</option>
                  <option value="GEO">GEO (AI Search)</option>
                  <option value="SEO + GEO">SEO + GEO</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social Ads">Social Ads</option>
                  <option value="Content">Content</option>
                  <option value="Maintenance">Maintenance & Support</option>
                  <option value="AI Agents">AI Agents</option>
                  <option value="Automation">Automation</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input type="number" value={newRecurring.monthlyAmount || ''} onChange={e => setNewRecurring({ ...newRecurring, monthlyAmount: Number(e.target.value) })} className={inputClass} placeholder="Monthly amount ($) *" />
                <input type="date" value={newRecurring.startDate} onChange={e => setNewRecurring({ ...newRecurring, startDate: e.target.value, nextBillingDate: e.target.value })} className={inputClass} />
                <input value={newRecurring.description} onChange={e => setNewRecurring({ ...newRecurring, description: e.target.value })} className={inputClass} placeholder="Description" />
              </div>
              <button onClick={addRecurringFn} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">Add Service</button>
            </div>
            {recurring.length === 0 ? <div className="text-center py-12 text-sm-muted">No recurring services. Add one above.</div> : (
              <div className="space-y-3">
                {recurring.map(svc => (
                  <div key={svc.id} className="p-5 rounded-xl border border-sm-border bg-sm-card/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{svc.clientName} — <span className="text-orange-400">{svc.service}</span></h3>
                      <p className="text-xs text-sm-muted">{svc.description || svc.clientEmail}</p>
                      <p className="text-xs text-sm-muted mt-1">Next billing: {svc.nextBillingDate ? new Date(svc.nextBillingDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-display font-bold text-orange-400">${svc.monthlyAmount}/mo</p>
                      <div className="flex gap-1">
                        {['active', 'paused', 'cancelled'].map(s => (
                          <button key={s} onClick={() => updateRecurringStatus(svc.id, s)}
                            className={`px-2 py-1 rounded text-xs border capitalize ${svc.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== PROJECTS TAB ====== */}
        {tab === 'projects' && (
          <div>
            <div className="p-6 rounded-xl border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input value={newProject.clientName} onChange={e => setNewProject({ ...newProject, clientName: e.target.value })} className={inputClass} placeholder="Client name *" />
                <input value={newProject.clientEmail} onChange={e => setNewProject({ ...newProject, clientEmail: e.target.value })} className={inputClass} placeholder="Client email" />
                <input value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className={inputClass} placeholder="Project title *" />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <select value={newProject.priority} onChange={e => setNewProject({ ...newProject, priority: e.target.value })} className={inputClass}>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <input type="date" value={newProject.dueDate} onChange={e => setNewProject({ ...newProject, dueDate: e.target.value })} className={inputClass} />
                <input value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className={inputClass} placeholder="Description" />
              </div>
              <button onClick={addProjectFn} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">Add Project</button>
            </div>
            {projects.length === 0 ? <div className="text-center py-12 text-sm-muted">No projects. Add one above.</div> : (
              <div className="space-y-3">
                {projects.map(proj => (
                  <div key={proj.id} className="p-5 rounded-xl border border-sm-border bg-sm-card/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{proj.title}</h3>
                        <p className="text-xs text-sm-muted">{proj.clientName} {proj.clientEmail && `— ${proj.clientEmail}`}</p>
                        {proj.description && <p className="text-xs text-sm-light mt-1">{proj.description}</p>}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-md ${proj.priority === 'urgent' ? 'bg-red-500/10 text-red-400' : proj.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-sm-border text-sm-light'}`}>{proj.priority}</span>
                        {proj.dueDate && <p className="text-xs text-sm-muted mt-1">Due: {new Date(proj.dueDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['queued', 'in-progress', 'review', 'delivered', 'completed'].map(s => (
                        <button key={s} onClick={() => updateProjectStatus(proj.id, s)}
                          className={`px-2 py-1 rounded text-xs border capitalize ${proj.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== CLIENTS TAB ====== */}
        {tab === 'clients' && (
          <div>
            <div className="p-6 rounded-xl border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Client</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className={inputClass} placeholder="Client Name" />
                <input value={newClient.url} onChange={e => setNewClient({ ...newClient, url: e.target.value })} className={inputClass} placeholder="Website URL" />
                <input value={newClient.logoUrl} onChange={e => setNewClient({ ...newClient, logoUrl: e.target.value })} className={inputClass} placeholder="Logo URL" />
                <input value={newClient.heroUrl} onChange={e => setNewClient({ ...newClient, heroUrl: e.target.value })} className={inputClass} placeholder="Hero Screenshot URL" />
              </div>
              <button onClick={addClientFn} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">Add Client</button>
            </div>
            {clients.length === 0 ? <div className="text-center py-12 text-sm-muted">No clients.</div> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map(client => (
                  <div key={client.id} className="p-4 rounded-xl border border-sm-border bg-sm-card/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={client.logoUrl} alt="" className="w-8 h-8 rounded-md object-cover" />
                        <div><p className="font-semibold text-sm">{client.name}</p><p className="text-xs text-sm-muted">{client.url.replace(/^https?:\/\//, '')}</p></div>
                      </div>
                      <button onClick={() => deleteClientFn(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-sm-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
