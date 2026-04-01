export interface Deliverable {
  id: string;
  projectId: string;
  type: 'website' | 'repo' | 'credentials' | 'design' | 'document' | 'api' | 'agent' | 'other';
  title: string;
  description?: string;
  url?: string; // live URL, repo link, file link
  credentials?: { label: string; value: string }[];
  createdAt: string;
}

export interface ClientPortal {
  id: string;
  accessCode: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  projectDescription: string;
  status: 'in-progress' | 'review' | 'delivered' | 'completed';
  deliverables: Deliverable[];
  updates: { date: string; message: string }[];
  handoverChecklist: { item: string; done: boolean }[];
  supportEmail: string;
  createdAt: string;
}

const portals: ClientPortal[] = [];

export function createPortal(params: Omit<ClientPortal, 'id' | 'accessCode' | 'createdAt' | 'deliverables' | 'updates'>): ClientPortal {
  const portal: ClientPortal = {
    ...params,
    id: `portal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    accessCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
    deliverables: [],
    updates: [{ date: new Date().toISOString(), message: 'Project created. Work is underway.' }],
    createdAt: new Date().toISOString(),
  };
  portals.push(portal);
  return portal;
}

export function getPortals(): ClientPortal[] {
  return [...portals].reverse();
}

export function getPortalByCode(code: string): ClientPortal | null {
  return portals.find(p => p.accessCode === code) || null;
}

export function updatePortal(id: string, updates: Partial<ClientPortal>): ClientPortal | null {
  const portal = portals.find(p => p.id === id);
  if (!portal) return null;
  Object.assign(portal, updates);
  return portal;
}

export function addDeliverable(portalId: string, deliverable: Omit<Deliverable, 'id' | 'createdAt'>): Deliverable | null {
  const portal = portals.find(p => p.id === portalId);
  if (!portal) return null;
  const d: Deliverable = {
    ...deliverable,
    id: `del_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  portal.deliverables.push(d);
  return d;
}

export function addUpdate(portalId: string, message: string): boolean {
  const portal = portals.find(p => p.id === portalId);
  if (!portal) return false;
  portal.updates.push({ date: new Date().toISOString(), message });
  return true;
}

export function toggleHandoverItem(portalId: string, index: number): boolean {
  const portal = portals.find(p => p.id === portalId);
  if (!portal || !portal.handoverChecklist[index]) return false;
  portal.handoverChecklist[index].done = !portal.handoverChecklist[index].done;
  return true;
}
