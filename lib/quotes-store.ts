import { sql, ensureTables } from './db';
import { type QuoteParams, estimatePrice } from './pricing';

export interface StoredQuote extends QuoteParams {
  id: string;
  estimate: ReturnType<typeof estimatePrice>;
  createdAt: string;
  status: string;
}

export async function addQuote(params: QuoteParams): Promise<StoredQuote> {
  await ensureTables();
  const estimate = estimatePrice(params);
  const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await sql`INSERT INTO quotes (id, company_name, industry, employees, services, other_service, description, email, phone, location, website, links, socials, urgency, status, estimate)
    VALUES (${id}, ${params.companyName}, ${params.industry}, ${params.employees}, ${JSON.stringify(params.services)}, ${params.otherService || null}, ${params.description}, ${params.email}, ${params.phone || null}, ${params.location || null}, ${params.website || null}, ${JSON.stringify(params.links || [])}, ${JSON.stringify(params.socials || {})}, ${params.urgency}, 'new', ${JSON.stringify(estimate)})`;
  return { ...params, id, estimate, createdAt: new Date().toISOString(), status: 'new' };
}

export async function getQuotes(): Promise<StoredQuote[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
  return rows.map(r => ({
    id: r.id, companyName: r.company_name, industry: r.industry, employees: r.employees,
    services: r.services, otherService: r.other_service, description: r.description,
    email: r.email, phone: r.phone, location: r.location, website: r.website,
    links: r.links, socials: r.socials, urgency: r.urgency, status: r.status,
    estimate: r.estimate, createdAt: r.created_at,
  }));
}

export async function updateQuoteStatus(id: string, status: string): Promise<StoredQuote | null> {
  await ensureTables();
  const rows = await sql`UPDATE quotes SET status = ${status} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id, companyName: r.company_name, industry: r.industry, employees: r.employees,
    services: r.services, otherService: r.other_service, description: r.description,
    email: r.email, phone: r.phone, location: r.location, website: r.website,
    links: r.links, socials: r.socials, urgency: r.urgency, status: r.status,
    estimate: r.estimate, createdAt: r.created_at,
  };
}
