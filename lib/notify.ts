import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
