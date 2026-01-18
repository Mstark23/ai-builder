'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AddonsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addons = [
    {
      id: 'hosting',
      name: 'Managed Hosting',
      description: 'We host and maintain your website. Includes SSL, backups, and 99.9% uptime.',
      price: 29,
      priceType: 'monthly',
      icon: '🌐',
      popular: true,
    },
    {
      id: 'updates',
      name: 'Monthly Updates',
      description: 'Up to 5 content changes per month. Text, images, small edits.',
      price: 99,
      priceType: 'monthly',
      icon: '📝',
    },
    {
      id: 'seo',
      name: 'SEO Package',
      description: 'Full SEO optimization. Keywords, meta tags, speed optimization, sitemap.',
      price: 199,
      priceType: 'one-time',
      icon: '🔍',
      popular: true,
    },
    {
      id: 'logo',
      name: 'Logo Design',
      description: 'Professional custom logo design. 3 concepts, unlimited revisions.',
      price: 149,
      priceType: 'one-time',
      icon: '🎨',
    },
    {
      id: 'social',
      name: 'Social Media Setup',
      description: 'Setup Facebook, Instagram, LinkedIn pages with your branding.',
      price: 99,
      priceType: 'one-time',
      icon: '📱',
    },
    {
      id: 'google',
      name: 'Google Business Profile',
      description: 'Setup and optimize your Google Business listing for local SEO.',
      price: 79,
      priceType: 'one-time',
      icon: '📍',
    },
    {
      id: 'pages',
      name: 'Extra Pages (x3)',
      description: 'Add 3 additional pages to your website.',
      price: 149,
      priceType: 'one-time',
      icon: '📄',
    },
    {
      id: 'rush',
      name: 'Rush Delivery',
      description: 'Get your website delivered in 24 hours instead of 72 hours.',
      price: 99,
      priceType: 'one-time',
      icon: '⚡',
    },
    {
      id: 'chat',
      name: 'Live Chat Widget',
      description: 'Add live chat to your website. Includes 1 month of service.',
      price: 79,
      priceType: 'one-time',
      icon: '💬',
    },
    {
      id: 'analytics',
      name: 'Analytics Setup',
      description: 'Setup Google Analytics and create a custom dashboard for you.',
      price: 49,
      priceType: 'one-time',
      icon: '📊',
    },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data: customerData } = await supabase.from('customers').select('*').eq('id', user.id).single();
      setCustomer(customerData);

      const { data: projectsData } = await supabase.from('projects').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
      setProjects(projectsData || []);
      if (projectsData && projectsData.length > 0) {
        setSelectedProject(projectsData[0].id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const addToCart = (addon: any) => {
    if (!cart.find(item => item.id === addon.id)) {
      setCart([...cart, addon]);
    }
  };

  const removeFromCart = (addonId: string) => {
    setCart(cart.filter(item => item.id !== addonId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = async () => {
    if (!selectedProject || cart.length === 0) return;
    
    // Here you would integrate with Stripe
    // For now, we'll just save the addon requests to the database
    try {
      for (const addon of cart) {
        await supabase.from('addons').insert({
          project_id: selectedProject,
          customer_id: user.id,
          addon_type: addon.id,
          addon_name: addon.name,
          price: addon.price,
          status: 'PENDING',
        });
      }
      alert('Add-ons requested! We will contact you shortly.');
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIDEBAR - Desktop */}
      <aside className="fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200">
            <Link href="/portal" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Verktorlabs</span>
                <span className="text-xs text-slate-500">Customer Portal</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link href="/portal" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/portal/new-project" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
              <span className="text-xl">➕</span>
              <span>New Project</span>
            </Link>
            <Link href="/portal/addons" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-purple-50 text-purple-700">
              <span className="text-xl">🛒</span>
              <span>Add-ons</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">{customer?.name?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{customer?.name || 'Customer'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-bold text-slate-900">Add-ons</span>
          <button onClick={() => setShowCart(true)} className="p-2 relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Add-ons & Services 🛒</h1>
              <p className="text-slate-600">Boost your website with premium add-ons</p>
            </div>
            <button 
              onClick={() => setShowCart(true)} 
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700"
            >
              🛒 Cart ({cart.length})
              {cart.length > 0 && <span className="text-purple-200">• ${getCartTotal()}</span>}
            </button>
          </div>

          {/* PROJECT SELECTOR */}
          {projects.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Project for Add-ons:</label>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.business_name}</option>
                ))}
              </select>
            </div>
          )}

          {/* NO PROJECTS WARNING */}
          {projects.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-yellow-900 mb-1">No projects yet</h3>
                  <p className="text-yellow-700 mb-4">Create a project first before purchasing add-ons.</p>
                  <Link href="/portal/new-project" className="inline-block px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700">
                    Create Project →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ADDONS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => {
              const inCart = cart.find(item => item.id === addon.id);
              return (
                <div 
                  key={addon.id} 
                  className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                    inCart ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {addon.popular && (
                    <span className="absolute -top-3 right-4 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                      POPULAR
                    </span>
                  )}
                  
                  <div className="text-4xl mb-4">{addon.icon}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{addon.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{addon.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">${addon.price}</span>
                      <span className="text-sm text-slate-500">/{addon.priceType === 'monthly' ? 'mo' : 'once'}</span>
                    </div>
                    
                    {inCart ? (
                      <button 
                        onClick={() => removeFromCart(addon.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => addToCart(addon)}
                        disabled={projects.length === 0}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* CART SIDEBAR */}
      {showCart && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-slate-500 hover:text-slate-700 text-2xl">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-500">${item.price}/{item.priceType === 'monthly' ? 'mo' : 'once'}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">${getCartTotal()}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-blue-700"
                  >
                    Checkout →
                  </button>
                  <p className="text-center text-sm text-slate-500 mt-3">
                    We will contact you to complete payment
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}