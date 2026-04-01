export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  quoteId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  notes?: string;
}

export interface RecurringService {
  id: string;
  clientName: string;
  clientEmail: string;
  service: string;
  description: string;
  monthlyAmount: number;
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  notes?: string;
}

export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  status: 'queued' | 'in-progress' | 'review' | 'delivered' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
}

const invoices: Invoice[] = [];
const recurringServices: RecurringService[] = [];
const projects: Project[] = [];

// ---- INVOICES ----

export function generateInvoice(params: {
  quoteId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  notes?: string;
}): Invoice {
  const subtotal = params.items.reduce((sum, item) => sum + item.total, 0);
  const gst = Math.round(subtotal * 0.1 * 100) / 100; // 10% GST
  const total = subtotal + gst;

  const now = new Date();
  const due = new Date(now);
  due.setDate(due.getDate() + 14); // 14 day payment terms

  const invoice: Invoice = {
    id: `INV-${String(invoices.length + 1).padStart(4, '0')}`,
    quoteId: params.quoteId,
    clientName: params.clientName,
    clientEmail: params.clientEmail,
    clientAddress: params.clientAddress,
    items: params.items,
    subtotal,
    gst,
    total,
    status: 'draft',
    issuedAt: now.toISOString(),
    dueAt: due.toISOString(),
    notes: params.notes,
  };

  invoices.push(invoice);
  return invoice;
}

export function generateInvoiceFromQuote(quote: {
  id: string;
  companyName: string;
  email: string;
  services: string[];
  otherService?: string;
  estimate: { setupMin: number; setupMax: number; monthlyMin: number; monthlyMax: number };
}): Invoice {
  const items: InvoiceItem[] = [];

  // Use mid-range of estimate for invoice
  const setupPrice = Math.round((quote.estimate.setupMin + quote.estimate.setupMax) / 2 / 100) * 100;
  const monthlyPrice = Math.round((quote.estimate.monthlyMin + quote.estimate.monthlyMax) / 2 / 100) * 100;

  const serviceNames: Record<string, string> = {
    'ai-agents': 'AI Agents & Chatbots',
    'automation': 'Business Automation',
    'custom-software': 'Custom Software Development',
    'website': 'Website / Web App Development',
    'integrations': 'System Integrations',
    'branding': 'Branding & Design',
    'data-analytics': 'Performance Analysis & Analytics',
    'consulting': 'AI Consulting & Strategy',
    'seo': 'SEO Optimisation',
    'ai-search': 'AI Search Optimisation (GEO)',
    'media-buying': 'Media Buying',
    'creative': 'Creatives & Content Production',
    'google-ads': 'Google Ads Management',
    'social-ads': 'Social Media Advertising',
    'content-strategy': 'Content Strategy',
    'display-ads': 'Display Advertising',
    'other': quote.otherService || 'Custom Service',
  };

  const serviceList = quote.services.map(s => serviceNames[s] || s).join(', ');

  if (setupPrice > 0) {
    items.push({
      description: `Project Setup — ${serviceList}`,
      quantity: 1,
      unitPrice: setupPrice,
      total: setupPrice,
    });
  }

  if (monthlyPrice > 0) {
    items.push({
      description: `Monthly Management — ${serviceList} (first month)`,
      quantity: 1,
      unitPrice: monthlyPrice,
      total: monthlyPrice,
    });
  }

  return generateInvoice({
    quoteId: quote.id,
    clientName: quote.companyName,
    clientEmail: quote.email,
    items,
    notes: `Services: ${serviceList}. Payment due within 14 days. All prices in AUD excl. GST.`,
  });
}

export function getInvoices(): Invoice[] {
  return [...invoices].reverse();
}

export function getInvoice(id: string): Invoice | undefined {
  return invoices.find(i => i.id === id);
}

export function updateInvoiceStatus(id: string, status: Invoice['status']): Invoice | null {
  const invoice = invoices.find(i => i.id === id);
  if (!invoice) return null;
  invoice.status = status;
  if (status === 'paid') invoice.paidAt = new Date().toISOString();
  return invoice;
}

// ---- RECURRING SERVICES ----

export function addRecurringService(params: Omit<RecurringService, 'id'>): RecurringService {
  const service: RecurringService = {
    ...params,
    id: `rs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
  recurringServices.push(service);
  return service;
}

export function getRecurringServices(): RecurringService[] {
  return [...recurringServices].reverse();
}

export function updateRecurringService(id: string, updates: Partial<RecurringService>): RecurringService | null {
  const svc = recurringServices.find(s => s.id === id);
  if (!svc) return null;
  Object.assign(svc, updates);
  return svc;
}

export function deleteRecurringService(id: string): boolean {
  const idx = recurringServices.findIndex(s => s.id === id);
  if (idx === -1) return false;
  recurringServices.splice(idx, 1);
  return true;
}

// ---- PROJECTS ----

export function addProject(params: Omit<Project, 'id'>): Project {
  const project: Project = {
    ...params,
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
  projects.push(project);
  return project;
}

export function getProjects(): Project[] {
  return [...projects].reverse();
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const proj = projects.find(p => p.id === id);
  if (!proj) return null;
  Object.assign(proj, updates);
  return proj;
}

export function deleteProject(id: string): boolean {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  return true;
}
