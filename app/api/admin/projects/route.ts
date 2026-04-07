import { NextRequest, NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ projects: await getProjects() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.clientName || !body.title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const project = await addProject(body);
  return NextResponse.json({ success: true, project });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...updates } = await req.json();
  // Allow clientWebsite, seoScores, geoScores updates
  const project = await updateProject(id, updates);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, project });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const removed = await deleteProject(id);
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
