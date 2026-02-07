"use client";

import { Save, Shield, Bell, Lock } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Platform Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
            <Shield size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Security & Access</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <p style={{ fontWeight: 'bold' }}>Allow Public Signups</p>
                 <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Users can create accounts without invitation.</p>
               </div>
               <div style={{ width: '50px', height: '26px', background: 'var(--primary)', borderRadius: '2rem', position: 'relative', cursor: 'pointer' }}>
                 <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
               </div>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <p style={{ fontWeight: 'bold' }}>Require Email Verification</p>
                 <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Send verification link upon signup.</p>
               </div>
               <div style={{ width: '50px', height: '26px', background: 'var(--secondary)', borderRadius: '2rem', position: 'relative', cursor: 'pointer' }}>
                 <div style={{ width: '22px', height: '22px', background: '#9ca3af', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }}></div>
               </div>
             </div>
          </div>
        </div>

        <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
             <Lock size={24} color="var(--accent)" />
             <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>API & Keys</h3>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>OpenAI API Key</label>
             <input 
               type="password"
               defaultValue="sk-........................"
               style={{
                 width: '100%',
                 padding: '0.75rem',
                 borderRadius: '0.5rem',
                 background: 'var(--background)',
                 border: '1px solid var(--card-border)',
                 color: 'white'
               }}
             />
          </div>
          <button style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
