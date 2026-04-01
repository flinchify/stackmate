import { sql, ensureTables } from './db';

export interface ClientQuote {
  id: string; accessCode: string; clientName: string; clientEmail: string; title: string;
  description: string; items: { description: string; amount: number }[]; subtotal: number;
  gst: number; total: number; validUntil: string; status: string; paymentType: string;
  monthlyAmount?: number; setupFee?: number; paymentTerms: string; cancellationPolicy: string;
  createdAt: string; acceptedAt?: string; notes?: string;
}

export async function createClientQuote(params: Omit<ClientQuote, 'id' | 'accessCode' | 'createdAt' | 'subtotal' | 'gst' | 'total'>): Promise<ClientQuote> {
  await ensureTables();
  const subtotal = params.items.reduce((s, i) => s + i.amount, 0);
  const gst = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + gst;
  const accessCode = Math.random().toString(36).slice(2, 10).toUpperCase();
  const id = `cq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  await sql`INSERT INTO client_quotes (id, access_code, client_name, client_email, title, description, items, subtotal, gst, total, valid_until, status, payment_type, monthly_amount, setup_fee, payment_terms, cancellation_policy, notes)
    VALUES (${id}, ${accessCode}, ${params.clientName}, ${params.clientEmail}, ${params.title}, ${params.description}, ${JSON.stringify(params.items)}, ${subtotal}, ${gst}, ${total}, ${params.validUntil}, ${params.status}, ${params.paymentType}, ${params.monthlyAmount || null}, ${params.setupFee || null}, ${params.paymentTerms}, ${params.cancellationPolicy}, ${params.notes || null})`;

  return { ...params, id, accessCode, subtotal, gst, total, createdAt: new Date().toISOString() };
}

export async function getClientQuotes(): Promise<ClientQuote[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM client_quotes ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, accessCode: r.access_code, clientName: r.client_name, clientEmail: r.client_email, title: r.title, description: r.description, items: r.items, subtotal: Number(r.subtotal), gst: Number(r.gst), total: Number(r.total), validUntil: r.valid_until, status: r.status, paymentType: r.payment_type, monthlyAmount: r.monthly_amount ? Number(r.monthly_amount) : undefined, setupFee: r.setup_fee ? Number(r.setup_fee) : undefined, paymentTerms: r.payment_terms, cancellationPolicy: r.cancellation_policy, createdAt: r.created_at, acceptedAt: r.accepted_at, notes: r.notes }));
}

export async function getClientQuoteByCode(code: string): Promise<ClientQuote | null> {
  await ensureTables();
  const rows = await sql`SELECT * FROM client_quotes WHERE access_code = ${code}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, accessCode: r.access_code, clientName: r.client_name, clientEmail: r.client_email, title: r.title, description: r.description, items: r.items, subtotal: Number(r.subtotal), gst: Number(r.gst), total: Number(r.total), validUntil: r.valid_until, status: r.status, paymentType: r.payment_type, monthlyAmount: r.monthly_amount ? Number(r.monthly_amount) : undefined, setupFee: r.setup_fee ? Number(r.setup_fee) : undefined, paymentTerms: r.payment_terms, cancellationPolicy: r.cancellation_policy, createdAt: r.created_at, acceptedAt: r.accepted_at, notes: r.notes };
}

export async function updateClientQuote(id: string, updates: Partial<ClientQuote>): Promise<ClientQuote | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE client_quotes SET status = ${updates.status} WHERE id = ${id}`;
  return (await getClientQuotes()).find(q => q.id === id) || null;
}

export async function acceptClientQuote(code: string): Promise<ClientQuote | null> {
  await ensureTables();
  await sql`UPDATE client_quotes SET status = 'accepted', accepted_at = NOW() WHERE access_code = ${code}`;
  return getClientQuoteByCode(code);
}

export async function rejectClientQuote(code: string): Promise<ClientQuote | null> {
  await ensureTables();
  await sql`UPDATE client_quotes SET status = 'rejected' WHERE access_code = ${code}`;
  return getClientQuoteByCode(code);
}
