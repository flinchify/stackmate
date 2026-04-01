import { NextRequest, NextResponse } from 'next/server';
import { getAutoAudits, addAutoAudit, updateAutoAudit, deleteAutoAudit } from '@/lib/auto-audit';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ audits: await getAutoAudits() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  const audit = await addAutoAudit(body);
  return NextResponse.json({ success: true, audit });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  await updateAutoAudit(id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteAutoAudit(id);
  return NextResponse.json({ success: true });
}
