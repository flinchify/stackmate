import { NextRequest, NextResponse } from 'next/server';
import { getAudits, updateAudit } from '@/lib/audits-store';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ audits: getAudits() });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const audit = updateAudit(id, updates);
  if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, audit });
}
