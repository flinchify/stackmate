import { NextRequest, NextResponse } from 'next/server';
import { getVisiblePackages } from '@/lib/packages-store';

export async function GET(req: NextRequest) {
  const industry = req.nextUrl.searchParams.get('industry') || undefined;
  const packages = await getVisiblePackages(industry);
  return NextResponse.json({ packages });
}
