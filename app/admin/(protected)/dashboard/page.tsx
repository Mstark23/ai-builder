'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
  created_at: string;
  customers?: {
    name: string;
    email: string;
  } | null;
};

type Stats = {
  totalProjects: number;
  totalRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
  queued: number;
  inProgress: number;
  previewReady: number;
  paid: number;
  delivered: number;
  unpaid: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  projectsThisWeek: number;
  avgProjectValue: number;
  conversionRate: number;
};

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    queued: 0,
    inProgress: 0,
    previewReady: 0,
    paid: 0,
    delivered: 0,
    unpaid: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    projectsThisWeek: 0,
    avgProjectValue: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false });

      // Load customers count
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Load employees count
      let employeesCount = 0;
      try {
        const { count } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true });
        employeesCount = count || 0;
      } catch (e) {
        console.log('Employees table may not exist');
      }

      if (projectsData) {
        setProjects(projectsData);

        const planPrices: Record<string, number> = {
          starter: 299, landing: 299,
          professional: 599, service: 599,
          premium: 799,
          enterprise: 999, ecommerce: 999,
        };

        const paidProjects = projectsData.filter(p => p.paid);
        const totalRevenue = paidProjects.reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

        // Calculate monthly revenue
        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const thisYear = now.getFullYear();
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const revenueThisMonth = paidProjects
          .filter(p => {
            const d = new Date(p.created_at);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
          })
          .reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

        const revenueLastMonth = paidProjects
          .filter(p => {
            const d = new Date(p.created_at);
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
          })
          .reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

        // Projects this week
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const projectsThisWeek = projectsData.filter(p => new Date(p.created_at) >= oneWeekAgo).length;

        // Average project value
        const avgProjectValue = paidProjects.length > 0 ? totalRevenue / paidProjects.length : 0;

        // Conversion rate (paid / total)
        const conversionRate = projectsData.length > 0 
          ? Math.round((paidProjects.length / projectsData.length) * 100) 
          : 0;

        setStats({
          totalProjects: projectsData.length,
          totalRevenue,
          totalCustomers: customersCount || 0,
          totalEmployees: employeesCount,
          queued: projectsData.filter(p => p.status === 'QUEUED').length,
          inProgress: projectsData.filter(p => p.status === 'IN_PROGRESS').length,
          previewReady: projectsData.filter(p => p.status === 'PREVIEW_READY').length,
          paid: paidProjects.length,
          delivered: projectsData.filter(p => p.status === 'DELIVERED').length,
          unpaid: projectsData.filter(p => !p.paid).length,
          revenueThisMonth,
          revenueLastMonth,
          projectsThisWeek,
          avgProjectValue: Math.round(avgProjectValue),
          conversionRate,
        });

        // Generate recent activity
        const activity = projectsData.slice(0, 8).map(p => ({
          id: p.id,
          type: p.status,
          project: p.business_name,
          customer: p.customers?.name || 'Unknown',
          time: p.created_at,
        }));
        setRecentActivity(activity);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      QUEUED: { label: 'Queued', color: 'text-amber-700', bg: 'bg-amber-100' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100' },
      REVISION_REQUESTED: { label: 'Revision', color: 'text-orange-700', bg: 'bg-orange-100' },
      PAID: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100' },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    };
    return configs[status] || { label: status, color: 'text-neutral-700', bg: 'bg-neutral-100' };
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const revenueChange = stats.revenueLastMonth > 0 
    ? Math.round(((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100)
    : stats.revenueThisMonth > 0 ? 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-medium text-black mb-2">Dashboard</h1>
            <p className="font-body text-neutral-500">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/kanban"
              className="px-5 py-2.5 bg-white border border-neutral-200 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-all"
            >
              📋 Kanban Board
            </Link>
            <Link
              href="/admin/customers"
              className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-all"
            >
              + New Project
            </Link>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* TOTAL REVENUE */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`px-2 py-1 rounded-full font-body text-xs font-medium ${
                revenueChange >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange}%
              </span>
            </div>
            <p className="font-display text-3xl font-semibold text-black">${stats.totalRevenue.toLocaleString()}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Revenue</p>
          </div>

          {/* PROJECTS */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-body text-xs font-medium">
                +{stats.projectsThisWeek} this week
              </span>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.totalProjects}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Projects</p>
          </div>

          {/* CUSTOMERS */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.totalCustomers}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Customers</p>
          </div>

          {/* CONVERSION */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.conversionRate}%</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Conversion Rate</p>
          </div>
        </div>

        {/* REVENUE CHART & PIPELINE */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* REVENUE THIS MONTH */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="font-display text-xl font-medium text-black mb-6">Monthly Revenue</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm text-neutral-500">This Month</span>
                  <span className="font-body font-semibold text-black">${stats.revenueThisMonth.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.revenueThisMonth / Math.max(stats.revenueThisMonth, stats.revenueLastMonth, 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm text-neutral-500">Last Month</span>
                  <span className="font-body font-semibold text-black">${stats.revenueLastMonth.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neutral-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.revenueLastMonth / Math.max(stats.revenueThisMonth, stats.revenueLastMonth, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-sm text-neutral-500">Avg. Project Value</p>
                <p className="font-display text-2xl font-semibold text-black">${stats.avgProjectValue}</p>
              </div>
              <div>
                <p className="font-body text-sm text-neutral-500">Paid Projects</p>
                <p className="font-display text-2xl font-semibold text-black">{stats.paid}</p>
              </div>
            </div>
          </div>

          {/* PROJECT PIPELINE */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-black">Project Pipeline</h2>
              <Link href="/admin/kanban" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                View Kanban →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Queued', count: stats.queued, color: 'bg-amber-500', total: stats.totalProjects },
                { label: 'In Progress', count: stats.inProgress, color: 'bg-blue-500', total: stats.totalProjects },
                { label: 'Preview Ready', count: stats.previewReady, color: 'bg-purple-500', total: stats.totalProjects },
                { label: 'Paid', count: stats.paid, color: 'bg-emerald-500', total: stats.totalProjects },
                { label: 'Delivered', count: stats.delivered, color: 'bg-emerald-600', total: stats.totalProjects },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-neutral-600">{item.label}</span>
                    <span className="font-body text-sm font-medium text-black">{item.count}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-black">Recent Activity</h2>
              <Link href="/admin/projects" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {recentActivity.map((item) => {
                const statusConfig = getStatusConfig(item.type);
                return (
                  <Link
                    key={item.id}
                    href={`/admin/projects/${item.id}`}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-body text-sm font-semibold">
                          {item.project?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-body font-medium text-black">{item.project}</p>
                        <p className="font-body text-sm text-neutral-500">{item.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full font-body text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className="font-body text-xs text-neutral-400">{timeAgo(item.time)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* QUICK ACTIONS & ALERTS */}
          <div className="space-y-6">
            {/* NEEDS ATTENTION */}
            {stats.unpaid > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-amber-900">Needs Attention</h3>
                    <p className="font-body text-sm text-amber-700">{stats.unpaid} unpaid projects</p>
                  </div>
                </div>
                <Link
                  href="/admin/projects?filter=unpaid"
                  className="block w-full px-4 py-2 bg-amber-500 text-white font-body text-sm font-medium rounded-xl text-center hover:bg-amber-600 transition-colors"
                >
                  View Unpaid
                </Link>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Manage Projects</span>
                </Link>
                <Link
                  href="/admin/kanban"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Kanban Board</span>
                </Link>
                <Link
                  href="/admin/customers"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Customers</span>
                </Link>
                <Link
                  href="/admin/messages"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Messages</span>
                </Link>
              </div>
            </div>

            {/* TEAM */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-medium text-black">Team</h2>
                <Link href="/admin/employees" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                  Manage →
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-body text-sm font-semibold">{stats.totalEmployees}</span>
                </div>
                <div>
                  <p className="font-body font-medium text-black">Team Members</p>
                  <p className="font-body text-xs text-neutral-500">Active employees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}