import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-black">
            VERKTORLABS
          </Link>
          <Link href="/" className="text-sm text-neutral-500 hover:text-black transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-black mb-2">Privacy Policy</h1>
        <p className="text-neutral-400 mb-12">Last updated: February 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-black mt-0">1. Information We Collect</h2>
            <p>We collect information you provide directly when using VektorLabs:</p>
            <p>
              <strong>Account Information:</strong> Name, email address, phone number, and business name when you register.
            </p>
            <p>
              <strong>Project Information:</strong> Business descriptions, industry details, design preferences, 
              logos, images, and other content you submit through our questionnaire and setup wizard.
            </p>
            <p>
              <strong>Platform Credentials:</strong> Hosting platform credentials (e.g., Shopify, WordPress) 
              you provide for website deployment. These are used solely for deployment and are deleted after 
              project completion.
            </p>
            <p>
              <strong>Payment Information:</strong> Billing details processed securely by our payment processor. 
              We do not store full credit card numbers on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <p>
              Provide and deliver our website design services, process payments, communicate about your projects, 
              send important service updates, improve our AI generation technology, and comply with legal obligations. 
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">3. Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use Supabase for database 
              hosting with row-level security policies. Platform credentials are encrypted at rest and 
              permanently deleted after your website is deployed. We implement appropriate technical and 
              organizational measures to protect your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">4. Third-Party Services</h2>
            <p>We use the following third-party services to operate:</p>
            <p>
              <strong>Supabase:</strong> Database and authentication.{' '}
              <strong>Square:</strong> Payment processing.{' '}
              <strong>Anthropic (Claude AI):</strong> Website content generation.{' '}
              <strong>Resend:</strong> Email notifications.{' '}
              <strong>Vercel:</strong> Application hosting.
            </p>
            <p>
              Each third-party provider has their own privacy policy governing their handling of your data. 
              We only share the minimum information necessary for each service to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">5. Cookies</h2>
            <p>
              We use essential cookies required for authentication and session management. We do not use 
              third-party advertising or tracking cookies. Essential cookies cannot be disabled as they 
              are necessary for the Service to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">6. Your Rights</h2>
            <p>You have the right to:</p>
            <p>
              Access, correct, or delete your personal data. Export your data in a portable format. 
              Withdraw consent for non-essential data processing. Request information about how your 
              data is used. Close your account and have your data removed.
            </p>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:support@verktorlabs.com" className="text-black underline">support@verktorlabs.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">7. Data Retention</h2>
            <p>
              We retain your account and project data for as long as your account is active or as needed 
              to provide services. Platform credentials are deleted within 7 days of project delivery. 
              After account deletion, we remove your personal data within 30 days, except where we are 
              legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">8. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to individuals under 18. We do not knowingly collect personal 
              information from children. If we become aware that we have collected data from a child, 
              we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">9. Canadian Privacy Law (PIPEDA)</h2>
            <p>
              As a Canadian company, we comply with the Personal Information Protection and Electronic 
              Documents Act (PIPEDA). You have the right to access your personal information held by us 
              and to challenge its accuracy. We obtain meaningful consent for the collection, use, and 
              disclosure of personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes 
              via email or through the Service. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">11. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at{' '}
              <a href="mailto:support@verktorlabs.com" className="text-black underline">support@verktorlabs.com</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-sm text-neutral-400">
          <span>© {new Date().getFullYear()} VektorLabs</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-black font-medium">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
