import { sql, ensureTables } from './db';

export interface InvoiceItem { description: string; quantity: number; unitPrice: number; total: number; }
export interface Invoice {
  id: string; quoteId: string; clientName: string; clientEmail: string; clientAddress?: string;
  items: InvoiceItem[]; subtotal: number; gst: number; total: number;
  status: string; issuedAt: string; dueAt: string; paidAt?: string; notes?: string; linkedProjectId?: string;
}
export interface RecurringService {
  id: string; clientName: string; clientEmail: string; service: string; description: string;
  monthlyAmount: number; startDate: string; nextBillingDate: string; status: string; notes?: string; linkedProjectId?: string;
}
export interface Project {
  id: string; clientName: string; clientEmail: string; title: string; description: string;
  status: string; priority: string; startDate?: string; dueDate?: string; completedDate?: string; notes?: string;
  depositAmount: number; mrrAmount: number; costAmount: number; linkedInvoiceId?: string;
  clientWebsite?: string; seoScores: { date: string; score: number }[]; geoScores: { date: string; platform: string; score: number }[];
}

// ---- INVOICES ----
let invoiceCount = 0;

export async function generateInvoice(params: { quoteId: string; clientName: string; clientEmail: string; clientAddress?: string; items: InvoiceItem[]; notes?: string; linkedProjectId?: string }): Promise<Invoice> {
  await ensureTables();
  const countRows = await sql`SELECT COUNT(*) as c FROM invoices`;
  invoiceCount = Number(countRows[0].c) + 1;
  const subtotal = params.items.reduce((s, i) => s + i.total, 0);
  const gst = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + gst;
  const now = new Date();
  const due = new Date(now); due.setDate(due.getDate() + 14);
  const id = `INV-${String(invoiceCount).padStart(4, '0')}`;

  await sql`INSERT INTO invoices (id, quote_id, client_name, client_email, client_address, items, subtotal, gst, total, status, issued_at, due_at, notes, linked_project_id)
    VALUES (${id}, ${params.quoteId}, ${params.clientName}, ${params.clientEmail}, ${params.clientAddress || null}, ${JSON.stringify(params.items)}, ${subtotal}, ${gst}, ${total}, 'draft', ${now.toISOString()}, ${due.toISOString()}, ${params.notes || null}, ${params.linkedProjectId || null})`;

  return { id, quoteId: params.quoteId, clientName: params.clientName, clientEmail: params.clientEmail, clientAddress: params.clientAddress, items: params.items, subtotal, gst, total, status: 'draft', issuedAt: now.toISOString(), dueAt: due.toISOString(), notes: params.notes, linkedProjectId: params.linkedProjectId };
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

function mapInvoiceRow(r: Record<string, any>): Invoice {
  return { id: r.id, quoteId: r.quote_id, clientName: r.client_name, clientEmail: r.client_email, clientAddress: r.client_address, items: r.items, subtotal: Number(r.subtotal), gst: Number(r.gst), total: Number(r.total), status: r.status, issuedAt: r.issued_at, dueAt: r.due_at, paidAt: r.paid_at, notes: r.notes, linkedProjectId: r.linked_project_id };
}

export async function getInvoices(): Promise<Invoice[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM invoices ORDER BY issued_at DESC`;
  return rows.map(mapInvoiceRow);
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  await ensureTables();
  const rows = await sql`SELECT * FROM invoices WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return mapInvoiceRow(rows[0]);
}

export async function updateInvoice(id: string, updates: Partial<{ items: InvoiceItem[]; notes: string; dueAt: string; clientAddress: string; clientName: string; clientEmail: string }>): Promise<Invoice | null> {
  await ensureTables();
  if (updates.items) {
    const subtotal = updates.items.reduce((s, i) => s + i.total, 0);
    const gst = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + gst;
    await sql`UPDATE invoices SET items = ${JSON.stringify(updates.items)}, subtotal = ${subtotal}, gst = ${gst}, total = ${total} WHERE id = ${id}`;
  }
  if (updates.notes !== undefined) await sql`UPDATE invoices SET notes = ${updates.notes} WHERE id = ${id}`;
  if (updates.dueAt) await sql`UPDATE invoices SET due_at = ${updates.dueAt} WHERE id = ${id}`;
  if (updates.clientAddress !== undefined) await sql`UPDATE invoices SET client_address = ${updates.clientAddress} WHERE id = ${id}`;
  if (updates.clientName) await sql`UPDATE invoices SET client_name = ${updates.clientName} WHERE id = ${id}`;
  if (updates.clientEmail) await sql`UPDATE invoices SET client_email = ${updates.clientEmail} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM invoices WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return mapInvoiceRow(rows[0]);
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice | null> {
  await ensureTables();
  const paidAt = status === 'paid' ? new Date().toISOString() : null;
  const rows = await sql`UPDATE invoices SET status = ${status}, paid_at = COALESCE(${paidAt}, paid_at) WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return mapInvoiceRow(rows[0]);
}

// ---- RECURRING ----
export async function addRecurringService(params: Omit<RecurringService, 'id'>): Promise<RecurringService> {
  await ensureTables();
  const id = `rs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO recurring_services (id, client_name, client_email, service, description, monthly_amount, start_date, next_billing_date, status, notes, linked_project_id)
    VALUES (${id}, ${params.clientName}, ${params.clientEmail}, ${params.service}, ${params.description}, ${params.monthlyAmount}, ${params.startDate}, ${params.nextBillingDate}, ${params.status}, ${params.notes || null}, ${params.linkedProjectId || null})`;
  return { ...params, id };
}

function mapRecurringRow(r: Record<string, any>): RecurringService {
  return { id: r.id, clientName: r.client_name, clientEmail: r.client_email, service: r.service, description: r.description, monthlyAmount: Number(r.monthly_amount), startDate: r.start_date, nextBillingDate: r.next_billing_date, status: r.status, notes: r.notes, linkedProjectId: r.linked_project_id };
}

export async function getRecurringServices(): Promise<RecurringService[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM recurring_services ORDER BY created_at DESC`;
  return rows.map(mapRecurringRow);
}

export async function getRecurringByProjectId(projectId: string): Promise<RecurringService[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM recurring_services WHERE linked_project_id = ${projectId} ORDER BY created_at DESC`;
  return rows.map(mapRecurringRow);
}

export async function updateRecurringService(id: string, updates: Partial<RecurringService>): Promise<RecurringService | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE recurring_services SET status = ${updates.status} WHERE id = ${id}`;
  if (updates.linkedProjectId !== undefined) await sql`UPDATE recurring_services SET linked_project_id = ${updates.linkedProjectId} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM recurring_services WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return mapRecurringRow(rows[0]);
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
  await sql`INSERT INTO projects (id, client_name, client_email, title, description, status, priority, due_date, notes, deposit_amount, mrr_amount, cost_amount, client_website, seo_scores, geo_scores)
    VALUES (${id}, ${params.clientName}, ${params.clientEmail}, ${params.title}, ${params.description}, ${params.status}, ${params.priority}, ${params.dueDate || null}, ${params.notes || null}, ${params.depositAmount || 0}, ${params.mrrAmount || 0}, ${params.costAmount || 0}, ${params.clientWebsite || null}, ${JSON.stringify(params.seoScores || [])}, ${JSON.stringify(params.geoScores || [])})`;
  return { ...params, id };
}

