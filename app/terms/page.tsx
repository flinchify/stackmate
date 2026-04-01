import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Stackmate terms of service. The rules governing use of our services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; Back</Link>
        <h1 className="text-4xl font-display font-bold mt-6 mb-2">Terms of Service</h1>
        <p className="text-sm text-sm-muted mb-10">Last updated: 1 April 2026</p>

        <div className="space-y-8 text-sm-light leading-relaxed">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">1. Agreement</h2>
            <p>By using Stackmate&apos;s website and services, you agree to these terms. If you do not agree, do not use our services. These terms are governed by the laws of Western Australia.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">2. Services</h2>
            <p>Stackmate provides AI systems integration, custom software development, business automation, web development, branding, SEO, and related technology services. Specific deliverables, timelines, and pricing are defined in individual project proposals.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">3. Quotes & Proposals</h2>
            <p>Quote requests submitted through our website are non-binding enquiries. A formal engagement only begins when both parties agree to a written proposal or contract. Pricing estimates are indicative and may change based on final scope.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">4. Payment Terms</h2>
            <p>Payment terms are specified in individual project proposals. Unless otherwise stated, setup fees are due before work begins. Monthly fees are billed at the start of each billing period. Late payments may incur a 2% monthly charge.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>Upon full payment, you own all custom work product delivered by Stackmate. We retain the right to use general methodologies, tools, and frameworks. We may showcase completed work in our portfolio unless you request otherwise in writing.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">6. Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary information shared during the engagement. This obligation survives termination of the agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Australian law, Stackmate&apos;s liability for any claim arising from our services is limited to the total amount paid by you for the specific service in question. We are not liable for indirect, incidental, or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">8. Termination</h2>
            <p>Either party may terminate an engagement with 14 days written notice. Upon termination, you are responsible for payment for all work completed up to the termination date. We will provide all completed deliverables and source code.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">9. Warranty</h2>
            <p>We warrant that our services will be performed with reasonable care and skill. We provide a 30-day warranty on completed work for bug fixes and defects. This does not cover changes in requirements, third-party service failures, or misuse.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">10. Disputes</h2>
            <p>Any disputes will first be addressed through good-faith negotiation. If unresolved, disputes will be submitted to mediation in Perth, Western Australia, before any legal proceedings.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">11. Changes</h2>
            <p>We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">12. Contact</h2>
            <p>For questions about these terms, contact us at hello@stackmate.digital.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
