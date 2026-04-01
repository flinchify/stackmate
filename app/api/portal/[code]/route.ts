import { NextRequest, NextResponse } from 'next/server';
import { getPortalByCode } from '@/lib/deliverables-store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const portal = await getPortalByCode(code);
  if (!portal) return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
  return NextResponse.json({ portal });
}
