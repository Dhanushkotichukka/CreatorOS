"use client";

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await login('google');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Background Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1), rgba(0,0,0,0))' }} />
      
      <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ margin: '0 auto', width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            <Sparkles color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#a1a1aa' }}>Sign in to access your Creator Intelligence.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.875rem', fontSize: '1rem' }}
        >
            {loading ? (
                <span>Connecting...</span>
            ) : (
                <>
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                        <path
                            fill="#ffffff"
                            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                        />
                    </svg>
                    Continue with Google
                    <ArrowRight size={18} />
                </>
            )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#52525b', marginTop: '1.5rem' }}>
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
