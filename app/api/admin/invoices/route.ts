import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, updateInvoiceStatus, generateInvoice } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ invoices: getInvoices() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const invoice = generateInvoice(body);
  return NextResponse.json({ success: true, invoice });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await req.json();
  const invoice = updateInvoiceStatus(id, status);
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, invoice });
}
