'use client';

import { useState } from 'react';
import { FileText, Download, Printer, Copy } from 'lucide-react';

interface DocTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

const TEMPLATES: DocTemplate[] = [
  {
    id: 'proposal',
    title: 'Project Proposal',
    category: 'Sales',
    description: 'Send to new clients with scope, pricing, and terms.',
    content: `STACKMATE — PROJECT PROPOSAL
stackmate.digital | Perth, Western Australia
────────────────────────────────────────

Date: _______________
Client: _______________
Contact: _______________
Email: _______________
Phone: _______________

PROJECT OVERVIEW
───────────────
Project Title: _______________

Description:
____________________________________________________________
____________________________________________________________
____________________________________________________________

SCOPE OF WORK
─────────────
☐ Website / Web App
☐ AI Agent / Chatbot
☐ Business Automation
☐ System Integrations
☐ SEO & GEO Optimisation
☐ Branding & Design
☐ Custom Software
☐ Other: _______________

DELIVERABLES
────────────
1. _______________
2. _______________
3. _______________
4. _______________

TIMELINE
────────
Estimated Delivery: _____ business days
Start Date: _______________
Delivery Date: _______________

PRICING
───────
Setup Fee:          $_______________
Monthly Fee:        $_______________ /month
Payment Terms:      14 days from invoice date
GST:                10% applied to all amounts

TERMS
─────
• Setup fee due before work begins
• Monthly fees billed at start of each period
• Client owns 100% of deliverables upon full payment
• 30-day cancellation notice for subscriptions
• 30-day bug fix warranty included
• Late payments incur 2% monthly fee

ACCEPTANCE
──────────
By signing below, you agree to the scope, pricing, and terms outlined above.

Client Signature: _________________________  Date: ___________

Stackmate (Miles Cass): ___________________  Date: ___________`,
  },
  {
    id: 'onboarding',
    title: 'Client Onboarding Form',
    category: 'Operations',
    description: 'Collect all credentials and access details from a new client.',
    content: `STACKMATE — CLIENT ONBOARDING FORM
stackmate.digital | Perth, Western Australia
────────────────────────────────────────

Date: _______________
Client: _______________
Primary Contact: _______________
Email: _______________
Phone: _______________

BUSINESS DETAILS
────────────────
Business Name: _______________
ABN: _______________
Industry: _______________
Website (current): _______________
Location: _______________

ACCESS CREDENTIALS (we need these to start)
───────────────────────────────────────────

Domain Registrar:
  Provider: _______________ (e.g. GoDaddy, Namecheap, VentraIP)
  Login: _______________
  Password: _______________

Hosting:
  Provider: _______________ (e.g. Vercel, Netlify, cPanel)
  Login: _______________
  Password: _______________

Google Workspace / Email:
  Admin Email: _______________
  Password: _______________

Google Analytics:
  ☐ Granted editor access to: hello@stackmate.digital

Google Search Console:
  ☐ Granted owner access to: hello@stackmate.digital

Google Business Profile:
  ☐ Granted manager access to: hello@stackmate.digital

Social Media Accounts:
  Instagram: _______________
  Facebook: _______________
  LinkedIn: _______________
  TikTok: _______________
  Twitter/X: _______________

Current Tools / Software:
  CRM: _______________
  Accounting: _______________ (e.g. Xero, MYOB)
  Email Marketing: _______________
  Other: _______________

NOTES
─────
____________________________________________________________
____________________________________________________________

CONSENT
───────
I authorise Stackmate to access the above accounts for the purpose of delivering the agreed project scope.

Signature: _________________________  Date: ___________`,
  },
  {
    id: 'audit-report',
    title: 'AI Audit Report',
    category: 'Audits',
    description: 'Present findings from a free AI audit to the client.',
    content: `STACKMATE — AI AUDIT REPORT
stackmate.digital | Perth, Western Australia
────────────────────────────────────────

Prepared for: _______________
Date: _______________
Auditor: Miles Cass, Stackmate

EXECUTIVE SUMMARY
──────────────────
____________________________________________________________
____________________________________________________________

CURRENT STATE
─────────────
Website: _______________
PageSpeed Score: _____ / 100
SEO Score: _____ / 100
GEO Score: _____ / 100
Security Headers: _____ / 100

FINDINGS
────────

1. WEBSITE PERFORMANCE
   Current: _______________
   Issue: _______________
   Recommendation: _______________
   Estimated Impact: _______________

2. SEO STATUS
   Current: _______________
   Issue: _______________
   Recommendation: _______________
   Estimated Impact: _______________

3. AI SEARCH VISIBILITY (GEO)
   Current: _______________
   Issue: _______________
   Recommendation: _______________
   Estimated Impact: _______________

4. AUTOMATION OPPORTUNITIES
   ☐ AI Receptionist / Chatbot
     Current process: _______________
     Time saved: _____ hrs/week
     Estimated value: $_____/month

   ☐ Automated Invoicing
     Current process: _______________
     Time saved: _____ hrs/week

   ☐ Booking System
     Current process: _______________
     Time saved: _____ hrs/week

   ☐ Lead Follow-up Automation
     Current process: _______________
     Leads recovered: _____ /month

   ☐ Reporting / Analytics
     Current process: _______________
     Time saved: _____ hrs/week

   ☐ Other: _______________

PRIORITY ACTIONS (ranked by ROI)
────────────────────────────────
1. _______________  |  Impact: HIGH  |  Effort: _____
2. _______________  |  Impact: HIGH  |  Effort: _____
3. _______________  |  Impact: MED   |  Effort: _____
4. _______________  |  Impact: MED   |  Effort: _____
5. _______________  |  Impact: LOW   |  Effort: _____

ESTIMATED TOTAL SAVINGS
───────────────────────
Time saved: _____ hours/week
Cost savings: $_____/month
Revenue gained: $_____/month

RECOMMENDED PACKAGE
───────────────────
☐ Setup: $_______________
☐ Monthly: $_______________ /month
☐ Includes: _______________

NEXT STEPS
──────────
1. Review this report
2. Book a strategy call: stackmate.digital
3. Accept quote and we start building

────────────────────────────────────────
Stackmate | stackmate.digital | Perth, WA
Miles Cass | hello@stackmate.digital`,
  },
  {
    id: 'handover',
    title: 'Project Handover Document',
    category: 'Delivery',
    description: 'Give to client when project is complete with all access details.',
    content: `STACKMATE — PROJECT HANDOVER
stackmate.digital | Perth, Western Australia
────────────────────────────────────────

Client: _______________
Project: _______________
Delivered: _______________
Handover By: Miles Cass

LIVE URLS
─────────
Website: _______________
Admin Panel: _______________
API Endpoint: _______________

SOURCE CODE
───────────
GitHub Repository: _______________
Branch: main
Tech Stack: _______________

HOSTING
───────
Platform: _______________ (e.g. Vercel)
Account: _______________
Project URL: _______________

CREDENTIALS
───────────
Admin Login:
  URL: _______________
  Email: _______________
  Password: _______________

Database:
  Provider: _______________
  Connection String: [provided separately for security]

API Keys:
  _______________: [provided separately]
  _______________: [provided separately]

ENVIRONMENT VARIABLES
─────────────────────
All env vars documented in: _______________
Critical variables:
  _______________
  _______________

DNS / DOMAIN
────────────
Domain: _______________
Registrar: _______________
DNS: Pointed to _______________
SSL: ☐ Active (auto-renewing)

WHAT'S INCLUDED
───────────────
☐ Full source code (you own it)
☐ Deployed and live
☐ Admin access
☐ Documentation
☐ 30-day bug fix warranty

ONGOING SUPPORT
───────────────
Support Email: hello@stackmate.digital
Response Time: Within 24 hours
Monthly Plan: ☐ Active  ☐ Not included

HOW TO MAKE CHANGES
───────────────────
Content updates: _______________
Code changes: _______________
Deployments: _______________

────────────────────────────────────────
Stackmate | stackmate.digital | Perth, WA`,
  },
  {
    id: 'invoice',
    title: 'Invoice Template',
    category: 'Finance',
    description: 'Printable invoice with Stackmate branding.',
    content: `STACKMATE
stackmate.digital
Perth, Western Australia
ABN: _______________
────────────────────────────────────────

INVOICE

Invoice #: INV-________
Date: _______________
Due Date: _______________

BILL TO
───────
Company: _______________
Contact: _______________
Email: _______________
Address: _______________

ITEMS
─────
Description                              Qty    Unit Price    Total
─────────────────────────────────────────────────────────────────
___________________________________      ___    $________    $________
___________________________________      ___    $________    $________
___________________________________      ___    $________    $________
___________________________________      ___    $________    $________

                                         ─────────────────────────
                                         Subtotal:    $________
                                         GST (10%):   $________
                                         ─────────────────────────
                                         TOTAL:       $________

PAYMENT DETAILS
───────────────
Bank: _______________
BSB: _______________
Account: _______________
Account Name: _______________
Reference: INV-________

TERMS
─────
• Payment due within 14 days
• Late payments incur 2% monthly fee
• All prices in AUD

────────────────────────────────────────
Thank you for your business.
Stackmate | stackmate.digital | Perth, WA`,
  },
  {
    id: 'seo-report',
    title: 'Monthly SEO/GEO Report',
    category: 'Reporting',
    description: 'Monthly performance report template to send clients.',
    content: `STACKMATE — MONTHLY REPORT
stackmate.digital | Perth, Western Australia
────────────────────────────────────────

Client: _______________
Period: _______________ to _______________
Prepared by: Miles Cass

SUMMARY
───────
Overall: ☐ Improving  ☐ Stable  ☐ Needs Attention

GOOGLE PERFORMANCE
──────────────────
Sessions:        _____ (last month: _____)  Change: _____%
Users:           _____ (last month: _____)  Change: _____%
Bounce Rate:     _____%
Top Pages:
  1. _______________  (_____ views)
  2. _______________  (_____ views)
  3. _______________  (_____ views)

SEARCH RANKINGS
───────────────
Top Keywords:
  "_______________"  Position: #_____  (was #_____)
  "_______________"  Position: #_____  (was #_____)
  "_______________"  Position: #_____  (was #_____)

Impressions: _____ (change: _____%)
Clicks: _____ (change: _____%)
Avg Position: #_____ (was #_____)

GEO / AI SEARCH
───────────────
GEO Audit Score: _____ / 100 (last month: _____)
ChatGPT: ☐ Appears  ☐ Not appearing
Perplexity: ☐ Appears  ☐ Not appearing
Gemini: ☐ Appears  ☐ Not appearing

WORK COMPLETED THIS MONTH
──────────────────────────
☐ _______________
☐ _______________
☐ _______________
☐ _______________
☐ _______________

ISSUES FIXED
────────────
☐ _______________
☐ _______________

BACKLINKS ACQUIRED
──────────────────
  _______________
  _______________

RECOMMENDATIONS FOR NEXT MONTH
───────────────────────────────
1. _______________
2. _______________
3. _______________

────────────────────────────────────────
Stackmate | stackmate.digital | Perth, WA
Next report: _______________`,
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    category: 'Legal',
    description: 'NDA for protecting client information during engagements.',
    content: `NON-DISCLOSURE AGREEMENT (NDA)
────────────────────────────────────────

Date: _______________

BETWEEN:
Stackmate (ABN: _______________)
Miles Cass, Perth, Western Australia
("Receiving Party")

AND:
_______________
ABN: _______________
("Disclosing Party")

1. DEFINITION
The term "Confidential Information" means any data or information, oral or written, disclosed by the Disclosing Party that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

2. OBLIGATIONS
The Receiving Party agrees to:
(a) Hold and maintain Confidential Information in strict confidence
(b) Not disclose Confidential Information to any third parties without prior written consent
(c) Use Confidential Information solely for the purpose of the agreed project scope
(d) Protect Confidential Information using the same degree of care used for its own confidential information

3. EXCLUSIONS
This agreement does not apply to information that:
(a) Is or becomes publicly available through no fault of the Receiving Party
(b) Was already known to the Receiving Party prior to disclosure
(c) Is independently developed by the Receiving Party
(d) Is required to be disclosed by law

4. TERM
This agreement is effective from the date above and continues for 2 years after the termination of the business relationship.

5. GOVERNING LAW
This agreement is governed by the laws of Western Australia, Australia.

AGREED:

Stackmate:
Signature: _________________________
Name: Miles Cass
Date: _______________

Client:
Signature: _________________________
Name: _______________
Date: _______________`,
  },
];