function mapProjectRow(r: Record<string, any>): Project {
  return { id: r.id, clientName: r.client_name, clientEmail: r.client_email, title: r.title, description: r.description, status: r.status, priority: r.priority, startDate: r.start_date, dueDate: r.due_date, completedDate: r.completed_date, notes: r.notes, depositAmount: Number(r.deposit_amount) || 0, mrrAmount: Number(r.mrr_amount) || 0, costAmount: Number(r.cost_amount) || 0, linkedInvoiceId: r.linked_invoice_id, clientWebsite: r.client_website, seoScores: r.seo_scores || [], geoScores: r.geo_scores || [] };
}

export async function getProjects(): Promise<Project[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return rows.map(mapProjectRow);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE projects SET status = ${updates.status} WHERE id = ${id}`;
  if (updates.depositAmount !== undefined) await sql`UPDATE projects SET deposit_amount = ${updates.depositAmount} WHERE id = ${id}`;
  if (updates.mrrAmount !== undefined) await sql`UPDATE projects SET mrr_amount = ${updates.mrrAmount} WHERE id = ${id}`;
  if (updates.costAmount !== undefined) await sql`UPDATE projects SET cost_amount = ${updates.costAmount} WHERE id = ${id}`;
  if (updates.linkedInvoiceId !== undefined) await sql`UPDATE projects SET linked_invoice_id = ${updates.linkedInvoiceId} WHERE id = ${id}`;
  if (updates.clientWebsite !== undefined) await sql`UPDATE projects SET client_website = ${updates.clientWebsite} WHERE id = ${id}`;
  if (updates.seoScores !== undefined) await sql`UPDATE projects SET seo_scores = ${JSON.stringify(updates.seoScores)} WHERE id = ${id}`;
  if (updates.geoScores !== undefined) await sql`UPDATE projects SET geo_scores = ${JSON.stringify(updates.geoScores)} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return mapProjectRow(rows[0]);
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ---- AUTO RECURRING INVOICING ----
export async function advanceBillingDate(id: string): Promise<void> {
  await ensureTables();
  await sql`UPDATE recurring_services SET next_billing_date = (
    TO_DATE(next_billing_date, 'YYYY-MM-DD') + INTERVAL '1 month'
  )::TEXT WHERE id = ${id}`;
}

export async function generateRecurringInvoices(): Promise<Invoice[]> {
  await ensureTables();
  const today = new Date().toISOString().split('T')[0];
  const dueRows = await sql`SELECT * FROM recurring_services WHERE status = 'active' AND next_billing_date <= ${today}`;
  if (dueRows.length === 0) return [];

  // Group by clientName + clientEmail
  const groups: Record<string, { services: RecurringService[]; linkedProjectId?: string }> = {};
  for (const r of dueRows) {
    const svc = mapRecurringRow(r);
    const key = `${svc.clientName}|||${svc.clientEmail}`;
    if (!groups[key]) groups[key] = { services: [], linkedProjectId: svc.linkedProjectId || undefined };
    groups[key].services.push(svc);
    if (svc.linkedProjectId && !groups[key].linkedProjectId) groups[key].linkedProjectId = svc.linkedProjectId;
  }

  const generated: Invoice[] = [];
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  for (const [key, group] of Object.entries(groups)) {
    const [clientName, clientEmail] = key.split('|||');
    const items: InvoiceItem[] = group.services.map(svc => ({
      description: `${svc.service} — ${monthName}`,
      quantity: 1,
      unitPrice: svc.monthlyAmount,
      total: svc.monthlyAmount,
    }));

    const invoice = await generateInvoice({
      quoteId: '',
      clientName,
      clientEmail,
      items,
      notes: `Auto-generated recurring invoice for ${monthName}`,
      linkedProjectId: group.linkedProjectId,
    });
    generated.push(invoice);

    // Advance billing dates
    for (const svc of group.services) {
      await advanceBillingDate(svc.id);
    }
  }

  return generated;
}

export async function getDueRecurringCount(): Promise<number> {
  await ensureTables();
  const today = new Date().toISOString().split('T')[0];
  const rows = await sql`SELECT COUNT(*) as c FROM recurring_services WHERE status = 'active' AND next_billing_date <= ${today}`;
  return Number(rows[0].c);
}
