import { sql } from './db';
import { ensureTables } from './db';

export interface AddonRow {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string | null;
  upfrontPrice: number;
  monthlyPrice: number;
  perUnit: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
}

function toAddon(r: Record<string, unknown>): AddonRow {
  return {
    id: r.id as string,
    category: r.category as string,
    name: r.name as string,
    slug: r.slug as string,
    description: (r.description as string) || null,
    upfrontPrice: Number(r.upfront_price),
    monthlyPrice: Number(r.monthly_price),
    perUnit: r.per_unit as boolean,
    visible: r.visible as boolean,
    sortOrder: Number(r.sort_order),
    createdAt: r.created_at as string,
  };
}

export async function getAllAddons(): Promise<AddonRow[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM addons ORDER BY category, sort_order`;
  return rows.map(toAddon);
}

export async function getVisibleAddons(): Promise<AddonRow[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM addons WHERE visible = true ORDER BY category, sort_order`;
  return rows.map(toAddon);
}

export async function updateAddon(id: string, updates: Partial<{
  upfrontPrice: number;
  monthlyPrice: number;
  visible: boolean;
  sortOrder: number;
  name: string;
  description: string;
}>): Promise<AddonRow | null> {
  await ensureTables();

  if (updates.upfrontPrice !== undefined) await sql`UPDATE addons SET upfront_price = ${updates.upfrontPrice} WHERE id = ${id}`;
  if (updates.monthlyPrice !== undefined) await sql`UPDATE addons SET monthly_price = ${updates.monthlyPrice} WHERE id = ${id}`;
  if (updates.visible !== undefined) await sql`UPDATE addons SET visible = ${updates.visible} WHERE id = ${id}`;
  if (updates.sortOrder !== undefined) await sql`UPDATE addons SET sort_order = ${updates.sortOrder} WHERE id = ${id}`;
  if (updates.name !== undefined) await sql`UPDATE addons SET name = ${updates.name} WHERE id = ${id}`;
  if (updates.description !== undefined) await sql`UPDATE addons SET description = ${updates.description} WHERE id = ${id}`;

  const rows = await sql`SELECT * FROM addons WHERE id = ${id}`;
  return rows.length > 0 ? toAddon(rows[0]) : null;
}

export async function seedAddons(addons: {
  id: string;
  category: string;
  name: string;
  slug: string;
  description?: string;
  upfrontPrice: number;
  monthlyPrice: number;
  perUnit?: boolean;
  sortOrder: number;
}[]): Promise<number> {
  await ensureTables();
  let count = 0;
  for (const a of addons) {
    await sql`INSERT INTO addons (id, category, name, slug, description, upfront_price, monthly_price, per_unit, visible, sort_order)
      VALUES (${a.id}, ${a.category}, ${a.name}, ${a.slug}, ${a.description || ''}, ${a.upfrontPrice}, ${a.monthlyPrice}, ${a.perUnit || false}, false, ${a.sortOrder})
      ON CONFLICT (id) DO NOTHING`;
    count++;
  }
  return count;
}

export async function getAddonCount(): Promise<number> {
  await ensureTables();
  const rows = await sql`SELECT COUNT(*) as count FROM addons`;
  return Number(rows[0].count);
}

// Pricing config helpers
export interface PricingConfigRow {
  key: string;
  value: Record<string, unknown>;
  updatedAt: string;
}

export async function getPricingConfig(): Promise<PricingConfigRow[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM pricing_config ORDER BY key`;
  return rows.map(r => ({
    key: r.key as string,
    value: r.value as Record<string, unknown>,
    updatedAt: r.updated_at as string,
  }));
}

export async function upsertPricingConfig(key: string, value: Record<string, unknown>): Promise<void> {
  await ensureTables();
  await sql`INSERT INTO pricing_config (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)}::jsonb, updated_at = NOW()`;
}
