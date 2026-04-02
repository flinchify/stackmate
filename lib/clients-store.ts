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
  
  // Upsert seed clients with hero screenshots
  await sql`INSERT INTO showcase_clients (id, name, url, logo_url, hero_url, description) VALUES
    ('c_umove', 'U-Move Australia', 'https://umove.lol', '/umove-logo.png', '/client-umove-hero.jpg', 'Full website rebuild for Perth shipping container company. SEO-optimised, mobile-first.'),
    ('c_hireacreator', 'HireACreator', 'https://hireacreator.ai', '/hireacreator-logo.png', '/client-hireacreator-hero.jpg', 'AI-powered creator marketplace with dynamic comment-to-service automation for social media.'),
    ('c_whipspec', 'WhipSpec', 'https://www.whipspec.com', '/whipspec-logo.png', '/client-whipspec-hero.jpg', 'Automotive builds platform. Quote builder and calendar for 4WD workshops.')
    ON CONFLICT (id) DO UPDATE SET hero_url = EXCLUDED.hero_url, description = EXCLUDED.description`;

  const rows = await sql`SELECT * FROM showcase_clients ORDER BY created_at ASC`;
  return rows.map(r => ({ id: r.id, name: r.name, url: r.url, logoUrl: r.logo_url, heroUrl: r.hero_url, description: r.description, createdAt: r.created_at }));
}

export async function removeClient(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM showcase_clients WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
