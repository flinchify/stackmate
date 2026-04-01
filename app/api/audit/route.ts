import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { addAudit } from '@/lib/audits-store';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success } = rateLimit(`audit_${ip}`);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const body = await req.json();
    if (!body.companyName || !body.email || !body.description) {
      return NextResponse.json({ error: 'Missing required fields: companyName, email, description' }, { status: 400 });
    }

    const audit = addAudit({
      companyName: String(body.companyName).slice(0, 200),
      contactName: body.contactName ? String(body.contactName).slice(0, 100) : undefined,
      email: String(body.email).slice(0, 254),
      phone: body.phone ? String(body.phone).slice(0, 20) : undefined,
      website: body.website ? String(body.website).slice(0, 500) : undefined,
      industry: String(body.industry || 'other').slice(0, 100),
      employees: String(body.employees || '1-5').slice(0, 10),
      description: String(body.description).slice(0, 2000),
    });

    return NextResponse.json({ success: true, message: 'Audit request received. We\'ll respond within 48 hours.', auditId: audit.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
