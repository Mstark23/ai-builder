'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CustomerSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    messages: true,
    marketing: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const customerId = localStorage.getItem('customerId');
    const name = localStorage.getItem('customerName');
    const email = localStorage.getItem('customerEmail');

    if (customerId && customerId !== 'demo') {
      try {
        const { data } = await supabase.from('customers').select('*').eq('id', customerId).single();
        if (data) {
          setProfile({
            name: data.name || name || '',
            email: data.email || email || '',
            phone: data.phone || '',
            company: data.company || '',
          });
        }
      } catch (err) {
        console.error('Error:', err);
      }
    } else {
      setProfile({ name: name || '', email: email || '', phone: '', company: '' });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const customerId = localStorage.getItem('customerId');

    try {
      if (customerId && customerId !== 'demo') {
        await supabase.from('customers').update({
          name: profile.name,
          phone: profile.phone,
          company: profile.company,
        }).eq('id', customerId);
      }
      localStorage.setItem('customerName', profile.name);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Settings</h1>
        <p className="font-body text-neutral-500 mt-1">Manage your account and preferences</p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-body text-sm text-emerald-700">Settings saved successfully!</span>
        </div>
      )}

      {/* PROFILE */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <h2 className="font-body font-semibold text-black mb-6">Profile Information</h2>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-body font-bold">
            {profile.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <button className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
              Change Avatar
            </button>
            <p className="font-body text-xs text-neutral-500 mt-2">JPG or PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm font-medium text-black mb-2">Full Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-black mb-2">Email Address</label>
            <input type="email" value={profile.email} disabled className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl font-body text-sm text-neutral-500 cursor-not-allowed" />
            <p className="font-body text-xs text-neutral-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-black mb-2">Phone Number</label>
            <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="(555) 123-4567" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-black mb-2">Company Name</label>
            <input type="text" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="Your business name" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <h2 className="font-body font-semibold text-black mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified when your project status changes' },
            { key: 'messages', label: 'New Messages', description: 'Receive email when you get a new message' },
            { key: 'marketing', label: 'Marketing Emails', description: 'Tips, offers, and product updates' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div>
                <div className="font-body font-medium text-black">{item.label}</div>
                <div className="font-body text-xs text-neutral-500">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]} onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button onClick={saveProfile} disabled={saving} className="px-6 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2">
        {saving ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>) : 'Save Changes'}
      </button>

      {/* DANGER ZONE */}
      <div className="mt-8 bg-red-50 rounded-2xl border border-red-200 p-6">
        <h2 className="font-body font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="font-body text-sm text-red-600 mb-4">Once you delete your account, there is no going back.</p>
        <button className="px-4 py-2 bg-red-600 text-white font-body text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
