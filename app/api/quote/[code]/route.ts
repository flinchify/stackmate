import { NextRequest, NextResponse } from 'next/server';
import { getClientQuoteByCode, acceptClientQuote, rejectClientQuote } from '@/lib/client-quotes';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quote = await getClientQuoteByCode(code);
  if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  return NextResponse.json({ quote });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  if (body.action === 'accept') {
    const quote = await acceptClientQuote(code);
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, quote });
  }
  if (body.action === 'reject') {
    const quote = await rejectClientQuote(code);
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, quote });
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
