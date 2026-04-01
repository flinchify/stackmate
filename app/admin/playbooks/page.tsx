'use client';

import { useState } from 'react';

const PLAYBOOKS = [
  {
    id: 'seo-monthly',
    title: 'Monthly SEO Checklist',
    category: 'SEO',
    tasks: [
      { task: 'Run Google Search Console — check indexing errors, crawl issues, manual actions', tool: 'https://search.google.com/search-console', time: '10 min' },
      { task: 'Check Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms) — fix any regressions', tool: 'https://pagespeed.web.dev/', time: '15 min' },
      { task: 'Review keyword rankings — track target keywords, note any drops', tool: 'https://search.google.com/search-console', time: '15 min' },
      { task: 'Update/refresh top 5 blog posts with new data, stats, or sections', tool: null, time: '2 hrs' },
      { task: 'Publish 2-4 new keyword-targeted blog posts or landing pages', tool: null, time: '3-4 hrs' },
      { task: 'Check and fix any broken links (404s)', tool: 'https://www.brokenlinkcheck.com/', time: '10 min' },
      { task: 'Update sitemap.xml if new pages were added', tool: null, time: '5 min' },
      { task: 'Submit updated sitemap to Google Search Console', tool: 'https://search.google.com/search-console', time: '2 min' },
      { task: 'Review and respond to Google Business Profile reviews', tool: 'https://business.google.com/', time: '10 min' },
      { task: 'Build 3-5 backlinks — guest posts, directory listings, citations', tool: null, time: '2 hrs' },
      { task: 'Check competitor rankings — are they outranking us on any target keywords?', tool: 'https://www.google.com/', time: '20 min' },
      { task: 'Optimize meta titles and descriptions for underperforming pages', tool: 'https://search.google.com/search-console', time: '30 min' },
      { task: 'Add internal links from new content to existing pages and vice versa', tool: null, time: '20 min' },
      { task: 'Check mobile usability — test on real phone, not just dev tools', tool: null, time: '10 min' },
      { task: 'Screenshot rankings report and send to client', tool: null, time: '15 min' },
    ],
  },
  {
    id: 'geo-monthly',
    title: 'Monthly GEO (AI Search) Checklist',
    category: 'GEO',
    tasks: [
      { task: 'Run GEO audit on Geoptie — track score changes month over month', tool: 'https://geoptie.com/free-geo-audit', time: '10 min' },
      { task: 'Ask ChatGPT, Perplexity, Gemini: "[client industry] in [city]" — check if client appears', tool: 'https://chat.openai.com/', time: '15 min' },
      { task: 'Update llms.txt and llms-full.txt with any new pages, services, or info', tool: null, time: '10 min' },
      { task: 'Check structured data validity — run Schema Markup Validator', tool: 'https://validator.schema.org/', time: '10 min' },
      { task: 'Add/update FAQ schema with questions real customers ask', tool: null, time: '30 min' },
      { task: 'Write 1-2 "answer-first" articles — content that directly answers questions AI engines surface', tool: null, time: '2 hrs' },
      { task: 'Check ai-plugin.json is serving correctly', tool: null, time: '5 min' },
      { task: 'Review robots.txt — make sure all AI bots (GPTBot, ClaudeBot, PerplexityBot) are allowed', tool: null, time: '5 min' },
      { task: 'Add LocalBusiness schema to any new location-specific pages', tool: null, time: '15 min' },
      { task: 'Build citations on platforms AI engines reference: LinkedIn, Reddit, industry directories', tool: null, time: '1 hr' },
      { task: 'Update Google Business Profile with new photos, posts, or offers', tool: 'https://business.google.com/', time: '15 min' },
      { task: 'Check content freshness — add dates, update stats, remove outdated claims', tool: null, time: '30 min' },
      { task: 'Add author bios/Person schema to content pages', tool: null, time: '20 min' },
      { task: 'Track which AI engines cite the client — screenshot and log', tool: null, time: '15 min' },
      { task: 'Send monthly GEO report to client: score, AI mentions, recommendations', tool: null, time: '30 min' },
    ],
  },
  {
    id: 'client-onboarding',
    title: 'New Client Onboarding',
    category: 'Operations',
    tasks: [
      { task: 'Create project in admin panel', tool: '/admin', time: '5 min' },
      { task: 'Send client quote via portal — get acceptance', tool: '/admin', time: '10 min' },
      { task: 'Collect: domain credentials, hosting access, Google Analytics, Search Console access', tool: null, time: '15 min' },
      { task: 'Get access to client\'s Google Business Profile', tool: null, time: '5 min' },
      { task: 'Audit current website — PageSpeed, SEO, GEO, security headers', tool: 'https://pagespeed.web.dev/', time: '30 min' },
      { task: 'Set up recurring service in admin panel', tool: '/admin', time: '5 min' },
      { task: 'Create client in portfolio/clients section', tool: '/admin', time: '10 min' },
      { task: 'Send welcome email with: what to expect, timeline, how to reach you', tool: null, time: '15 min' },
      { task: 'Set calendar reminder for first monthly check-in', tool: null, time: '2 min' },
    ],
  },
  {
    id: 'seo-quick-wins',
    title: 'SEO Quick Wins (First Week)',
    category: 'SEO',
    tasks: [
      { task: 'Fix any crawl errors in Google Search Console', tool: 'https://search.google.com/search-console', time: '20 min' },
      { task: 'Add/fix meta titles and descriptions on all key pages', tool: null, time: '30 min' },
      { task: 'Add structured data: Organization, LocalBusiness, FAQ', tool: null, time: '1 hr' },
      { task: 'Create and submit sitemap.xml', tool: null, time: '15 min' },
      { task: 'Set up Google Business Profile if not exists', tool: 'https://business.google.com/', time: '30 min' },
      { task: 'Add canonical URLs to all pages', tool: null, time: '15 min' },
      { task: 'Compress images — target < 200KB per image', tool: 'https://squoosh.app/', time: '30 min' },
      { task: 'Add alt text to all images', tool: null, time: '20 min' },
      { task: 'Ensure HTTPS everywhere — no mixed content', tool: null, time: '10 min' },
      { task: 'Add security headers (HSTS, X-Frame-Options, CSP)', tool: 'https://securityheaders.com/', time: '15 min' },
    ],
  },
  {
    id: 'geo-quick-wins',
    title: 'GEO Quick Wins (First Week)',
    category: 'GEO',
    tasks: [
      { task: 'Create llms.txt with company info, services, pages', tool: null, time: '20 min' },
      { task: 'Create llms-full.txt with detailed context', tool: null, time: '30 min' },
      { task: 'Add robots.txt rules allowing all AI bots', tool: null, time: '10 min' },
      { task: 'Add FAQPage schema to homepage and key pages', tool: null, time: '30 min' },
      { task: 'Add LocalBusiness schema with geo coordinates', tool: null, time: '15 min' },
      { task: 'Write 3-5 "answer-first" landing pages targeting "[service] in [city]"', tool: null, time: '3 hrs' },
      { task: 'Create .well-known/ai-plugin.json manifest', tool: null, time: '10 min' },
      { task: 'Verify site appears in Perplexity and ChatGPT searches', tool: 'https://perplexity.ai/', time: '15 min' },
      { task: 'Add author metadata and Person schema', tool: null, time: '15 min' },
      { task: 'Ensure all content is direct and answer-first — no fluff before the point', tool: null, time: '1 hr' },
    ],
  },
  {
    id: 'monthly-report',
    title: 'Monthly Client Report Template',
    category: 'Reporting',
    tasks: [
      { task: 'Google Analytics: sessions, users, bounce rate, top pages (vs last month)', tool: 'https://analytics.google.com/', time: '15 min' },
      { task: 'Search Console: impressions, clicks, avg position, top queries', tool: 'https://search.google.com/search-console', time: '15 min' },
      { task: 'GEO audit score (Geoptie) — show improvement', tool: 'https://geoptie.com/free-geo-audit', time: '10 min' },
      { task: 'Keyword ranking changes — wins and losses', tool: null, time: '15 min' },
      { task: 'AI search mentions — screenshots of ChatGPT/Perplexity citing client', tool: null, time: '15 min' },
      { task: 'Backlinks acquired this month', tool: null, time: '10 min' },
      { task: 'Content published this month', tool: null, time: '5 min' },
      { task: 'Issues fixed this month', tool: null, time: '5 min' },
      { task: 'Recommendations for next month', tool: null, time: '15 min' },
      { task: 'Send report to client via email', tool: null, time: '5 min' },
    ],
  },
];

