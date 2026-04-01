import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost, updatePost, deletePost } from '@/lib/posts-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || undefined;
  return NextResponse.json({ posts: await getPosts(type) });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.title || !body.type) return NextResponse.json({ error: 'Missing title or type' }, { status: 400 });
  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const post = await createPost({ ...body, slug, tags: body.tags || [], links: body.links || [], status: body.status || 'draft' });
  return NextResponse.json({ success: true, post });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  const post = await updatePost(id, updates);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, post });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
