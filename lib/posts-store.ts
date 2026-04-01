import { sql, ensureTables } from './db';

export interface Post {
  id: string; type: 'blog' | 'case-study'; title: string; slug: string;
  description: string; content: string; imageUrl?: string; category?: string;
  tags: string[]; links: { label: string; url: string }[]; status: 'draft' | 'published';
  createdAt: string; updatedAt: string;
}

export async function createPost(params: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  await ensureTables();
  const id = `post_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  await sql`INSERT INTO admin_posts (id, type, title, slug, description, content, image_url, category, tags, links, status, created_at, updated_at)
    VALUES (${id}, ${params.type}, ${params.title}, ${params.slug}, ${params.description}, ${params.content}, ${params.imageUrl || null}, ${params.category || null}, ${JSON.stringify(params.tags)}, ${JSON.stringify(params.links)}, ${params.status}, ${now}, ${now})`;
  return { ...params, id, createdAt: now, updatedAt: now };
}

export async function getPosts(type?: string): Promise<Post[]> {
  await ensureTables();
  const rows = type
    ? await sql`SELECT * FROM admin_posts WHERE type = ${type} ORDER BY created_at DESC`
    : await sql`SELECT * FROM admin_posts ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, type: r.type, title: r.title, slug: r.slug, description: r.description, content: r.content, imageUrl: r.image_url, category: r.category, tags: r.tags, links: r.links, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureTables();
  const rows = await sql`SELECT * FROM admin_posts WHERE slug = ${slug} AND status = 'published'`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, type: r.type, title: r.title, slug: r.slug, description: r.description, content: r.content, imageUrl: r.image_url, category: r.category, tags: r.tags, links: r.links, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at };
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  await ensureTables();
  const now = new Date().toISOString();
  if (updates.title) await sql`UPDATE admin_posts SET title = ${updates.title}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.content) await sql`UPDATE admin_posts SET content = ${updates.content}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.description) await sql`UPDATE admin_posts SET description = ${updates.description}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.status) await sql`UPDATE admin_posts SET status = ${updates.status}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.imageUrl !== undefined) await sql`UPDATE admin_posts SET image_url = ${updates.imageUrl || null}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.category) await sql`UPDATE admin_posts SET category = ${updates.category}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.tags) await sql`UPDATE admin_posts SET tags = ${JSON.stringify(updates.tags)}, updated_at = ${now} WHERE id = ${id}`;
  if (updates.links) await sql`UPDATE admin_posts SET links = ${JSON.stringify(updates.links)}, updated_at = ${now} WHERE id = ${id}`;
  const rows = await sql`SELECT * FROM admin_posts WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id, type: r.type, title: r.title, slug: r.slug, description: r.description, content: r.content, imageUrl: r.image_url, category: r.category, tags: r.tags, links: r.links, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at };
}

export async function deletePost(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM admin_posts WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
