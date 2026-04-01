import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { type QuoteParams } from '@/lib/pricing';
import { addQuote } from '@/lib/quotes-store';

/**
 * Public API for AI agents to submit quotes programmatically.
 * POST /api/v1/quote
 * 
 * Headers:
 *   Content-Type: application/json
 * 
 * Body:
 * {
 *   "companyName": "Acme Corp",
 *   "industry": "mining|oil-gas|construction|finance|healthcare|retail|hospitality|agency|other",
 *   "employees": "1-5|6-20|21-50|51-200|200+",
 *   "services": ["ai-agents","automation","custom-software","website","integrations","branding","data-analytics","consulting","seo","creative","google-ads","social-ads","other"],
 *   "otherService": "optional description if services includes 'other'",
 *   "description": "What the client needs (min 10 chars)",
 *   "email": "client@example.com",
 *   "phone": "optional",
 *   "location": "optional city/state",
 *   "website": "optional URL",
 *   "links": ["optional reference URLs"],
 *   "urgency": "standard|fast|asap"
 * }
 * 
 * Response:
 * { "success": true, "message": "Quote request received.", "quoteId": "q_..." }
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success, remaining } = rateLimit(`api_${ip}`);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 10 requests per 15 minutes.', retryAfter: 900 },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.companyName || !body.industry || !body.employees || !body.email || !body.description) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['companyName', 'industry', 'employees', 'services', 'description', 'email'],
      }, { status: 400 });
    }

    if (!body.services || !Array.isArray(body.services) || body.services.length === 0) {
      return NextResponse.json({ error: 'services must be a non-empty array' }, { status: 400 });
    }

    if (String(body.description).length < 10) {
      return NextResponse.json({ error: 'description must be at least 10 characters' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const validIndustries = ['mining', 'oil-gas', 'construction', 'finance', 'healthcare', 'retail', 'hospitality', 'agency', 'other'];
    if (!validIndustries.includes(body.industry)) {
      return NextResponse.json({ error: `Invalid industry. Must be one of: ${validIndustries.join(', ')}` }, { status: 400 });
    }

    const validSizes = ['1-5', '6-20', '21-50', '51-200', '200+'];
    if (!validSizes.includes(body.employees)) {
      return NextResponse.json({ error: `Invalid employees. Must be one of: ${validSizes.join(', ')}` }, { status: 400 });
    }

    const params: QuoteParams = {
      companyName: String(body.companyName).slice(0, 200),
      industry: String(body.industry).slice(0, 100),
      employees: String(body.employees).slice(0, 10),
      services: body.services.map((s: unknown) => String(s).slice(0, 50)).slice(0, 10),
      otherService: body.otherService ? String(body.otherService).slice(0, 500) : undefined,
      description: String(body.description).slice(0, 2000),
      email: String(body.email).slice(0, 254),
      phone: body.phone ? String(body.phone).slice(0, 20) : undefined,
      location: body.location ? String(body.location).slice(0, 200) : undefined,
      website: body.website ? String(body.website).slice(0, 500) : undefined,
      links: Array.isArray(body.links) ? body.links.filter((l: unknown) => typeof l === 'string' && l).map((l: unknown) => String(l).slice(0, 500)).slice(0, 5) : undefined,
      urgency: ['standard', 'fast', 'asap'].includes(body.urgency) ? body.urgency : 'standard',
    };

    const quote = addQuote(params);

    return NextResponse.json({
      success: true,
      message: 'Quote request received. We\'ll review and respond within 24 hours.',
      quoteId: quote.id,
    }, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String(remaining),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    name: 'Stackmate Quote API',
    version: '1.0',
    description: 'Submit quote requests to Stackmate programmatically. For AI agents and integrations.',
    endpoint: 'POST /api/v1/quote',
    docs: 'https://stackmate.digital/api/v1/quote',
    requiredFields: ['companyName', 'industry', 'employees', 'services', 'description', 'email'],
    optionalFields: ['otherService', 'phone', 'location', 'website', 'links', 'urgency'],
    industries: ['mining', 'oil-gas', 'construction', 'finance', 'healthcare', 'retail', 'hospitality', 'agency', 'other'],
    employeeSizes: ['1-5', '6-20', '21-50', '51-200', '200+'],
    services: ['ai-agents', 'automation', 'custom-software', 'website', 'integrations', 'branding', 'data-analytics', 'consulting', 'seo', 'ai-search', 'media-buying', 'creative', 'google-ads', 'social-ads', 'content-strategy', 'display-ads', 'other'],
    urgencyLevels: ['standard', 'fast', 'asap'],
    rateLimit: '10 requests per 15 minutes per IP',
  });
}
