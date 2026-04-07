import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set — email notifications disabled');
      return null;
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = 'stackmatedigital@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'notifications@stackmate.digital';

export async function notifyNewQuote(data: {
  companyName: string;
  email: string;
  industry: string;
  employees: string;
  description: string;
  urgency: string;
  phone?: string;
  website?: string;
}) {
  try {
    const resend = getResend();
    if (!resend) return;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Quote Request: ${data.companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #FF7A00;">New Quote Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Company</td><td>${data.companyName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td>${data.phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; font-weight: bold;">Industry</td><td>${data.industry}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Employees</td><td>${data.employees}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Urgency</td><td>${data.urgency}</td></tr>
            ${data.website ? `<tr><td style="padding: 8px 0; font-weight: bold;">Website</td><td>${data.website}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px;">
            <strong>Description:</strong><br/>${data.description || 'No description provided'}
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">
            View in admin: <a href="https://stackmate.digital/admin">stackmate.digital/admin</a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send quote notification:', err);
  }
}

// ---- CLIENT EMAIL TEMPLATES ----
function emailWrapper(content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; background: #111; color: #e5e5e5; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff; font-weight: 700;">Stackmate</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.8);">Digital Growth Partner</p>
      </div>
      <div style="padding: 32px;">
        ${content}
      </div>
      <div style="padding: 20px 32px; border-top: 1px solid #333; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #888;">
          Stackmate Digital &mdash; <a href="https://stackmate.digital" style="color: #f97316; text-decoration: none;">stackmate.digital</a>
        </p>
      </div>
    </div>
  `;
}

function monthlyReportTemplate(data: Record<string, unknown>): string {
  const seoScore = data.seoScore ?? 'N/A';
  const geoScores = (data.geoScores as { platform: string; score: number }[]) || [];
  const recommendations = (data.recommendations as string) || '';
  const clientName = (data.clientName as string) || 'there';
  const geoRows = geoScores.map(g => `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #333; color: #ccc;">${g.platform}</td><td style="padding: 8px 12px; border-bottom: 1px solid #333; font-weight: 700; color: ${g.score >= 80 ? '#4ade80' : g.score >= 60 ? '#f97316' : '#f87171'};">${g.score}/100</td></tr>`).join('');
  return emailWrapper(`
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #fff;">Monthly Performance Report</h2>
    <p style="color: #aaa; margin: 0 0 24px; font-size: 14px;">Hi ${clientName}, here's your monthly performance summary.</p>
    <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 4px; font-size: 12px; color: #888;">SEO Performance Score</p>
      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #f97316;">${seoScore}/100</p>
    </div>
    ${geoScores.length > 0 ? `
      <h3 style="color: #fff; font-size: 16px; margin: 0 0 12px;">AI Search Visibility (GEO)</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead><tr><th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #f97316; color: #fff; font-size: 12px;">Platform</th><th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #f97316; color: #fff; font-size: 12px;">Score</th></tr></thead>
        <tbody>${geoRows}</tbody>
      </table>
    ` : ''}
    ${recommendations ? `<div style="background: #1a1a1a; border-left: 3px solid #f97316; padding: 16px; border-radius: 4px; margin-bottom: 20px;"><h3 style="margin: 0 0 8px; color: #fff; font-size: 14px;">Recommendations</h3><p style="margin: 0; color: #ccc; font-size: 13px; white-space: pre-line;">${recommendations}</p></div>` : ''}
    <p style="color: #888; font-size: 12px;">Questions? Reply to this email or contact us at hello@stackmate.digital</p>
  `);
}

function seoRecommendationTemplate(data: Record<string, unknown>): string {
  const clientName = (data.clientName as string) || 'there';
  const currentScore = data.currentScore ?? 'N/A';
  const issues = (data.issues as string) || 'No specific issues identified.';
  const actionItems = (data.actionItems as string) || '';
  return emailWrapper(`
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #fff;">SEO Improvement Opportunities</h2>
    <p style="color: #aaa; margin: 0 0 24px; font-size: 14px;">Hi ${clientName}, we've identified opportunities to improve your search visibility.</p>
    <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 4px; font-size: 12px; color: #888;">Current SEO Score</p>
      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #f97316;">${currentScore}/100</p>
    </div>
    <div style="background: #1a1a1a; border-left: 3px solid #f87171; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 8px; color: #fff; font-size: 14px;">Issues Found</h3>
      <p style="margin: 0; color: #ccc; font-size: 13px; white-space: pre-line;">${issues}</p>
    </div>
    ${actionItems ? `<div style="background: #1a1a1a; border-left: 3px solid #4ade80; padding: 16px; border-radius: 4px; margin-bottom: 20px;"><h3 style="margin: 0 0 8px; color: #fff; font-size: 14px;">Recommended Actions</h3><p style="margin: 0; color: #ccc; font-size: 13px; white-space: pre-line;">${actionItems}</p></div>` : ''}
    <p style="color: #888; font-size: 12px;">Want us to implement these improvements? Reply to this email.</p>
  `);
}

function geoRecommendationTemplate(data: Record<string, unknown>): string {
  const clientName = (data.clientName as string) || 'there';
  const geoScores = (data.geoScores as { platform: string; score: number }[]) || [];
  const working = (data.working as string) || '';
  const toImprove = (data.toImprove as string) || '';
  const geoRows = geoScores.map(g => `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #333; color: #ccc;">${g.platform}</td><td style="padding: 8px 12px; border-bottom: 1px solid #333; font-weight: 700; color: ${g.score >= 80 ? '#4ade80' : g.score >= 60 ? '#f97316' : '#f87171'};">${g.score}/100</td></tr>`).join('');
  return emailWrapper(`
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #fff;">AI Search Visibility Report</h2>
    <p style="color: #aaa; margin: 0 0 24px; font-size: 14px;">Hi ${clientName}, here's how your business appears in AI search platforms.</p>
    ${geoScores.length > 0 ? `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead><tr><th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #f97316; color: #fff; font-size: 12px;">Platform</th><th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #f97316; color: #fff; font-size: 12px;">Score</th></tr></thead>
        <tbody>${geoRows}</tbody>
      </table>
    ` : ''}
    ${working ? `<div style="background: #1a1a1a; border-left: 3px solid #4ade80; padding: 16px; border-radius: 4px; margin-bottom: 20px;"><h3 style="margin: 0 0 8px; color: #fff; font-size: 14px;">What's Working</h3><p style="margin: 0; color: #ccc; font-size: 13px; white-space: pre-line;">${working}</p></div>` : ''}
    ${toImprove ? `<div style="background: #1a1a1a; border-left: 3px solid #f97316; padding: 16px; border-radius: 4px; margin-bottom: 20px;"><h3 style="margin: 0 0 8px; color: #fff; font-size: 14px;">What to Improve</h3><p style="margin: 0; color: #ccc; font-size: 13px; white-space: pre-line;">${toImprove}</p></div>` : ''}
    <p style="color: #888; font-size: 12px;">Want to boost your AI search visibility? Reply to discuss our GEO packages.</p>
  `);
}

function generalTemplate(data: Record<string, unknown>): string {
  const clientName = (data.clientName as string) || 'there';
  const body = (data.body as string) || '';
  return emailWrapper(`
    <p style="color: #aaa; margin: 0 0 24px; font-size: 14px;">Hi ${clientName},</p>
    <div style="color: #ccc; font-size: 14px; line-height: 1.6; white-space: pre-line;">${body}</div>
    <p style="color: #888; font-size: 12px; margin-top: 24px;">Questions? Reply to this email or contact us at hello@stackmate.digital</p>
  `);
}

export async function sendClientEmail(params: { to: string; subject: string; template: string; data: Record<string, unknown> }): Promise<{ sent: boolean }> {
  const resend = getResend();
  if (!resend) return { sent: false };

  let html: string;
  switch (params.template) {
    case 'monthly-report': html = monthlyReportTemplate(params.data); break;
    case 'seo-recommendation': html = seoRecommendationTemplate(params.data); break;
    case 'geo-recommendation': html = geoRecommendationTemplate(params.data); break;
    case 'general': default: html = generalTemplate(params.data); break;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html,
  });

  return { sent: true };
}

export async function notifyNewAudit(data: {
  companyName: string;
  email: string;
  contactName?: string;
  phone?: string;
  website?: string;
  industry?: string;
  description: string;
}) {
  try {
    const resend = getResend();
    if (!resend) return;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Audit Request: ${data.companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #FF7A00;">New Audit Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Company</td><td>${data.companyName}</td></tr>
            ${data.contactName ? `<tr><td style="padding: 8px 0; font-weight: bold;">Contact</td><td>${data.contactName}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td>${data.phone}</td></tr>` : ''}
            ${data.website ? `<tr><td style="padding: 8px 0; font-weight: bold;">Website</td><td>${data.website}</td></tr>` : ''}
            ${data.industry ? `<tr><td style="padding: 8px 0; font-weight: bold;">Industry</td><td>${data.industry}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px;">
            <strong>Description:</strong><br/>${data.description || 'No description provided'}
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">
            View in admin: <a href="https://stackmate.digital/admin">stackmate.digital/admin</a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send audit notification:', err);
  }
}
