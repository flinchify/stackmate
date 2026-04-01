'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

interface Dashboard {
  id: string;
  accessCode: string;
  clientName: string;
  clientEmail?: string;
  clientLogo?: string;
  clientDomain?: string;
  brandColor: string;
  metrics: { label: string; value: number; prev?: number }[];
  seoScores: { date: string; score: number }[];
  geoScores: { platform: string; score: number }[];
  trafficData: { month: string; visits: number }[];
  rankings: { keyword: string; position: number; change: number }[];
  leads: { date: string; name: string; source?: string }[];
  notes?: string;
  createdAt: string;
}

function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);
  return <span ref={ref} style={{ color }}>{display.toLocaleString()}</span>;
}

function TrendArrow({ current, prev, color }: { current: number; prev?: number; color: string }) {
  if (prev === undefined) return null;
  const diff = current - prev;
  if (diff === 0) return <span className="text-sm-muted text-xs ml-1">—</span>;
  return (
    <span className={`text-xs ml-2 ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
      {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toLocaleString()}
    </span>
  );
}

function SVGLineChart({ data, color, height = 120 }: { data: { label: string; value: number }[]; color: string; height?: number }) {
  if (data.length < 2) return <div className="text-sm-muted text-sm py-8 text-center">Not enough data</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const w = 500;
  const pad = 30;
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (d.value - min) / range) * (height - pad * 2),
  }));
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${points[points.length - 1].x},${height - pad} L${points[0].x},${height - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0a0a0a" stroke={color} strokeWidth="2" />
          <text x={p.x} y={height - 8} textAnchor="middle" fill="#666" fontSize="10" fontFamily="Inter">{data[i].label}</text>
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#999" fontSize="9" fontFamily="Inter">{data[i].value}</text>
        </g>
      ))}
    </svg>
  );
}

function SVGBarChart({ data, color, height = 160 }: { data: { label: string; value: number }[]; color: string; height?: number }) {
  if (data.length === 0) return <div className="text-sm-muted text-sm py-8 text-center">No data</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 500;
  const pad = 30;
  const barW = Math.min(40, (w - pad * 2) / data.length - 8);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = pad + (i / data.length) * (w - pad * 2) + (w - pad * 2) / data.length / 2 - barW / 2;
        const barH = (d.value / max) * (height - pad * 2.5);
        const y = height - pad - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="url(#barGrad)" />
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" fill="#666" fontSize="10" fontFamily="Inter">{d.label}</text>
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#999" fontSize="9" fontFamily="Inter">{d.value.toLocaleString()}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GEOBar({ platform, score, color }: { platform: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-sm-light w-24 shrink-0">{platform}</span>
      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(score, 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
      <span className="text-sm font-semibold w-10 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export default function ClientDashboardPage() {
  const params = useParams();
  const code = params.code as string;
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard/${code}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setData(d.dashboard))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </main>
  );

  if (error || !data) return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-white mb-2">Dashboard Not Found</h1>
        <p className="text-[#666]">This link may have expired or is invalid.</p>
      </div>
    </main>
  );

  const bc = data.brandColor || '#f97316';
  const latestSEO = data.seoScores.length > 0 ? data.seoScores[data.seoScores.length - 1].score : null;
  const prevSEO = data.seoScores.length > 1 ? data.seoScores[data.seoScores.length - 2].score : undefined;
  const avgGEO = data.geoScores.length > 0 ? Math.round(data.geoScores.reduce((s, g) => s + g.score, 0) / data.geoScores.length) : null;
  const latestTraffic = data.trafficData.length > 0 ? data.trafficData[data.trafficData.length - 1].visits : null;
  const prevTraffic = data.trafficData.length > 1 ? data.trafficData[data.trafficData.length - 2].visits : undefined;

  const overviewCards = [
    ...(latestSEO !== null ? [{ label: 'SEO Score', value: latestSEO, prev: prevSEO }] : []),
    ...(avgGEO !== null ? [{ label: 'GEO Score', value: avgGEO }] : []),
    ...(latestTraffic !== null ? [{ label: 'Monthly Traffic', value: latestTraffic, prev: prevTraffic }] : []),
    { label: 'Total Leads', value: data.leads.length },
    ...data.metrics,
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#111]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data.clientLogo && (
              <img src={data.clientLogo} alt={data.clientName} className="h-8 w-auto object-contain" />
            )}
            <div>
              <h1 className="font-display font-bold text-lg">{data.clientName}</h1>
              {data.clientDomain && <p className="text-xs text-[#666]">{data.clientDomain}</p>}
            </div>
          </div>
          <span className="text-[10px] text-[#444] tracking-wider uppercase">Powered by Stackmate</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        {overviewCards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {overviewCards.map((card, i) => (
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] transition-colors">
                <p className="text-xs text-[#666] uppercase tracking-wider mb-2">{card.label}</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-display font-bold">
                    <AnimatedNumber value={card.value} color={bc} />
                  </span>
                  <TrendArrow current={card.value} prev={card.prev} color={bc} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO Score Chart */}
        {data.seoScores.length > 0 && (
          <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-4">SEO Score Trend</h2>
            <SVGLineChart
              data={data.seoScores.map(s => ({ label: s.date, value: s.score }))}
              color={bc}
            />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* GEO Score Breakdown */}
          {data.geoScores.length > 0 && (
            <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-5">GEO Score by Platform</h2>
              <div className="space-y-4">
                {data.geoScores.map((g, i) => (
                  <GEOBar key={i} platform={g.platform} score={g.score} color={bc} />
                ))}
              </div>
            </section>
          )}

          {/* Traffic Chart */}
          {data.trafficData.length > 0 && (
            <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-4">Monthly Traffic</h2>
              <SVGBarChart
                data={data.trafficData.slice(-6).map(t => ({ label: t.month, value: t.visits }))}
                color={bc}
              />
            </section>
          )}
        </div>

        {/* Rankings Table */}
        {data.rankings.length > 0 && (
          <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 overflow-x-auto">
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-4">Keyword Rankings</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#666] border-b border-[#1a1a1a]">
                  <th className="text-left py-2 font-medium">Keyword</th>
                  <th className="text-right py-2 font-medium">Position</th>
                  <th className="text-right py-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {data.rankings.map((r, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]/50 hover:bg-white/[0.02]">
                    <td className="py-3 text-white">{r.keyword}</td>
                    <td className="py-3 text-right font-mono" style={{ color: bc }}>#{r.position}</td>
                    <td className="py-3 text-right">
                      {r.change === 0 ? <span className="text-[#666]">—</span> :
                        r.change > 0 ? <span className="text-green-400">↑{r.change}</span> :
                        <span className="text-red-400">↓{Math.abs(r.change)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Recent Leads */}
        {data.leads.length > 0 && (
          <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-4">Recent Leads</h2>
            <div className="space-y-3">
              {data.leads.slice(-10).reverse().map((lead, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a]/50 last:border-0">
                  <div>
                    <span className="text-white text-sm">{lead.name}</span>
                    {lead.source && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#999]">{lead.source}</span>}
                  </div>
                  <span className="text-xs text-[#666]">{lead.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {data.notes && (
          <section className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-[#999] mb-3">Notes</h2>
            <p className="text-sm text-[#999] whitespace-pre-wrap">{data.notes}</p>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-6 border-t border-[#1a1a1a]">
          <p className="text-xs text-[#444]">
            Last updated {new Date(data.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            <a href="https://stackmate.digital" target="_blank" rel="noopener noreferrer" className="hover:text-[#999] transition-colors">stackmate.digital</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
