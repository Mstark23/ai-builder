'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    email_updates: true,
    project_updates: true,
    marketing: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    await loadProfile(user.id);
  };

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        business_name: data.business_name || '',
      });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase
      .from('customers')
      .update({
        name: profile.name,
        phone: profile.phone,
        business_name: profile.business_name,
      })
      .eq('user_id', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (password.new !== password.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (password.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({
      password: password.new
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword({ current: '', new: '', confirm: '' });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading settings...</p>
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
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VERKTORLABS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/portal" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Messages
              </Link>
              <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Billing
              </Link>
              <Link href="/portal/settings" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">
                Settings
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/portal" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-display text-4xl font-medium text-black mb-2">Settings</h1>
          <p className="font-body text-neutral-500">Manage your account and preferences</p>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-body text-sm flex items-center gap-2 ${
              message.type === 'success' ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message.text}
            </p>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-4">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'password', label: 'Password', icon: '🔒' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8">
            <h2 className="font-display text-2xl font-medium text-black mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* AVATAR */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-display text-3xl font-semibold">
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-body font-medium text-black">{profile.name || 'Your Name'}</h3>
                  <p className="font-body text-sm text-neutral-500">{profile.email}</p>
                </div>
              </div>

              {/* FORM */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl font-body text-neutral-500 cursor-not-allowed"
                  />
                  <p className="font-body text-xs text-neutral-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profile.business_name}
                    onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                    placeholder="Your Company"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8">
            <h2 className="font-display text-2xl font-medium text-black mb-6">Change Password</h2>
            
            <div className="max-w-md space-y-6">
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">New Password</label>
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {password.new && password.confirm && (
                <div className="flex items-center gap-2">
                  {password.new === password.confirm ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-body text-sm text-emerald-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-body text-sm text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              <div className="pt-6 border-t border-neutral-100">
                <button
                  onClick={changePassword}
                  disabled={saving || !password.new || password.new !== password.confirm}
                  className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8">
            <h2 className="font-display text-2xl font-medium text-black mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              {[
                {
                  id: 'email_updates',
                  title: 'Email Updates',
                  desc: 'Receive important updates about your account',
                  checked: notifications.email_updates,
                },
                {
                  id: 'project_updates',
                  title: 'Project Updates',
                  desc: 'Get notified when your project status changes',
                  checked: notifications.project_updates,
                },
                {
                  id: 'marketing',
                  title: 'Marketing Emails',
                  desc: 'Receive tips, offers, and news about our services',
                  checked: notifications.marketing,
                },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <h3 className="font-body font-medium text-black">{item.title}</h3>
                    <p className="font-body text-sm text-neutral-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.id]: !item.checked })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      item.checked ? 'bg-black' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      item.checked ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}

              <div className="pt-6 border-t border-neutral-100">
                <button
                  onClick={() => setMessage({ type: 'success', text: 'Notification preferences saved!' })}
                  className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DANGER ZONE */}
        <div className="mt-8 bg-red-50 rounded-2xl border border-red-200 p-8">
          <h2 className="font-display text-xl font-medium text-red-800 mb-2">Danger Zone</h2>
          <p className="font-body text-sm text-red-600 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-6 py-2.5 bg-red-600 text-white font-body text-sm font-medium rounded-full hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}