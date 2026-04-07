import { NextRequest, NextResponse } from 'next/server';
import { updateProject } from '@/lib/invoice';

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-secret') === (process.env.ADMIN_SECRET || 'stackmate-admin-2026');
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url, projectId, existingSeoScores } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const targetUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: `PageSpeed API error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const lighthouse = data.lighthouseResult;
    const categories = lighthouse?.categories || {};
    const audits = lighthouse?.audits || {};

    const performanceScore = Math.round((categories.performance?.score || 0) * 100);
    const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
    const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
    const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const tbt = audits['total-blocking-time']?.displayValue || 'N/A';

    // Save to project if projectId provided
    if (projectId) {
      const scores = existingSeoScores || [];
      const updated = [...scores, { date: new Date().toISOString().split('T')[0], score: performanceScore }];
      await updateProject(projectId, { seoScores: updated });
    }

    return NextResponse.json({
      success: true,
      score: performanceScore,
      metrics: { fcp, lcp, cls, tbt },
      url: targetUrl,
    });
  } catch (err) {
    console.error('PageSpeed fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch PageSpeed data' }, { status: 500 });
  }
}
