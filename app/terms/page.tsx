import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-black mb-2">Terms of Service</h1>
        <p className="text-neutral-400 mb-12">Last updated: February 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-black mt-0">1. Agreement to Terms</h2>
            <p>
              By accessing or using VektorLabs (&quot;Service&quot;), operated by VektorLabs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), 
              you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">2. Description of Service</h2>
            <p>
              VektorLabs provides AI-powered website design and development services. We create custom websites 
              based on your business information, industry intelligence, and design preferences. Our service includes 
              website generation, revisions as specified in your plan, and deployment assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">3. Account Registration</h2>
            <p>
              To use the Service, you must create an account and provide accurate, complete information. You are 
              responsible for maintaining the security of your account credentials and for all activities under your account. 
              You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">4. Payment Terms</h2>
            <p>
              Payments are processed securely through our payment processor. All prices are listed in USD. 
              Payment is required before website delivery. By submitting payment, you authorize us to charge 
              the specified amount for the selected plan.
            </p>
            <p>
              <strong>Refund Policy:</strong> If we are unable to deliver a satisfactory website after your 
              included revision rounds, you may request a full refund within 30 days of your initial payment. 
              Refund requests should be sent to support@verktorlabs.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">5. Intellectual Property</h2>
            <p>
              Upon full payment, you own the website files and content we create for you. You grant us permission 
              to showcase your project in our portfolio unless you opt out. The underlying technology, AI systems, 
              templates, and industry intelligence databases remain our intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">6. Your Content &amp; Credentials</h2>
            <p>
              You retain ownership of all content, logos, images, and business information you provide. 
              Platform credentials you share (e.g., Shopify, WordPress access) are used solely to deploy 
              your website and are not stored after project completion. You are responsible for ensuring 
              you have the right to use all content you provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">7. Website Delivery &amp; Revisions</h2>
            <p>
              Delivery timelines are estimates and may vary based on project complexity. Each plan includes 
              a specified number of revision rounds. Additional revisions beyond your plan limit may incur 
              extra fees. We reserve the right to decline requests that fundamentally change the project scope.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">8. Limitation of Liability</h2>
            <p>
              VektorLabs provides websites on an &quot;as-is&quot; basis. We are not liable for any indirect, 
              incidental, or consequential damages arising from the use of our Service. Our total liability 
              is limited to the amount you paid for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">9. Prohibited Uses</h2>
            <p>
              You may not use our Service to create websites that promote illegal activities, hate speech, 
              harassment, fraud, or any content that violates applicable laws. We reserve the right to 
              refuse service and terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">10. Termination</h2>
            <p>
              We may terminate or suspend your account at our discretion if you violate these Terms. 
              You may cancel your account at any time by contacting us. Upon termination, your right 
              to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes constitutes 
              acceptance of the updated Terms. Material changes will be communicated via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">12. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
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
            <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
            <Link href="/terms" className="text-black font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
