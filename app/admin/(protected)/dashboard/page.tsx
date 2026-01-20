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
  customers?: { name: string; email: string } | null;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type Message = {
  id: string;
  content: string;
  created_at: string;
  project_id: string;
  sender_type: string;
  projects?: { business_name: string } | null;
};

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, customersRes, messagesRes] = await Promise.all([
        supabase.from('projects').select('*, customers(name, email)').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*, projects(business_name)').order('created_at', { ascending: false }).limit(10),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalRevenue: projects.filter(p => p.paid).reduce((sum, p) => {
      const prices: Record<string, number> = { starter: 299, landing: 299, professional: 599, service: 599, premium: 799, enterprise: 999, ecommerce: 999 };
      return sum + (prices[p.plan] || 0);
    }, 0),
    activeProjects: projects.filter(p => !['DELIVERED', 'CANCELLED'].includes(p.status)).length,
    totalCustomers: customers.length,
    conversionRate: projects.length > 0 ? Math.round((projects.filter(p => p.paid).length / projects.length) * 100) : 0,
    newThisWeek: projects.filter(p => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(p.created_at) > weekAgo;
    }).length,
  };

  // Get projects by status for chart
  const statusCounts = {
    QUEUED: projects.filter(p => p.status === 'QUEUED').length,
    IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
    PREVIEW_READY: projects.filter(p => p.status === 'PREVIEW_READY').length,
    PAID: projects.filter(p => p.status === 'PAID').length,
    DELIVERED: projects.filter(p => p.status === 'DELIVERED').length,
  };

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  // Recent activity
  const recentProjects = projects.slice(0, 5);
  const unreadMessages = messages.filter(m => m.sender_type === 'customer').length;

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      QUEUED: { label: 'Queued', color: 'text-amber-600', bg: 'bg-amber-100' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' },
      PREVIEW_READY: { label: 'Preview', color: 'text-purple-600', bg: 'bg-purple-100' },
      PAID: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-100' },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    };
    return configs[status] || { label: status, color: 'text-neutral-600', bg: 'bg-neutral-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Dashboard</h1>
          <p className="font-body text-neutral-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-body text-sm w-48 focus:outline-none focus:border-black transition-colors"
            />
            <svg className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="relative p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-body font-medium">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-emerald-600 font-medium font-body bg-emerald-50 px-2 py-1 rounded-full">
              ↑ +{stats.newThisWeek} this week
            </span>
          </div>
          <div className="font-display text-3xl text-black">${stats.totalRevenue.toLocaleString()}</div>
          <div className="font-body text-sm text-neutral-500">Total Revenue</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <Link href="/admin/kanban" className="text-xs text-blue-600 font-medium font-body hover:underline">
              View board →
            </Link>
          </div>
          <div className="font-display text-3xl text-black">{stats.activeProjects}</div>
          <div className="font-body text-sm text-neutral-500">Active Projects</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <Link href="/admin/customers" className="text-xs text-purple-600 font-medium font-body hover:underline">
              View all →
            </Link>
          </div>
          <div className="font-display text-3xl text-black">{stats.totalCustomers}</div>
          <div className="font-body text-sm text-neutral-500">Total Customers</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs text-emerald-600 font-medium font-body bg-emerald-50 px-2 py-1 rounded-full">
              Good
            </span>
          </div>
          <div className="font-display text-3xl text-black">{stats.conversionRate}%</div>
          <div className="font-body text-sm text-neutral-500">Conversion Rate</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ACTIVE PROJECTS */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-body font-semibold text-black">Active Projects</h2>
            <Link href="/admin/projects" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentProjects.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-body text-neutral-500">No projects yet</p>
              </div>
            ) : (
              recentProjects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-body font-semibold">
                        {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-medium text-sm text-black truncate">
                          {project.business_name}
                        </span>
                        <span className={`${statusConfig.bg} ${statusConfig.color} text-xs px-2 py-0.5 rounded-full font-body font-medium`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="font-body text-xs text-neutral-500 mt-0.5">
                        {project.customers?.name || 'No customer'} • {timeAgo(project.created_at)}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      {project.paid ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium font-body rounded-full">
                          ✓ Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium font-body rounded-full">
                          Unpaid
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* PROJECT STATUS CHART */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-body font-semibold text-black">Pipeline Overview</h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm font-body border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => {
                const config = getStatusConfig(status);
                const percentage = (count / maxStatusCount) * 100;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs text-neutral-600">{config.label}</span>
                      <span className="font-body text-xs font-medium text-black">{count}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'QUEUED' ? 'bg-amber-500' :
                          status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          status === 'PREVIEW_READY' ? 'bg-purple-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT MESSAGES */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-body font-semibold text-black">Recent Messages</h2>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-body font-medium">
                  {unreadMessages} new
                </span>
              )}
            </div>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="font-body text-sm text-neutral-500 text-center py-4">No messages yet</p>
              ) : (
                messages.slice(0, 4).map((msg) => (
                  <Link
                    key={msg.id}
                    href={`/admin/messages?project=${msg.project_id}`}
                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-body text-xs font-semibold">
                        {msg.projects?.business_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm font-medium text-black truncate">
                          {msg.projects?.business_name || 'Unknown'}
                        </span>
                        <span className="font-body text-xs text-neutral-400">{timeAgo(msg.created_at)}</span>
                      </div>
                      <p className="font-body text-xs text-neutral-500 truncate">{msg.content}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/admin/messages"
              className="block text-center font-body text-sm text-neutral-500 hover:text-black mt-4 pt-3 border-t border-neutral-100 transition-colors"
            >
              View all messages →
            </Link>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-5 text-white">
            <h2 className="font-body font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/kanban"
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
                <span className="font-body text-sm">Open Kanban Board</span>
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-body text-sm">View All Projects</span>
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-body text-sm">Manage Customers</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-body font-semibold text-black">Revenue by Plan</h2>
          <div className="flex gap-4">
            {[
              { name: 'Starter', color: 'bg-blue-500', price: 299 },
              { name: 'Professional', color: 'bg-emerald-500', price: 599 },
              { name: 'Enterprise', color: 'bg-purple-500', price: 999 },
            ].map((plan) => (
              <div key={plan.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${plan.color} rounded-full`} />
                <span className="font-body text-xs text-neutral-600">{plan.name} (${plan.price})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-48 flex items-end gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [60, 85, 45, 70, 90, 100, 55];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${heights[i]}%` }}
                />
                <span className="font-body text-xs text-neutral-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
