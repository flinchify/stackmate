import { NextRequest, NextResponse } from 'next/server';
import { getAllAddons, updateAddon } from '@/lib/addons-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const addons = await getAllAddons();
  return NextResponse.json({ addons });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, ...updates } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing addon id' }, { status: 400 });
  }
  const updated = await updateAddon(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Addon not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, addon: updated });
}
