import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #a78bfa, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Creator Operating System
      </h1>
      <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: '#9ca3af' }}>
        The all-in-one AI platform to manage, grow, and monetize your creative business.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link 
          href="/login" 
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius)', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Sign In <ArrowRight size={18} />
        </Link>
        <Link 
          href="/signup" 
          style={{ 
            background: 'var(--secondary)', 
            color: 'var(--secondary-foreground)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius)', 
            fontWeight: 600
          }}
        >
          Create Account
        </Link>
      </div>
    </main>
  );
}
