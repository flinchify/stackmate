import { NextRequest, NextResponse } from 'next/server';
import { getDashboards, createDashboard, updateDashboard, deleteDashboard } from '@/lib/dashboards-store';

function checkAuth(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const dashboards = await getDashboards();
  return NextResponse.json({ dashboards });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const dashboard = await createDashboard(body);
  return NextResponse.json({ dashboard });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const ok = await updateDashboard(id, data);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const ok = await deleteDashboard(body.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
