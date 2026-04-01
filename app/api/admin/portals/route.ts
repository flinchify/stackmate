import { NextRequest, NextResponse } from 'next/server';
import { getPortals, createPortal, updatePortal, addDeliverable, addUpdate, toggleHandoverItem } from '@/lib/deliverables-store';

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ portals: getPortals() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();

  if (body.action === 'create') {
    if (!body.clientName || !body.projectTitle) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const portal = createPortal({
      clientName: body.clientName,
      clientEmail: body.clientEmail || '',
      projectTitle: body.projectTitle,
      projectDescription: body.projectDescription || '',
      status: body.status || 'in-progress',
      handoverChecklist: body.handoverChecklist || [
        { item: 'Domain credentials shared', done: false },
        { item: 'Hosting/Vercel access transferred', done: false },
        { item: 'GitHub repo access granted', done: false },
        { item: 'Environment variables documented', done: false },
        { item: 'Admin login credentials provided', done: false },
        { item: 'Training/walkthrough completed', done: false },
        { item: 'Support contact confirmed', done: false },
      ],
      supportEmail: body.supportEmail || 'hello@stackmate.digital',
    });
    return NextResponse.json({ success: true, portal, viewUrl: `/portal/${portal.accessCode}` });
  }

  if (body.action === 'update') {
    const portal = updatePortal(body.id, body.updates);
    if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, portal });
  }

  if (body.action === 'add-deliverable') {
    const d = addDeliverable(body.portalId, body.deliverable);
    if (!d) return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    return NextResponse.json({ success: true, deliverable: d });
  }

  if (body.action === 'add-update') {
    const ok = addUpdate(body.portalId, body.message);
    if (!ok) return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'toggle-handover') {
    const ok = toggleHandoverItem(body.portalId, body.index);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
