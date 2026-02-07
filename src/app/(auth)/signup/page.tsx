"use client";

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setLoading(true);
    await signup('google');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.1), rgba(0,0,0,0))' }} />
      
      <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ margin: '0 auto', width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
            <Sparkles color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join CreatorOS</h1>
          <p style={{ color: '#a1a1aa' }}>Start your AI-powered journey today.</p>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.875rem', fontSize: '1rem', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}
        >
            {loading ? (
                <span>Creating Account...</span>
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

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#a1a1aa' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
