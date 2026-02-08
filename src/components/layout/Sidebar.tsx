"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  BarChart2, 
  Calendar, 
  Share2, 
  Users, 
  DollarSign, 
  Settings, 
  LogOut,
  ShieldAlert,
  Link as LinkIcon
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const creatorLinks = [
    { name: 'Dashboard', href: '/creator', icon: LayoutDashboard },
    { name: 'AI Studio', href: '/creator/ai-studio', icon: Sparkles },
    { name: 'Connect', href: '/creator/connect', icon: LinkIcon },
    { name: 'Analytics', href: '/creator/analytics', icon: BarChart2 },
    { name: 'Planner', href: '/creator/planner', icon: Calendar },
    { name: 'Multi-Post', href: '/creator/multi-post', icon: Share2 },
    { name: 'Community', href: '/creator/community', icon: Users },
    { name: 'Monetization', href: '/creator/monetization', icon: DollarSign },
    { name: 'Profile', href: '/creator/profile', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'AI Reports', href: '/admin/reports', icon: Sparkles },
    { name: 'Community', href: '/admin/community', icon: ShieldAlert },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = user.role === 'admin' ? adminLinks : creatorLinks;

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'var(--gradient-primary)', 
          borderRadius: '10px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>CreatorOS</span>
            <span style={{ fontSize: '0.65rem', color: '#a1a1aa', letterSpacing: '0.1em' }}>v2.0.1 PRO</span>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 600, paddingLeft: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</p>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                color: isActive ? 'white' : '#a1a1aa',
                background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                fontWeight: 500,
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              <Icon size={18} color={isActive ? '#c4b5fd' : 'currentColor'} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '0.75rem', 
          borderRadius: '0.75rem',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          marginBottom: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(to right, #4f46e5, #9333ea)', borderRadius: '50%' }}></div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'User'}</p>
            <p style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{user.role} Plan</p>
          </div>
        </div>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            width: '100%',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
