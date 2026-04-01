import { NextRequest, NextResponse } from 'next/server';
import { getRecurringServices, addRecurringService, updateRecurringService, deleteRecurringService } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ services: getRecurringServices() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.clientName || !body.clientEmail || !body.service || !body.monthlyAmount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const service = addRecurringService(body);
  return NextResponse.json({ success: true, service });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const service = updateRecurringService(id, updates);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, service });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const removed = deleteRecurringService(id);
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
