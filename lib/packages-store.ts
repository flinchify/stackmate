import { sql } from './db';
import { ensureTables } from './db';

export interface PackageRow {
  id: string;
  industry: string;
  tier: string;
  tierLabel: string;
  upfrontPrice: number;
  monthlyPrice: number;
  features: string[];
  includesDescription: string | null;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function toPackage(r: Record<string, unknown>): PackageRow {
  return {
    id: r.id as string,
    industry: r.industry as string,
    tier: r.tier as string,
    tierLabel: r.tier_label as string,
    upfrontPrice: Number(r.upfront_price),
    monthlyPrice: Number(r.monthly_price),
    features: (r.features || []) as string[],
    includesDescription: (r.includes_description as string) || null,
    visible: r.visible as boolean,
    sortOrder: Number(r.sort_order),
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export async function getAllPackages(): Promise<PackageRow[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM packages ORDER BY industry, sort_order`;
  return rows.map(toPackage);
}

export async function getVisiblePackages(industry?: string): Promise<PackageRow[]> {
  await ensureTables();
  if (industry) {
    const rows = await sql`SELECT * FROM packages WHERE visible = true AND industry = ${industry} ORDER BY sort_order`;
    return rows.map(toPackage);
  }
  const rows = await sql`SELECT * FROM packages WHERE visible = true ORDER BY industry, sort_order`;
  return rows.map(toPackage);
}

export async function updatePackage(id: string, updates: Partial<{
  upfrontPrice: number;
  monthlyPrice: number;
  features: string[];
  includesDescription: string;
  visible: boolean;
  sortOrder: number;
  tierLabel: string;
}>): Promise<PackageRow | null> {
  await ensureTables();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.upfrontPrice !== undefined) { fields.push('upfront_price'); values.push(updates.upfrontPrice); }
  if (updates.monthlyPrice !== undefined) { fields.push('monthly_price'); values.push(updates.monthlyPrice); }
  if (updates.features !== undefined) { fields.push('features'); values.push(JSON.stringify(updates.features)); }
  if (updates.includesDescription !== undefined) { fields.push('includes_description'); values.push(updates.includesDescription); }
  if (updates.visible !== undefined) { fields.push('visible'); values.push(updates.visible); }
  if (updates.sortOrder !== undefined) { fields.push('sort_order'); values.push(updates.sortOrder); }
  if (updates.tierLabel !== undefined) { fields.push('tier_label'); values.push(updates.tierLabel); }

  if (fields.length === 0) return null;

  // Build update dynamically - use individual queries per field since neon sql doesn't support dynamic column names easily
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = values[i];
    if (field === 'upfront_price') await sql`UPDATE packages SET upfront_price = ${value as number}, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'monthly_price') await sql`UPDATE packages SET monthly_price = ${value as number}, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'features') await sql`UPDATE packages SET features = ${value as string}::jsonb, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'includes_description') await sql`UPDATE packages SET includes_description = ${value as string}, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'visible') await sql`UPDATE packages SET visible = ${value as boolean}, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'sort_order') await sql`UPDATE packages SET sort_order = ${value as number}, updated_at = NOW() WHERE id = ${id}`;
    else if (field === 'tier_label') await sql`UPDATE packages SET tier_label = ${value as string}, updated_at = NOW() WHERE id = ${id}`;
  }

  const rows = await sql`SELECT * FROM packages WHERE id = ${id}`;
  return rows.length > 0 ? toPackage(rows[0]) : null;
}

export async function seedPackages(packages: {
  id: string;
  industry: string;
  tier: string;
  tierLabel: string;
  upfrontPrice: number;
  monthlyPrice: number;
  features: string[];
  includesDescription: string;
  sortOrder: number;
}[]): Promise<number> {
  await ensureTables();
  let count = 0;
  for (const pkg of packages) {
    await sql`INSERT INTO packages (id, industry, tier, tier_label, upfront_price, monthly_price, features, includes_description, visible, sort_order)
      VALUES (${pkg.id}, ${pkg.industry}, ${pkg.tier}, ${pkg.tierLabel}, ${pkg.upfrontPrice}, ${pkg.monthlyPrice}, ${JSON.stringify(pkg.features)}::jsonb, ${pkg.includesDescription}, false, ${pkg.sortOrder})
      ON CONFLICT (id) DO NOTHING`;
    count++;
  }
  return count;
}

export async function getPackageCount(): Promise<number> {
  await ensureTables();
  const rows = await sql`SELECT COUNT(*) as count FROM packages`;
  return Number(rows[0].count);
}
