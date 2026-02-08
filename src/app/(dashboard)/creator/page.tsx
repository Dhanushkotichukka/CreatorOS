"use client";

import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, Sparkles, TrendingUp, Users, Zap, Flame, Youtube, Instagram, Edit3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
        try {
            const res = await fetch('/api/dashboard/overview');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center" style={{ color: '#a1a1aa' }}>Loading your command center...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="fade-in-up">
      {/* Header Section */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                Welcome back, <span className="text-gradient text-glow">{user?.name?.split(' ')[0]}</span>
              </h1>
              <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2rem', border: '1px solid rgba(249, 115, 22, 0.3)', background: 'rgba(249, 115, 22, 0.1)' }}>
                  <Flame size={18} color="#f97316" fill="#f97316" className="pulse" />
                  <span style={{ fontWeight: 700, color: '#ffedd5' }}>{stats?.streak || 0} Day Streak</span>
              </div>
          </div>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
             Here is your daily creator intelligence report.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/creator/multi-post" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} /> New Post
            </Link>
            <Link href="/creator/ai-studio" className="btn-primary neon-border" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} /> AI Studio
            </Link>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Creator Health Score (Large Card) */}
        <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#27272a" strokeWidth="12" />
                    <circle 
                        cx="80" cy="80" r="70" fill="none" stroke="#10b981" strokeWidth="12" 
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (440 * (stats?.healthScore || 0)) / 100} 
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>{stats?.healthScore || 0}</span>
                </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Health Score</h3>
            <p style={{ color: '#a1a1aa', textAlign: 'center', fontSize: '0.9rem' }}>Based on consistency, growth, and engagement across all platforms.</p>
        </div>

        {/* Platform Cards (Split) */}
        <div style={{ gridColumn: 'span 8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* YouTube Card */}
            <DashboardCard 
                title="YouTube"
                value={stats?.youtube?.connected ? stats.youtube.subscribers?.toLocaleString() : "Connect"}
                sub={stats?.youtube?.connected ? `${stats.youtube.growth} this week` : "Link Channel"}
                icon={Youtube}
                gradient="linear-gradient(135deg, #ff0000 0%, #cc0000 100%)"
                href="/creator/analytics?tab=youtube"
                connected={stats?.youtube?.connected}
            />

            {/* Instagram Card */}
            <DashboardCard 
                title="Instagram"
                value={stats?.instagram?.connected ? stats.instagram.followers?.toLocaleString() : "Connect"}
                sub={stats?.instagram?.connected ? `${stats.instagram.growth} this week` : "Link Account"}
                icon={Instagram}
                gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
                href="/creator/connect"
                connected={stats?.instagram?.connected}
            />

        {/* AI Insight Card */}
            <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(0,0,0,0) 100%)' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles color="white" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>AI Action Item</h4>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>{stats?.suggestion || "Your streak is on fire! 🔥 Schedule a Reel for tomorrow to maintain momentum."}</p>
                </div>
                <button className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    View Plan <ArrowRight size={16} />
                </button>
            </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{ gridColumn: 'span 12', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Instagram size={24} color="#ec4899" /> Recent Instagram Activity
            </h3>
            
            {stats?.instagram?.recentMedia && stats.instagram.recentMedia.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {stats.instagram.recentMedia.map((post: any) => (
                        <div key={post.id} className="glass-panel card-hover" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {post.media_url ? (
                                <img src={post.media_url} alt="Post" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                            ) : (
                                <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Instagram size={24} />
                                </div>
                            )}
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {post.caption || 'No Caption'}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                                    <span>❤️ {post.like_count}</span>
                                    <span>💬 {post.comments_count}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#52525b', marginTop: '0.25rem' }}>
                                    {new Date(post.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                    No recent activity found. Connect Instagram to see your latest posts here.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, sub, icon: Icon, gradient, href, connected }: any) {
  return (
    <Link href={href} className="glass-panel card-hover" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: gradient, filter: 'blur(50px)', opacity: 0.2 }}></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
            <Icon size={24} color="white" />
          </div>
          {!connected && <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Not Connected</span>}
      </div>

      <div>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem', color: 'white' }}>
            {value}
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {connected && <TrendingUp size={14} color="#10b981" />} {sub}
        </p>
      </div>
    </Link>
  );
}
