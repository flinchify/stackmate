'use client';

import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Eye, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Plus, Users, FileText, Receipt, Repeat, FolderKanban, DollarSign, Download, Search, Send, Package, Terminal, BookOpen, Globe, TrendingDown, Mail, Radar, LayoutDashboard, Copy, ExternalLink, Tag, Puzzle, Settings } from 'lucide-react';

interface Expense {
  id: string; clientName?: string; category: string; description: string;
  amount: number; recurring: boolean; frequency?: string; date: string;
}

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

interface Portal {
  id: string; accessCode: string; clientName: string; clientEmail: string;
  projectTitle: string; projectDescription: string; status: string;
  deliverables: { id: string; type: string; title: string; description?: string; url?: string }[];
  updates: { date: string; message: string }[];
  handoverChecklist: { item: string; done: boolean }[];
  createdAt: string;
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

// Activity log
const activityLog: { time: string; event: string }[] = [];
function logActivity(event: string) {
  activityLog.unshift({ time: new Date().toISOString(), event });
  if (activityLog.length > 200) activityLog.pop();
}

export default function AdminPage() {
  // Persistent auth
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<string>('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurring, setRecurring] = useState<RecurringService[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [portalsList, setPortalsList] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Quote | null>(null);

  const [newClient, setNewClient] = useState({ name: '', url: '', logoUrl: '', heroUrl: '' });
  const [newRecurring, setNewRecurring] = useState({ clientName: '', clientEmail: '', services: [{ service: '', amount: 0 }] as { service: string; amount: number }[], startDate: '', notes: '' });
  const [newProject, setNewProject] = useState({ clientName: '', clientEmail: '', title: '', description: '', status: 'queued', priority: 'medium', dueDate: '', notes: '' });
  const [newPortal, setNewPortal] = useState({ clientName: '', clientEmail: '', projectTitle: '', projectDescription: '' });
  const [newDeliverable, setNewDeliverable] = useState({ portalId: '', type: 'website', title: '', description: '', url: '' });
  const [newUpdate, setNewUpdate] = useState({ portalId: '', message: '' });
  const [auditUrl, setAuditUrl] = useState('');
  const [auditResult, setAuditResult] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; name?: string; source: string; subscribed: boolean; createdAt: string }[]>([]);
  const [autoAudits, setAutoAudits] = useState<{ id: string; clientName?: string; url: string; lastRun?: string; frequency: string; geoScore?: number; seoScore?: number; performanceScore?: number; status: string }[]>([]);
  const [newAutoAudit, setNewAutoAudit] = useState({ clientName: '', url: '', frequency: 'daily' });
  const [newExpense, setNewExpense] = useState({ clientName: '', category: 'api', description: '', amount: 0, recurring: true, frequency: 'monthly', date: '' });
  const [dashboards, setDashboards] = useState<{ id: string; accessCode: string; clientName: string; clientEmail?: string; clientLogo?: string; clientDomain?: string; brandColor: string; metrics: { label: string; value: number; prev?: number }[]; seoScores: { date: string; score: number }[]; geoScores: { platform: string; score: number }[]; trafficData: { month: string; visits: number }[]; rankings: { keyword: string; position: number; change: number }[]; leads: { date: string; name: string; source?: string }[]; notes?: string; createdAt: string }[]>([]);
  const [newDashboard, setNewDashboard] = useState({ clientName: '', clientEmail: '', clientLogo: '', clientDomain: '', brandColor: '#f97316', notes: '' });
  const [editingDashboard, setEditingDashboard] = useState<string | null>(null);
  const [dashboardMetric, setDashboardMetric] = useState({ type: 'seo', date: '', score: 0, platform: '', month: '', visits: 0, keyword: '', position: 0, change: 0, leadName: '', leadSource: '', metricLabel: '', metricValue: 0, metricPrev: 0 });
  const [pkgList, setPkgList] = useState<{ id: string; industry: string; tier: string; tierLabel: string; upfrontPrice: number; monthlyPrice: number; features: string[]; includesDescription: string | null; visible: boolean; sortOrder: number }[]>([]);
  const [pkgEditing, setPkgEditing] = useState<string | null>(null);
  const [pkgEditValues, setPkgEditValues] = useState<{ upfrontPrice: number; monthlyPrice: number }>({ upfrontPrice: 0, monthlyPrice: 0 });
  const [addonList, setAddonList] = useState<{ id: string; category: string; name: string; slug: string; description: string | null; upfrontPrice: number; monthlyPrice: number; perUnit: boolean; visible: boolean; sortOrder: number }[]>([]);
  const [addonEditing, setAddonEditing] = useState<string | null>(null);
  const [addonEditValues, setAddonEditValues] = useState<{ upfrontPrice: number; monthlyPrice: number }>({ upfrontPrice: 0, monthlyPrice: 0 });
  const [pricingConfig, setPricingConfig] = useState<{ key: string; value: Record<string, number> }[]>([]);
  const [configEditing, setConfigEditing] = useState<string | null>(null);
  const [configEditValues, setConfigEditValues] = useState<Record<string, number>>({});

  // Load saved auth
  useEffect(() => {
    const saved = localStorage.getItem('sm_admin_secret');
    if (saved) { setSecret(saved); }
  }, []);

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
      if (!qRes.ok) { alert('Invalid admin secret'); localStorage.removeItem('sm_admin_secret'); setLoading(false); return; }
      setAuthenticated(true);
      localStorage.setItem('sm_admin_secret', secret);
      logActivity('Admin logged in');
      const results = await Promise.all([qRes.json(), iRes.json(), rRes.json(), pRes.json(), cRes.json()]);
      setQuotes(results[0].quotes || []);
      setInvoices(results[1].invoices || []);
      setRecurring(results[2].services || []);
      setProjects(results[3].projects || []);
      setClients(results[4].clients || []);
      try {
        const aRes = await fetch('/api/admin/audits', { headers: h });
        if (aRes.ok) { const aData = await aRes.json(); setAudits(aData.audits || []); }
        const pRes2 = await fetch('/api/admin/portals', { headers: h });
        if (pRes2.ok) { const pData2 = await pRes2.json(); setPortalsList(pData2.portals || []); }
        const eRes = await fetch('/api/admin/expenses', { headers: h });
        if (eRes.ok) { const eData = await eRes.json(); setExpenses(eData.expenses || []); }
        const mRes = await fetch('/api/admin/mailing-list', { headers: h });
        if (mRes.ok) { const mData = await mRes.json(); setSubscribers(mData.subscribers || []); }
        const aaRes = await fetch('/api/admin/auto-audits', { headers: h });
        if (aaRes.ok) { const aaData = await aaRes.json(); setAutoAudits(aaData.audits || []); }
        const dbRes = await fetch('/api/admin/dashboards', { headers: h });
        if (dbRes.ok) { const dbData = await dbRes.json(); setDashboards(dbData.dashboards || []); }
        const pkgRes = await fetch('/api/admin/packages', { headers: h });
        if (pkgRes.ok) { const pkgData = await pkgRes.json(); setPkgList(pkgData.packages || []); }
        const addonRes = await fetch('/api/admin/addons', { headers: h });
        if (addonRes.ok) { const addonData = await addonRes.json(); setAddonList(addonData.addons || []); }
        const pcRes = await fetch('/api/admin/pricing-config', { headers: h });
        if (pcRes.ok) { const pcData = await pcRes.json(); setPricingConfig(pcData.config || []); }
      } catch {}
    } catch { alert('Failed to fetch'); }
    finally { setLoading(false); }
  }, [secret]);

  // Auto-login if saved
  useEffect(() => {
    const saved = localStorage.getItem('sm_admin_secret');
    if (saved && !authenticated) { setSecret(saved); }
  }, [authenticated]);

  useEffect(() => {
    if (secret && !authenticated) { fetchAll(); }
  }, [secret, authenticated, fetchAll]);

  const updateQuoteStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/quotes', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    const data = await res.json();
    logActivity(`Quote ${id} → ${status}${data.invoice ? ` (Invoice ${data.invoice.id} generated)` : ''}`);
    if (data.invoice) setInvoices(prev => [data.invoice, ...prev]);
    fetchAll();
  };

  const addClientFn = async () => {
    if (!newClient.name || !newClient.url || !newClient.logoUrl || !newClient.heroUrl) return alert('Fill all fields');
    await fetch('/api/admin/clients', { method: 'POST', headers: headers(), body: JSON.stringify(newClient) });
    logActivity(`Client added: ${newClient.name}`);
    setNewClient({ name: '', url: '', logoUrl: '', heroUrl: '' });
    fetchAll();
  };

  const deleteClientFn = async (id: string) => {
    if (!confirm('Remove?')) return;
    await fetch('/api/admin/clients', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    logActivity(`Client removed: ${id}`);
    fetchAll();
  };

  const addRecurringBatch = async () => {
    const valid = newRecurring.services.filter(s => s.service && s.amount > 0);
    if (!newRecurring.clientName || valid.length === 0) return alert('Fill client name and at least one service');
    for (const svc of valid) {
      await fetch('/api/admin/recurring', { method: 'POST', headers: headers(), body: JSON.stringify({
        clientName: newRecurring.clientName, clientEmail: newRecurring.clientEmail,
        service: svc.service, description: '', monthlyAmount: svc.amount,
        startDate: newRecurring.startDate, nextBillingDate: newRecurring.startDate,
        status: 'active', notes: newRecurring.notes,
      }) });
      logActivity(`Recurring: ${newRecurring.clientName} — ${svc.service} $${svc.amount}/mo`);
    }
    setNewRecurring({ clientName: '', clientEmail: '', services: [{ service: '', amount: 0 }], startDate: '', notes: '' });
    fetchAll();
  };

  const updateRecurringStatus = async (id: string, status: string) => {
    await fetch('/api/admin/recurring', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    logActivity(`Recurring ${id} → ${status}`);
    fetchAll();
  };

  const addProjectFn = async () => {
    if (!newProject.clientName || !newProject.title) return alert('Fill required fields');
    await fetch('/api/admin/projects', { method: 'POST', headers: headers(), body: JSON.stringify(newProject) });
    logActivity(`Project: ${newProject.title} for ${newProject.clientName}`);
    setNewProject({ clientName: '', clientEmail: '', title: '', description: '', status: 'queued', priority: 'medium', dueDate: '', notes: '' });
    fetchAll();
  };

  const updateProjectStatus = async (id: string, status: string) => {
    await fetch('/api/admin/projects', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    logActivity(`Project ${id} → ${status}`);
    fetchAll();
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    await fetch('/api/admin/invoices', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, status }) });
    logActivity(`Invoice ${id} → ${status}`);
    fetchAll();
  };

  const runQuickAudit = () => {
    if (!auditUrl) return;
    const url = auditUrl.startsWith('http') ? auditUrl : `https://${auditUrl}`;
    const domain = auditUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    logActivity(`Quick audit: ${domain}`);
    const result = `QUICK AUDIT: ${domain}\n` +
      `${'='.repeat(50)}\n\n` +
      `AUDIT TOOLS (click to open):\n` +
      `\n→ PageSpeed & Core Web Vitals:\n  https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}\n` +
      `\n→ GEO Score (AI Search Visibility):\n  https://geoptie.com/free-geo-audit\n  (paste: ${domain})\n` +
      `\n→ Schema/Structured Data Check:\n  https://validator.schema.org/\n  (paste: ${url})\n` +
      `\n→ Security Headers:\n  https://securityheaders.com/?q=${encodeURIComponent(url)}\n` +
      `\n→ Rich Results Test:\n  https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}\n` +
      `\n→ Mobile Friendly Test:\n  https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}\n` +
      `\n→ SSL Check:\n  https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(domain)}\n` +
      `\n${'='.repeat(50)}\n` +
      `\nAI OPPORTUNITIES TO PITCH:\n` +
      `\n• Do they answer phone calls manually?\n  → AI receptionist ($499-1,799/mo)\n` +
      `\n• Do they have online booking?\n  → AI booking system with calendar sync\n` +
      `\n• Manual invoicing or quoting?\n  → Automated quoting + invoicing workflow\n` +
      `\n• Website old, slow, or not mobile-friendly?\n  → Full rebuild (1-2 days, $2-5K setup)\n` +
      `\n• No Google Business Profile?\n  → GBP setup + local SEO ($499/mo)\n` +
      `\n• Not showing up in AI search (ChatGPT/Perplexity)?\n  → GEO package — llms.txt, schema, content ($499-999/mo)\n` +
      `\n• Manual customer follow-ups?\n  → AI email/SMS sequences\n` +
      `\n• No analytics or reporting?\n  → Custom dashboard + automated reports\n` +
      `\n• Using spreadsheets as CRM?\n  → HubSpot/custom CRM integration\n` +
      `\n• No social media automation?\n  → Content scheduling + AI content generation\n` +
      `\n${'='.repeat(50)}\n` +
      `\nQUICK PRICING GUIDE:\n` +
      `  Website rebuild:     $2,000-5,000 setup + $199-499/mo\n` +
      `  AI chatbot:          $2,500-5,000 setup + $499-999/mo\n` +
      `  AI receptionist:     $5,000-8,000 setup + $999-1,799/mo\n` +
      `  SEO:                 $499-999/mo\n` +
      `  GEO (AI search):     $499-999/mo\n` +
      `  SEO + GEO bundle:    $799-1,499/mo\n` +
      `  Business automation: $2,000-6,000 setup + $399-999/mo\n` +
      `  Custom software:     $5,000-15,000 setup + $599-1,799/mo`;
    setAuditResult(result);
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

  // Client revenue summary
  const clientRevenue: Record<string, { oneTime: number; monthly: number }> = {};
  invoices.filter(i => i.status === 'paid').forEach(inv => {
    if (!clientRevenue[inv.clientName]) clientRevenue[inv.clientName] = { oneTime: 0, monthly: 0 };
    clientRevenue[inv.clientName].oneTime += inv.total;
  });
  recurring.filter(r => r.status === 'active').forEach(r => {
    if (!clientRevenue[r.clientName]) clientRevenue[r.clientName] = { oneTime: 0, monthly: 0 };
    clientRevenue[r.clientName].monthly += r.monthlyAmount;
  });

  const TABS = [
    { key: 'quotes', icon: FileText, label: `Quotes (${quotes.length})` },
    { key: 'audits', icon: Search, label: `Audits (${audits.length})` },
    { key: 'invoices', icon: Receipt, label: `Invoices (${invoices.length})` },
    { key: 'recurring', icon: Repeat, label: `Recurring (${recurring.length})` },
    { key: 'projects', icon: FolderKanban, label: `Projects (${projects.length})` },
    { key: 'portals', icon: Package, label: `Delivery (${portalsList.length})` },
    { key: 'clients', icon: Users, label: `Clients (${clients.length})` },
    { key: 'revenue', icon: DollarSign, label: 'Revenue' },
    { key: 'mailing', icon: Mail, label: 'Mailing List' },
    { key: 'monitoring', icon: Radar, label: '24/7 Monitoring' },
    { key: 'dashboards', icon: LayoutDashboard, label: `Dashboards (${dashboards.length})` },
    { key: 'packages', icon: Tag, label: `Packages (${pkgList.length})` },
    { key: 'terminal', icon: Terminal, label: 'Activity' },
  ];

  return (
    <main className="min-h-screen">
      {/* Admin header */}
      <div className="border-b border-sm-border bg-sm-card/50 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold">Stackmate Admin</span>
          <a href="/admin/playbooks" className="text-xs text-orange-400 hover:underline flex items-center gap-1"><BookOpen className="w-3 h-3" /> Playbooks</a>
          <a href="/admin/documents" className="text-xs text-orange-400 hover:underline flex items-center gap-1"><FileText className="w-3 h-3" /> Documents</a>
          <a href="/admin/editor" className="text-xs text-orange-400 hover:underline flex items-center gap-1"><FileText className="w-3 h-3" /> Editor</a>
          <a href="/" className="text-xs text-sm-muted hover:text-white">← Site</a>
        </div>
        <div className="flex items-center gap-4 text-xs text-sm-muted">
          <span>Rev: <strong className="text-orange-400">${totalRevenue.toLocaleString()}</strong></span>
          <span>MRR: <strong className="text-orange-400">${monthlyRecurring.toLocaleString()}/mo</strong></span>
          <span>Active: <strong className="text-white">{activeProjects}</strong></span>
          <button onClick={fetchAll} disabled={loading} className="flex items-center gap-1 hover:text-white">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => { localStorage.removeItem('sm_admin_secret'); setAuthenticated(false); setSecret(''); }} className="hover:text-red-400">Logout</button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs transition-all ${tab === key ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'border border-sm-border text-sm-light hover:border-white/30'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ====== QUOTES ====== */}
        {tab === 'quotes' && (
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {quotes.length === 0 && <div className="text-center py-16 text-sm-muted">No quotes yet.</div>}
              {quotes.map(quote => {
                const config = STATUS_CONFIG[quote.status] || STATUS_CONFIG.new;
                const Icon = config.icon;
                return (
                  <button key={quote.id} onClick={() => setSelected(quote)}
                    className={`w-full text-left p-4 rounded-sm border transition-all ${selected?.id === quote.id ? 'border-orange-500/30 bg-sm-card/60' : 'border-sm-border bg-sm-card/30 hover:bg-sm-card/50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div><h3 className="font-semibold">{quote.companyName}</h3><p className="text-xs text-sm-muted">{quote.email}</p></div>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs ${config.bg} ${config.color}`}><Icon className="w-3 h-3" /> {quote.status}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-sm-muted">
                      <span>{quote.industry}</span><span>{quote.employees}</span><span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className="hidden lg:block w-[400px] p-5 rounded-sm border border-sm-border bg-sm-card/30 sticky top-20 self-start max-h-[80vh] overflow-y-auto text-sm">
                <h2 className="font-display font-bold text-lg mb-1">{selected.companyName}</h2>
                <p className="text-sm-muted mb-3">{selected.email} {selected.phone && `| ${selected.phone}`}</p>
                <div className="space-y-2 mb-3">
                  {selected.location && <p><span className="text-sm-muted">Location:</span> {selected.location}</p>}
                  {selected.website && <p><span className="text-sm-muted">Web:</span> <a href={selected.website} target="_blank" className="text-orange-400">{selected.website}</a></p>}
                  <p><span className="text-sm-muted">Industry:</span> {selected.industry} | <span className="text-sm-muted">Team:</span> {selected.employees}</p>
                  <div className="flex flex-wrap gap-1">{selected.services.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-sm bg-sm-border text-sm-light">{s}</span>)}</div>
                  <p className="text-sm-light">{selected.description}</p>
                </div>
                <div className="p-3 rounded-sm bg-sm-dark border border-sm-border mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-sm-muted">Setup</span><p className="font-bold">${selected.estimate.setupMin.toLocaleString()}-${selected.estimate.setupMax.toLocaleString()}</p></div>
                    <div><span className="text-sm-muted">Monthly</span><p className="font-bold">${selected.estimate.monthlyMin.toLocaleString()}-${selected.estimate.monthlyMax.toLocaleString()}/mo</p></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['new', 'reviewing', 'quoted', 'accepted', 'paid', 'rejected'].map(s => (
                    <button key={s} onClick={() => updateQuoteStatus(selected.id, s)}
                      className={`px-2 py-1 rounded-sm text-xs border capitalize ${selected.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                    >{s}</button>
                  ))}
                </div>
                {selected.status === 'paid' && <p className="text-xs text-orange-400 mt-2">Invoice auto-generated</p>}
                <button
                  onClick={async () => {
                    if (!confirm(`Delete quote from ${selected.companyName}? This cannot be undone.`)) return;
                    await fetch('/api/admin/quotes', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: selected.id }) });
                    logActivity(`Quote deleted: ${selected.companyName} (${selected.id})`);
                    setSelected(null);
                    fetchAll();
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete Quote
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====== AUDITS ====== */}
        {tab === 'audits' && (
          <div>
            {/* Quick audit tool */}
            <div className="p-5 rounded-sm border border-orange-500/20 bg-orange-500/5 mb-6">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-orange-400" /> Quick Website Audit</h3>
              <p className="text-xs text-sm-muted mb-3">Paste a website URL to generate audit links and AI opportunity checklist. Use this when meeting clients in person.</p>
              <div className="flex gap-3 mb-3">
                <input value={auditUrl} onChange={e => setAuditUrl(e.target.value)} className={`${inputClass} flex-1`} placeholder="example.com.au" />
                <button onClick={runQuickAudit} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Audit</button>
              </div>
              {auditResult && <pre className="text-xs text-sm-light bg-sm-dark border border-sm-border rounded-sm p-4 whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">{auditResult}</pre>}
            </div>

            {/* Audit requests */}
            {audits.length === 0 ? <div className="text-center py-12 text-sm-muted">No audit requests yet.</div> : (
              <div className="space-y-3">
                {audits.map(audit => {
                  const sc: Record<string, string> = { new: 'text-blue-400 bg-blue-400/10', 'in-progress': 'text-yellow-400 bg-yellow-400/10', completed: 'text-green-400 bg-green-400/10', sent: 'text-purple-400 bg-purple-400/10' };
                  return (
                    <div key={audit.id} className="p-5 rounded-sm border border-sm-border bg-sm-card/30">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{audit.companyName}</h3>
                          <p className="text-xs text-sm-muted">{audit.email} {audit.contactName && `— ${audit.contactName}`}</p>
                          {audit.website && <a href={audit.website.startsWith('http') ? audit.website : `https://${audit.website}`} target="_blank" rel="noopener" className="text-xs text-orange-400">{audit.website}</a>}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-sm ${sc[audit.status] || ''}`}>{audit.status}</span>
                      </div>
                      <p className="text-sm text-sm-light mb-3">{audit.description}</p>
                      <div className="flex gap-2">
                        {(['new', 'in-progress', 'completed', 'sent'] as const).map(s => (
                          <button key={s} onClick={async () => { await fetch('/api/admin/audits', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: audit.id, status: s }) }); logActivity(`Audit ${audit.id} → ${s}`); fetchAll(); }}
                            className={`px-2 py-1 rounded-sm text-xs border capitalize ${audit.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                          >{s}</button>
                        ))}
                        {audit.website && (
                          <button onClick={() => { setAuditUrl(audit.website || ''); runQuickAudit(); }} className="px-2 py-1 rounded-sm text-xs border border-orange-500/30 text-orange-400">Quick Audit</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== INVOICES ====== */}
        {tab === 'invoices' && (
          <div>
            {invoices.length === 0 ? <div className="text-center py-12 text-sm-muted">No invoices. Mark a quote as &quot;paid&quot; to auto-generate.</div> : (
              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-5 rounded-sm border border-sm-border bg-sm-card/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-bold">{inv.id}</h3>
                        <p className="text-xs text-sm-muted">{inv.clientName} — {inv.clientEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-lg text-orange-400">${inv.total.toLocaleString()}</p>
                        <p className="text-xs text-sm-muted">incl. ${inv.gst.toLocaleString()} GST</p>
                      </div>
                    </div>
                    {inv.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm mb-1"><span className="text-sm-light">{item.description}</span><span className="text-sm-muted">${item.total.toLocaleString()}</span></div>
                    ))}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-sm-border">
                      <div className="flex gap-3 text-xs text-sm-muted">
                        <span>Issued: {new Date(inv.issuedAt).toLocaleDateString()}</span>
                        <span>Due: {new Date(inv.dueAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-1">
                        {['draft', 'sent', 'paid', 'overdue'].map(s => (
                          <button key={s} onClick={() => updateInvoiceStatus(inv.id, s)}
                            className={`px-2 py-1 rounded-sm text-xs border capitalize ${inv.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
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

        {/* ====== RECURRING ====== */}
        {tab === 'recurring' && (
          <div>
            <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4">Add Recurring Services (multiple at once)</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input value={newRecurring.clientName} onChange={e => setNewRecurring({ ...newRecurring, clientName: e.target.value })} className={inputClass} placeholder="Client name *" />
                <input value={newRecurring.clientEmail} onChange={e => setNewRecurring({ ...newRecurring, clientEmail: e.target.value })} className={inputClass} placeholder="Client email" />
                <input type="date" value={newRecurring.startDate} onChange={e => setNewRecurring({ ...newRecurring, startDate: e.target.value })} className={inputClass} />
              </div>
              {newRecurring.services.map((svc, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <select value={svc.service} onChange={e => { const s = [...newRecurring.services]; s[i].service = e.target.value; setNewRecurring({ ...newRecurring, services: s }); }} className={`${inputClass} flex-1`}>
                    <option value="">Service *</option>
                    <option value="SEO">SEO</option><option value="GEO">GEO</option><option value="SEO + GEO">SEO + GEO</option>
                    <option value="Google Ads">Google Ads</option><option value="Social Ads">Social Ads</option><option value="Content">Content</option>
                    <option value="Maintenance">Maintenance</option><option value="AI Agents">AI Agents</option><option value="Automation">Automation</option><option value="Custom">Custom</option>
                  </select>
                  <input type="number" value={svc.amount || ''} onChange={e => { const s = [...newRecurring.services]; s[i].amount = Number(e.target.value); setNewRecurring({ ...newRecurring, services: s }); }} className={`${inputClass} w-32`} placeholder="$/mo" />
                  {newRecurring.services.length > 1 && <button onClick={() => { const s = newRecurring.services.filter((_, j) => j !== i); setNewRecurring({ ...newRecurring, services: s }); }} className="text-red-400 text-xs">Remove</button>}
                </div>
              ))}
              <button onClick={() => setNewRecurring({ ...newRecurring, services: [...newRecurring.services, { service: '', amount: 0 }] })} className="text-xs text-orange-400 hover:underline mb-4 block">+ Add another service</button>
              <button onClick={addRecurringBatch} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add All Services</button>
            </div>
            {recurring.length === 0 ? <div className="text-center py-12 text-sm-muted">No recurring services.</div> : (
              <div className="space-y-3">
                {recurring.map(svc => (
                  <div key={svc.id} className="p-4 rounded-sm border border-sm-border bg-sm-card/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{svc.clientName} — <span className="text-orange-400">{svc.service}</span></h3>
                      <p className="text-xs text-sm-muted">Next: {svc.nextBillingDate ? new Date(svc.nextBillingDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-display font-bold text-orange-400">${svc.monthlyAmount}/mo</p>
                      <div className="flex gap-1">
                        {['active', 'paused', 'cancelled'].map(s => (
                          <button key={s} onClick={() => updateRecurringStatus(svc.id, s)}
                            className={`px-2 py-1 rounded-sm text-xs border capitalize ${svc.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
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

        {/* ====== PROJECTS ====== */}
        {tab === 'projects' && (
          <div>
            <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4">Add Project</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input value={newProject.clientName} onChange={e => setNewProject({ ...newProject, clientName: e.target.value })} className={inputClass} placeholder="Client *" />
                <input value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className={inputClass} placeholder="Title *" />
                <input type="date" value={newProject.dueDate} onChange={e => setNewProject({ ...newProject, dueDate: e.target.value })} className={inputClass} />
              </div>
              <button onClick={addProjectFn} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add</button>
            </div>
            {projects.map(proj => (
              <div key={proj.id} className="p-4 rounded-sm border border-sm-border bg-sm-card/30 mb-3">
                <div className="flex justify-between mb-2">
                  <div><h3 className="font-semibold">{proj.title}</h3><p className="text-xs text-sm-muted">{proj.clientName}</p></div>
                  <span className={`text-xs px-2 py-1 rounded-sm ${proj.priority === 'urgent' ? 'bg-red-500/10 text-red-400' : proj.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-sm-border text-sm-light'}`}>{proj.priority}</span>
                </div>
                <div className="flex gap-1.5">
                  {['queued', 'in-progress', 'review', 'delivered', 'completed'].map(s => (
                    <button key={s} onClick={() => updateProjectStatus(proj.id, s)}
                      className={`px-2 py-1 rounded-sm text-xs border capitalize ${proj.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== PORTALS ====== */}
        {tab === 'portals' && (
          <div>
            <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4">Create Delivery Portal</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input value={newPortal.clientName} onChange={e => setNewPortal({ ...newPortal, clientName: e.target.value })} className={inputClass} placeholder="Client *" />
                <input value={newPortal.clientEmail} onChange={e => setNewPortal({ ...newPortal, clientEmail: e.target.value })} className={inputClass} placeholder="Email" />
                <input value={newPortal.projectTitle} onChange={e => setNewPortal({ ...newPortal, projectTitle: e.target.value })} className={inputClass} placeholder="Project title *" />
                <input value={newPortal.projectDescription} onChange={e => setNewPortal({ ...newPortal, projectDescription: e.target.value })} className={inputClass} placeholder="Description" />
              </div>
              <button onClick={async () => {
                if (!newPortal.clientName || !newPortal.projectTitle) return alert('Fill required');
                const res = await fetch('/api/admin/portals', { method: 'POST', headers: headers(), body: JSON.stringify({ action: 'create', ...newPortal }) });
                const data = await res.json();
                if (data.viewUrl) { logActivity(`Portal created: ${newPortal.clientName}`); alert(`Client link: stackmate.digital${data.viewUrl}`); }
                setNewPortal({ clientName: '', clientEmail: '', projectTitle: '', projectDescription: '' });
                fetchAll();
              }} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Create</button>
            </div>

            {portalsList.length > 0 && (
              <>
                <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
                  <h3 className="font-display font-bold mb-3">Add Deliverable</h3>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <select value={newDeliverable.portalId} onChange={e => setNewDeliverable({ ...newDeliverable, portalId: e.target.value })} className={inputClass}>
                      <option value="">Portal *</option>
                      {portalsList.map(p => <option key={p.id} value={p.id}>{p.clientName} — {p.projectTitle}</option>)}
                    </select>
                    <select value={newDeliverable.type} onChange={e => setNewDeliverable({ ...newDeliverable, type: e.target.value })} className={inputClass}>
                      <option value="website">Website</option><option value="repo">Repo</option><option value="credentials">Credentials</option>
                      <option value="design">Design</option><option value="document">Doc</option><option value="api">API</option><option value="agent">Agent</option>
                    </select>
                    <input value={newDeliverable.title} onChange={e => setNewDeliverable({ ...newDeliverable, title: e.target.value })} className={inputClass} placeholder="Title *" />
                  </div>
                  <div className="flex gap-3 mb-3">
                    <input value={newDeliverable.url} onChange={e => setNewDeliverable({ ...newDeliverable, url: e.target.value })} className={`${inputClass} flex-1`} placeholder="URL" />
                    <button onClick={async () => {
                      if (!newDeliverable.portalId || !newDeliverable.title) return;
                      await fetch('/api/admin/portals', { method: 'POST', headers: headers(), body: JSON.stringify({ action: 'add-deliverable', portalId: newDeliverable.portalId, deliverable: { type: newDeliverable.type, title: newDeliverable.title, description: newDeliverable.description, url: newDeliverable.url, projectId: newDeliverable.portalId } }) });
                      logActivity(`Deliverable: ${newDeliverable.title}`);
                      setNewDeliverable({ portalId: '', type: 'website', title: '', description: '', url: '' });
                      fetchAll();
                    }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add</button>
                  </div>
                </div>
                <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
                  <h3 className="font-display font-bold mb-3">Post Update</h3>
                  <div className="flex gap-3">
                    <select value={newUpdate.portalId} onChange={e => setNewUpdate({ ...newUpdate, portalId: e.target.value })} className={`${inputClass} w-64`}>
                      <option value="">Portal *</option>
                      {portalsList.map(p => <option key={p.id} value={p.id}>{p.clientName}</option>)}
                    </select>
                    <input value={newUpdate.message} onChange={e => setNewUpdate({ ...newUpdate, message: e.target.value })} className={`${inputClass} flex-1`} placeholder="Update message *" />
                    <button onClick={async () => {
                      if (!newUpdate.portalId || !newUpdate.message) return;
                      await fetch('/api/admin/portals', { method: 'POST', headers: headers(), body: JSON.stringify({ action: 'add-update', portalId: newUpdate.portalId, message: newUpdate.message }) });
                      logActivity(`Update posted: ${newUpdate.message}`);
                      setNewUpdate({ portalId: '', message: '' });
                      fetchAll();
                    }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Post</button>
                  </div>
                </div>
              </>
            )}

            {portalsList.map(portal => (
              <div key={portal.id} className="p-4 rounded-sm border border-sm-border bg-sm-card/30 mb-3">
                <div className="flex justify-between mb-2">
                  <div><h3 className="font-semibold">{portal.projectTitle}</h3><p className="text-xs text-sm-muted">{portal.clientName}</p></div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      {(['in-progress', 'review', 'delivered', 'completed'] as const).map(s => (
                        <button key={s} onClick={async () => { await fetch('/api/admin/portals', { method: 'POST', headers: headers(), body: JSON.stringify({ action: 'update', id: portal.id, updates: { status: s } }) }); fetchAll(); }}
                          className={`px-2 py-1 rounded-sm text-xs border capitalize ${portal.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-sm-border text-sm-muted'}`}
                        >{s}</button>
                      ))}
                    </div>
                    <button className="text-xs text-orange-400 mt-1" onClick={() => { navigator.clipboard.writeText(`stackmate.digital/portal/${portal.accessCode}`); alert('Copied!'); }}>Copy link</button>
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-sm-muted">
                  <span>{portal.deliverables.length} deliverables</span>
                  <span>{portal.updates.length} updates</span>
                  <span>{portal.handoverChecklist.filter(h => h.done).length}/{portal.handoverChecklist.length} handover</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== CLIENTS ====== */}
        {tab === 'clients' && (
          <div>
            <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-6">
              <h3 className="font-display font-bold mb-4">Add Client</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className={inputClass} placeholder="Name" />
                <input value={newClient.url} onChange={e => setNewClient({ ...newClient, url: e.target.value })} className={inputClass} placeholder="URL" />
                <input value={newClient.logoUrl} onChange={e => setNewClient({ ...newClient, logoUrl: e.target.value })} className={inputClass} placeholder="Logo URL" />
                <input value={newClient.heroUrl} onChange={e => setNewClient({ ...newClient, heroUrl: e.target.value })} className={inputClass} placeholder="Hero URL" />
              </div>
              <button onClick={addClientFn} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(client => {
                const rev = clientRevenue[client.name];
                const cost = (() => { let t = 0; expenses.filter(e => e.clientName === client.name && e.recurring && e.frequency === 'monthly').forEach(e => t += e.amount); return t; })();
                return (
                <div key={client.id} className="p-4 rounded-sm border border-sm-border bg-sm-card/30">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.logoUrl} alt="" className="w-8 h-8 rounded object-cover" />
                      <div><p className="font-semibold text-sm">{client.name}</p><p className="text-xs text-sm-muted">{client.url.replace(/^https?:\/\//, '')}</p></div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => {
                        const name = prompt('Client name:', client.name);
                        const url = prompt('Website URL:', client.url);
                        const logoUrl = prompt('Logo URL:', client.logoUrl);
                        const heroUrl = prompt('Hero URL:', client.heroUrl);
                        if (name && url && logoUrl && heroUrl) {
                          fetch('/api/admin/clients', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: client.id }) })
                            .then(() => fetch('/api/admin/clients', { method: 'POST', headers: headers(), body: JSON.stringify({ name, url, logoUrl, heroUrl }) }))
                            .then(() => { logActivity(`Client edited: ${name}`); fetchAll(); });
                        }
                      }} className="text-sm-muted hover:text-orange-400"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => deleteClientFn(client.id)} className="text-sm-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.heroUrl} alt="" className="w-full aspect-video object-cover rounded mb-2" />
                  {rev && (
                    <div className="flex justify-between text-xs pt-2 border-t border-sm-border">
                      <span className="text-sm-muted">Rev: <strong className="text-orange-400">${rev.monthly}/mo</strong></span>
                      <span className="text-sm-muted">Cost: <strong className="text-red-400">${cost}/mo</strong></span>
                      <span className="text-sm-muted">Profit: <strong className={rev.monthly - cost >= 0 ? 'text-green-400' : 'text-red-400'}>${rev.monthly - cost}/mo</strong></span>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== REVENUE ====== */}
        {tab === 'revenue' && (() => {
          const monthlyExpenses = expenses.filter(e => e.recurring && e.frequency === 'monthly').reduce((s, e) => s + e.amount, 0);
          const expensesByClient: Record<string, number> = {};
          expenses.filter(e => e.recurring && e.frequency === 'monthly').forEach(e => {
            const k = e.clientName || 'General'; expensesByClient[k] = (expensesByClient[k] || 0) + e.amount;
          });
          const netMonthly = monthlyRecurring - monthlyExpenses;

          return (
          <div>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 text-center">
                <p className="text-xs text-sm-muted">Total Revenue</p>
                <p className="text-2xl font-display font-bold text-orange-400">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 text-center">
                <p className="text-xs text-sm-muted">MRR</p>
                <p className="text-2xl font-display font-bold text-orange-400">${monthlyRecurring.toLocaleString()}/mo</p>
              </div>
              <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 text-center">
                <p className="text-xs text-sm-muted">Monthly Expenses</p>
                <p className="text-2xl font-display font-bold text-red-400">${monthlyExpenses.toLocaleString()}/mo</p>
              </div>
              <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 text-center">
                <p className="text-xs text-sm-muted">Net Profit/mo</p>
                <p className={`text-2xl font-display font-bold ${netMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netMonthly.toLocaleString()}/mo</p>
              </div>
            </div>

            {/* Client P&L */}
            <h3 className="font-display font-bold mb-3">Revenue & Costs by Client</h3>
            {Object.keys(clientRevenue).length === 0 ? <p className="text-sm-muted mb-6">No data yet.</p> : (
              <div className="space-y-2 mb-8">
                {Object.entries(clientRevenue).sort((a, b) => (b[1].monthly - (expensesByClient[b[0]] || 0)) - (a[1].monthly - (expensesByClient[a[0]] || 0))).map(([name, rev]) => {
                  const cost = expensesByClient[name] || 0;
                  const profit = rev.monthly - cost;
                  return (
                    <div key={name} className="p-4 rounded-sm border border-sm-border bg-sm-card/30 flex items-center justify-between">
                      <span className="font-semibold">{name}</span>
                      <div className="flex gap-4 text-xs">
                        <span>Rev: <strong className="text-orange-400">${rev.monthly.toLocaleString()}/mo</strong></span>
                        <span>Cost: <strong className="text-red-400">${cost.toLocaleString()}/mo</strong></span>
                        <span>Profit: <strong className={profit >= 0 ? 'text-green-400' : 'text-red-400'}>${profit.toLocaleString()}/mo</strong></span>
                        <span>Margin: <strong className="text-white">{rev.monthly > 0 ? Math.round((profit / rev.monthly) * 100) : 0}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add expense */}
            <h3 className="font-display font-bold mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-400" /> Expenses</h3>
            <div className="p-5 rounded-sm border border-sm-border bg-sm-card/30 mb-4">
              <div className="grid md:grid-cols-4 gap-3 mb-3">
                <input value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} className={inputClass} placeholder="Description *" />
                <input type="number" value={newExpense.amount || ''} onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} className={inputClass} placeholder="Amount ($) *" />
                <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })} className={inputClass}>
                  <option value="api">API Costs</option><option value="hosting">Hosting</option><option value="tools">Tools/Software</option>
                  <option value="twilio">Twilio/Comms</option><option value="ads">Ads Spend</option><option value="contractor">Contractor</option>
                  <option value="software">SaaS/Subscriptions</option><option value="other">Other</option>
                </select>
                <input value={newExpense.clientName} onChange={e => setNewExpense({ ...newExpense, clientName: e.target.value })} className={inputClass} placeholder="Client (optional)" />
              </div>
              <div className="flex gap-3 items-center">
                <label className="flex items-center gap-2 text-sm text-sm-light"><input type="checkbox" checked={newExpense.recurring} onChange={e => setNewExpense({ ...newExpense, recurring: e.target.checked })} /> Recurring</label>
                {newExpense.recurring && (
                  <select value={newExpense.frequency} onChange={e => setNewExpense({ ...newExpense, frequency: e.target.value })} className={`${inputClass} w-32`}>
                    <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                  </select>
                )}
                <button onClick={async () => {
                  if (!newExpense.description || !newExpense.amount) return alert('Fill description and amount');
                  await fetch('/api/admin/expenses', { method: 'POST', headers: headers(), body: JSON.stringify(newExpense) });
                  logActivity(`Expense: ${newExpense.description} $${newExpense.amount}`);
                  setNewExpense({ clientName: '', category: 'api', description: '', amount: 0, recurring: true, frequency: 'monthly', date: '' });
                  fetchAll();
                }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add</button>
              </div>
            </div>

            {/* Quarterly summary */}
            <h3 className="font-display font-bold mt-8 mb-3">Quarterly Projections</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => {
                const qRevenue = monthlyRecurring * 3;
                const qExpenses = monthlyExpenses * 3;
                const qProfit = qRevenue - qExpenses;
                return (
                  <div key={q} className="p-4 rounded-sm border border-sm-border bg-sm-card/30">
                    <p className="text-xs text-sm-muted font-bold">{q} {new Date().getFullYear()}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-sm-muted">Revenue</span><span className="text-orange-400 font-bold">${qRevenue.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-sm-muted">Expenses</span><span className="text-red-400 font-bold">${qExpenses.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t border-sm-border pt-1"><span className="text-sm-muted">Net</span><span className={`font-bold ${qProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${qProfit.toLocaleString()}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expense list */}
            <h3 className="font-display font-bold mb-3">All Expenses</h3>
            {expenses.length > 0 && (
              <div className="space-y-2">
                {expenses.map(exp => (
                  <div key={exp.id} className="p-3 rounded-sm border border-sm-border bg-sm-card/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-sm bg-sm-border text-sm-light">{exp.category}</span>
                      <span className="text-sm">{exp.description}</span>
                      {exp.clientName && <span className="text-xs text-sm-muted">({exp.clientName})</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-red-400">${exp.amount}{exp.recurring ? `/${exp.frequency === 'yearly' ? 'yr' : 'mo'}` : ''}</span>
                      <button onClick={async () => { await fetch('/api/admin/expenses', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: exp.id }) }); fetchAll(); }} className="text-sm-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          );
        })()}

        {/* ====== MAILING LIST ====== */}
        {tab === 'mailing' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Mailing List ({subscribers.filter(s => s.subscribed).length} active / {subscribers.length} total)</h3>
            </div>
            {subscribers.length === 0 ? <p className="text-sm-muted py-12 text-center">No subscribers yet. Emails are collected from quote and audit submissions.</p> : (
              <div className="space-y-2">
                {subscribers.map(sub => (
                  <div key={sub.id} className="p-3 rounded-sm border border-sm-border bg-sm-card/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${sub.subscribed ? 'bg-green-400' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-sm">{sub.email}</p>
                        <p className="text-xs text-sm-muted">{sub.name || 'No name'} — via {sub.source} — {new Date(sub.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${sub.subscribed ? 'text-green-400' : 'text-red-400'}`}>{sub.subscribed ? 'Subscribed' : 'Unsubscribed'}</span>
                      <button onClick={async () => { await fetch('/api/admin/mailing-list', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: sub.id }) }); fetchAll(); }} className="text-sm-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== 24/7 MONITORING ====== */}
        {tab === 'monitoring' && (
          <div>
            <div className="p-5 rounded-sm border border-orange-500/20 bg-orange-500/5 mb-6">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Radar className="w-4 h-4 text-orange-400" /> Add Site to Monitor</h3>
              <p className="text-xs text-sm-muted mb-3">Track client websites 24/7. Scores update when you manually run audits (auto PageSpeed API coming soon).</p>
              <div className="flex gap-3 mb-3">
                <input value={newAutoAudit.clientName} onChange={e => setNewAutoAudit({ ...newAutoAudit, clientName: e.target.value })} className={`${inputClass} w-48`} placeholder="Client name" />
                <input value={newAutoAudit.url} onChange={e => setNewAutoAudit({ ...newAutoAudit, url: e.target.value })} className={`${inputClass} flex-1`} placeholder="website.com.au *" />
                <select value={newAutoAudit.frequency} onChange={e => setNewAutoAudit({ ...newAutoAudit, frequency: e.target.value })} className={`${inputClass} w-32`}>
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                </select>
                <button onClick={async () => {
                  if (!newAutoAudit.url) return;
                  await fetch('/api/admin/auto-audits', { method: 'POST', headers: headers(), body: JSON.stringify(newAutoAudit) });
                  logActivity(`Monitoring added: ${newAutoAudit.url}`);
                  setNewAutoAudit({ clientName: '', url: '', frequency: 'daily' });
                  fetchAll();
                }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm">Add</button>
              </div>
            </div>

            {autoAudits.length === 0 ? <p className="text-sm-muted py-12 text-center">No sites being monitored. Add one above.</p> : (
              <div className="space-y-3">
                {autoAudits.map(aa => (
                  <div key={aa.id} className="p-5 rounded-sm border border-sm-border bg-sm-card/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{aa.clientName || aa.url}</h3>
                        <a href={aa.url.startsWith('http') ? aa.url : `https://${aa.url}`} target="_blank" rel="noopener" className="text-xs text-orange-400">{aa.url}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-sm ${aa.status === 'active' ? 'bg-green-400/10 text-green-400' : 'bg-sm-border text-sm-muted'}`}>{aa.status}</span>
                        <button onClick={async () => { await fetch('/api/admin/auto-audits', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: aa.id }) }); fetchAll(); }} className="text-sm-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="p-3 rounded-sm bg-sm-dark border border-sm-border text-center">
                        <p className="text-xs text-sm-muted">GEO</p>
                        <p className={`text-lg font-display font-bold ${(aa.geoScore || 0) >= 80 ? 'text-green-400' : (aa.geoScore || 0) >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{aa.geoScore ?? '—'}</p>
                      </div>
                      <div className="p-3 rounded-sm bg-sm-dark border border-sm-border text-center">
                        <p className="text-xs text-sm-muted">SEO</p>
                        <p className={`text-lg font-display font-bold ${(aa.seoScore || 0) >= 80 ? 'text-green-400' : (aa.seoScore || 0) >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{aa.seoScore ?? '—'}</p>
                      </div>
                      <div className="p-3 rounded-sm bg-sm-dark border border-sm-border text-center">
                        <p className="text-xs text-sm-muted">Performance</p>
                        <p className={`text-lg font-display font-bold ${(aa.performanceScore || 0) >= 80 ? 'text-green-400' : (aa.performanceScore || 0) >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{aa.performanceScore ?? '—'}</p>
                      </div>
                      <div className="p-3 rounded-sm bg-sm-dark border border-sm-border text-center">
                        <p className="text-xs text-sm-muted">Last Run</p>
                        <p className="text-xs text-sm-light mt-1">{aa.lastRun ? new Date(aa.lastRun).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const geo = prompt('GEO score (0-100):', String(aa.geoScore || ''));
                        const seo = prompt('SEO score (0-100):', String(aa.seoScore || ''));
                        const perf = prompt('Performance score (0-100):', String(aa.performanceScore || ''));
                        fetch('/api/admin/auto-audits', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: aa.id, geoScore: geo ? Number(geo) : undefined, seoScore: seo ? Number(seo) : undefined, performanceScore: perf ? Number(perf) : undefined }) }).then(() => fetchAll());
                      }} className="px-3 py-1.5 rounded-sm text-xs border border-orange-500/30 text-orange-400 hover:bg-orange-500/10">Update Scores</button>
                      <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(aa.url.startsWith('http') ? aa.url : `https://${aa.url}`)}`} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-sm text-xs border border-sm-border text-sm-light hover:border-white/30">PageSpeed →</a>
                      <a href="https://geoptie.com/free-geo-audit" target="_blank" rel="noopener" className="px-3 py-1.5 rounded-sm text-xs border border-sm-border text-sm-light hover:border-white/30">GEO Audit →</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== TERMINAL ====== */}
        {tab === 'dashboards' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-orange-400" /> Client Dashboards</h3>

            {/* Create New Dashboard */}
            <div className="bg-sm-card/30 border border-sm-border rounded-sm p-4 space-y-3">
              <h4 className="text-sm font-semibold text-white">Create Dashboard</h4>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} placeholder="Client Name *" value={newDashboard.clientName} onChange={e => setNewDashboard(p => ({ ...p, clientName: e.target.value }))} />
                <input className={inputClass} placeholder="Client Email" value={newDashboard.clientEmail} onChange={e => setNewDashboard(p => ({ ...p, clientEmail: e.target.value }))} />
                <input className={inputClass} placeholder="Logo URL" value={newDashboard.clientLogo} onChange={e => setNewDashboard(p => ({ ...p, clientLogo: e.target.value }))} />
                <input className={inputClass} placeholder="Domain (e.g. example.com)" value={newDashboard.clientDomain} onChange={e => setNewDashboard(p => ({ ...p, clientDomain: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <input type="color" value={newDashboard.brandColor} onChange={e => setNewDashboard(p => ({ ...p, brandColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-xs text-sm-muted">Brand Color</span>
                </div>
                <input className={inputClass} placeholder="Notes" value={newDashboard.notes} onChange={e => setNewDashboard(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <button onClick={async () => {
                if (!newDashboard.clientName) return alert('Client name required');
                await fetch('/api/admin/dashboards', { method: 'POST', headers: headers(), body: JSON.stringify(newDashboard) });
                logActivity(`Dashboard created: ${newDashboard.clientName}`);
                setNewDashboard({ clientName: '', clientEmail: '', clientLogo: '', clientDomain: '', brandColor: '#f97316', notes: '' });
                fetchAll();
              }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-xs font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Create Dashboard
              </button>
            </div>

            {/* Dashboard List */}
            <div className="space-y-3">
              {dashboards.length === 0 && <div className="text-center py-12 text-sm-muted">No dashboards yet.</div>}
              {dashboards.map(db => (
                <div key={db.id} className="bg-sm-card/30 border border-sm-border rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-white">{db.clientName}</span>
                      {db.clientDomain && <span className="text-xs text-sm-muted ml-2">{db.clientDomain}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-sm-dark px-2 py-1 rounded text-orange-400 font-mono">{db.accessCode}</code>
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/client-dashboard/${db.accessCode}`); alert('Link copied!'); }} className="p-1.5 hover:bg-white/5 rounded" title="Copy link">
                        <Copy className="w-3.5 h-3.5 text-sm-light" />
                      </button>
                      <a href={`/client-dashboard/${db.accessCode}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/5 rounded" title="View dashboard">
                        <ExternalLink className="w-3.5 h-3.5 text-sm-light" />
                      </a>
                      <button onClick={async () => { if (!confirm('Delete this dashboard?')) return; await fetch('/api/admin/dashboards', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: db.id }) }); logActivity(`Dashboard deleted: ${db.clientName}`); fetchAll(); }} className="p-1.5 hover:bg-red-500/10 rounded">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-sm-muted mb-3">
                    <span>SEO: {db.seoScores.length} entries</span>
                    <span>GEO: {db.geoScores.length} platforms</span>
                    <span>Traffic: {db.trafficData.length} months</span>
                    <span>Rankings: {db.rankings.length}</span>
                    <span>Leads: {db.leads.length}</span>
                  </div>

                  {/* Add Metrics Toggle */}
                  {editingDashboard === db.id ? (
                    <div className="border-t border-sm-border pt-3 mt-3 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {['seo', 'geo', 'traffic', 'ranking', 'lead', 'metric'].map(t => (
                          <button key={t} onClick={() => setDashboardMetric(p => ({ ...p, type: t }))}
                            className={`px-2 py-1 rounded text-xs ${dashboardMetric.type === t ? 'bg-orange-500 text-white' : 'border border-sm-border text-sm-light'}`}>{t.toUpperCase()}</button>
                        ))}
                      </div>
                      {dashboardMetric.type === 'seo' && (
                        <div className="flex gap-2 items-end">
                          <input className={inputClass} placeholder="Date (e.g. Jan)" value={dashboardMetric.date} onChange={e => setDashboardMetric(p => ({ ...p, date: e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Score (0-100)" value={dashboardMetric.score || ''} onChange={e => setDashboardMetric(p => ({ ...p, score: +e.target.value }))} />
                          <button onClick={async () => {
                            const updated = [...db.seoScores, { date: dashboardMetric.date, score: dashboardMetric.score }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, seoScores: updated }) });
                            logActivity(`SEO score added to ${db.clientName}: ${dashboardMetric.score}`);
                            setDashboardMetric(p => ({ ...p, date: '', score: 0 }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      {dashboardMetric.type === 'geo' && (
                        <div className="flex gap-2 items-end">
                          <select className={inputClass} value={dashboardMetric.platform} onChange={e => setDashboardMetric(p => ({ ...p, platform: e.target.value }))}>
                            <option value="">Platform</option>
                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Perplexity">Perplexity</option>
                            <option value="Gemini">Gemini</option>
                            <option value="Claude">Claude</option>
                            <option value="Copilot">Copilot</option>
                          </select>
                          <input className={inputClass} type="number" placeholder="Score (0-100)" value={dashboardMetric.score || ''} onChange={e => setDashboardMetric(p => ({ ...p, score: +e.target.value }))} />
                          <button onClick={async () => {
                            const existing = db.geoScores.filter(g => g.platform !== dashboardMetric.platform);
                            const updated = [...existing, { platform: dashboardMetric.platform, score: dashboardMetric.score }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, geoScores: updated }) });
                            logActivity(`GEO score added to ${db.clientName}: ${dashboardMetric.platform} ${dashboardMetric.score}`);
                            setDashboardMetric(p => ({ ...p, platform: '', score: 0 }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      {dashboardMetric.type === 'traffic' && (
                        <div className="flex gap-2 items-end">
                          <input className={inputClass} placeholder="Month (e.g. Mar)" value={dashboardMetric.month} onChange={e => setDashboardMetric(p => ({ ...p, month: e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Visits" value={dashboardMetric.visits || ''} onChange={e => setDashboardMetric(p => ({ ...p, visits: +e.target.value }))} />
                          <button onClick={async () => {
                            const updated = [...db.trafficData, { month: dashboardMetric.month, visits: dashboardMetric.visits }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, trafficData: updated }) });
                            logActivity(`Traffic added to ${db.clientName}: ${dashboardMetric.month} ${dashboardMetric.visits}`);
                            setDashboardMetric(p => ({ ...p, month: '', visits: 0 }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      {dashboardMetric.type === 'ranking' && (
                        <div className="flex gap-2 items-end">
                          <input className={inputClass} placeholder="Keyword" value={dashboardMetric.keyword} onChange={e => setDashboardMetric(p => ({ ...p, keyword: e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Position" value={dashboardMetric.position || ''} onChange={e => setDashboardMetric(p => ({ ...p, position: +e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Change (+/-)" value={dashboardMetric.change || ''} onChange={e => setDashboardMetric(p => ({ ...p, change: +e.target.value }))} />
                          <button onClick={async () => {
                            const existing = db.rankings.filter(r => r.keyword !== dashboardMetric.keyword);
                            const updated = [...existing, { keyword: dashboardMetric.keyword, position: dashboardMetric.position, change: dashboardMetric.change }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, rankings: updated }) });
                            logActivity(`Ranking added to ${db.clientName}: ${dashboardMetric.keyword} #${dashboardMetric.position}`);
                            setDashboardMetric(p => ({ ...p, keyword: '', position: 0, change: 0 }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      {dashboardMetric.type === 'lead' && (
                        <div className="flex gap-2 items-end">
                          <input className={inputClass} placeholder="Lead Name" value={dashboardMetric.leadName} onChange={e => setDashboardMetric(p => ({ ...p, leadName: e.target.value }))} />
                          <input className={inputClass} placeholder="Source (e.g. Google)" value={dashboardMetric.leadSource} onChange={e => setDashboardMetric(p => ({ ...p, leadSource: e.target.value }))} />
                          <button onClick={async () => {
                            const updated = [...db.leads, { date: new Date().toLocaleDateString('en-AU'), name: dashboardMetric.leadName, source: dashboardMetric.leadSource }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, leads: updated }) });
                            logActivity(`Lead added to ${db.clientName}: ${dashboardMetric.leadName}`);
                            setDashboardMetric(p => ({ ...p, leadName: '', leadSource: '' }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      {dashboardMetric.type === 'metric' && (
                        <div className="flex gap-2 items-end">
                          <input className={inputClass} placeholder="Label" value={dashboardMetric.metricLabel} onChange={e => setDashboardMetric(p => ({ ...p, metricLabel: e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Value" value={dashboardMetric.metricValue || ''} onChange={e => setDashboardMetric(p => ({ ...p, metricValue: +e.target.value }))} />
                          <input className={inputClass} type="number" placeholder="Previous (optional)" value={dashboardMetric.metricPrev || ''} onChange={e => setDashboardMetric(p => ({ ...p, metricPrev: +e.target.value }))} />
                          <button onClick={async () => {
                            const existing = db.metrics.filter(m => m.label !== dashboardMetric.metricLabel);
                            const updated = [...existing, { label: dashboardMetric.metricLabel, value: dashboardMetric.metricValue, prev: dashboardMetric.metricPrev || undefined }];
                            await fetch('/api/admin/dashboards', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: db.id, metrics: updated }) });
                            logActivity(`Metric added to ${db.clientName}: ${dashboardMetric.metricLabel} = ${dashboardMetric.metricValue}`);
                            setDashboardMetric(p => ({ ...p, metricLabel: '', metricValue: 0, metricPrev: 0 }));
                            fetchAll();
                          }} className="px-3 py-3 bg-orange-500 text-white rounded-lg text-xs shrink-0">Add</button>
                        </div>
                      )}
                      <button onClick={() => setEditingDashboard(null)} className="text-xs text-sm-muted hover:text-white">Close</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingDashboard(db.id)} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Metrics
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold flex items-center gap-2"><Tag className="w-5 h-5 text-orange-400" /> Package Management</h3>
              {pkgList.length === 0 && (
                <button
                  onClick={async () => {
                    const res = await fetch('/api/admin/packages/seed', { method: 'POST', headers: headers() });
                    const data = await res.json();
                    if (data.success) { logActivity(`Seeded ${data.seeded} packages`); fetchAll(); }
                    else alert(data.error || 'Failed to seed');
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
                >
                  Seed Packages
                </button>
              )}
            </div>
            {pkgList.length === 0 ? (
              <div className="text-center py-16 text-sm-muted">No packages yet. Click &quot;Seed Packages&quot; to populate all tiers.</div>
            ) : (
              <div className="space-y-8">
                {['tradies', 'restaurants', 'ecommerce', 'local-services', 'corporate', 'enterprise'].map(industry => {
                  const industryPkgs = pkgList.filter(p => p.industry === industry);
                  if (industryPkgs.length === 0) return null;
                  return (
                    <div key={industry}>
                      <h4 className="font-display font-bold text-lg mb-3 capitalize">{industry.replace('-', ' ')}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {industryPkgs.map(pkg => (
                          <div key={pkg.id} className={`border rounded-lg p-4 ${pkg.visible ? 'border-orange-500/40 bg-orange-500/5' : 'border-sm-border bg-sm-dark'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-display font-bold">{pkg.tierLabel}</span>
                              <button
                                onClick={async () => {
                                  await fetch('/api/admin/packages', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: pkg.id, visible: !pkg.visible }) });
                                  logActivity(`${pkg.tierLabel} (${industry}) → ${!pkg.visible ? 'visible' : 'hidden'}`);
                                  fetchAll();
                                }}
                                className={`text-xs px-2 py-1 rounded ${pkg.visible ? 'bg-green-500/20 text-green-400' : 'bg-sm-surface text-sm-muted'}`}
                              >
                                {pkg.visible ? 'Visible' : 'Hidden'}
                              </button>
                            </div>
                            <p className="text-xs text-sm-muted mb-1">Tier: {pkg.tier}</p>
                            {pkgEditing === pkg.id ? (
                              <div className="space-y-2 my-2">
                                <div>
                                  <label className="text-xs text-sm-muted">Upfront (cents)</label>
                                  <input type="number" value={pkgEditValues.upfrontPrice} onChange={e => setPkgEditValues(p => ({ ...p, upfrontPrice: Number(e.target.value) }))} className={inputClass} />
                                </div>
                                <div>
                                  <label className="text-xs text-sm-muted">Monthly (cents)</label>
                                  <input type="number" value={pkgEditValues.monthlyPrice} onChange={e => setPkgEditValues(p => ({ ...p, monthlyPrice: Number(e.target.value) }))} className={inputClass} />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={async () => {
                                    await fetch('/api/admin/packages', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: pkg.id, upfrontPrice: pkgEditValues.upfrontPrice, monthlyPrice: pkgEditValues.monthlyPrice }) });
                                    logActivity(`Updated prices for ${pkg.tierLabel}: upfront=${pkgEditValues.upfrontPrice}, monthly=${pkgEditValues.monthlyPrice}`);
                                    setPkgEditing(null);
                                    fetchAll();
                                  }} className="px-3 py-1 bg-orange-500 text-white rounded text-xs">Save</button>
                                  <button onClick={() => setPkgEditing(null)} className="px-3 py-1 border border-sm-border text-sm-muted rounded text-xs">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="my-2">
                                <p className="text-sm font-bold">A${(pkg.upfrontPrice / 100).toLocaleString()} <span className="text-xs text-sm-muted font-normal">upfront</span></p>
                                <p className="text-sm font-bold">A${(pkg.monthlyPrice / 100).toLocaleString()}<span className="text-xs text-sm-muted font-normal">/mo</span></p>
                                <button onClick={() => { setPkgEditing(pkg.id); setPkgEditValues({ upfrontPrice: pkg.upfrontPrice, monthlyPrice: pkg.monthlyPrice }); }} className="text-xs text-orange-400 hover:text-orange-300 mt-1">Edit Prices</button>
                              </div>
                            )}
                            <div className="mt-2 space-y-1">
                              {pkg.features.map((f, i) => (
                                <p key={i} className="text-xs text-sm-muted">- {f}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── ADD-ONS SECTION ── */}
            <div className="mt-12 pt-8 border-t border-sm-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold flex items-center gap-2"><Puzzle className="w-5 h-5 text-orange-400" /> Add-on Management</h3>
                {addonList.length === 0 && (
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/admin/addons/seed', { method: 'POST', headers: headers() });
                      const data = await res.json();
                      if (data.success) { logActivity(`Seeded ${data.seeded} add-ons + pricing config`); fetchAll(); }
                      else alert(data.error || 'Failed to seed');
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Seed Add-ons
                  </button>
                )}
              </div>
              {addonList.length === 0 ? (
                <div className="text-center py-10 text-sm-muted">No add-ons yet. Click &quot;Seed Add-ons&quot; to populate all categories.</div>
              ) : (
                <div className="space-y-8">
                  {(['core_build', 'ai', 'integrations', 'growth'] as const).map(cat => {
                    const catAddons = addonList.filter(a => a.category === cat);
                    if (catAddons.length === 0) return null;
                    const catLabel: Record<string, string> = { core_build: 'Core Build', ai: 'AI', integrations: 'Integrations', growth: 'Growth' };
                    return (
                      <div key={cat}>
                        <h4 className="font-display font-bold text-lg mb-3">{catLabel[cat]}</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {catAddons.map(addon => (
                            <div key={addon.id} className={`border rounded-lg p-4 ${addon.visible ? 'border-orange-500/40 bg-orange-500/5' : 'border-sm-border bg-sm-dark'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-display font-bold text-sm">{addon.name}</span>
                                <button
                                  onClick={async () => {
                                    await fetch('/api/admin/addons', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: addon.id, visible: !addon.visible }) });
                                    logActivity(`Add-on ${addon.name} → ${!addon.visible ? 'visible' : 'hidden'}`);
                                    fetchAll();
                                  }}
                                  className={`text-xs px-2 py-1 rounded ${addon.visible ? 'bg-green-500/20 text-green-400' : 'bg-sm-surface text-sm-muted'}`}
                                >
                                  {addon.visible ? 'Visible' : 'Hidden'}
                                </button>
                              </div>
                              <p className="text-xs text-sm-muted mb-1">{addon.slug}{addon.perUnit ? ' (per unit)' : ''}</p>
                              {addonEditing === addon.id ? (
                                <div className="space-y-2 my-2">
                                  <div>
                                    <label className="text-xs text-sm-muted">Upfront (cents)</label>
                                    <input type="number" value={addonEditValues.upfrontPrice} onChange={e => setAddonEditValues(p => ({ ...p, upfrontPrice: Number(e.target.value) }))} className={inputClass} />
                                  </div>
                                  <div>
                                    <label className="text-xs text-sm-muted">Monthly (cents)</label>
                                    <input type="number" value={addonEditValues.monthlyPrice} onChange={e => setAddonEditValues(p => ({ ...p, monthlyPrice: Number(e.target.value) }))} className={inputClass} />
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={async () => {
                                      await fetch('/api/admin/addons', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: addon.id, upfrontPrice: addonEditValues.upfrontPrice, monthlyPrice: addonEditValues.monthlyPrice }) });
                                      logActivity(`Updated add-on prices: ${addon.name} upfront=${addonEditValues.upfrontPrice}, monthly=${addonEditValues.monthlyPrice}`);
                                      setAddonEditing(null);
                                      fetchAll();
                                    }} className="px-3 py-1 bg-orange-500 text-white rounded text-xs">Save</button>
                                    <button onClick={() => setAddonEditing(null)} className="px-3 py-1 border border-sm-border text-sm-muted rounded text-xs">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="my-2">
                                  {addon.upfrontPrice > 0 && <p className="text-sm font-bold">A${(addon.upfrontPrice / 100).toLocaleString()} <span className="text-xs text-sm-muted font-normal">upfront</span></p>}
                                  {addon.monthlyPrice > 0 && <p className="text-sm font-bold">A${(addon.monthlyPrice / 100).toLocaleString()}<span className="text-xs text-sm-muted font-normal">/mo</span></p>}
                                  {addon.upfrontPrice === 0 && addon.monthlyPrice === 0 && <p className="text-xs text-sm-muted">No price set</p>}
                                  <button onClick={() => { setAddonEditing(addon.id); setAddonEditValues({ upfrontPrice: addon.upfrontPrice, monthlyPrice: addon.monthlyPrice }); }} className="text-xs text-orange-400 hover:text-orange-300 mt-1">Edit Prices</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── PRICING CONFIG (MULTIPLIERS) ── */}
            <div className="mt-12 pt-8 border-t border-sm-border">
              <h3 className="font-display font-bold flex items-center gap-2 mb-6"><Settings className="w-5 h-5 text-orange-400" /> Pricing Multipliers</h3>
              {pricingConfig.length === 0 ? (
                <p className="text-sm text-sm-muted">No pricing config found. Seed add-ons to populate multipliers.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {pricingConfig.map(cfg => (
                    <div key={cfg.key} className="border border-sm-border rounded-lg p-4 bg-sm-dark">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-display font-bold text-sm capitalize">{cfg.key.replace(/_/g, ' ')}</h4>
                        {configEditing === cfg.key ? (
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              await fetch('/api/admin/pricing-config', { method: 'PATCH', headers: headers(), body: JSON.stringify({ key: cfg.key, value: configEditValues }) });
                              logActivity(`Updated ${cfg.key}: ${JSON.stringify(configEditValues)}`);
                              setConfigEditing(null);
                              fetchAll();
                            }} className="px-3 py-1 bg-orange-500 text-white rounded text-xs">Save</button>
                            <button onClick={() => setConfigEditing(null)} className="px-3 py-1 border border-sm-border text-sm-muted rounded text-xs">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => { setConfigEditing(cfg.key); setConfigEditValues({ ...cfg.value }); }} className="text-xs text-orange-400 hover:text-orange-300">Edit</button>
                        )}
                      </div>
                      {configEditing === cfg.key ? (
                        <div className="space-y-2">
                          {Object.entries(configEditValues).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-3">
                              <span className="text-xs text-sm-muted w-28 capitalize">{k.replace(/_/g, ' ')}</span>
                              <input type="number" step="0.01" value={v} onChange={e => setConfigEditValues(prev => ({ ...prev, [k]: Number(e.target.value) }))} className={`${inputClass} w-24`} />
                              <span className="text-xs text-sm-muted">x</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {Object.entries(cfg.value).map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between text-sm">
                              <span className="text-sm-muted capitalize">{k.replace(/_/g, ' ')}</span>
                              <span className="font-mono font-bold">{v}x</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'terminal' && (
          <div>
            <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Terminal className="w-5 h-5 text-orange-400" /> Activity Log</h3>
            <div className="bg-sm-dark border border-sm-border rounded-sm p-4 font-mono text-xs max-h-[70vh] overflow-y-auto">
              {activityLog.length === 0 ? <p className="text-sm-muted">No activity yet. Actions will appear here in real-time.</p> : (
                activityLog.map((entry, i) => (
                  <div key={i} className="flex gap-3 py-1 border-b border-sm-border/50 last:border-0">
                    <span className="text-sm-muted shrink-0">{new Date(entry.time).toLocaleTimeString()}</span>
                    <span className="text-sm-light">{entry.event}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
