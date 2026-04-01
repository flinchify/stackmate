import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { type QuoteParams } from '@/lib/pricing';
import { addQuote } from '@/lib/quotes-store';

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

    // Email is required
    if (!body.companyName || !body.industry || !body.employees || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!body.services || !Array.isArray(body.services) || body.services.length === 0) {
      return NextResponse.json({ error: 'Select at least one service' }, { status: 400 });
    }
    if (!body.description || String(body.description).length < 10) {
      return NextResponse.json({ error: 'Description too short' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const params: QuoteParams = {
      companyName: String(body.companyName).slice(0, 200),
      industry: String(body.industry).slice(0, 100),
      employees: String(body.employees).slice(0, 10),
      services: Array.isArray(body.services) ? body.services.map((s: unknown) => String(s).slice(0, 50)).slice(0, 10) : [],
      otherService: body.otherService ? String(body.otherService).slice(0, 500) : undefined,
      description: String(body.description).slice(0, 2000),
      email: String(body.email).slice(0, 254),
      phone: body.phone ? String(body.phone).slice(0, 20) : undefined,
      location: body.location ? String(body.location).slice(0, 200) : undefined,
      website: body.website ? String(body.website).slice(0, 500) : undefined,
      links: Array.isArray(body.links) ? body.links.filter((l: unknown) => typeof l === 'string' && l).map((l: unknown) => String(l).slice(0, 500)).slice(0, 5) : undefined,
      socials: body.socials ? {
        instagram: body.socials.instagram ? String(body.socials.instagram).slice(0, 100) : undefined,
        facebook: body.socials.facebook ? String(body.socials.facebook).slice(0, 200) : undefined,
        linkedin: body.socials.linkedin ? String(body.socials.linkedin).slice(0, 200) : undefined,
        twitter: body.socials.twitter ? String(body.socials.twitter).slice(0, 100) : undefined,
        tiktok: body.socials.tiktok ? String(body.socials.tiktok).slice(0, 100) : undefined,
      } : undefined,
      urgency: ['standard', 'fast', 'asap'].includes(body.urgency) ? body.urgency : 'standard',
    };

    addQuote(params);

    return NextResponse.json(
      { success: true, message: 'Quote request received. We\'ll be in touch within 24 hours.' },
      { status: 200, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
