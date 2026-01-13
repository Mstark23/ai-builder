'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NewProjectPage() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('');
  const [plan, setPlan] = useState('Professional');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from('projects').insert([
      {
        email,
        business_name: businessName,
        industry,
        style,
        plan,
        status: 'QUEUED',
        paid: false
      }
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Project submitted successfully!');
      setEmail('');
      setBusinessName('');
      setIndustry('');
      setStyle('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: 20 }}>
      <h1>Start Your Website</h1>

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
        placeholder="Style"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={inputStyle}
      />

      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        style={inputStyle}
      >
        <option>Starter</option>
        <option>Professional</option>
        <option>Enterprise</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 8,
          background: 'black',
          color: 'white',
          fontWeight: 700
        }}
      >
        {loading ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: '1px solid #ccc'
};
