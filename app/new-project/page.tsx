'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';


export default function NewProjectPage() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('');
  const [plan, setPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('projects').insert([
      {
        email,
        business_name: businessName,
        industry,
        style,
        plan,
        status: 'QUEUED',
        paid: false,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail('');
      setBusinessName('');
      setIndustry('');
      setStyle('');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>Start a New Project</h1>

      {success && (
        <p style={{ color: 'green', marginBottom: 16 }}>
          ✅ Project submitted successfully!
        </p>
      )}

      {error && (
        <p style={{ color: 'red', marginBottom: 16 }}>
          ❌ {error}
        </p>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Style (modern, luxury, etc.)"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={inputStyle}
      />

      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        style={inputStyle}
      >
        <option>Basic</option>
        <option>Professional</option>
        <option>Premium</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: 14,
          width: '100%',
          borderRadius: 8,
          border: 'none',
          background: 'black',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: '1px solid #ccc',
};
