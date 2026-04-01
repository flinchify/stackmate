export interface Audit {
  id: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  website?: string;
  industry: string;
  employees: string;
  description: string;
  status: 'new' | 'in-progress' | 'completed' | 'sent';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

const audits: Audit[] = [];

export function addAudit(params: Omit<Audit, 'id' | 'createdAt' | 'status'>): Audit {
  const audit: Audit = {
    ...params,
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  audits.push(audit);
  return audit;
}

export function getAudits(): Audit[] {
  return [...audits].reverse();
}

export function updateAudit(id: string, updates: Partial<Audit>): Audit | null {
  const audit = audits.find(a => a.id === id);
  if (!audit) return null;
  Object.assign(audit, updates);
  if (updates.status === 'completed') audit.completedAt = new Date().toISOString();
  return audit;
}
