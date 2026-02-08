'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ============================================
// TYPES
// ============================================
type Platform = 'shopify' | 'wordpress' | 'squarespace' | 'wix' | 'webflow' | 'custom' | '';

type PlatformCredentials = {
  shopify_store_url?: string;
  shopify_collaborator_email?: string;
  wp_admin_url?: string;
  wp_username?: string;
  wp_password?: string;
  wp_hosting_provider?: string;
  squarespace_email?: string;
  squarespace_password?: string;
  squarespace_site_url?: string;
  wix_email?: string;
  wix_password?: string;
  wix_site_url?: string;
  webflow_email?: string;
  webflow_site_url?: string;
  notes?: string;
};

type SetupData = {
  // Platform
  platform: Platform;
  platformCredentials: PlatformCredentials;
  
  // Logo
  logoUrl: string;
  
  // Images
  images: { id: string; url: string; name: string }[];
  
  // Business
  businessName: string;
  tagline: string;
  description: string;
  
  // Contact
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  website: string;
  
  // Content
  aboutUs: string;
  services: string;
  whyChooseUs: string;
  testimonials: string;
  callToAction: string;
  additionalNotes: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
};

const initialSetupData: SetupData = {
  platform: '',
  platformCredentials: {},
  logoUrl: '',
  images: [],
  businessName: '',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  website: '',
  aboutUs: '',
  services: '',
  whyChooseUs: '',
  testimonials: '',
  callToAction: '',
  additionalNotes: '',
  primaryColor: '#000000',
  secondaryColor: '#4F46E5',
};

