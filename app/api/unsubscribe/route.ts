import { NextRequest, NextResponse } from 'next/server';
import { unsubscribe } from '@/lib/mailing-list';

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  await unsubscribe(email);
  return new NextResponse('<html><body style="font-family:system-ui;text-align:center;padding:60px;"><h2>Unsubscribed</h2><p>You have been removed from our mailing list.</p></body></html>', { headers: { 'Content-Type': 'text/html' } });
}
