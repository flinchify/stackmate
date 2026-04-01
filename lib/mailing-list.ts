import { sql, ensureTables } from './db';

export interface Subscriber {
  id: string; email: string; name?: string; source: string;
  subscribed: boolean; createdAt: string;
}

export async function addSubscriber(email: string, name?: string, source?: string): Promise<Subscriber | null> {
  await ensureTables();
  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  try {
    await sql`INSERT INTO mailing_list (id, email, name, source) VALUES (${id}, ${email.toLowerCase().trim()}, ${name || null}, ${source || 'website'}) ON CONFLICT (email) DO NOTHING`;
    return { id, email: email.toLowerCase().trim(), name, source: source || 'website', subscribed: true, createdAt: new Date().toISOString() };
  } catch { return null; }
}

export async function getSubscribers(): Promise<Subscriber[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM mailing_list ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, email: r.email, name: r.name, source: r.source, subscribed: r.subscribed, createdAt: r.created_at }));
}

export async function unsubscribe(email: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`UPDATE mailing_list SET subscribed = false WHERE email = ${email.toLowerCase().trim()} RETURNING id`;
  return rows.length > 0;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM mailing_list WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