export default function DocumentsPage() {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

  const getContent = (id: string, original: string) => editedContent[id] ?? original;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const printDoc = (content: string, title: string) => {
    const win = window.open('', '_blank');
    if (!win) return;
    // Convert plain text to styled HTML doc
    const lines = content.split('\n');
    let html = '';
    for (const line of lines) {
      if (line.startsWith('STACKMATE') || line.startsWith('NON-DISCLOSURE')) {
        html += `<h1 style="font-size:24px;font-weight:800;margin:0 0 4px 0;letter-spacing:-0.5px;">${line}</h1>`;
      } else if (line.match(/^[A-Z][A-Z\s\/&()]+$/) && line.length > 3 && !line.includes('___')) {
        html += `<h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:24px 0 8px 0;color:#333;border-bottom:2px solid #f97316;padding-bottom:4px;">${line}</h2>`;
      } else if (line.startsWith('────') || line.startsWith('───')) {
        // skip dividers, handled by h2 border
      } else if (line.startsWith('☐')) {
        html += `<div style="margin:4px 0 4px 12px;">${line}</div>`;
      } else if (line.match(/^\d+\.\s/)) {
        html += `<div style="margin:4px 0 4px 12px;font-weight:500;">${line}</div>`;
      } else if (line.includes('___') && line.includes(':')) {
        const [label, ...rest] = line.split(':');
        html += `<div style="margin:6px 0;display:flex;gap:8px;"><span style="color:#666;min-width:180px;">${label.trim()}:</span><span style="flex:1;border-bottom:1px solid #ddd;min-height:20px;">${rest.join(':').replace(/_/g, '').trim()}</span></div>`;
      } else if (line.trim() === '') {
        html += '<div style="height:8px;"></div>';
      } else {
        html += `<p style="margin:4px 0;">${line}</p>`;
      }
    }

    win.document.write(`<html><head><title>${title} — Stackmate</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      body { font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; padding: 60px; max-width: 800px; margin: 0 auto; line-height: 1.7; color: #1a1a1a; }
      @media print { body { padding: 40px; } @page { margin: 20mm; } }
      .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 3px solid #0a0a0a; }
      .header img { height: 36px; }
      .header-right { text-align: right; font-size: 11px; color: #666; }
    </style></head><body>
      <div class="header">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="/logo.png" alt="Stackmate" />
          <span style="font-size:20px;font-weight:800;letter-spacing:-0.5px;">stackmate</span>
        </div>
        <div class="header-right">
          stackmate.digital<br/>Perth, Western Australia<br/>hello@stackmate.digital
        </div>
      </div>
      ${html}
      <div style="margin-top:48px;padding-top:16px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#999;">
        Stackmate &middot; stackmate.digital &middot; Perth, Western Australia
      </div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const active = TEMPLATES.find(t => t.id === activeDoc);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <a href="/admin" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; Back to Admin</a>
          <h1 className="text-2xl font-display font-bold mt-4">Documents & Forms</h1>
          <p className="text-sm text-sm-muted">Printable templates for client proposals, onboarding, invoices, reports, and legal.</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 shrink-0 space-y-4">
            {categories.map(cat => (
              <div key={cat}>
                <p className="text-xs text-sm-muted uppercase tracking-widest mb-2">{cat}</p>
                <div className="space-y-1">
                  {TEMPLATES.filter(t => t.category === cat).map(t => (
                    <button key={t.id} onClick={() => setActiveDoc(t.id)}
                      className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all ${activeDoc === t.id ? 'bg-orange-500/10 border border-orange-500/20 text-white' : 'border border-sm-border text-sm-light hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> {t.title}</div>
                      <p className="text-xs text-sm-muted mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {!active ? (
              <div className="text-center py-20 text-sm-muted">Select a document from the sidebar.</div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold">{active.title}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-1.5 px-3 py-2 rounded-sm border text-xs transition-colors ${editMode ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-sm-border text-sm-light hover:border-white/30'}`}>
                      {editMode ? 'Preview' : 'Edit'}
                    </button>
                    <button onClick={() => copyToClipboard(getContent(active.id, active.content))} className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-sm-border text-xs text-sm-light hover:border-white/30 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button onClick={() => printDoc(getContent(active.id, active.content), active.title)} className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-orange-500/30 text-xs text-orange-400 hover:bg-orange-500/10 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Print / PDF
                    </button>
                  </div>
                </div>
                {editMode ? (
                  <textarea
                    value={getContent(active.id, active.content)}
                    onChange={e => setEditedContent(prev => ({ ...prev, [active.id]: e.target.value }))}
                    className="w-full bg-sm-dark border border-sm-border rounded-sm p-6 text-sm text-sm-light font-mono leading-relaxed max-h-[75vh] min-h-[50vh] resize-y focus:outline-none focus:border-orange-500/30"
                  />
                ) : (
                <div className="bg-white text-black rounded-sm p-8 max-h-[75vh] overflow-y-auto text-sm leading-relaxed">
                  {/* Logo header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.png" alt="Stackmate" className="h-8" />
                      <span className="font-bold text-lg tracking-tight">stackmate</span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>stackmate.digital</p>
                      <p>Perth, Western Australia</p>
                      <p>hello@stackmate.digital</p>
                    </div>
                  </div>
                  {/* Rendered content */}
                  {getContent(active.id, active.content).split('\n').map((line, i) => {
                    if (line.startsWith('STACKMATE') || line.startsWith('NON-DISCLOSURE')) return <h1 key={i} className="text-xl font-extrabold mb-1">{line}</h1>;
                    if (line.match(/^[A-Z][A-Z\s\/&()]+$/) && line.length > 3 && !line.includes('___')) return <h2 key={i} className="text-xs font-bold uppercase tracking-widest mt-6 mb-2 text-gray-700 border-b-2 border-orange-500 pb-1">{line}</h2>;
                    if (line.startsWith('\u2500')) return null;
                    if (line.startsWith('\u2610')) return <div key={i} className="ml-3 my-1">{line}</div>;
                    if (line.match(/^\d+\.\s/)) return <div key={i} className="ml-3 my-1 font-medium">{line}</div>;
                    if (line.includes('___') && line.includes(':')) {
                      const [label] = line.split(':');
                      return <div key={i} className="flex gap-2 my-1"><span className="text-gray-500 w-44 shrink-0">{label.trim()}:</span><span className="flex-1 border-b border-gray-300"></span></div>;
                    }
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="my-0.5">{line}</p>;
                  })}
                </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
