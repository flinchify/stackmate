import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { type QuoteParams } from '@/lib/pricing';
import { addQuote } from '@/lib/quotes-store';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success, remaining } = rateLimit(`api_${ip}`);
  if (!success) return NextResponse.json({ error: 'Rate limit exceeded.', retryAfter: 900 }, { status: 429 });

  try {
    const body = await req.json();
    if (!body.companyName || !body.industry || !body.employees || !body.email || !body.description) return NextResponse.json({ error: 'Missing required fields', required: ['companyName', 'industry', 'employees', 'services', 'description', 'email'] }, { status: 400 });
    if (!body.services || !Array.isArray(body.services) || body.services.length === 0) return NextResponse.json({ error: 'services must be a non-empty array' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    const params: QuoteParams = {
      companyName: String(body.companyName).slice(0, 200), industry: String(body.industry), employees: String(body.employees),
      services: body.services.map((s: unknown) => String(s).slice(0, 50)).slice(0, 10),
      description: String(body.description).slice(0, 2000), email: String(body.email).slice(0, 254),
      urgency: ['standard', 'fast', 'asap'].includes(body.urgency) ? body.urgency : 'standard',
    };

    const quote = await addQuote(params);
    return NextResponse.json({ success: true, message: "Quote received.", quoteId: quote.id }, { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining), 'Access-Control-Allow-Origin': '*' } });
  } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function GET() {
  return NextResponse.json({ name: 'Stackmate Quote API', version: '1.0', endpoint: 'POST /api/v1/quote', docs: 'https://stackmate.digital/api/v1/quote' });
}
