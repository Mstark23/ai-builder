'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Connection = {
  id: string;
  project_id: string;
  platform: string;
  shop_domain: string;
  status: string;
  connected_at: string;
  projects?: {
    business_name: string;
    customer_id: string;
  };
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*, projects(business_name, customer_id)')
      .order('connected_at', { ascending: false });

    if (!error && data) {
      setConnections(data);
    }
    setLoading(false);
  };

  const getPlatformConfig = (platform: string) => {
    const configs: Record<string, { name: string; icon: string; color: string; bg: string }> = {
      shopify: { name: 'Shopify', icon: '🛒', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
      wordpress: { name: 'WordPress', icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      custom: { name: 'Custom Hosting', icon: '🌐', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    };
    return configs[platform] || { name: platform, icon: '📦', color: 'text-neutral-600', bg: 'bg-neutral-50 border-neutral-200' };
  };

  const stats = {
    total: connections.length,
    shopify: connections.filter(c => c.platform === 'shopify').length,
    custom: connections.filter(c => c.platform === 'custom').length,
    active: connections.filter(c => c.status === 'CONNECTED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium text-black mb-2">Connections</h1>
        <p className="font-body text-neutral-500">Manage platform integrations and access customer stores</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <p className="font-display text-2xl font-semibold text-black">{stats.total}</p>
          <p className="font-body text-sm text-neutral-500 mt-1">Total Connections</p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
          <p className="font-display text-2xl font-semibold text-green-700">{stats.shopify}</p>
          <p className="font-body text-sm text-green-600 mt-1">🛒 Shopify</p>
        </div>
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
          <p className="font-display text-2xl font-semibold text-purple-700">{stats.custom}</p>
          <p className="font-body text-sm text-purple-600 mt-1">🌐 Custom Hosting</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <p className="font-display text-2xl font-semibold text-emerald-700">{stats.active}</p>
          <p className="font-body text-sm text-emerald-600 mt-1">✓ Active</p>
        </div>
      </div>

      {/* CONNECTIONS LIST */}
      {connections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-medium text-black mb-2">No connections yet</h3>
          <p className="font-body text-neutral-500">Connections will appear here when customers connect their platforms</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Platform</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Store</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Connected</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {connections.map((conn) => {
                  const platformConfig = getPlatformConfig(conn.platform);
                  
                  return (
                    <tr key={conn.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${platformConfig.bg}`}>
                            {platformConfig.icon}
                          </div>
                          <span className={`font-body font-medium ${platformConfig.color}`}>
                            {platformConfig.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {conn.shop_domain ? (
                          <p className="font-body text-sm text-black">{conn.shop_domain}.myshopify.com</p>
                        ) : (
                          <p className="font-body text-sm text-neutral-400">—</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/admin/projects/${conn.project_id}`}
                          className="font-body text-sm text-black hover:underline"
                        >
                          {conn.projects?.business_name || 'Unknown'}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-body text-sm text-neutral-500">
                          {new Date(conn.connected_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                          <span className="font-body text-xs font-medium text-emerald-600">✓ Connected</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {conn.platform === 'shopify' && conn.shop_domain && (
                            <>
                              <button
                                onClick={() => window.open(`https://${conn.shop_domain}.myshopify.com/admin`, '_blank')}
                                className="px-3 py-1.5 bg-green-600 text-white font-body text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
                              >
                                Open Store
                              </button>
                              <button
                                onClick={() => window.open(`https://${conn.shop_domain}.myshopify.com/admin/themes`, '_blank')}
                                className="px-3 py-1.5 bg-purple-600 text-white font-body text-xs font-medium rounded-full hover:bg-purple-700 transition-colors"
                              >
                                Edit Theme
                              </button>
                            </>
                          )}
                          {conn.platform === 'custom' && (
                            <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 font-body text-xs font-medium rounded-full">
                              We Host
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}