import { NextRequest, NextResponse } from 'next/server';
import { getPricingConfig, upsertPricingConfig } from '@/lib/addons-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const config = await getPricingConfig();
  return NextResponse.json({ config });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { key, value } = await req.json();
  if (!key || !value) {
    return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
  }
  await upsertPricingConfig(key, value);
  return NextResponse.json({ success: true });
}
