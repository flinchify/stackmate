import { NextRequest, NextResponse } from 'next/server';
import { getDashboardByCode } from '@/lib/dashboards-store';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const dashboard = await getDashboardByCode(code);
  if (!dashboard) return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
  return NextResponse.json({ dashboard });
}
