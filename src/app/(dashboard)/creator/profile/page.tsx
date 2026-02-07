"use client";

import { useAuth } from '@/context/AuthContext';
import { Camera, Save } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Profile Settings</h1>

      <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={32} color="#9ca3af" />
          </div>
          <button style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Change Photo</button>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
            <input 
              type="text" 
              defaultValue={user?.name}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--secondary)',
                background: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              defaultValue={user?.email}
              disabled
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--secondary)',
                background: 'var(--background)',
                color: '#6b7280',
                cursor: 'not-allowed'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Niche</label>
            <input 
              type="text" 
              placeholder="e.g. Tech, Lifestyle, Fitness"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--secondary)',
                background: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
          </div>
          
          <button 
            type="button" 
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
