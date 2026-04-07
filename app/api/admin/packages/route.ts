import { NextRequest, NextResponse } from 'next/server';
import { getAllPackages, updatePackage } from '@/lib/packages-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const packages = await getAllPackages();
  return NextResponse.json({ packages });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, ...updates } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing package id' }, { status: 400 });
  }
  const updated = await updatePackage(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, package: updated });
}
