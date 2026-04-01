import { NextRequest, NextResponse } from 'next/server';
import { getClients, addClient, removeClient } from '@/lib/clients-store';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET() {
  return NextResponse.json({ clients: getClients() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, url, logoUrl, heroUrl } = body;

    if (!name || !url || !logoUrl || !heroUrl) {
      return NextResponse.json({ error: 'Missing required fields: name, url, logoUrl, heroUrl' }, { status: 400 });
    }

    const client = addClient({
      name: String(name).slice(0, 200),
      url: String(url).slice(0, 500),
      logoUrl: String(logoUrl).slice(0, 1000),
      heroUrl: String(heroUrl).slice(0, 1000),
    });

    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  const removed = removeClient(id);

  if (!removed) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