export default function PlaybooksPage() {
  const [activeBook, setActiveBook] = useState(PLAYBOOKS[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setCompleted(prev => ({ ...prev, [key]: !prev[key] }));

  const active = PLAYBOOKS.find(p => p.id === activeBook)!;
  const completedCount = active.tasks.filter((_, i) => completed[`${activeBook}-${i}`]).length;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <a href="/admin" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; Back to Admin</a>
          <h1 className="text-2xl font-display font-bold mt-4">Playbooks & Checklists</h1>
          <p className="text-sm text-sm-muted">Step-by-step guides for SEO, GEO, onboarding, and reporting.</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0 space-y-2">
            {PLAYBOOKS.map(pb => (
              <button key={pb.id} onClick={() => setActiveBook(pb.id)}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all ${activeBook === pb.id ? 'bg-orange-500/10 border border-orange-500/20 text-white' : 'border border-sm-border text-sm-light hover:border-white/20'}`}
              >
                <span className="text-xs text-sm-muted">{pb.category}</span>
                <p className="font-semibold">{pb.title}</p>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">{active.title}</h2>
                <p className="text-sm text-sm-muted">{completedCount}/{active.tasks.length} completed</p>
              </div>
              <div className="w-32 h-2 bg-sm-border rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${(completedCount / active.tasks.length) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              {active.tasks.map((task, i) => {
                const key = `${activeBook}-${i}`;
                const done = completed[key];
                return (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-sm border transition-all ${done ? 'border-orange-500/20 bg-orange-500/5' : 'border-sm-border bg-sm-card/30'}`}>
                    <button onClick={() => toggle(key)}
                      className={`mt-0.5 w-5 h-5 rounded-sm border-2 shrink-0 transition-all flex items-center justify-center ${done ? 'bg-orange-500 border-orange-500' : 'border-sm-muted'}`}
                    >
                      {done && <span className="text-white text-xs">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm ${done ? 'text-sm-muted line-through' : 'text-sm-light'}`}>{task.task}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-sm-muted">{task.time}</span>
                        {task.tool && <a href={task.tool} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:underline">Open tool →</a>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
