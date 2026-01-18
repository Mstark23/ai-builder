'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ConnectPlatformPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [connection, setConnection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) { 
        router.push('/login'); 
        return; 
      }
      setUser(user);

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!projectData) { 
        router.push('/portal'); 
        return; 
      }
      setProject(projectData);

      const { data: connectionData } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (connectionData) {
        setConnection(connectionData);
        setSelectedPlatform(connectionData.platform);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectShopify = () => {
    if (!shopDomain.trim()) {
      alert('Please enter your Shopify store domain');
      return;
    }

    let domain = shopDomain.trim().toLowerCase();
    domain = domain.replace('https://', '').replace('http://', '');
    domain = domain.replace('.myshopify.com', '');
    domain = domain.replace('/', '');

    const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID || 'f1392eb512bb8911d972cf53704612a4';
    const redirectUri = `${window.location.origin}/api/auth/shopify/callback`;
    const scopes = 'read_themes,write_themes,read_content,write_content';
    const state = `${projectId}:${domain}`;

    const authUrl = `https://${domain}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = authUrl;
  };

  const selectCustomHosting = async () => {
    setConnecting(true);
    try {
      await supabase.from('platform_connections').upsert({
        project_id: projectId,
        customer_id: user.id,
        platform: 'custom',
        status: 'CONNECTED',
      });
      
      await supabase.from('projects').update({ platform: 'custom' }).eq('id', projectId);
      
      router.push(`/portal/project/${projectId}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const platforms = [
    { id: 'shopify', name: 'Shopify', icon: '🛒', desc: 'Connect your Shopify store', available: true },
    { id: 'wordpress', name: 'WordPress', icon: '📝', desc: 'Coming soon', available: false },
    { id: 'squarespace', name: 'Squarespace', icon: '⬛', desc: 'Coming soon', available: false },
    { id: 'wix', name: 'Wix', icon: '✨', desc: 'Coming soon', available: false },
    { id: 'webflow', name: 'Webflow', icon: '🎨', desc: 'Coming soon', available: false },
    { id: 'custom', name: 'Let Us Host It', icon: '🌐', desc: 'We handle everything', available: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', Georgia, serif; }
          .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        `}</style>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href={`/portal/project/${projectId}`} className="flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* CONNECTED STATE */}
        {connection && connection.status === 'CONNECTED' && (
          <div className="slide-up bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl">
                {connection.platform === 'shopify' && '🛒'}
                {connection.platform === 'custom' && '🌐'}
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-medium text-emerald-900">Platform Connected!</h2>
                <p className="font-body text-emerald-700 mt-1">
                  {connection.platform === 'shopify' && `Connected to ${connection.shop_domain}.myshopify.com`}
                  {connection.platform === 'custom' && 'We will host your website'}
                </p>
              </div>
              <div className="px-4 py-2 bg-emerald-500 text-white font-body font-medium rounded-full">
                ✓ Connected
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="slide-up text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-4">
            Connect Your Platform
          </h1>
          <p className="font-body text-lg text-neutral-500">
            Where should we publish your website?
          </p>
        </div>

        {/* PLATFORM SELECTION */}
        {!selectedPlatform && !connection && (
          <div className="slide-up space-y-4" style={{ animationDelay: '0.1s' }}>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => platform.available && setSelectedPlatform(platform.id)}
                disabled={!platform.available}
                className={`card-hover w-full p-6 bg-white rounded-2xl border text-left flex items-center gap-5 ${
                  platform.available 
                    ? 'border-neutral-200 hover:border-black cursor-pointer' 
                    : 'border-neutral-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center text-3xl">
                  {platform.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-black text-lg">{platform.name}</h3>
                  <p className="font-body text-sm text-neutral-500">{platform.desc}</p>
                </div>
                {platform.available ? (
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-500 font-body text-xs font-medium rounded-full">Soon</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* SHOPIFY CONNECT */}
        {selectedPlatform === 'shopify' && !connection && (
          <div className="slide-up bg-white rounded-3xl border border-neutral-200 p-8" style={{ animationDelay: '0.1s' }}>
            <button 
              onClick={() => setSelectedPlatform('')} 
              className="flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#96bf48] rounded-2xl flex items-center justify-center text-3xl">
                🛒
              </div>
              <div>
                <h2 className="font-display text-2xl font-medium text-black">Connect Shopify</h2>
                <p className="font-body text-neutral-500">Link your Shopify store</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-body text-sm font-medium text-black mb-2">
                Your Shopify Store Domain
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="your-store-name"
                  className="flex-1 px-5 py-4 bg-white border border-neutral-200 rounded-l-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                />
                <div className="px-5 py-4 bg-neutral-100 border border-l-0 border-neutral-200 rounded-r-2xl">
                  <span className="font-body text-neutral-500">.myshopify.com</span>
                </div>
              </div>
              <p className="font-body text-xs text-neutral-400 mt-2">
                Enter just your store name, not the full URL
              </p>
            </div>

            <button
              onClick={connectShopify}
              disabled={!shopDomain.trim()}
              className="w-full py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Connect Shopify Store</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p className="font-body text-sm text-blue-800">
                <span className="font-medium">🔒 Secure Connection:</span> You will be redirected to Shopify to authorize access. We only request permissions to edit your theme.
              </p>
            </div>
          </div>
        )}

        {/* CUSTOM HOSTING */}
        {selectedPlatform === 'custom' && !connection && (
          <div className="slide-up bg-white rounded-3xl border border-neutral-200 p-8" style={{ animationDelay: '0.1s' }}>
            <button 
              onClick={() => setSelectedPlatform('')} 
              className="flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-3xl">
                🌐
              </div>
              <div>
                <h2 className="font-display text-2xl font-medium text-black">We Will Host It</h2>
                <p className="font-body text-neutral-500">Let us handle everything</p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <h3 className="font-body font-semibold text-emerald-900 mb-4">What is included:</h3>
              <ul className="space-y-3">
                {[
                  'Fast, secure hosting',
                  'Free SSL certificate',
                  'Custom domain support',
                  '99.9% uptime guarantee',
                  'Automatic backups'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-body text-emerald-800">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={selectCustomHosting}
              disabled={connecting}
              className="w-full py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {connecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>Yes, Host My Website</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* BACK TO PROJECT BUTTON */}
        {connection && (
          <div className="slide-up text-center" style={{ animationDelay: '0.2s' }}>
            <Link
              href={`/portal/project/${projectId}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Project</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}