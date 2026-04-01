import { NextRequest, NextResponse } from 'next/server';
import { getClientQuotes, createClientQuote, updateClientQuote } from '@/lib/client-quotes';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ quotes: getClientQuotes() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.clientName || !body.clientEmail || !body.title || !body.items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const quote = createClientQuote({
      ...body,
      paymentTerms: body.paymentTerms || 'Payment due within 14 days of acceptance. Setup fees due before work begins.',
      cancellationPolicy: body.cancellationPolicy || 'Monthly subscriptions can be cancelled with 30 days written notice. No refund on setup fees. Ongoing work stops at end of billing period.',
    });
    return NextResponse.json({ success: true, quote, viewUrl: `/quote/${quote.accessCode}` });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const quote = updateClientQuote(id, updates);
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, quote });
}
