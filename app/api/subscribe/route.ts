import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/mailing-list';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success } = rateLimit(`sub_${ip}`);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { email, name, source } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  await addSubscriber(email, name, source);
  return NextResponse.json({ success: true });
}
