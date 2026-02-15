'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type IndustryConfig = { icon: string; pre_pages: string[]; extra_pages: string[]; pre_features: string[]; extra_features: string[]; pre_addons: string[]; extra_addons: string[] };

const IC: Record<string, IndustryConfig> = {
  'restaurant': { icon: '🍽️', pre_pages: ['Home','Menu','About','Contact'], extra_pages: ['Gallery','Events','Catering','Reservations','Reviews'], pre_features: ['Online Ordering','Reservation Widget','Menu Display','Contact Form','Google Maps'], extra_features: ['Delivery Tracking','Gift Cards','Loyalty Program','Event Booking','Multi-Location'], pre_addons: ['Google Business','Custom Domain'], extra_addons: ['SEO Setup','Hosting','Food Photography','Social Media Kit','Logo Design'] },
  'beauty': { icon: '💇', pre_pages: ['Home','Services','Gallery','Contact'], extra_pages: ['About','Team','Pricing','Reviews','Blog'], pre_features: ['Online Booking','Service Menu','Contact Form','Before & After Gallery','Reviews Widget'], extra_features: ['Gift Cards','Loyalty Program','Multi-Stylist Calendar','Product Sales','Membership'], pre_addons: ['Google Business','Custom Domain'], extra_addons: ['SEO Setup','Hosting','Photo Shoot','Social Media Kit','Logo Design'] },
  'fitness': { icon: '💪', pre_pages: ['Home','Programs','Schedule','Contact'], extra_pages: ['About','Trainers','Pricing','Gallery','Blog','Membership'], pre_features: ['Class Schedule','Membership Signup','Contact Form','Trainer Profiles','Trial Booking'], extra_features: ['Online Payments','Workout Videos','Nutrition Plans','Progress Tracking','App Integration'], pre_addons: ['Google Business','Custom Domain'], extra_addons: ['SEO Setup','Hosting','Photo Shoot','Social Media Kit','Logo Design'] },
  'home-services': { icon: '🔧', pre_pages: ['Home','Services','Contact','Free Estimate'], extra_pages: ['About','Gallery','Service Areas','Reviews','FAQ','Blog'], pre_features: ['Free Estimate Form','Click-to-Call','Service Areas Map','Contact Form','Reviews Widget'], extra_features: ['Online Booking','Before & After Gallery','Emergency Service','Financing Calculator','License Display'], pre_addons: ['Google Business','Custom Domain','SEO Setup'], extra_addons: ['Hosting','Photo Shoot','Vehicle Wraps Design','Logo Design','Social Media Kit'] },
  'marine': { icon: '🛥️', pre_pages: ['Home','Services','Before & After','Free Estimate','Contact'], extra_pages: ['About','Gallery','Reviews','FAQ','Blog'], pre_features: ['Before & After Slider','Free Estimate Form','Click-to-Call','Reviews Widget','Certification Badges','Contact Form'], extra_features: ['Online Booking','Service Tracker','Product Sales','Multi-Location'], pre_addons: ['Google Business','Custom Domain','SEO Setup'], extra_addons: ['Hosting','Photo Shoot','Logo Design','Social Media Kit'] },
  'real-estate': { icon: '🏠', pre_pages: ['Home','Properties','About','Contact'], extra_pages: ['Sellers','Buyers','Blog','Neighborhoods','Reviews','Resources'], pre_features: ['Property Listings','Search & Filter','Contact Form','Virtual Tours','Lead Capture'], extra_features: ['Mortgage Calculator','CRM Integration','MLS Feed','Agent Profiles','Market Reports'], pre_addons: ['Custom Domain','SEO Setup'], extra_addons: ['Google Business','Hosting','Drone Photography','Logo Design','Social Media Kit'] },
  'ecommerce': { icon: '🛍️', pre_pages: ['Home','Shop','About','Contact'], extra_pages: ['FAQ','Blog','Size Guide','Lookbook','Reviews'], pre_features: ['Product Catalog','Shopping Cart','Secure Checkout','Order Tracking','Contact Form'], extra_features: ['Wishlist','Reviews & Ratings','Discount Codes','Inventory Management','Email Marketing'], pre_addons: ['Custom Domain','Hosting','SEO Setup'], extra_addons: ['Google Business','Product Photography','Logo Design','Social Media Kit','Email Setup'] },
  'medical': { icon: '🏥', pre_pages: ['Home','Services','About','Contact'], extra_pages: ['Team','Patient Resources','FAQ','Insurance','Blog','Reviews'], pre_features: ['Appointment Booking','Contact Form','Provider Profiles','Insurance List','Patient Portal Link'], extra_features: ['Telehealth Integration','Forms Download','Multi-Location','HIPAA Compliance Badge','Reviews Widget'], pre_addons: ['Custom Domain','SEO Setup'], extra_addons: ['Google Business','Hosting','Logo Design','Photo Shoot','Social Media Kit'] },
  'legal': { icon: '⚖️', pre_pages: ['Home','Practice Areas','About','Contact'], extra_pages: ['Team','Case Results','Blog','FAQ','Reviews','Resources'], pre_features: ['Free Consultation Form','Click-to-Call','Contact Form','Practice Area Pages','Attorney Profiles'], extra_features: ['Client Portal','Case Results Display','Live Chat','Intake Forms','Reviews Widget'], pre_addons: ['Custom Domain','SEO Setup'], extra_addons: ['Google Business','Hosting','Logo Design','Photo Shoot','Social Media Kit'] },
  'education': { icon: '📚', pre_pages: ['Home','Programs','About','Contact'], extra_pages: ['Faculty','Admissions','Gallery','Blog','FAQ','Events'], pre_features: ['Program Listings','Enrollment Form','Contact Form','Calendar','Faculty Profiles'], extra_features: ['Online Courses','Student Portal','Payment Integration','Testimonials','Newsletter Signup'], pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup','Google Business','Hosting','Logo Design','Photo Shoot'] },
  'creative': { icon: '🎨', pre_pages: ['Home','Portfolio','About','Contact'], extra_pages: ['Services','Blog','Testimonials','Press','Shop'], pre_features: ['Portfolio Gallery','Lightbox Display','Contact Form','Social Links','Bio Section'], extra_features: ['Client Portal','Booking Calendar','Print Shop','Video Reel','Newsletter'], pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup','Hosting','Logo Design','Social Media Kit'] },
  'construction': { icon: '🏗️', pre_pages: ['Home','Services','Projects','Contact'], extra_pages: ['About','Team','Reviews','FAQ','Blog','Careers'], pre_features: ['Project Gallery','Free Quote Form','Click-to-Call','Service Areas','Contact Form'], extra_features: ['Before & After','License Display','Financing Info','Video Tours','Reviews Widget'], pre_addons: ['Google Business','Custom Domain','SEO Setup'], extra_addons: ['Hosting','Drone Photography','Logo Design','Social Media Kit'] },
  'tech': { icon: '💻', pre_pages: ['Home','Features','Pricing','Contact'], extra_pages: ['About','Blog','Docs','Careers','Case Studies','Integrations'], pre_features: ['Feature Showcase','Pricing Table','Contact Form','Demo Request','Newsletter'], extra_features: ['Live Chat','Knowledge Base','API Docs','Status Page','Changelog'], pre_addons: ['Custom Domain','Hosting'], extra_addons: ['SEO Setup','Google Analytics','Logo Design','Social Media Kit'] },
  'events': { icon: '🎉', pre_pages: ['Home','Services','Gallery','Contact'], extra_pages: ['About','Pricing','Reviews','Blog','FAQ'], pre_features: ['Event Gallery','Quote Request','Contact Form','Calendar','Package Display'], extra_features: ['Online Booking','Payment Integration','Vendor List','Virtual Tours','Reviews Widget'], pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup','Google Business','Hosting','Photo Shoot','Logo Design'] },
  'nonprofit': { icon: '💚', pre_pages: ['Home','Mission','Programs','Contact'], extra_pages: ['Team','Events','Blog','Gallery','Volunteer','Impact'], pre_features: ['Donation Button','Volunteer Signup','Contact Form','Newsletter','Impact Counter'], extra_features: ['Event Calendar','Member Portal','Annual Report','Fundraising Tracker','Social Feed'], pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup','Google Business','Hosting','Logo Design','Email Setup'] },
  'automotive': { icon: '🚗', pre_pages: ['Home','Services','Gallery','Contact'], extra_pages: ['About','Pricing','Reviews','FAQ','Blog','Specials'], pre_features: ['Service Menu','Appointment Booking','Click-to-Call','Contact Form','Reviews Widget'], extra_features: ['Before & After','Price Estimator','Multi-Location','Loyalty Program','Gift Cards'], pre_addons: ['Google Business','Custom Domain'], extra_addons: ['SEO Setup','Hosting','Photo Shoot','Logo Design','Social Media Kit'] },
  'pet': { icon: '🐾', pre_pages: ['Home','Services','About','Contact'], extra_pages: ['Gallery','Team','Pricing','Reviews','Blog','FAQ'], pre_features: ['Online Booking','Service Menu','Contact Form','Gallery','Reviews Widget'], extra_features: ['Pet Portal','Vaccination Records','Loyalty Program','Product Sales','Live Cam'], pre_addons: ['Google Business','Custom Domain'], extra_addons: ['SEO Setup','Hosting','Photo Shoot','Logo Design','Social Media Kit'] },
};

const DC: IndustryConfig = { icon: '🌐', pre_pages: ['Home','About','Services','Contact'], extra_pages: ['Gallery','Blog','FAQ','Reviews','Pricing'], pre_features: ['Contact Form','Click-to-Call','Google Maps','Social Links'], extra_features: ['Online Booking','Reviews Widget','Newsletter','Live Chat','Search'], pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup','Google Business','Hosting','Logo Design','Social Media Kit'] };
const TIMELINES = ['ASAP (Rush)','1–2 Weeks','2–4 Weeks','1–2 Months','No Rush'];

export default function NeedsFormPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { if (projectId) loadProject(); }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/preview/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.project;
        setProject(p);
        if (p.email) setEmail(p.email);
        const ind = detectInd(p.industry || '');
        const c = IC[ind] || DC;
        setSelectedPages([...c.pre_pages]);
        setSelectedFeatures([...c.pre_features]);
        setSelectedAddons([...c.pre_addons]);
        if (p.metadata?.client_needs) {
          setSelectedPages(p.metadata.client_needs.pages || c.pre_pages);
          setSelectedFeatures(p.metadata.client_needs.features || c.pre_features);
          setSelectedAddons(p.metadata.client_needs.addons || c.pre_addons);
          setTimeline(p.metadata.client_needs.timeline || '');
        }
      }
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  const detectInd = (industry: string): string => {
    const l = industry.toLowerCase();
    if (l.includes('restaurant') || l.includes('food') || l.includes('cafe') || l.includes('bar')) return 'restaurant';
    if (l.includes('beauty') || l.includes('salon') || l.includes('nail') || l.includes('hair') || l.includes('spa') || l.includes('barber')) return 'beauty';
    if (l.includes('fitness') || l.includes('gym') || l.includes('yoga') || l.includes('personal train')) return 'fitness';
    if (l.includes('plumb') || l.includes('hvac') || l.includes('electric') || l.includes('clean') || l.includes('landscap') || l.includes('home service') || l.includes('local service') || l.includes('handyman') || l.includes('roofing') || l.includes('pest')) return 'home-services';
    if (l.includes('marine') || l.includes('boat') || l.includes('gelcoat')) return 'marine';
    if (l.includes('real estate') || l.includes('property') || l.includes('realtor') || l.includes('cash home')) return 'real-estate';
    if (l.includes('ecommerce') || l.includes('e-commerce') || l.includes('shop') || l.includes('retail') || l.includes('store') || l.includes('jewel')) return 'ecommerce';
    if (l.includes('medical') || l.includes('dental') || l.includes('doctor') || l.includes('health') || l.includes('clinic') || l.includes('therap')) return 'medical';
    if (l.includes('legal') || l.includes('law') || l.includes('attorney') || l.includes('lawyer')) return 'legal';
    if (l.includes('edu') || l.includes('school') || l.includes('tutor') || l.includes('academ')) return 'education';
    if (l.includes('creative') || l.includes('portfolio') || l.includes('photo') || l.includes('design') || l.includes('art') || l.includes('animation') || l.includes('film')) return 'creative';
    if (l.includes('construct') || l.includes('reno') || l.includes('contractor') || l.includes('build')) return 'construction';
    if (l.includes('tech') || l.includes('saas') || l.includes('software') || l.includes('startup') || l.includes('app') || l.includes('it ')) return 'tech';
    if (l.includes('event') || l.includes('wedding') || l.includes('catering') || l.includes('party')) return 'events';
    if (l.includes('nonprofit') || l.includes('non-profit') || l.includes('charity') || l.includes('foundation')) return 'nonprofit';
    if (l.includes('auto') || l.includes('car') || l.includes('detailing') || l.includes('mechanic') || l.includes('tire') || l.includes('body shop')) return 'automotive';
    if (l.includes('pet') || l.includes('vet') || l.includes('groom') || l.includes('kennel') || l.includes('dog') || l.includes('cat')) return 'pet';
    return '';
  };

  const toggle = (list: string[], set: (v: string[]) => void, item: string) => set(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const pwStr = () => { let s = 0; if (password.length >= 6) s++; if (password.length >= 8) s++; if (/[A-Z]/.test(password)) s++; if (/[0-9!@#$%^&*]/.test(password)) s++; return s; };

  const handleAccountNext = () => {
    setError('');
    if (!email.trim() || !email.includes('@')) { setError('Enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setStep(2); window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      // Try signup first
      let userId: string | undefined;
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) {
        // If user already exists, try signing in instead
        if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already been registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) { setError('Account exists but password is wrong. Try signing in or reset your password.'); setSubmitting(false); return; }
          userId = signInData.user?.id;
        } else {
          setError(authError.message); setSubmitting(false); return;
        }
      } else {
        userId = authData.user?.id;
      }
      
      if (!userId) { setError('Account creation failed'); setSubmitting(false); return; }

      await supabase.from('customers').upsert({ id: userId, email: email.toLowerCase().trim(), name: project?.business_name || email.split('@')[0], source: 'needs_form' }, { onConflict: 'email' });
      await fetch('/api/preview/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: projectId, customer_id: userId }) });
      await fetch('/api/needs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, pages: selectedPages, features: selectedFeatures, addons: selectedAddons, timeline, notes }) });
      // Make sure we're signed in
      await supabase.auth.signInWithPassword({ email, password });
      router.push(`/portal/project/${projectId}/checkout`);
    } catch (err: any) { setError(err.message || 'Something went wrong'); setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .fd{font-family:'Playfair Display',serif} .fb{font-family:'Inter',sans-serif}`}</style>
      <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .fd{font-family:'Playfair Display',serif} .fb{font-family:'Inter',sans-serif}`}</style>
      <div className="bg-white rounded-3xl border border-neutral-200 p-12 max-w-md text-center shadow-sm">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="fd text-2xl font-medium text-black mb-2">Project Not Found</h1>
        <p className="fb text-neutral-500">This link may be invalid or expired.</p>
      </div>
    </div>
  );

  const ind = detectInd(project?.industry || '');
  const config = IC[ind] || DC;
  const allPages = Array.from(new Set([...config.pre_pages, ...config.extra_pages]));
  const allFeatures = Array.from(new Set([...config.pre_features, ...config.extra_features]));
  const allAddons = Array.from(new Set([...config.pre_addons, ...config.extra_addons]));
  const strength = pwStr();
  const sColors = ['bg-neutral-200','bg-red-500','bg-orange-500','bg-emerald-400','bg-emerald-500'];

  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${selected ? 'bg-black text-white border-black shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}>
      {selected && <span className="mr-1.5">✓</span>}{label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .fd{font-family:'Playfair Display',serif} .fb{font-family:'Inter',sans-serif}`}</style>

      <div className="sticky top-0 z-50 bg-black text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><span className="text-black fd font-semibold text-sm">V</span></div>
          <span className="fb text-sm text-white/60">{step === 1 ? 'Create your account' : 'Tell us what you need'} for <strong className="text-white">{project?.business_name}</strong></span>
        </div>
        <div className="fb text-xs text-white/40">Step {step} of 2</div>
      </div>

      {step === 1 && (
        <div className="max-w-md mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white fd text-xl font-semibold">V</span></div>
            <h1 className="fd text-3xl font-medium text-black mb-2">Create Your Account</h1>
            <p className="fb text-neutral-500">Your email is already linked to <strong className="text-black">{project?.business_name}</strong></p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
            <div>
              <label className="fb text-sm font-medium text-black block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-neutral-200 rounded-xl fb text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-neutral-50" placeholder="your@email.com" />
              {project?.email && email === project.email && <p className="fb text-xs text-emerald-600 mt-1 flex items-center gap-1"><span>✓</span> Pre-filled from your request</p>}
            </div>
            <div>
              <label className="fb text-sm font-medium text-black block mb-1.5">Create Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-neutral-200 rounded-xl fb text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-12" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 fb text-xs text-neutral-400 hover:text-black">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              {password.length > 0 && <div className="flex gap-1 mt-2">{[0,1,2,3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < strength ? sColors[strength] : 'bg-neutral-200'}`} />)}</div>}
            </div>
            <div>
              <label className="fb text-sm font-medium text-black block mb-1.5">Confirm Password</label>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-neutral-200 rounded-xl fb text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" placeholder="Re-enter password" />
              {confirmPassword && password && confirmPassword === password && <p className="fb text-xs text-emerald-600 mt-1 flex items-center gap-1"><span>✓</span> Passwords match</p>}
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="fb text-sm text-red-700">{error}</p></div>}
            <button onClick={handleAccountNext} className="w-full py-3.5 bg-black text-white fb text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-black/20 transition-all">Continue to Project Needs →</button>
            <p className="fb text-xs text-neutral-400 text-center">Already have an account? <a href="/login" className="text-black font-medium hover:underline">Sign in</a></p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <div className="text-4xl mb-3">{config.icon}</div>
            <h1 className="fd text-3xl lg:text-4xl font-medium text-black mb-2">What Do You Need?</h1>
            <p className="fb text-neutral-500">We&apos;ve pre-selected the essentials for your industry. Add or remove anything.</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4"><h2 className="fb font-semibold text-black">Pages</h2><span className="fb text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedPages.length} selected</span></div>
            <div className="flex flex-wrap gap-2">{allPages.map(p => <Chip key={p} label={p} selected={selectedPages.includes(p)} onClick={() => toggle(selectedPages, setSelectedPages, p)} />)}</div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4"><h2 className="fb font-semibold text-black">Features</h2><span className="fb text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedFeatures.length} selected</span></div>
            <div className="flex flex-wrap gap-2">{allFeatures.map(f => <Chip key={f} label={f} selected={selectedFeatures.includes(f)} onClick={() => toggle(selectedFeatures, setSelectedFeatures, f)} />)}</div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4"><h2 className="fb font-semibold text-black">Add-ons</h2><span className="fb text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedAddons.length} selected</span></div>
            <div className="flex flex-wrap gap-2">{allAddons.map(a => <Chip key={a} label={a} selected={selectedAddons.includes(a)} onClick={() => toggle(selectedAddons, setSelectedAddons, a)} />)}</div>
          </div>

          <div className="mb-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="fb font-semibold text-black mb-4">Timeline</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{TIMELINES.map(t => <button key={t} onClick={() => setTimeline(t)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${timeline === t ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}>{timeline === t && '✓ '}{t}</button>)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
            <h2 className="fb font-semibold text-black mb-3">Anything Else?</h2>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border border-neutral-200 rounded-xl fb text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black" rows={3} placeholder="References, brand colors, competitors you admire..." />
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4"><p className="fb text-sm text-red-700">{error}</p></div>}

          <div className="flex items-center gap-3">
            <button onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="px-6 py-3.5 border border-neutral-200 text-neutral-600 fb text-sm font-medium rounded-xl hover:border-black hover:text-black transition-all">← Back</button>
            <button onClick={handleFinalSubmit} disabled={submitting || selectedPages.length === 0} className="flex-1 py-3.5 bg-black text-white fb text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-black/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account &amp; saving...</> : <>Create Account &amp; Continue to Invoice →</>}
            </button>
          </div>

          <div className="mt-6 p-4 bg-neutral-100 rounded-xl">
            <div className="flex items-center justify-between fb text-sm">
              <span className="text-neutral-500">{selectedPages.length} pages · {selectedFeatures.length} features · {selectedAddons.length} add-ons{timeline && ` · ${timeline}`}</span>
              <span className="font-medium text-black">{project?.business_name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
