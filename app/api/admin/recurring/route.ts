import { NextRequest, NextResponse } from 'next/server';
import { getRecurringServices, addRecurringService, updateRecurringService, deleteRecurringService, generateRecurringInvoices, getDueRecurringCount } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ services: await getRecurringServices() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();

  if (body.action === 'invoice-due') {
    const invoices = await generateRecurringInvoices();
    return NextResponse.json({ success: true, invoices, count: invoices.length });
  }

  if (body.action === 'due-count') {
    const count = await getDueRecurringCount();
    return NextResponse.json({ count });
  }

  if (!body.clientName || !body.service || !body.monthlyAmount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const service = await addRecurringService(body);
  return NextResponse.json({ success: true, service });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const service = await updateRecurringService(id, updates);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, service });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const removed = await deleteRecurringService(id);
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
