import { NextRequest, NextResponse } from 'next/server';
import { getClients, addClient, removeClient } from '@/lib/clients-store';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET() {
  return NextResponse.json({ clients: await getClients() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, url, logoUrl, heroUrl } = await req.json();
  if (!name || !url || !logoUrl || !heroUrl) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const client = await addClient({ name, url, logoUrl, heroUrl });
  return NextResponse.json({ success: true, client });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const removed = await removeClient(id);
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
