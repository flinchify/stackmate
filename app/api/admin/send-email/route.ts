import { NextRequest, NextResponse } from 'next/server';
import { sendClientEmail } from '@/lib/notify';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { to, subject, template, data } = await req.json();
  if (!to || !subject || !template) {
    return NextResponse.json({ error: 'Missing required fields: to, subject, template' }, { status: 400 });
  }

  try {
    const result = await sendClientEmail({ to, subject, template, data: data || {} });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Send email error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
