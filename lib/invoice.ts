import { sql, ensureTables } from './db';

export interface InvoiceItem { description: string; quantity: number; unitPrice: number; total: number; }
export interface Invoice {
  id: string; quoteId: string; clientName: string; clientEmail: string; clientAddress?: string;
  items: InvoiceItem[]; subtotal: number; gst: number; total: number;
  status: string; issuedAt: string; dueAt: string; paidAt?: string; notes?: string;
}
export interface RecurringService {
  id: string; clientName: string; clientEmail: string; service: string; description: string;
  monthlyAmount: number; startDate: string; nextBillingDate: string; status: string; notes?: string;
}
export interface Project {
  id: string; clientName: string; clientEmail: string; title: string; description: string;
  status: string; priority: string; startDate?: string; dueDate?: string; completedDate?: string; notes?: string;
}

// ---- INVOICES ----
let invoiceCount = 0;

export async function generateInvoice(params: { quoteId: string; clientName: string; clientEmail: string; clientAddress?: string; items: InvoiceItem[]; notes?: string }): Promise<Invoice> {
  await ensureTables();
  const countRows = await sql`SELECT COUNT(*) as c FROM invoices`;
  invoiceCount = Number(countRows[0].c) + 1;
  const subtotal = params.items.reduce((s, i) => s + i.total, 0);
  const gst = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + gst;
  const now = new Date();
  const due = new Date(now); due.setDate(due.getDate() + 14);
  const id = `INV-${String(invoiceCount).padStart(4, '0')}`;

  await sql`INSERT INTO invoices (id, quote_id, client_name, client_email, client_address, items, subtotal, gst, total, status, issued_at, due_at, notes)
    VALUES (${id}, ${params.quoteId}, ${params.clientName}, ${params.clientEmail}, ${params.clientAddress || null}, ${JSON.stringify(params.items)}, ${subtotal}, ${gst}, ${total}, 'draft', ${now.toISOString()}, ${due.toISOString()}, ${params.notes || null})`;

  return { id, quoteId: params.quoteId, clientName: params.clientName, clientEmail: params.clientEmail, clientAddress: params.clientAddress, items: params.items, subtotal, gst, total, status: 'draft', issuedAt: now.toISOString(), dueAt: due.toISOString(), notes: params.notes };
}

export async function generateInvoiceFromQuote(quote: { id: string; companyName: string; email: string; services: string[]; otherService?: string; estimate: { setupMin: number; setupMax: number; monthlyMin: number; monthlyMax: number } }): Promise<Invoice> {
  const items: InvoiceItem[] = [];
  const serviceNames: Record<string, string> = { 'ai-agents': 'AI Agents & Chatbots', 'automation': 'Business Automation', 'custom-software': 'Custom Software', 'website': 'Website / Web App', 'integrations': 'System Integrations', 'branding': 'Branding & Design', 'data-analytics': 'Performance Analysis', 'consulting': 'AI Consulting', 'seo': 'SEO Optimisation', 'ai-search': 'AI Search (GEO)', 'media-buying': 'Media Buying', 'creative': 'Creatives & Content', 'google-ads': 'Google Ads', 'social-ads': 'Social Ads', 'content-strategy': 'Content Strategy', 'display-ads': 'Display Advertising', 'other': quote.otherService || 'Custom Service' };
  const serviceList = quote.services.map(s => serviceNames[s] || s).join(', ');
  const setupPrice = Math.round((quote.estimate.setupMin + quote.estimate.setupMax) / 2 / 100) * 100;
  const monthlyPrice = Math.round((quote.estimate.monthlyMin + quote.estimate.monthlyMax) / 2 / 100) * 100;
  if (setupPrice > 0) items.push({ description: `Project Setup — ${serviceList}`, quantity: 1, unitPrice: setupPrice, total: setupPrice });
  if (monthlyPrice > 0) items.push({ description: `Monthly Management — ${serviceList} (first month)`, quantity: 1, unitPrice: monthlyPrice, total: monthlyPrice });
  return generateInvoice({ quoteId: quote.id, clientName: quote.companyName, clientEmail: quote.email, items, notes: `Services: ${serviceList}. Payment due within 14 days.` });
}

export async function getInvoices(): Promise<Invoice[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM invoices ORDER BY issued_at DESC`;
  return rows.map(r => ({ id: r.id, quoteId: r.quote_id, clientName: r.client_name, clientEmail: r.client_email, clientAddress: r.client_address, items: r.items, subtotal: Number(r.subtotal), gst: Number(r.gst), total: Number(r.total), status: r.status, issuedAt: r.issued_at, dueAt: r.due_at, paidAt: r.paid_at, notes: r.notes }));
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice | null> {
  await ensureTables();
  const paidAt = status === 'paid' ? new Date().toISOString() : null;
  const rows = await sql`UPDATE invoices SET status = ${status}, paid_at = COALESCE(${paidAt}, paid_at) WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, quoteId: r.quote_id, clientName: r.client_name, clientEmail: r.client_email, items: r.items, subtotal: Number(r.subtotal), gst: Number(r.gst), total: Number(r.total), status: r.status, issuedAt: r.issued_at, dueAt: r.due_at, paidAt: r.paid_at, notes: r.notes };
}

// ---- RECURRING ----
export async function addRecurringService(params: Omit<RecurringService, 'id'>): Promise<RecurringService> {
  await ensureTables();
  const id = `rs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO recurring_services (id, client_name, client_email, service, description, monthly_amount, start_date, next_billing_date, status, notes)
    VALUES (${id}, ${params.clientName}, ${params.clientEmail}, ${params.service}, ${params.description}, ${params.monthlyAmount}, ${params.startDate}, ${params.nextBillingDate}, ${params.status}, ${params.notes || null})`;
  return { ...params, id };
}

export async function getRecurringServices(): Promise<RecurringService[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM recurring_services ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, clientName: r.client_name, clientEmail: r.client_email, service: r.service, description: r.description, monthlyAmount: Number(r.monthly_amount), startDate: r.start_date, nextBillingDate: r.next_billing_date, status: r.status, notes: r.notes }));
}

export async function updateRecurringService(id: string, updates: Partial<RecurringService>): Promise<RecurringService | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE recurring_services SET status = ${updates.status} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM recurring_services WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, clientName: r.client_name, clientEmail: r.client_email, service: r.service, description: r.description, monthlyAmount: Number(r.monthly_amount), startDate: r.start_date, nextBillingDate: r.next_billing_date, status: r.status, notes: r.notes };
}

export async function deleteRecurringService(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM recurring_services WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ---- PROJECTS ----
export async function addProject(params: Omit<Project, 'id'>): Promise<Project> {
  await ensureTables();
  const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO projects (id, client_name, client_email, title, description, status, priority, due_date, notes)
    VALUES (${id}, ${params.clientName}, ${params.clientEmail}, ${params.title}, ${params.description}, ${params.status}, ${params.priority}, ${params.dueDate || null}, ${params.notes || null})`;
  return { ...params, id };
}

export async function getProjects(): Promise<Project[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, clientName: r.client_name, clientEmail: r.client_email, title: r.title, description: r.description, status: r.status, priority: r.priority, startDate: r.start_date, dueDate: r.due_date, completedDate: r.completed_date, notes: r.notes }));
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE projects SET status = ${updates.status} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, clientName: r.client_name, clientEmail: r.client_email, title: r.title, description: r.description, status: r.status, priority: r.priority, startDate: r.start_date, dueDate: r.due_date, completedDate: r.completed_date, notes: r.notes };
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
