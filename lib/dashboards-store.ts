import { sql, ensureTables } from './db';

export interface Dashboard {
  id: string;
  accessCode: string;
  clientName: string;
  clientEmail?: string;
  clientLogo?: string;
  clientDomain?: string;
  brandColor: string;
  metrics: { label: string; value: number; prev?: number }[];
  seoScores: { date: string; score: number }[];
  geoScores: { platform: string; score: number }[];
  trafficData: { month: string; visits: number }[];
  rankings: { keyword: string; position: number; change: number }[];
  leads: { date: string; name: string; source?: string }[];
  notes?: string;
  createdAt: string;
}

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function rowToDashboard(r: Record<string, unknown>): Dashboard {
  return {
    id: r.id as string,
    accessCode: r.access_code as string,
    clientName: r.client_name as string,
    clientEmail: r.client_email as string | undefined,
    clientLogo: r.client_logo as string | undefined,
    clientDomain: r.client_domain as string | undefined,
    brandColor: (r.brand_color as string) || '#f97316',
    metrics: (typeof r.metrics === 'string' ? JSON.parse(r.metrics) : r.metrics) || [],
    seoScores: (typeof r.seo_scores === 'string' ? JSON.parse(r.seo_scores) : r.seo_scores) || [],
    geoScores: (typeof r.geo_scores === 'string' ? JSON.parse(r.geo_scores) : r.geo_scores) || [],
    trafficData: (typeof r.traffic_data === 'string' ? JSON.parse(r.traffic_data) : r.traffic_data) || [],
    rankings: (typeof r.rankings === 'string' ? JSON.parse(r.rankings) : r.rankings) || [],
    leads: (typeof r.leads === 'string' ? JSON.parse(r.leads) : r.leads) || [],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
  };
}

export async function getDashboards(): Promise<Dashboard[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM client_dashboards ORDER BY created_at DESC`;
  return rows.map(rowToDashboard);
}

export async function getDashboardByCode(code: string): Promise<Dashboard | null> {
  await ensureTables();
  const rows = await sql`SELECT * FROM client_dashboards WHERE access_code = ${code}`;
  return rows.length > 0 ? rowToDashboard(rows[0]) : null;
}

export async function createDashboard(data: { clientName: string; clientEmail?: string; clientLogo?: string; clientDomain?: string; brandColor?: string; notes?: string }): Promise<Dashboard> {
  await ensureTables();
  const id = crypto.randomUUID();
  const accessCode = generateAccessCode();
  await sql`INSERT INTO client_dashboards (id, access_code, client_name, client_email, client_logo, client_domain, brand_color, notes)
    VALUES (${id}, ${accessCode}, ${data.clientName}, ${data.clientEmail || null}, ${data.clientLogo || null}, ${data.clientDomain || null}, ${data.brandColor || '#f97316'}, ${data.notes || null})`;
  return { id, accessCode, clientName: data.clientName, clientEmail: data.clientEmail, clientLogo: data.clientLogo, clientDomain: data.clientDomain, brandColor: data.brandColor || '#f97316', metrics: [], seoScores: [], geoScores: [], trafficData: [], rankings: [], leads: [], notes: data.notes, createdAt: new Date().toISOString() };
}

export async function updateDashboard(id: string, data: Partial<Omit<Dashboard, 'id' | 'accessCode' | 'createdAt'>>): Promise<boolean> {
  await ensureTables();
  const rows = await sql`SELECT * FROM client_dashboards WHERE id = ${id}`;
  if (rows.length === 0) return false;
  const current = rowToDashboard(rows[0]);
  const merged = {
    clientName: data.clientName ?? current.clientName,
    clientEmail: data.clientEmail ?? current.clientEmail,
    clientLogo: data.clientLogo ?? current.clientLogo,
    clientDomain: data.clientDomain ?? current.clientDomain,
    brandColor: data.brandColor ?? current.brandColor,
    metrics: data.metrics ?? current.metrics,
    seoScores: data.seoScores ?? current.seoScores,
    geoScores: data.geoScores ?? current.geoScores,
    trafficData: data.trafficData ?? current.trafficData,
    rankings: data.rankings ?? current.rankings,
    leads: data.leads ?? current.leads,
    notes: data.notes ?? current.notes,
  };
  await sql`UPDATE client_dashboards SET
    client_name = ${merged.clientName},
    client_email = ${merged.clientEmail || null},
    client_logo = ${merged.clientLogo || null},
    client_domain = ${merged.clientDomain || null},
    brand_color = ${merged.brandColor},
    metrics = ${JSON.stringify(merged.metrics)},
    seo_scores = ${JSON.stringify(merged.seoScores)},
    geo_scores = ${JSON.stringify(merged.geoScores)},
    traffic_data = ${JSON.stringify(merged.trafficData)},
    rankings = ${JSON.stringify(merged.rankings)},
    leads = ${JSON.stringify(merged.leads)},
    notes = ${merged.notes || null}
    WHERE id = ${id}`;
  return true;
}

export async function deleteDashboard(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM client_dashboards WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
