'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [companySettings, setCompanySettings] = useState({
    name: 'VerktorLabs',
    website: 'verktorlabs.com',
    email: 'support@verktorlabs.com',
    timezone: 'America/New_York',
  });

  const [pricing, setPricing] = useState({
    starter: 299,
    professional: 599,
    enterprise: 999,
  });

  const [notifications, setNotifications] = useState({
    newProject: true,
    paymentReceived: true,
    customerMessage: true,
    projectDelivered: false,
    weeklyReport: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'pricing', label: 'Pricing', icon: '💰' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'integrations', label: 'Integrations', icon: '🔗' },
    { key: 'team', label: 'Team Access', icon: '👥' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Settings</h1>
        <p className="font-body text-neutral-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* TABS SIDEBAR */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* CONTENT */}
        <div className="flex-1 max-w-2xl">
          {/* SUCCESS MESSAGE */}
          {saved && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-body text-sm text-emerald-700">Settings saved successfully!</span>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-body font-semibold text-black mb-6">Company Profile</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-body font-bold">
                    V
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                      Upload Logo
                    </button>
                    <p className="font-body text-xs text-neutral-500 mt-2">PNG or SVG. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-black mb-2">Company Name</label>
                    <input
                      type="text"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-black mb-2">Website</label>
                    <input
                      type="text"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-black mb-2">Support Email</label>
                    <input
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-black mb-2">Timezone</label>
                    <select
                      value={companySettings.timezone}
                      onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-body font-semibold text-black mb-6">Package Pricing</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'starter', label: 'Starter', description: 'Single page website' },
                    { key: 'professional', label: 'Professional', description: '5-7 page website' },
                    { key: 'enterprise', label: 'Enterprise', description: 'Full e-commerce store' },
                  ].map((plan) => (
                    <div key={plan.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div>
                        <div className="font-body font-medium text-black">{plan.label}</div>
                        <div className="font-body text-xs text-neutral-500">{plan.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-neutral-500">$</span>
                        <input
                          type="number"
                          value={pricing[plan.key as keyof typeof pricing]}
                          onChange={(e) => setPricing({ ...pricing, [plan.key]: parseInt(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 bg-white border border-neutral-200 rounded-lg font-body text-sm text-right focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Pricing'}
              </button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-body font-semibold text-black mb-6">Email Notifications</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'newProject', label: 'New Project', description: 'When a new project is created' },
                    { key: 'paymentReceived', label: 'Payment Received', description: 'When a customer completes payment' },
                    { key: 'customerMessage', label: 'Customer Messages', description: 'When a customer sends a message' },
                    { key: 'projectDelivered', label: 'Project Delivered', description: 'When a project is marked as delivered' },
                    { key: 'weeklyReport', label: 'Weekly Report', description: 'Summary of weekly activity' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div>
                        <div className="font-body font-medium text-black">{item.label}</div>
                        <div className="font-body text-xs text-neutral-500">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-body font-semibold text-black mb-6">Connected Services</h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'Stripe', icon: '💳', description: 'Process payments', connected: true },
                    { name: 'Shopify', icon: '🛒', description: 'E-commerce integration', connected: true },
                    { name: 'Slack', icon: '💬', description: 'Team notifications', connected: false },
                    { name: 'Google Analytics', icon: '📊', description: 'Website analytics', connected: false },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-neutral-200">
                          {service.icon}
                        </div>
                        <div>
                          <div className="font-body font-medium text-black">{service.name}</div>
                          <div className="font-body text-xs text-neutral-500">{service.description}</div>
                        </div>
                      </div>
                      {service.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">Connected</span>
                          <button className="px-3 py-1.5 border border-neutral-200 text-neutral-600 font-body text-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEAM ACCESS TAB */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-body font-semibold text-black">Admin Access</h2>
                  <button className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                    + Add Admin
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Admin User', email: 'admin@verktorlabs.com', role: 'Super Admin' },
                  ].map((admin, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-body font-bold">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-body font-medium text-black">{admin.name}</div>
                          <div className="font-body text-xs text-neutral-500">{admin.email}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 font-body text-xs font-medium rounded-full">
                        {admin.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                <h2 className="font-body font-semibold text-red-700 mb-2">Danger Zone</h2>
                <p className="font-body text-sm text-red-600 mb-4">These actions are irreversible. Please be careful.</p>
                <button className="px-4 py-2 bg-red-600 text-white font-body text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
