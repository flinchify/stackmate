import { sql, ensureTables } from './db';

export interface Audit {
  id: string; companyName: string; contactName?: string; email: string; phone?: string;
  website?: string; industry: string; employees: string; description: string;
  status: string; createdAt: string; completedAt?: string; notes?: string;
}

export async function addAudit(params: Omit<Audit, 'id' | 'createdAt' | 'status'>): Promise<Audit> {
  await ensureTables();
  const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO audits (id, company_name, contact_name, email, phone, website, industry, employees, description, status)
    VALUES (${id}, ${params.companyName}, ${params.contactName || null}, ${params.email}, ${params.phone || null}, ${params.website || null}, ${params.industry}, ${params.employees}, ${params.description}, 'new')`;
  return { ...params, id, status: 'new', createdAt: new Date().toISOString() };
}

export async function getAudits(): Promise<Audit[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM audits ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, companyName: r.company_name, contactName: r.contact_name, email: r.email, phone: r.phone, website: r.website, industry: r.industry, employees: r.employees, description: r.description, status: r.status, notes: r.notes, createdAt: r.created_at, completedAt: r.completed_at }));
}

export async function updateAudit(id: string, updates: Partial<Audit>): Promise<Audit | null> {
  await ensureTables();
  const completedAt = updates.status === 'completed' ? new Date().toISOString() : null;
  const rows = await sql`UPDATE audits SET status = COALESCE(${updates.status || null}, status), notes = COALESCE(${updates.notes || null}, notes), completed_at = COALESCE(${completedAt}, completed_at) WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, companyName: r.company_name, contactName: r.contact_name, email: r.email, phone: r.phone, website: r.website, industry: r.industry, employees: r.employees, description: r.description, status: r.status, notes: r.notes, createdAt: r.created_at, completedAt: r.completed_at };
}
