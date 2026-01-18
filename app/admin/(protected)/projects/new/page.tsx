'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    industry: '',
    style: '',
    plan: 'basic',
    paid: false,
    notes: '',
  });

  const industries = [
    { value: '', label: 'Select an industry...' },
    { value: 'restaurant', label: '🍽️ Restaurant / Food' },
    { value: 'retail', label: '🛍️ Retail / E-commerce' },
    { value: 'health', label: '🏥 Health / Medical' },
    { value: 'fitness', label: '💪 Fitness / Gym' },
    { value: 'beauty', label: '💅 Beauty / Salon' },
    { value: 'tech', label: '💻 Technology' },
    { value: 'finance', label: '💰 Finance / Accounting' },
    { value: 'realestate', label: '🏠 Real Estate' },
    { value: 'legal', label: '⚖️ Legal / Law Firm' },
    { value: 'education', label: '📚 Education' },
    { value: 'photography', label: '📸 Photography' },
    { value: 'construction', label: '🔨 Construction' },
    { value: 'automotive', label: '🚗 Automotive' },
    { value: 'travel', label: '✈️ Travel / Tourism' },
    { value: 'other', label: '📦 Other' },
  ];

  const styles = [
    { value: '', label: 'Select a style...' },
    { value: 'modern', label: '✨ Modern & Clean' },
    { value: 'minimal', label: '⬜ Minimal' },
    { value: 'bold', label: '🔥 Bold & Vibrant' },
    { value: 'elegant', label: '👔 Elegant & Professional' },
    { value: 'playful', label: '🎨 Playful & Fun' },
    { value: 'dark', label: '🌙 Dark Mode' },
    { value: 'corporate', label: '🏢 Corporate' },
    { value: 'creative', label: '🎭 Creative & Artistic' },
  ];

  const plans = [
    { value: 'basic', label: 'Basic', price: '$99', features: ['1 Page', 'Mobile Responsive', '1 Revision'] },
    { value: 'professional', label: 'Professional', price: '$199', features: ['5 Pages', 'Mobile Responsive', '3 Revisions', 'SEO Setup'] },
    { value: 'premium', label: 'Premium', price: '$399', features: ['10 Pages', 'Mobile Responsive', 'Unlimited Revisions', 'SEO Setup', 'Contact Form'] },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.business_name.trim()) {
      setError('Business name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      // Generate preview token
      const preview_token = uuidv4();

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({
          business_name: formData.business_name.trim(),
          email: formData.email.trim(),
          industry: formData.industry || null,
          style: formData.style || null,
          plan: formData.plan,
          paid: formData.paid,
          notes: formData.notes.trim() || null,
          status: 'QUEUED',
          preview_token: preview_token,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        setError('Failed to create project. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to the new project
      router.push(`/admin/projects/${data.id}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/projects" className="text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-2 mb-2">
                <span>←</span> Back to Projects
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
              <p className="text-slate-600 mt-1">Fill in the details to create a new website project</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-8 py-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* BASIC INFO CARD */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>📝</span>
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="e.g., Acme Corporation"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Client Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@example.com"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Industry & Style Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        {industries.map(ind => (
                          <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Style */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Design Style
                      </label>
                      <select
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        {styles.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any specific requirements, colors, features, or content notes..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT STATUS CARD */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>💳</span>
                  Payment Status
                </h2>

                <label className="flex items-center gap-4 cursor-pointer p-4 border-2 border-slate-200 rounded-lg hover:border-green-300 transition-all">
                  <input
                    type="checkbox"
                    name="paid"
                    checked={formData.paid}
                    onChange={handleChange}
                    className="w-6 h-6 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">Mark as Paid</span>
                    <p className="text-sm text-slate-600">Check this if the client has already paid for this project</p>
                  </div>
                  {formData.paid && (
                    <span className="ml-auto text-green-600 text-2xl">✅</span>
                  )}
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN - Plan Selection */}
            <div className="space-y-6">
              {/* PLAN SELECTION */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>📦</span>
                  Select Plan
                </h2>

                <div className="space-y-3">
                  {plans.map(plan => (
                    <label
                      key={plan.value}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.plan === plan.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={plan.value}
                          checked={formData.plan === plan.value}
                          onChange={handleChange}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{plan.label}</span>
                            <span className="text-lg font-bold text-purple-600">{plan.price}</span>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-center gap-1">
                                <span className="text-green-500">✓</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* QUICK TIP */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Quick Tip</h3>
                    <p className="text-sm text-blue-700">
                      After creating the project, you can generate the website and send the preview link to your client!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="mt-8 flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Link
              href="/admin/projects"
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}