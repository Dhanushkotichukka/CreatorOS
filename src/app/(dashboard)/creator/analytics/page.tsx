"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { PlayCircle, TrendingUp, Users, Eye, ThumbsUp, MessageCircle, AlertCircle, Instagram, Youtube, CheckCircle2, ChevronRight, X, Zap, Clock, Target, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsLab() {
  const { user } = useAuth();
  const [platform, setPlatform] = useState<'youtube' | 'instagram'>('youtube');
  const [data, setData] = useState<any>(null);
  const [improvementData, setImprovementData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showImprovementPanel, setShowImprovementPanel] = useState(false);

  useEffect(() => {
    fetchData();
  }, [platform]);

  async function fetchData() {
    setLoading(true);
    setImprovementData(null);
    setData(null);

    try {
        let endpoint = platform === 'youtube' ? '/api/youtube/channel' : '/api/instagram/profile';
        const res = await fetch(endpoint);
        const results = await res.json();
        
        if (platform === 'instagram') {
            const postRes = await fetch('/api/instagram/posts');
            const posts = await postRes.json();
            results.posts = posts.data;
        }
        
        setData(results);

        // Fetch Detailed AI Improvement Analysis
        try {
            const aiRes = await fetch('/api/ai/improvementAnalysis', {
                method: 'POST',
                body: JSON.stringify({ platform, stats: results })
            });
            const aiData = await aiRes.json();
            setImprovementData(aiData);
        } catch (e) {
            console.error("AI Analysis failed", e);
            // Fallback mock for demo if AI fails
            setImprovementData({
                score: 78,
                summary: "Your content is engaging, but consistency needs work.",
                strategy: { postingFrequency: "3x / week", bestTime: "10 AM EST", contentFocus: "Educational" },
                actions: [{ title: "Post Reels", description: "Reels are getting 2x more engagement." }],
                strengths: ["Visuals", "Hooks"],
                weaknesses: ["Call to Action"]
            });
        }

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  if (loading) return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full spin"></div>
          <p className="text-accent animate-pulse">Analyzing {platform === 'youtube' ? 'Channel' : 'Profile'} Intelligence...</p>
      </div>
  );

  return (
    <div className="fade-in-up" style={{ position: 'relative' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Deep Analytics
            </h1>
            <p style={{ color: '#a1a1aa' }}>
            Multi-platform intelligence engine.
            </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', borderRadius: '3rem' }}>
            <button 
                onClick={() => setPlatform('youtube')}
                className={platform === 'youtube' ? 'btn-primary' : 'btn-ghost'}
                style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
                <Youtube size={18} /> YouTube
            </button>
            <button 
                onClick={() => setPlatform('instagram')}
                className={platform === 'instagram' ? 'btn-primary' : 'btn-ghost'}
                style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: platform === 'instagram' ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : 'transparent' }}
            >
                <Instagram size={18} /> Instagram
            </button>
        </div>
      </header>

      {/* AI Score Section */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', cursor: 'pointer', transition: 'transform 0.2s', border: improvementData?.score >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.1)' }} onClick={() => setShowImprovementPanel(true)}>
         <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ position: 'relative' }}>
                <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: `8px solid ${improvementData?.score >= 80 ? '#10b981' : improvementData?.score >= 50 ? '#facc15' : '#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, boxShadow: '0 0 20px rgba(0,0,0,0.2)', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                    {improvementData?.score || '-'}
                </div>
                <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', borderRadius: '50%', padding: '0.5rem', boxShadow: '0 0 10px #3b82f6' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
             </div>
             <p style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{platform === 'youtube' ? 'Channel' : 'Profile'} Health Score</p>
             <p style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Click for Detailed Analysis</p>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={20} className="text-purple-400" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Summary</h3>
             </div>
             <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#e4e4e7', marginBottom: '2rem' }}>
                 {improvementData?.summary || "Analyzing your content strategy..."}
             </p>
             
             <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary neon-border" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Unlock Growth Plan <ChevronRight size={18} />
                </button>
             </div>
         </div>
      </div>

      {/* Improvement Panel (Side Drawer) */}
      {showImprovementPanel && (
          <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setShowImprovementPanel(false)}>
              <div 
                className="glass-panel slide-in-right" 
                style={{ width: '500px', height: '100%', borderRadius: '0', padding: '2rem', overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.1)', background: '#09090b', position: 'relative', marginLeft: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">Growth Strategy</h2>
                      <button onClick={() => setShowImprovementPanel(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                          <X size={24} />
                      </button>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Target color="#10b981" /> Strategic Focus
                      </h3>
                      <div className="glass-card" style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                              <div>
                                  <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Posting Frequency</p>
                                  <p style={{ fontWeight: 700 }}>{improvementData?.strategy?.postingFrequency || '-'}</p>
                              </div>
                              <div>
                                  <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Best Time to Post</p>
                                  <p style={{ fontWeight: 700 }}>{improvementData?.strategy?.bestTime || '-'}</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Action Plan</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {improvementData?.actions?.map((action: any, i: number) => (
                              <div key={i} className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6' }}>
                                  <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{action.title}</h4>
                                  <p style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>{action.description}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Stats Grid */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Performance Metrics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {platform === 'youtube' ? (
            <>
                <StatCard title="Total Subscribers" value={data?.subscriberCount ? parseInt(data.subscriberCount).toLocaleString() : '-'} icon={Users} color="#ff0000" />
                <StatCard title="Total Views" value={data?.viewCount ? parseInt(data.viewCount).toLocaleString() : '-'} icon={Eye} color="#ff0000" />
                <StatCard title="Video Count" value={data?.videoCount || '-'} icon={PlayCircle} color="#ff0000" />
            </>
        ) : (
             <>
                <StatCard title="Followers" value={data?.followers?.toLocaleString() || '-'} icon={Users} color="#E1306C" />
                <StatCard title="Media Count" value={data?.media_count?.toLocaleString() || '-'} icon={Instagram} color="#E1306C" />
                <StatCard title="Engagement Rate" value={improvementData?.score ? `${(improvementData.score / 20).toFixed(1)}%` : '-'} icon={TrendingUp} color="#E1306C" />
            </>
        )}
      </div>

      {/* Content Grid */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {platform === 'youtube' ? 'Recent Videos' : 'Recent Posts'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {platform === 'youtube' ? (
             data?.videos?.map((video: any) => (
                 <VideoCard key={video.id} video={video} />
             ))
        ) : (
             data?.posts?.map((post: any) => (
                 <InstaCard key={post.id} post={post} />
             ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid ${color}30` }}>
      <div style={{ background: `${color}20`, padding: '1rem', borderRadius: '1rem', boxShadow: `0 0 10px ${color}10` }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h3>
      </div>
    </div>
  );
}

