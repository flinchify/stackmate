import { NextRequest, NextResponse } from 'next/server';
import { getClientQuotes, createClientQuote, updateClientQuote } from '@/lib/client-quotes';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ quotes: await getClientQuotes() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.clientName || !body.clientEmail || !body.title || !body.items?.length) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const quote = await createClientQuote({
      ...body,
      paymentTerms: body.paymentTerms || 'Payment due within 14 days of acceptance.',
      cancellationPolicy: body.cancellationPolicy || '30 days written notice. No refund on setup fees.',
    });
    return NextResponse.json({ success: true, quote, viewUrl: `/quote/${quote.accessCode}` });
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const quote = await updateClientQuote(id, updates);
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, quote });
}
