import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { estimatePrice, type QuoteParams } from '@/lib/pricing';

// In-memory store for MVP — replace with DB later
const quotes: Array<QuoteParams & { id: string; estimate: ReturnType<typeof estimatePrice>; createdAt: string; status: string }> = [];

// Make quotes accessible for admin
export { quotes };

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success, remaining } = rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  try {
    const body = await req.json();

    // Validate required fields
    const required = ['companyName', 'industry', 'employees', 'services', 'description', 'email'];
    for (const field of required) {
      if (!body[field] || (Array.isArray(body[field]) && body[field].length === 0)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitize
    const params: QuoteParams = {
      companyName: String(body.companyName).slice(0, 200),
      industry: String(body.industry).slice(0, 100),
      employees: String(body.employees).slice(0, 10),
      services: Array.isArray(body.services) ? body.services.map((s: unknown) => String(s).slice(0, 50)).slice(0, 10) : [],
      description: String(body.description).slice(0, 2000),
      email: String(body.email).slice(0, 254),
      phone: body.phone ? String(body.phone).slice(0, 20) : undefined,
      urgency: ['standard', 'fast', 'asap'].includes(body.urgency) ? body.urgency : 'standard',
    };

    const estimate = estimatePrice(params);
    const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    quotes.push({
      ...params,
      id,
      estimate,
      createdAt: new Date().toISOString(),
      status: 'new',
    });

    return NextResponse.json(
      { success: true, message: 'Quote request received. We\'ll be in touch within 24 hours.' },
      { status: 200, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
