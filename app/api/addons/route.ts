import { NextResponse } from 'next/server';
import { getVisibleAddons } from '@/lib/addons-store';
import { getPricingConfig } from '@/lib/addons-store';

export async function GET() {
  const addons = await getVisibleAddons();
  const config = await getPricingConfig();
  const configMap: Record<string, Record<string, unknown>> = {};
  for (const c of config) {
    configMap[c.key] = c.value;
  }
  return NextResponse.json({ addons, config: configMap });
}
