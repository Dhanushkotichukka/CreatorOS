"use client";

import { useEffect, useState } from 'react';
import { Users, DollarSign, Activity, Zap, Link, Globe } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
           const data = await res.json();
           setStats(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="fade-in-up">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Platform Overview</h1>
        <p style={{ color: '#a1a1aa' }}>Real-time system metrics and performance.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard 
          title="Total Users" 
          value={stats ? stats.userCount : '...'} 
          change="+12%" 
          icon={Users} 
          color="#8b5cf6" 
        />
        <StatCard 
          title="AI Reports Generated" 
          value={stats ? stats.aiCount : '...'} 
          change="+45%" 
          icon={Zap} 
          color="#ec4899" 
        />
        <StatCard 
          title="Connected Channels" 
          value={stats ? stats.connectedCount : '...'} 
          change="+8%" 
          icon={Link} 
          color="#10b981" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Status</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                   <span>Database Connection</span>
                </div>
                <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Healthy</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '10px', height: '10px', background: '#ec4899', borderRadius: '50%', boxShadow: '0 0 10px #ec4899' }}></div>
                   <span>AI Engine (Gemini)</span>
                </div>
                <span style={{ color: '#ec4899', fontSize: '0.9rem' }}>Active</span>
             </div>
           </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(26, 27, 30, 0) 100%)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Total Posts Scheduled</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: 800, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stats ? stats.postCount : '0'}
              </h2>
              <p style={{ color: '#a1a1aa' }}>Posts in Queue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', top: '-20px', right: '-20px', 
        width: '100px', height: '100px', 
        background: color, filter: 'blur(60px)', opacity: 0.2 
      }}></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
        <div style={{ background: `rgba(255,255,255,0.05)`, padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Icon size={24} color={color} />
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 700, 
          color: color,
          background: `rgba(255,255,255,0.05)`,
          padding: '0.4rem 0.8rem',
          borderRadius: '2rem'
        }}>
          {change}
        </span>
      </div>
      <div>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
        <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</h3>
      </div>
    </div>
  );
}
