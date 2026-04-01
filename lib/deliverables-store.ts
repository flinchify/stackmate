import { sql, ensureTables } from './db';

export interface Deliverable {
  id: string; projectId: string; type: string; title: string;
  description?: string; url?: string; credentials?: { label: string; value: string }[];
  createdAt: string;
}

export interface ClientPortal {
  id: string; accessCode: string; clientName: string; clientEmail: string;
  projectTitle: string; projectDescription: string; status: string;
  deliverables: Deliverable[]; updates: { date: string; message: string }[];
  handoverChecklist: { item: string; done: boolean }[]; supportEmail: string; createdAt: string;
}

export async function createPortal(params: Omit<ClientPortal, 'id' | 'accessCode' | 'createdAt' | 'deliverables' | 'updates'>): Promise<ClientPortal> {
  await ensureTables();
  const id = `portal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const accessCode = Math.random().toString(36).slice(2, 10).toUpperCase();
  const updates = [{ date: new Date().toISOString(), message: 'Project created. Work is underway.' }];

  await sql`INSERT INTO portals (id, access_code, client_name, client_email, project_title, project_description, status, deliverables, updates, handover_checklist, support_email)
    VALUES (${id}, ${accessCode}, ${params.clientName}, ${params.clientEmail}, ${params.projectTitle}, ${params.projectDescription}, ${params.status}, '[]', ${JSON.stringify(updates)}, ${JSON.stringify(params.handoverChecklist)}, ${params.supportEmail})`;

  return { ...params, id, accessCode, deliverables: [], updates, createdAt: new Date().toISOString() };
}

export async function getPortals(): Promise<ClientPortal[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM portals ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, accessCode: r.access_code, clientName: r.client_name, clientEmail: r.client_email, projectTitle: r.project_title, projectDescription: r.project_description, status: r.status, deliverables: r.deliverables, updates: r.updates, handoverChecklist: r.handover_checklist, supportEmail: r.support_email, createdAt: r.created_at }));
}

export async function getPortalByCode(code: string): Promise<ClientPortal | null> {
  await ensureTables();
  const rows = await sql`SELECT * FROM portals WHERE access_code = ${code}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, accessCode: r.access_code, clientName: r.client_name, clientEmail: r.client_email, projectTitle: r.project_title, projectDescription: r.project_description, status: r.status, deliverables: r.deliverables, updates: r.updates, handoverChecklist: r.handover_checklist, supportEmail: r.support_email, createdAt: r.created_at };
}

export async function updatePortal(id: string, updates: Partial<ClientPortal>): Promise<ClientPortal | null> {
  await ensureTables();
  if (updates.status) await sql`UPDATE portals SET status = ${updates.status} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM portals WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, accessCode: r.access_code, clientName: r.client_name, clientEmail: r.client_email, projectTitle: r.project_title, projectDescription: r.project_description, status: r.status, deliverables: r.deliverables, updates: r.updates, handoverChecklist: r.handover_checklist, supportEmail: r.support_email, createdAt: r.created_at };
}

export async function addDeliverable(portalId: string, deliverable: Omit<Deliverable, 'id' | 'createdAt'>): Promise<Deliverable | null> {
  await ensureTables();
  const d: Deliverable = { ...deliverable, id: `del_${Date.now()}`, createdAt: new Date().toISOString() };
  await sql`UPDATE portals SET deliverables = deliverables || ${JSON.stringify([d])}::jsonb WHERE id = ${portalId}`;
  return d;
}

export async function addUpdate(portalId: string, message: string): Promise<boolean> {
  await ensureTables();
  const update = { date: new Date().toISOString(), message };
  const rows = await sql`UPDATE portals SET updates = updates || ${JSON.stringify([update])}::jsonb WHERE id = ${portalId} RETURNING id`;
  return rows.length > 0;
}

export async function toggleHandoverItem(portalId: string, index: number): Promise<boolean> {
  await ensureTables();
  const portal = await getPortalByCode(''); // need to get by id
  // Simpler: get, toggle, save
  const rows = await sql`SELECT handover_checklist FROM portals WHERE id = ${portalId}`;
  if (rows.length === 0) return false;
  const checklist = rows[0].handover_checklist;
  if (!checklist[index]) return false;
  checklist[index].done = !checklist[index].done;
  await sql`UPDATE portals SET handover_checklist = ${JSON.stringify(checklist)}::jsonb WHERE id = ${portalId}`;
  return true;
}
