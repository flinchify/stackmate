'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Circle, Globe, Code2, Key, Palette, FileText, Bot, Link2, Package, Clock, MessageSquare } from 'lucide-react';

const TYPE_ICONS: Record<string, typeof Globe> = {
  website: Globe, repo: Code2, credentials: Key, design: Palette,
  document: FileText, api: Link2, agent: Bot, other: Package,
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  'in-progress': { label: 'In Progress', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20' },
  'review': { label: 'In Review', color: 'text-blue-400 bg-blue-400/10 border-blue-500/20' },
  'delivered': { label: 'Delivered', color: 'text-orange-400 bg-orange-400/10 border-orange-500/20' },
  'completed': { label: 'Completed', color: 'text-green-400 bg-green-400/10 border-green-500/20' },
};

interface Portal {
  id: string; accessCode: string; clientName: string; clientEmail: string;
  projectTitle: string; projectDescription: string; status: string;
  deliverables: { id: string; type: string; title: string; description?: string; url?: string; credentials?: { label: string; value: string }[]; createdAt: string }[];
  updates: { date: string; message: string }[];
  handoverChecklist: { item: string; done: boolean }[];
  supportEmail: string; createdAt: string;
}

export default function ClientPortalPage() {
  const { code } = useParams<{ code: string }>();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreds, setShowCreds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/portal/${code}`)
      .then(r => r.json())
      .then(data => { if (data.portal) setPortal(data.portal); else setError('Portal not found.'); })
      .catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <main className="min-h-screen flex items-center justify-center"><p className="text-sm-muted">Loading...</p></main>;
  if (error || !portal) return <main className="min-h-screen flex items-center justify-center"><p className="text-sm-muted">{error || 'Not found.'}</p></main>;

  const statusInfo = STATUS_LABELS[portal.status] || STATUS_LABELS['in-progress'];
  const handoverDone = portal.handoverChecklist.filter(h => h.done).length;

  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Stackmate" width={32} height={32} className="invert" />
            <span className="font-display font-bold text-lg">stackmate</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-sm border ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>

        {/* Project info */}
        <div className="mb-10">
          <p className="text-sm text-sm-muted mb-1">Project for {portal.clientName}</p>
          <h1 className="text-3xl font-display font-bold mb-2">{portal.projectTitle}</h1>
          {portal.projectDescription && <p className="text-sm text-sm-light">{portal.projectDescription}</p>}
        </div>

        {/* Status timeline */}
        <div className="mb-10">
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-400" /> Updates</h2>
          <div className="space-y-3 border-l-2 border-sm-border pl-6">
            {portal.updates.slice().reverse().map((update, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-sm-border border-2 border-sm-dark" />
                <p className="text-xs text-sm-muted">{new Date(update.date).toLocaleDateString()} {new Date(update.date).toLocaleTimeString()}</p>
                <p className="text-sm text-sm-light">{update.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        {portal.deliverables.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-orange-400" /> Deliverables</h2>
            <div className="space-y-3">
              {portal.deliverables.map(d => {
                const Icon = TYPE_ICONS[d.type] || Package;
                return (
                  <div key={d.id} className="p-5 rounded-sm border border-sm-border bg-sm-card/30">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{d.title}</h3>
                        {d.description && <p className="text-xs text-sm-muted mt-1">{d.description}</p>}
                        {d.url && (
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:underline mt-1 inline-block">{d.url}</a>
                        )}
                        {d.credentials && d.credentials.length > 0 && (
                          <div className="mt-3">
                            <button onClick={() => setShowCreds(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                              className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                            >
                              <Key className="w-3 h-3" /> {showCreds[d.id] ? 'Hide' : 'Show'} credentials
                            </button>
                            {showCreds[d.id] && (
                              <div className="mt-2 p-3 rounded-sm bg-sm-dark border border-sm-border space-y-1">
                                {d.credentials.map((cred, ci) => (
                                  <div key={ci} className="flex justify-between text-xs">
                                    <span className="text-sm-muted">{cred.label}</span>
                                    <span className="text-sm-light font-mono">{cred.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Handover checklist */}
        {portal.handoverChecklist.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-400" /> Handover ({handoverDone}/{portal.handoverChecklist.length})
            </h2>
            <div className="space-y-2">
              {portal.handoverChecklist.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-sm border ${item.done ? 'border-orange-500/20 bg-orange-500/5' : 'border-sm-border bg-sm-card/30'}`}>
                  {item.done ? <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" /> : <Circle className="w-4 h-4 text-sm-muted shrink-0" />}
                  <span className={`text-sm ${item.done ? 'text-sm-muted line-through' : 'text-sm-light'}`}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support */}
        <div className="p-6 rounded-sm border border-sm-border bg-sm-card/30 text-center">
          <MessageSquare className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <h3 className="font-display font-semibold mb-1">Need help?</h3>
          <p className="text-sm text-sm-muted mb-3">Contact us anytime for support, questions, or changes.</p>
          <a href={`mailto:${portal.supportEmail}`} className="text-sm text-orange-400 hover:underline">{portal.supportEmail}</a>
        </div>

        <div className="mt-10 text-center text-xs text-sm-muted">
          <p>Stackmate &middot; Perth, Western Australia &middot; stackmate.digital</p>
        </div>
      </div>
    </main>
  );
}
