import { NextRequest, NextResponse } from 'next/server';
import { getSubscribers, deleteSubscriber } from '@/lib/mailing-list';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ subscribers: await getSubscribers() });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteSubscriber(id);
  return NextResponse.json({ success: true });
}
