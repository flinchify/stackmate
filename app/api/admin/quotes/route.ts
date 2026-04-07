import { NextRequest, NextResponse } from 'next/server';
import { getQuotes, updateQuoteStatus, deleteQuote } from '@/lib/quotes-store';
import { generateInvoiceFromQuote } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const quotes = await getQuotes();
  return NextResponse.json({ total: quotes.length, quotes });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await req.json();
  const validStatuses = ['new', 'reviewing', 'quoted', 'accepted', 'paid', 'rejected'];
  if (!validStatuses.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  const quote = await updateQuoteStatus(id, status);
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  let invoice = null;
  if (status === 'paid') invoice = await generateInvoiceFromQuote(quote);
  return NextResponse.json({ success: true, quote, invoice });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing quote id' }, { status: 400 });
  const deleted = await deleteQuote(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
