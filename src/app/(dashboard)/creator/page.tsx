"use client";

import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, Sparkles, TrendingUp, Users, Zap, PlayCircle, Video, Image as ImageIcon, Instagram, Youtube, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string>('Initializing AI Agent...');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            // 1. Fetch Real YouTube Data
            const res = await fetch('/api/youtube/channel');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                
                // 2. Trigger AI Analysis
                const aiRes = await fetch('/api/ai/analyzeChannel', {
                    method: 'POST',
                    body: JSON.stringify({ stats: data })
                });
                const aiData = await aiRes.json();
                setAdvice(aiData.analysis);
            }
        } catch (error) {
            console.error(error);
            setAdvice('Connect your YouTube channel to get AI insights.');
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  // Format chart data from videos
  const chartData = stats?.videos?.map((v: any) => ({
      name:  v.title.substring(0, 10) + '...',
      engagement: parseInt(v.views) // Mapping views to engagement for the chart
  })).reverse() || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Ready to create, <span className="text-gradient text-glow">{user?.name?.split(' ')[0]}?</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
             {stats?.title ? `Tracking ${stats.title}` : 'Connect your account to enable real-time tracking.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/creator/multi-post" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} /> New Post
            </Link>
            <Link href="/creator/ai-studio" className="btn-primary neon-border" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} /> Open Studio
            </Link>
        </div>
      </header>

      {/* Unified Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <DashboardCard 
          title="Total Creator Score" 
          value="88/100" 
          sub="Combined Health" 
          icon={Zap} 
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" 
          href="/creator/analytics"
        />
        <DashboardCard 
          title="YouTube Performance" 
          value={stats?.subscriberCount ? parseInt(stats.subscriberCount).toLocaleString() : "Connect"} 
          sub="Live Subscribers" 
          icon={Youtube} 
          gradient="linear-gradient(135deg, #ff0000 0%, #cc0000 100%)" 
          href="/creator/analytics"
        />
        <DashboardCard 
          title="Instagram Health" 
          value="Good" 
          sub="Engagement Trending Up" 
          icon={Instagram} 
          gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)" 
          href="/creator/analytics"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Chart Area */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem' }}>Engagement Analytics</h3>
           <div style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#52525b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* AI Coach */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', boxShadow: '0 0 10px #ec4899' }}></div>
              AI Coach
            </h3>
          </div>
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '1rem 1rem 1rem 0', marginBottom: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                {advice} 🚀
              </p>
            </div>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>Ask for more tips</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActivityIcon = ({size, color}: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

function DashboardCard({ title, value, sub, icon: Icon, gradient, href }: any) {
  const CardContent = (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', height: '100%', cursor: href ? 'pointer' : 'default', transition: 'transform 0.2s' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: gradient, filter: 'blur(20px)' }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{value}</h3>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Icon size={20} color="white" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <span style={{ fontSize: '0.8rem', color: '#d4d4d8' }}>{sub}</span>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{CardContent}</Link> : CardContent;
}