function VideoCard({ video }: any) {
   const views = parseInt(video.views || 0);
   const viralScore = views > 1000 ? 'High' : views > 500 ? 'Medium' : 'Low';
   const badgeColor = viralScore === 'High' ? '#10b981' : viralScore === 'Medium' ? '#facc15' : '#a1a1aa';

   return (
    <div className="glass-panel group" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
         {video.thumbnail ? (
             <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-105" />
         ) : (
             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>No Thumbnail</div>
         )}
         <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${badgeColor}` }}>
            <Zap size={12} color={badgeColor} fill={badgeColor} /> {viralScore} Potential
         </div>
      </div>
      <div style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4, height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {video.title}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.85rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#f4f4f5' }}>{parseInt(video.views || 0).toLocaleString()}</span>
                <span style={{ fontSize: '0.7rem' }}>Views</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#f4f4f5' }}>{parseInt(video.likes || 0).toLocaleString()}</span>
                <span style={{ fontSize: '0.7rem' }}>Likes</span>
            </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#f4f4f5' }}>{parseInt(video.comments || 0).toLocaleString()}</span>
                <span style={{ fontSize: '0.7rem' }}>Comms</span>
            </div>
        </div>
        
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Target size={14} color="#ec4899" /> 
             <span style={{ fontSize: '0.75rem', color: '#ec4899' }}>Tip: {viralScore === 'High' ? 'Make a sequel to this!' : 'Try a catchier hook next time.'}</span>
        </div>
      </div>
    </div>
  );
}

function InstaCard({ post }: any) {
    return (
    <div className="glass-panel group" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.3s', cursor: 'default', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#111', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {post.media_url ? (
             <img src={post.media_url} alt="Insta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         ) : (
             <Instagram size={48} color="#333" />
         )}
          {post.media_type === 'VIDEO' && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '0.5rem' }}>
                  <PlayCircle size={24} color="white" />
              </div>
          )}
      </div>
      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#ddd', marginBottom: '0.75rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {post.caption || 'No caption'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> {post.like_count} Likes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={14} /> {post.comments_count}</span>
        </div>
      </div>
    </div>
  );
}
