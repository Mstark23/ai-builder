'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  created_at: string;
  projects?: { id: string; business_name: string; status: string; paid: boolean }[];
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'alpha' | 'projects'>('newest');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('*, projects(id, business_name, status, paid)')
      .order('created_at', { ascending: false });

    if (data) setCustomers(data);
    setLoading(false);
  };

  const filtered = customers
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.business_name?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === 'alpha') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'projects') return (b.projects?.length || 0) - (a.projects?.length || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPaid = customers.filter(c => c.projects?.some(p => p.paid)).length;
  const thisMonth = customers.filter(c => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Customers</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: customers.length, color: 'bg-black text-white' },
          { label: 'With Projects', value: customers.filter(c => (c.projects?.length || 0) > 0).length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Paid', value: totalPaid, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'New This Month', value: thisMonth, color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm mt-1 opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, business..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black"
        >
          <option value="newest">Newest</option>
          <option value="alpha">A → Z</option>
          <option value="projects">Most Projects</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-4">Customer</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-4">Business</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-4">Projects</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-4">Joined</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 text-sm">
                  {search ? 'No customers match your search' : 'No customers yet'}
                </td>
              </tr>
            ) : (
              filtered.map(c => {
                const hasPaid = c.projects?.some(p => p.paid);
                const isNew = Date.now() - new Date(c.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
                return (
                  <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                          {(c.name || c.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{c.name || 'Unnamed'}</p>
                          <p className="text-xs text-neutral-400">{c.email}</p>
                          {c.phone && <p className="text-xs text-neutral-400">{c.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">{c.business_name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(c.projects || []).slice(0, 3).map(p => (
                          <Link
                            key={p.id}
                            href={`/admin/projects/${p.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs hover:bg-neutral-200 transition"
                          >
                            {p.business_name}
                            {p.paid && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                          </Link>
                        ))}
                        {(c.projects?.length || 0) > 3 && (
                          <span className="text-xs text-neutral-400 px-2 py-1">
                            +{(c.projects?.length || 0) - 3} more
                          </span>
                        )}
                        {!c.projects?.length && (
                          <span className="text-xs text-neutral-400">No projects</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-500">{formatDate(c.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {hasPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Paid
                        </span>
                      ) : isNew ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
