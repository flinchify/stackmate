import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Stackmate privacy policy. How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; Back</Link>
        <h1 className="text-4xl font-display font-bold mt-6 mb-2">Privacy Policy</h1>
        <p className="text-sm text-sm-muted mb-10">Last updated: 1 April 2026</p>

        <div className="space-y-8 text-sm-light leading-relaxed">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">1. Information We Collect</h2>
            <p>When you submit a quote request, we collect: your name, company name, email address, phone number (optional), business location (optional), website (optional), social media handles (optional), and project details. We also collect basic usage data such as IP addresses for rate limiting and security purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to: respond to your quote requests, provide our services, communicate about your projects, improve our website and services, and comply with legal obligations. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We use HTTPS for all data transmission. Access to your data is restricted to authorised team members only.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">4. Cookies</h2>
            <p>We use essential cookies for website functionality. We do not use tracking cookies or third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">5. Third-Party Services</h2>
            <p>We may use third-party services for hosting (Vercel), analytics, and payment processing. These services have their own privacy policies and handle data in accordance with their terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">6. Your Rights</h2>
            <p>Under the Australian Privacy Act 1988, you have the right to: access your personal information, request correction of inaccurate data, request deletion of your data, and lodge a complaint with the Office of the Australian Information Commissioner (OAIC).</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">7. Data Retention</h2>
            <p>We retain your data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">9. Contact</h2>
            <p>For privacy-related enquiries, contact us at hello@stackmate.digital.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
