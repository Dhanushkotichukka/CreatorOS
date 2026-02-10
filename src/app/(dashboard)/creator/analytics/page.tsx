"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { PlayCircle, TrendingUp, Users, Eye, ThumbsUp, MessageCircle, AlertCircle, Instagram, Youtube, CheckCircle2, ChevronRight, X, Zap, Clock, Target, CalendarDays, Sparkles, BarChart2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchCreatorIntelligence, CreatorIntelligence } from '@/lib/creatorBrain';

export default function AnalyticsLab() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'youtube' | 'instagram' | 'ai'>('overview');
  const [brain, setBrain] = useState<CreatorIntelligence | null>(null);
  
  // Platform specific detailed data
  const [platformData, setPlatformData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
        setLoading(true);
        // 1. Load Broad Intelligence (Overview)
        const intelligence = await fetchCreatorIntelligence();
        setBrain(intelligence);

        // 2. Load Specifics based on Tab
        if (activeTab === 'youtube' || activeTab === 'instagram') {
            const endpoint = activeTab === 'youtube' ? '/api/youtube/channel' : '/api/instagram/profile';
            try {
                const res = await fetch(endpoint);
                const results = await res.json();
                
                if (activeTab === 'instagram') {
                    const postRes = await fetch('/api/instagram/posts');
                    const posts = await postRes.json();
                    results.posts = posts.data;
                }
                setPlatformData(results);
            } catch (e) {
                console.error("Failed to fetch platform specifics", e);
            }
        }
        setLoading(false);
    }
    init();
  }, [activeTab]);

  return (
    <div className="fade-in-up container mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">
                Deep Analytics
            </h1>
            <p className="text-zinc-400 flex items-center gap-2">
                <LayoutDashboard size={16} /> Multi-platform intelligence engine.
            </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-black/40 p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-full">
            {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'youtube', label: 'YouTube', icon: Youtube },
                { id: 'instagram', label: 'Instagram', icon: Instagram },
                { id: 'ai', label: 'AI Insights', icon: Sparkles },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeTab === tab.id 
                        ? 'bg-white text-black shadow-lg scale-105' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <tab.icon size={16} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                    {tab.label}
                </button>
            ))}
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full spin" />
             <p className="text-zinc-500 animate-pulse">Computing Analytics...</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && brain && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Growth Momentum */}
                     <div className="glass-panel p-8 col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                            <TrendingUp className="text-indigo-400" /> Growth Velocity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Trend</p>
                                <p className="text-3xl font-black text-white">{brain.growthTrend}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Health Score</p>
                                <p className="text-3xl font-black text-emerald-400">{brain.healthScore}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Streak</p>
                                <p className="text-3xl font-black text-orange-400">{brain.streak}<span className="text-sm text-zinc-500 ml-1">days</span></p>
                            </div>
                        </div>
                    </div>
                
                    {/* YouTube Summary */}
                    <div className="glass-panel p-6 border-l-4 border-l-red-600 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setActiveTab('youtube')}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-600/10 rounded-xl"><Youtube className="text-red-600" size={24} /></div>
                            <div className={`px-2 py-1 rounded text-xs font-bold ${brain.youtube?.connected ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                {brain.youtube?.connected ? 'ACTIVE' : 'OFFLINE'}
                            </div>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">
                            {brain.youtube?.connected ? brain.youtube.subscribers.toLocaleString() : "Connect"}
                        </h4>
                        <p className="text-zinc-500 font-medium">Subscribers</p>
                    </div>

                    {/* Instagram Summary */}
                     <div className="glass-panel p-6 border-l-4 border-l-pink-600 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setActiveTab('instagram')}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-600/10 rounded-xl"><Instagram className="text-pink-600" size={24} /></div>
                            <div className={`px-2 py-1 rounded text-xs font-bold ${brain.instagram?.connected ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                {brain.instagram?.connected ? 'ACTIVE' : 'OFFLINE'}
                            </div>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">
                            {brain.instagram?.connected ? brain.instagram.followers.toLocaleString() : "Connect"}
                        </h4>
                        <p className="text-zinc-500 font-medium">Followers</p>
                    </div>
                </div>
            )}

            {/* 2. YOUTUBE TAB */}
            {activeTab === 'youtube' && platformData && (
                <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Views" value={parseInt(platformData.viewCount).toLocaleString()} icon={Eye} color="#ef4444" />
                        <StatCard title="Subscribers" value={parseInt(platformData.subscriberCount).toLocaleString()} icon={Users} color="#ef4444" />
                        <StatCard title="Videos" value={platformData.videoCount} icon={PlayCircle} color="#ef4444" />
                     </div>

                     <h3 className="text-xl font-bold text-white flex items-center gap-2"><PlayCircle /> Recent Upload Performance</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {platformData?.videos?.map((video: any) => (
                             <div key={video.id} className="glass-panel group p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-white/5">
                                 <div className="relative aspect-video bg-black">
                                     <img src={video.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                     <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-xs font-bold text-white border border-white/10">
                                         <Eye size={10} className="text-green-400" /> {parseInt(video.views).toLocaleString()}
                                     </div>
                                 </div>
                                 <div className="p-4">
                                     <h4 className="font-bold text-white line-clamp-2 text-sm mb-3 h-10">{video.title}</h4>
                                     <div className="flex gap-4 text-xs text-zinc-400">
                                         <span className="flex items-center gap-1"><ThumbsUp size={12} /> {video.likes}</span>
                                         <span className="flex items-center gap-1"><MessageCircle size={12} /> {video.comments}</span>
                                     </div>
                                 </div>
                             </div>
                        ))}
                     </div>
                </div>
            )}

            {/* 3. INSTAGRAM TAB */}
            {activeTab === 'instagram' && platformData && (
                 <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Followers" value={platformData.followers.toLocaleString()} icon={Users} color="#ec4899" />
                        <StatCard title="Media Count" value={platformData.media_count} icon={Instagram} color="#ec4899" />
                        <StatCard title="Reach" value={(platformData.followers * 0.4).toFixed(0)} icon={TrendingUp} color="#ec4899" suffix=" (est)" />
                     </div>

                     <h3 className="text-xl font-bold text-white flex items-center gap-2"><Instagram /> Recent Content</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {platformData?.posts?.map((post: any) => (
                             <div key={post.id} className="glass-panel group p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-white/5 relative">
                                 <div className="aspect-square bg-zinc-900 relative">
                                     {post.media_url ? (
                                         <img src={post.media_url} className="w-full h-full object-cover" />
                                     ) : <div className="w-full h-full flex items-center justify-center"><Instagram className="text-zinc-700" size={32} /></div>}
                                     
                                     {/* Hover Overlay */}
                                     <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                         <div className="flex items-center gap-1 text-white font-bold"><ThumbsUp size={16} className="text-pink-500" /> {post.like_count}</div>
                                         <div className="flex items-center gap-1 text-white font-bold"><MessageCircle size={16} /> {post.comments_count}</div>
                                     </div>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </div>
            )}

            {/* 4. AI INSIGHTS TAB (Aggregated) */}
            {activeTab === 'ai' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="col-span-1 md:col-span-2 glass-panel p-8 bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="p-4 bg-purple-500 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                 <Sparkles className="text-white animate-pulse" size={32} />
                             </div>
                             <div>
                                 <h2 className="text-2xl font-bold text-white">AI Strategy Engine</h2>
                                 <p className="text-purple-300">Analysis based on your comprehensive data footprint.</p>
                             </div>
                         </div>
                         <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
                             "{brain?.aiCoachMessage}"
                         </p>
                     </div>

                     
                     <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="text-emerald-500" /> Key Strengths</h3>
                         <ul className="space-y-3">
                             {['Consistent Visual Style', 'High Completion Rate on Shorts', 'Strong Commmunity Engagement'].map((item, i) => ( // Demo for layout
                                 <li key={i} className="flex items-center gap-2 text-zinc-300 bg-white/5 p-3 rounded-lg"><CheckCircle2 size={16} className="text-emerald-500" /> {item}</li>
                             ))}
                         </ul>
                     </div>

                     <div className="glass-panel p-6 border-l-4 border-l-yellow-500">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-yellow-500" /> Opportunities</h3>
                         <ul className="space-y-3">
                             {brain?.actionItems.map((item, i) => (
                                 <li key={i} className="flex items-center gap-2 text-zinc-300 bg-white/5 p-3 rounded-lg"><ArrowRight size={16} className="text-yellow-500" /> {item.title}</li>
                             ))}
                         </ul>
                     </div>
                </div>
            )}

        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, suffix }: any) {
    return (
        <div className="glass-panel p-6 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5" style={{ color }}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-zinc-500 text-xs font-bold uppercase">{title}</p>
                <h4 className="text-2xl font-black text-white">{value}<span className="text-sm font-normal text-zinc-500 ml-1">{suffix}</span></h4>
            </div>
        </div>
    )
}
