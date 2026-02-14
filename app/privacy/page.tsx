'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>
      <div className="noise" />

      {/* Nav */}
      <header className="bg-white border-b border-neutral-200">
        <nav className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-black rounded-xl transition-transform duration-300 group-hover:rotate-6" />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-d text-xl font-semibold">V</span></div>
            </div>
            <span className="hidden sm:block font-b text-[15px] font-semibold tracking-wide text-black">VEKTORLABS</span>
          </Link>
          <Link href="/" className="font-b text-[13px] font-medium text-neutral-500 hover:text-black transition-colors">← Back to Home</Link>
        </nav>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-[720px] mx-auto px-8 lg:px-12">
          <span className="font-b text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">Legal</span>
          <h1 className="font-d text-4xl lg:text-5xl font-medium mt-4 mb-4 text-black">Privacy Policy</h1>
          <p className="font-b text-sm text-neutral-400 mb-12">Last updated: February 2026</p>

          <div className="font-b text-neutral-600 leading-relaxed space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-black mb-3">1. Introduction</h2>
              <p>VektorLabs (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. This policy complies with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and Quebec&apos;s Act Respecting the Protection of Personal Information in the Private Sector (Law 25).</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information that you provide directly to us, including:</p>
              <p><strong className="text-black">Contact Information:</strong> Name, email address, phone number, and business name provided through our intake forms.</p>
              <p className="mt-2"><strong className="text-black">Business Information:</strong> Industry type, website type preference, and other business details provided during the project questionnaire.</p>
              <p className="mt-2"><strong className="text-black">Payment Information:</strong> Credit card and billing details processed securely through Stripe. We do not store your full credit card number on our servers.</p>
              <p className="mt-2"><strong className="text-black">Usage Information:</strong> Browser type, device information, IP address, and pages visited, collected automatically through cookies and similar technologies.</p>
              <p className="mt-2"><strong className="text-black">Communication Data:</strong> Messages, emails, and SMS exchanges related to your project.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <p>Provide, maintain, and improve our website building services. Process your project requests and deliver website previews. Communicate with you about your project via SMS, email, or phone. Process payments through our payment provider (Stripe). Send you service-related updates and notifications. Analyze usage patterns to improve our platform and user experience. Comply with legal obligations and protect our rights.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">4. SMS Communications</h2>
              <p>By providing your phone number, you consent to receive SMS messages from VektorLabs related to your website project, including preview links, project updates, and follow-up communications. Message frequency varies based on project activity. Message and data rates may apply. You can opt out of SMS communications at any time by replying STOP to any message or contacting us directly.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">5. Information Sharing</h2>
              <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <p><strong className="text-black">Service Providers:</strong> We share data with trusted third-party services that help us operate our business, including Stripe (payments), Supabase (data storage), and Vercel (hosting). These providers are contractually obligated to protect your information.</p>
              <p className="mt-2"><strong className="text-black">Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation.</p>
              <p className="mt-2"><strong className="text-black">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">6. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information, including encryption in transit (TLS/SSL), secure data storage, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">7. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. Project data is retained for a minimum of 2 years after project completion for reference and support purposes. You may request deletion of your data at any time by contacting us.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">8. Your Rights</h2>
              <p className="mb-3">Under PIPEDA and Quebec Law 25, you have the right to:</p>
              <p>Access your personal information held by us. Request correction of inaccurate information. Request deletion of your personal information. Withdraw consent to the processing of your data. Receive your data in a portable format. File a complaint with the Office of the Privacy Commissioner of Canada or the Commission d&apos;accès à l&apos;information du Québec.</p>
              <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@tryvektorlabs.com" className="text-black underline hover:no-underline">hello@tryvektorlabs.com</a>.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">9. Cookies</h2>
              <p>We use essential cookies to operate our website and optional analytics cookies to understand how visitors interact with our platform. You can control cookie preferences through your browser settings. Essential cookies cannot be disabled as they are necessary for the website to function.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">10. Children&apos;s Privacy</h2>
              <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will take steps to delete that information promptly.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a new revision date. We encourage you to review this policy periodically.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">12. Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy or our data practices, contact us at:</p>
              <p className="mt-3">
                <strong className="text-black">VektorLabs</strong><br />
                Montreal, Quebec, Canada<br />
                <a href="mailto:hello@tryvektorlabs.com" className="text-black underline hover:no-underline">hello@tryvektorlabs.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center"><span className="text-black font-d text-xl font-semibold">V</span></div>
            <span className="font-b text-[15px] font-semibold tracking-wide">VEKTORLABS</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-neutral-500">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-white">Privacy</Link>
          </div>
          <p className="font-b text-sm text-neutral-500">© 2026 VektorLabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
