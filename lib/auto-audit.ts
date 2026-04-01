import { sql, ensureTables } from './db';

export interface AutoAudit {
  id: string; clientName?: string; url: string; lastRun?: string;
  frequency: string; geoScore?: number; seoScore?: number;
  performanceScore?: number; status: string; alerts: { date: string; message: string }[];
  createdAt: string;
}

export async function addAutoAudit(params: { clientName?: string; url: string; frequency?: string }): Promise<AutoAudit> {
  await ensureTables();
  const id = `aa_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO auto_audits (id, client_name, url, frequency, status) VALUES (${id}, ${params.clientName || null}, ${params.url}, ${params.frequency || 'daily'}, 'active')`;
  return { id, clientName: params.clientName, url: params.url, frequency: params.frequency || 'daily', status: 'active', alerts: [], createdAt: new Date().toISOString() };
}

export async function getAutoAudits(): Promise<AutoAudit[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM auto_audits ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, clientName: r.client_name, url: r.url, lastRun: r.last_run, frequency: r.frequency, geoScore: r.geo_score, seoScore: r.seo_score, performanceScore: r.performance_score, status: r.status, alerts: r.alerts || [], createdAt: r.created_at }));
}

export async function updateAutoAudit(id: string, updates: Partial<AutoAudit>): Promise<boolean> {
  await ensureTables();
  if (updates.geoScore !== undefined) await sql`UPDATE auto_audits SET geo_score = ${updates.geoScore}, last_run = NOW() WHERE id = ${id}`;
  if (updates.seoScore !== undefined) await sql`UPDATE auto_audits SET seo_score = ${updates.seoScore}, last_run = NOW() WHERE id = ${id}`;
  if (updates.performanceScore !== undefined) await sql`UPDATE auto_audits SET performance_score = ${updates.performanceScore}, last_run = NOW() WHERE id = ${id}`;
  if (updates.status) await sql`UPDATE auto_audits SET status = ${updates.status} WHERE id = ${id}`;
  return true;
}

export async function deleteAutoAudit(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM auto_audits WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
