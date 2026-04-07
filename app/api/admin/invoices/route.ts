import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, updateInvoiceStatus, generateInvoice, updateInvoice } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ invoices: await getInvoices() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const invoice = await generateInvoice(body);
  return NextResponse.json({ success: true, invoice });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, status, items, notes, dueAt, clientAddress, clientName, clientEmail } = body;
  // If only status update, use the simple status updater
  if (status && !items && notes === undefined && !dueAt && clientAddress === undefined && !clientName && !clientEmail) {
    const invoice = await updateInvoiceStatus(id, status);
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, invoice });
  }
  // Full update
  const updates: Record<string, any> = {};
  if (items) updates.items = items;
  if (notes !== undefined) updates.notes = notes;
  if (dueAt) updates.dueAt = dueAt;
  if (clientAddress !== undefined) updates.clientAddress = clientAddress;
  if (clientName) updates.clientName = clientName;
  if (clientEmail) updates.clientEmail = clientEmail;
  const invoice = await updateInvoice(id, updates);
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Also update status if provided alongside other fields
  if (status) {
    const updated = await updateInvoiceStatus(id, status);
    return NextResponse.json({ success: true, invoice: updated });
  }
  return NextResponse.json({ success: true, invoice });
}