// ============================================
// PLATFORMS CONFIG
// ============================================
const platforms = [
  { 
    id: 'shopify', 
    name: 'Shopify', 
    icon: '🛒', 
    color: 'bg-[#96bf48]',
    description: 'Best for e-commerce stores',
  },
  { 
    id: 'wordpress', 
    name: 'WordPress', 
    icon: '📝', 
    color: 'bg-[#21759b]',
    description: 'Most flexible option',
  },
  { 
    id: 'squarespace', 
    name: 'Squarespace', 
    icon: '⬛', 
    color: 'bg-black',
    description: 'Beautiful templates',
  },
  { 
    id: 'wix', 
    name: 'Wix', 
    icon: '✨', 
    color: 'bg-[#0C6EFC]',
    description: 'Easy to manage',
  },
  { 
    id: 'webflow', 
    name: 'Webflow', 
    icon: '🎨', 
    color: 'bg-[#4353FF]',
    description: 'Advanced design control',
  },
  { 
    id: 'custom', 
    name: 'Host it for me', 
    icon: '🌐', 
    color: 'bg-emerald-500',
    description: 'We handle everything',
    recommended: true,
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function PostPaymentSetupWizard() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>(initialSetupData);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', icon: '🎉' },
    { id: 'platform', title: 'Platform', icon: '🔗' },
    { id: 'logo', title: 'Logo', icon: '🖼️' },
    { id: 'images', title: 'Images', icon: '📸' },
    { id: 'business', title: 'Business', icon: '🏢' },
    { id: 'contact', title: 'Contact', icon: '📞' },
    { id: 'social', title: 'Social', icon: '📱' },
    { id: 'content', title: 'Content', icon: '📝' },
    { id: 'review', title: 'Review', icon: '✅' },
  ];

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!projectData) {
        router.push('/portal');
        return;
      }

      // Check if project is paid
      if (!projectData.paid) {
        router.push(`/portal/project/${projectId}`);
        return;
      }

      setProject(projectData);

      // Load existing setup data
      if (projectData.setup_data) {
        setSetupData(prev => ({ ...prev, ...projectData.setup_data }));
      }

      // Pre-fill from project
      setSetupData(prev => ({
        ...prev,
        businessName: projectData.business_name || prev.businessName,
        email: projectData.contact_email || prev.email,
        phone: projectData.contact_phone || prev.phone,
        description: projectData.description || prev.description,
        platform: projectData.platform || prev.platform,
        platformCredentials: projectData.platform_credentials || prev.platformCredentials,
        logoUrl: projectData.logo_url || prev.logoUrl,
        images: projectData.images || prev.images,
      }));

      // If setup already completed, go to review
      if (projectData.setup_completed) {
        setCurrentStep(steps.length - 1);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetup = (field: keyof SetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
  };

  const updateCredential = (key: string, value: string) => {
    setSetupData(prev => ({
      ...prev,
      platformCredentials: { ...prev.platformCredentials, [key]: value }
    }));
  };

  const saveProgress = async () => {
    try {
      await supabase
        .from('projects')
        .update({
          setup_data: setupData,
          platform: setupData.platform,
          platform_credentials: setupData.platformCredentials,
          logo_url: setupData.logoUrl,
          images: setupData.images,
          business_name: setupData.businessName,
          contact_email: setupData.email,
          contact_phone: setupData.phone,
        })
        .eq('id', projectId);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const nextStep = async () => {
    await saveProgress();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/logo-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('project-assets')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('project-assets')
        .getPublicUrl(fileName);

      updateSetup('logoUrl', urlData.publicUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const newImages: { id: string; url: string; name: string }[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/images/${Date.now()}-${i}.${fileExt}`;

        const { error } = await supabase.storage
          .from('project-assets')
          .upload(fileName, file);

        if (error) continue;

        const { data: urlData } = supabase.storage
          .from('project-assets')
          .getPublicUrl(fileName);

        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url: urlData.publicUrl,
          name: file.name,
        });
      }

      updateSetup('images', [...setupData.images, ...newImages]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (imageId: string) => {
    updateSetup('images', setupData.images.filter(img => img.id !== imageId));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await supabase
        .from('projects')
        .update({
          setup_data: setupData,
          setup_completed: true,
          status: 'BUILDING',
          platform: setupData.platform,
          platform_credentials: setupData.platformCredentials,
          logo_url: setupData.logoUrl,
          images: setupData.images,
          business_name: setupData.businessName,
          contact_email: setupData.email,
          contact_phone: setupData.phone,
        })
        .eq('id', projectId);

      const platformName = platforms.find(p => p.id === setupData.platform)?.name || setupData.platform;
      await supabase.from('messages').insert({
        project_id: projectId,
        content: `✅ Customer has completed the setup wizard and submitted all content.\n\n📋 Platform: ${platformName}\n${setupData.platform !== 'custom' ? '🔑 Credentials submitted — check project details to view.\n' : '🌐 Customer chose "Host it for me" — no credentials needed.\n'}\nReady to build!`,
        sender_type: 'system',
        read: false,
      });

      router.push(`/portal/project/${projectId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome': return true;
      case 'platform': return !!setupData.platform;
      case 'logo': return true; // Optional
      case 'images': return true; // Optional
      case 'business': return !!setupData.businessName;
      case 'contact': return !!setupData.email;
      case 'social': return true; // Optional
      case 'content': return true; // Optional
      case 'review': return true;
      default: return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href={`/portal/project/${projectId}`} className="flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Exit Setup</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-display text-sm font-semibold">V</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-neutral-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="font-body text-sm font-medium text-black">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Step Labels */}
          <div className="hidden sm:flex justify-between mt-3">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => idx <= currentStep && setCurrentStep(idx)}
                disabled={idx > currentStep}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  idx <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <span className={`text-lg ${idx === currentStep ? 'scale-125' : ''} transition-transform`}>
                  {step.icon}
                </span>
                <span className={`font-body text-xs ${idx === currentStep ? 'text-black font-medium' : 'text-neutral-400'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {/* ============================================ */}
        {/* STEP 0: WELCOME */}
        {/* ============================================ */}
        {currentStep === 0 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="font-display text-4xl font-medium text-black mb-4">
              Congratulations!
            </h1>
            <p className="font-body text-lg text-neutral-500 mb-8 max-w-md mx-auto">
              Thank you for your purchase! Let's set up your website. This will only take a few minutes.
            </p>
            
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8 text-left">
              <h2 className="font-body font-semibold text-black mb-4">What we'll need from you:</h2>
              <ul className="space-y-3">
                {[
                  { icon: '🔗', text: 'Choose your hosting platform' },
                  { icon: '🖼️', text: 'Your logo (if you have one)' },
                  { icon: '📸', text: 'Photos for your website' },
                  { icon: '📝', text: 'Business information & content' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-body text-neutral-600">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <p className="font-body text-sm text-blue-700">
                💡 <strong>Tip:</strong> You can save and continue later. Your progress is automatically saved.
              </p>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 1: PLATFORM */}
        {/* ============================================ */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Where should we build your site?
              </h1>
              <p className="font-body text-neutral-500">
                Choose your preferred platform
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => updateSetup('platform', platform.id as Platform)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    setupData.platform === platform.id
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  {platform.recommended && (
                    <span className={`absolute -top-2 right-4 px-2 py-0.5 text-xs font-body font-medium rounded-full ${
                      setupData.platform === platform.id ? 'bg-white text-black' : 'bg-emerald-500 text-white'
                    }`}>
                      Recommended
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center text-xl ${
                      setupData.platform === platform.id ? 'opacity-90' : ''
                    }`}>
                      {platform.icon}
                    </div>
                    <span className="font-body font-semibold">{platform.name}</span>
                  </div>
                  <p className={`font-body text-sm ${
                    setupData.platform === platform.id ? 'text-white/70' : 'text-neutral-500'
                  }`}>
                    {platform.description}
                  </p>
                  
                  {setupData.platform === platform.id && (
                    <div className="absolute top-4 right-4">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {setupData.platform && setupData.platform !== 'custom' && (
              <div className="mt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                  <p className="font-body text-sm text-blue-800">
                    <strong>🔒 Your credentials are encrypted</strong> and only used by our team to deploy your website. We never share or store them after delivery.
                  </p>
                </div>

                {/* SHOPIFY */}
                {setupData.platform === 'shopify' && (
                  <div className="space-y-4">
                    <h3 className="font-body font-semibold text-black">Shopify Access</h3>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Store URL *</label>
                      <div className="flex items-center">
                        <input type="text" placeholder="your-store" value={setupData.platformCredentials.shopify_store_url || ''} onChange={(e) => updateCredential('shopify_store_url', e.target.value)} className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-l-xl font-body text-sm focus:outline-none focus:border-black" />
                        <span className="px-4 py-3 bg-neutral-100 border border-l-0 border-neutral-200 rounded-r-xl font-body text-sm text-neutral-500">.myshopify.com</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Staff Account Email</label>
                      <input type="email" placeholder="The email you'll use to invite us as a collaborator" value={setupData.platformCredentials.shopify_collaborator_email || ''} onChange={(e) => updateCredential('shopify_collaborator_email', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm text-amber-800 font-medium mb-2">How to give us access:</p>
                      <ol className="font-body text-sm text-amber-700 space-y-1 list-decimal list-inside">
                        <li>Go to your Shopify Admin → Settings → Users and permissions</li>
                        <li>Click &quot;Add staff&quot; or &quot;Send collaborator request&quot;</li>
                        <li>Invite <strong>deploy@verktorlabs.com</strong> with &quot;Themes&quot; access</li>
                        <li>We&apos;ll accept the invite and deploy your new theme</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* WORDPRESS */}
                {setupData.platform === 'wordpress' && (
                  <div className="space-y-4">
                    <h3 className="font-body font-semibold text-black">WordPress Access</h3>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">WordPress Admin URL *</label>
                      <input type="url" placeholder="https://yoursite.com/wp-admin" value={setupData.platformCredentials.wp_admin_url || ''} onChange={(e) => updateCredential('wp_admin_url', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-sm font-medium text-black mb-2">Admin Username *</label>
                        <input type="text" placeholder="admin" value={setupData.platformCredentials.wp_username || ''} onChange={(e) => updateCredential('wp_username', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                      </div>
                      <div>
                        <label className="block font-body text-sm font-medium text-black mb-2">Admin Password *</label>
                        <input type="password" placeholder="••••••••" value={setupData.platformCredentials.wp_password || ''} onChange={(e) => updateCredential('wp_password', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Hosting Provider</label>
                      <select value={setupData.platformCredentials.wp_hosting_provider || ''} onChange={(e) => updateCredential('wp_hosting_provider', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black">
                        <option value="">Select hosting provider</option>
                        <option value="bluehost">Bluehost</option>
                        <option value="siteground">SiteGround</option>
                        <option value="godaddy">GoDaddy</option>
                        <option value="hostinger">Hostinger</option>
                        <option value="namecheap">Namecheap</option>
                        <option value="wpengine">WP Engine</option>
                        <option value="cloudways">Cloudways</option>
                        <option value="other">Other</option>
                        <option value="unknown">I&apos;m not sure</option>
                      </select>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm text-amber-800"><strong>Tip:</strong> Create a temporary admin account for us instead of sharing your main credentials. You can delete it after we&apos;re done.</p>
                    </div>
                  </div>
                )}

                {/* SQUARESPACE */}
                {setupData.platform === 'squarespace' && (
                  <div className="space-y-4">
                    <h3 className="font-body font-semibold text-black">Squarespace Access</h3>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Site URL *</label>
                      <input type="url" placeholder="https://yoursite.squarespace.com" value={setupData.platformCredentials.squarespace_site_url || ''} onChange={(e) => updateCredential('squarespace_site_url', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Account Email *</label>
                      <input type="email" placeholder="your@email.com" value={setupData.platformCredentials.squarespace_email || ''} onChange={(e) => updateCredential('squarespace_email', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Account Password *</label>
                      <input type="password" placeholder="••••••••" value={setupData.platformCredentials.squarespace_password || ''} onChange={(e) => updateCredential('squarespace_password', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm text-amber-800"><strong>Alternative:</strong> You can invite us as a contributor instead. Go to Settings → Permissions → Invite Contributor and add <strong>deploy@verktorlabs.com</strong>.</p>
                    </div>
                  </div>
                )}

                {/* WIX */}
                {setupData.platform === 'wix' && (
                  <div className="space-y-4">
                    <h3 className="font-body font-semibold text-black">Wix Access</h3>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Wix Site URL *</label>
                      <input type="url" placeholder="https://yoursite.wixsite.com/mysite" value={setupData.platformCredentials.wix_site_url || ''} onChange={(e) => updateCredential('wix_site_url', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Wix Account Email *</label>
                      <input type="email" placeholder="your@email.com" value={setupData.platformCredentials.wix_email || ''} onChange={(e) => updateCredential('wix_email', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Wix Password *</label>
                      <input type="password" placeholder="••••••••" value={setupData.platformCredentials.wix_password || ''} onChange={(e) => updateCredential('wix_password', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm text-amber-800"><strong>Alternative:</strong> Add us as a Site Collaborator. Go to Dashboard → Settings → Roles & Permissions → Invite People and add <strong>deploy@verktorlabs.com</strong> as Admin.</p>
                    </div>
                  </div>
                )}

                {/* WEBFLOW */}
                {setupData.platform === 'webflow' && (
                  <div className="space-y-4">
                    <h3 className="font-body font-semibold text-black">Webflow Access</h3>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Webflow Site URL</label>
                      <input type="url" placeholder="https://yoursite.webflow.io" value={setupData.platformCredentials.webflow_site_url || ''} onChange={(e) => updateCredential('webflow_site_url', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-black mb-2">Webflow Account Email *</label>
                      <input type="email" placeholder="your@email.com" value={setupData.platformCredentials.webflow_email || ''} onChange={(e) => updateCredential('webflow_email', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm text-amber-800"><strong>How to invite us:</strong> Go to Workspace Settings → Members → Invite and add <strong>deploy@verktorlabs.com</strong> with &quot;Can Design&quot; permissions.</p>
                    </div>
                  </div>
                )}

                {/* NOTES */}
                <div className="mt-4">
                  <label className="block font-body text-sm font-medium text-black mb-2">Additional Notes (optional)</label>
                  <textarea placeholder="Any special instructions about accessing your platform..." value={setupData.platformCredentials.notes || ''} onChange={(e) => updateCredential('notes', e.target.value)} rows={3} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none" />
                </div>
              </div>
            )}

            {setupData.platform === 'custom' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="font-body text-sm text-emerald-800">
                  <strong>Great choice!</strong> We'll handle hosting, security, and maintenance. Your site will be fast and secure on our servers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 2: LOGO */}
        {/* ============================================ */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Upload your logo
              </h1>
              <p className="font-body text-neutral-500">
                PNG with transparent background works best
              </p>
            </div>

            {setupData.logoUrl ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                <div className="w-40 h-40 mx-auto mb-6 bg-neutral-100 rounded-2xl flex items-center justify-center p-4">
                  <img src={setupData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="font-body text-sm text-emerald-600 mb-4">✓ Logo uploaded successfully</p>
                <label className="inline-block px-4 py-2 bg-neutral-100 text-neutral-700 font-body text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer">
                  Replace Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="block bg-white rounded-2xl border-2 border-dashed border-neutral-300 p-12 text-center cursor-pointer hover:border-black hover:bg-neutral-50 transition-all">
                {uploadingLogo ? (
                  <>
                    <div className="w-12 h-12 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-body text-neutral-500">Uploading...</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-body font-medium text-black mb-1">Click to upload logo</p>
                    <p className="font-body text-sm text-neutral-500">PNG, JPG, or SVG (max 5MB)</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
            )}

            <div className="mt-6 p-4 bg-neutral-100 rounded-xl">
              <p className="font-body text-sm text-neutral-600">
                <strong>Don't have a logo?</strong> No problem! You can skip this step. We'll use your business name as a text logo, or you can add a logo later.
              </p>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 3: IMAGES */}
        {/* ============================================ */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Add your photos
              </h1>
              <p className="font-body text-neutral-500">
                Upload images for your website (products, team, location, etc.)
              </p>
            </div>

            {/* Uploaded Images */}
            {setupData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {setupData.images.map(image => (
                  <div key={image.id} className="relative aspect-square group">
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-xl" />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            <label className="block bg-white rounded-2xl border-2 border-dashed border-neutral-300 p-8 text-center cursor-pointer hover:border-black hover:bg-neutral-50 transition-all">
              {uploadingImages ? (
                <>
                  <div className="w-12 h-12 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-body text-neutral-500">Uploading images...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="font-body font-medium text-black mb-1">
                    {setupData.images.length > 0 ? 'Add more images' : 'Click to upload images'}
                  </p>
                  <p className="font-body text-sm text-neutral-500">Select multiple files at once</p>
                </>
              )}
              <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" disabled={uploadingImages} />
            </label>

            <p className="font-body text-xs text-neutral-400 mt-4 text-center">
              💡 High-quality images (1920x1080 or larger) work best
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 4: BUSINESS INFO */}
        {/* ============================================ */}
        {currentStep === 4 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Business Information
              </h1>
              <p className="font-body text-neutral-500">
                Tell us about your business
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={setupData.businessName}
                  onChange={(e) => updateSetup('businessName', e.target.value)}
                  placeholder="Your Business Name"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={setupData.tagline}
                  onChange={(e) => updateSetup('tagline', e.target.value)}
                  placeholder="e.g., Quality You Can Trust"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Business Description
                </label>
                <textarea
                  value={setupData.description}
                  onChange={(e) => updateSetup('description', e.target.value)}
                  placeholder="What does your business do? What makes you special?"
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={setupData.primaryColor}
                      onChange={(e) => updateSetup('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-neutral-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={setupData.primaryColor}
                      onChange={(e) => updateSetup('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-body text-sm uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={setupData.secondaryColor}
                      onChange={(e) => updateSetup('secondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-neutral-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={setupData.secondaryColor}
                      onChange={(e) => updateSetup('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-body text-sm uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 5: CONTACT INFO */}
        {/* ============================================ */}
        {currentStep === 5 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Contact Information
              </h1>
              <p className="font-body text-neutral-500">
                This will appear on your website
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={setupData.email}
                    onChange={(e) => updateSetup('email', e.target.value)}
                    placeholder="contact@yourbusiness.com"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={setupData.phone}
                    onChange={(e) => updateSetup('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={setupData.address}
                  onChange={(e) => updateSetup('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={setupData.city}
                    onChange={(e) => updateSetup('city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={setupData.state}
                    onChange={(e) => updateSetup('state', e.target.value)}
                    placeholder="NY"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={setupData.zip}
                    onChange={(e) => updateSetup('zip', e.target.value)}
                    placeholder="10001"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Existing Website (if any)
                </label>
                <input
                  type="url"
                  value={setupData.website}
                  onChange={(e) => updateSetup('website', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 6: SOCIAL MEDIA */}
        {/* ============================================ */}
        {currentStep === 6 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Social Media
              </h1>
              <p className="font-body text-neutral-500">
                We'll add links to your website (all optional)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              {[
                { key: 'facebook', icon: '📘', label: 'Facebook', placeholder: 'https://facebook.com/yourbusiness' },
                { key: 'instagram', icon: '📸', label: 'Instagram', placeholder: 'https://instagram.com/yourbusiness' },
                { key: 'twitter', icon: '🐦', label: 'Twitter / X', placeholder: 'https://twitter.com/yourbusiness' },
                { key: 'linkedin', icon: '💼', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbusiness' },
                { key: 'youtube', icon: '▶️', label: 'YouTube', placeholder: 'https://youtube.com/@yourbusiness' },
                { key: 'tiktok', icon: '🎵', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbusiness' },
              ].map(social => (
                <div key={social.key}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    <span className="flex items-center gap-2">
                      {social.icon} {social.label}
                    </span>
                  </label>
                  <input
                    type="url"
                    value={setupData[social.key as keyof SetupData] as string}
                    onChange={(e) => updateSetup(social.key as keyof SetupData, e.target.value)}
                    placeholder={social.placeholder}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 7: CONTENT */}
        {/* ============================================ */}
        {currentStep === 7 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Website Content
              </h1>
              <p className="font-body text-neutral-500">
                Write the content for your website sections
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  About Us
                </label>
                <textarea
                  value={setupData.aboutUs}
                  onChange={(e) => updateSetup('aboutUs', e.target.value)}
                  placeholder="Tell your story. How did your business start? What's your mission?"
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Services / Products
                </label>
                <textarea
                  value={setupData.services}
                  onChange={(e) => updateSetup('services', e.target.value)}
                  placeholder="List your main services or products. What do you offer?"
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Why Choose Us?
                </label>
                <textarea
                  value={setupData.whyChooseUs}
                  onChange={(e) => updateSetup('whyChooseUs', e.target.value)}
                  placeholder="What makes you different? Your benefits, guarantees, unique selling points..."
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Customer Testimonials (optional)
                </label>
                <textarea
                  value={setupData.testimonials}
                  onChange={(e) => updateSetup('testimonials', e.target.value)}
                  placeholder="Paste any customer reviews or testimonials you'd like to feature"
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={setupData.callToAction}
                  onChange={(e) => updateSetup('callToAction', e.target.value)}
                  placeholder="e.g., Get a Free Quote, Book Now, Contact Us Today"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={setupData.additionalNotes}
                  onChange={(e) => updateSetup('additionalNotes', e.target.value)}
                  placeholder="Anything else you want us to know? Special requests, specific phrases to include, etc."
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 8: REVIEW */}
        {/* ============================================ */}
        {currentStep === 8 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-black mb-2">
                Review & Submit
              </h1>
              <p className="font-body text-neutral-500">
                Make sure everything looks good before submitting
              </p>
            </div>

            <div className="space-y-4">
              {/* Platform */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔗</span>
                    <div>
                      <p className="font-body font-medium text-black">Platform</p>
                      <p className="font-body text-sm text-neutral-500">
                        {platforms.find(p => p.id === setupData.platform)?.name || 'Not selected'}
                        {setupData.platform && setupData.platform !== 'custom' && (
                          <span className="ml-2">
                            {Object.values(setupData.platformCredentials).some(v => v && String(v).trim())
                              ? '• 🔑 Credentials provided'
                              : '• ⚠️ No credentials yet'}
                          </span>
                        )}
                        {setupData.platform === 'custom' && (
                          <span className="ml-2">• We handle hosting</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Logo */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🖼️</span>
                    <div>
                      <p className="font-body font-medium text-black">Logo</p>
                      <p className="font-body text-sm text-neutral-500">
                        {setupData.logoUrl ? 'Uploaded ✓' : 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📸</span>
                    <div>
                      <p className="font-body font-medium text-black">Images</p>
                      <p className="font-body text-sm text-neutral-500">
                        {setupData.images.length} images uploaded
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Business */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <div>
                      <p className="font-body font-medium text-black">Business</p>
                      <p className="font-body text-sm text-neutral-500">
                        {setupData.businessName || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="font-body font-medium text-black">Contact</p>
                      <p className="font-body text-sm text-neutral-500">
                        {setupData.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(5)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="font-body font-medium text-black">Social Media</p>
                      <p className="font-body text-sm text-neutral-500">
                        {[setupData.facebook, setupData.instagram, setupData.twitter, setupData.linkedin].filter(Boolean).length} links added
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(6)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    <div>
                      <p className="font-body font-medium text-black">Content</p>
                      <p className="font-body text-sm text-neutral-500">
                        {[setupData.aboutUs, setupData.services, setupData.whyChooseUs].filter(Boolean).length} sections completed
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(7)} className="font-body text-sm text-neutral-500 hover:text-black">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <h3 className="font-body font-semibold text-emerald-900 mb-2">Ready to submit?</h3>
              <p className="font-body text-sm text-emerald-700 mb-4">
                Once you submit, our team will start building your website. You can still message us if you need to make changes.
              </p>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full px-6 py-4 bg-emerald-600 text-white font-body font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Submit & Start Building</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* NAVIGATION BUTTONS */}
        {/* ============================================ */}
        {currentStep < steps.length - 1 && (
          <div className="flex items-center justify-between mt-10">
            {currentStep > 0 ? (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-neutral-200 text-neutral-700 font-body font-medium rounded-full hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span>{currentStep === 0 ? "Let's Start" : 'Continue'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
