import { sql, ensureTables } from './db';

export interface Client {
  id: string; name: string; url: string; logoUrl: string; heroUrl: string;
  description?: string; createdAt: string;
}

export async function addClient(data: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
  await ensureTables();
  const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await sql`INSERT INTO showcase_clients (id, name, url, logo_url, hero_url, description)
    VALUES (${id}, ${data.name}, ${data.url}, ${data.logoUrl}, ${data.heroUrl}, ${data.description || null})`;
  return { ...data, id, createdAt: new Date().toISOString() };
}

export async function getClients(): Promise<Client[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM showcase_clients ORDER BY created_at ASC`;
  if (rows.length === 0) {
    // Seed defaults
    await sql`INSERT INTO showcase_clients (id, name, url, logo_url, hero_url, description) VALUES
      ('c_umove', 'U-Move Australia', 'https://umove.lol', '/umove-logo.png', '/umove-hero.png', 'Full website rebuild for Perth shipping container company. SEO-optimised, mobile-first.'),
      ('c_hireacreator', 'HireACreator', 'https://hireacreator.ai', '/hireacreator-logo.png', '/hireacreator-logo.png', 'AI-powered creator marketplace with dynamic comment-to-service automation for social media.')
      ON CONFLICT (id) DO NOTHING`;
    const seeded = await sql`SELECT * FROM showcase_clients ORDER BY created_at ASC`;
    return seeded.map(r => ({ id: r.id, name: r.name, url: r.url, logoUrl: r.logo_url, heroUrl: r.hero_url, description: r.description, createdAt: r.created_at }));
  }
  return rows.map(r => ({ id: r.id, name: r.name, url: r.url, logoUrl: r.logo_url, heroUrl: r.hero_url, description: r.description, createdAt: r.created_at }));
}

export async function removeClient(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM showcase_clients WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
