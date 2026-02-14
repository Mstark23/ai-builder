'use client';

import Link from 'next/link';

function LegalNav() {
  return (
    <>
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
    </>
  );
}

function LegalFooter() {
  return (
    <footer className="py-16 bg-neutral-950 text-white">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center"><span className="text-black font-d text-xl font-semibold">V</span></div>
          <span className="font-b text-[15px] font-semibold tracking-wide">VEKTORLABS</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-neutral-500">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
        <p className="font-b text-sm text-neutral-500">© 2026 VektorLabs. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <LegalNav />

      <section className="py-24 bg-white">
        <div className="max-w-[720px] mx-auto px-8 lg:px-12">
          <span className="font-b text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">Legal</span>
          <h1 className="font-d text-4xl lg:text-5xl font-medium mt-4 mb-4 text-black">Terms of Service</h1>
          <p className="font-b text-sm text-neutral-400 mb-12">Last updated: February 2026</p>

          <div className="font-b text-neutral-600 leading-relaxed space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-black mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using VektorLabs services (&quot;Services&quot;), operated by VektorLabs (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our Services.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">2. Services Description</h2>
              <p>VektorLabs provides AI-assisted website design and development services. We build custom websites based on competitive intelligence and industry best practices. Our service includes an initial free preview of your website design. Payment is only required if you choose to proceed with the final deliverable.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">3. Free Preview Policy</h2>
              <p>We build your website preview at no cost before any payment is required. You are under no obligation to purchase or proceed after viewing the preview. If you choose not to proceed, you owe nothing. The preview remains our intellectual property until payment is completed.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">4. Pricing and Payment</h2>
              <p>Service pricing starts at $299 CAD and varies based on project scope. All prices are displayed in Canadian dollars unless otherwise stated. Payment is processed through Stripe and is due only after you approve the website design. We accept major credit cards and debit cards.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">5. Intellectual Property</h2>
              <p>Upon full payment, all rights to the custom website design and code are transferred to you. Until payment is received, all designs, code, and creative work remain the exclusive property of VektorLabs. You may not copy, reproduce, or distribute preview materials without our written consent. Our competitive intelligence methodology, King Profile™ system, and proprietary processes remain our intellectual property at all times.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">6. Client Responsibilities</h2>
              <p>You agree to provide accurate business information during the intake process. You are responsible for providing any necessary content, images, and brand assets required for your website. You agree not to use our Services for any unlawful purpose or to create websites promoting illegal activities.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">7. Revisions and Modifications</h2>
              <p>Revision policies vary by plan tier and are communicated at the time of purchase. Additional revisions beyond the included amount may incur extra charges. Major scope changes after project approval may require a separate quote.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">8. Refund Policy</h2>
              <p>Since we provide a free preview before any payment, all sales are final once payment is made and the final website is delivered. If we fail to deliver the agreed-upon website within the specified timeframe, you are entitled to a full refund.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">9. Limitation of Liability</h2>
              <p>VektorLabs shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our Services. Our total liability shall not exceed the amount paid by you for the specific service in question. We do not guarantee specific business results, traffic, or conversion rates from the websites we build.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">10. Third-Party Services</h2>
              <p>Our websites may integrate with third-party services such as hosting providers, analytics tools, and payment processors. We are not responsible for the terms, privacy practices, or availability of third-party services.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">11. Termination</h2>
              <p>We reserve the right to refuse or terminate service to anyone at our discretion. You may cancel your project at any time before final payment. No charges will be incurred for cancelled projects that have not been paid for.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">12. Governing Law</h2>
              <p>These terms are governed by the laws of the Province of Quebec, Canada. Any disputes arising from these terms shall be resolved in the courts of Quebec, Canada.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">13. Changes to Terms</h2>
              <p>We may update these terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of our Services after changes constitutes acceptance of the revised terms.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">14. Contact</h2>
              <p>For questions about these Terms of Service, contact us at <a href="mailto:hello@tryvektorlabs.com" className="text-black underline hover:no-underline">hello@tryvektorlabs.com</a>.</p>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  );
}
