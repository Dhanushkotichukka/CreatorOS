"use client";

import { useAuth } from '@/context/AuthContext';
import { Sparkles, TrendingUp, Users, Zap, Flame, Youtube, Instagram, Edit3, ArrowRight, Activity, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { fetchCreatorIntelligence, CreatorIntelligence } from '@/lib/creatorBrain';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [brain, setBrain] = useState<CreatorIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntelligence() {
        const data = await fetchCreatorIntelligence();
        setBrain(data);
        setLoading(false);
    }
    loadIntelligence();
  }, []);

  if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full spin" />
          <p className="text-zinc-400 animate-pulse">Booting CreatorOS...</p>
      </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="fade-in-up">
      {/* 1. TOP HEADER: Creator Vital Signs */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight">
                Hello, <span className="text-gradient hover:blur-sm transition-all duration-300 cursor-default">{user?.name?.split(' ')[0]}</span>
              </h1>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-400">v2.0</span>
           </div>
           <p className="text-zinc-400 text-lg">Your operating system is ready.</p>
        </div>
        
        <div className="flex gap-4">
            <Link href="/creator/multi-post" className="btn-secondary flex items-center gap-2 group">
                <Edit3 size={18} className="group-hover:rotate-12 transition-transform" /> 
                <span className="hidden sm:inline">Create</span>
            </Link>
            <Link href="/creator/ai-studio" className="btn-primary neon-border flex items-center gap-2">
                <Sparkles size={18} className="animate-pulse" /> 
                <span className="hidden sm:inline">AI Studio</span>
            </Link>
            <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN HUD: Health, Streak, Momentum */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Creator Health Score Ring (Span 4) */}
        <div className="col-span-1 md:col-span-5 lg:col-span-4 glass-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
            
            <div className="flex flex-col items-center relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    {/* Background Ring */}
                    <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <circle 
                            cx="80" cy="80" r="70" fill="none" stroke="#10b981" strokeWidth="12" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * (brain?.healthScore || 0)) / 100} 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-black text-white tracking-tighter">{brain?.healthScore}</span>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1">Health</span>
                    </div>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Status</p>
                        <p className="font-bold text-emerald-400">{brain?.healthScore && brain.healthScore > 80 ? 'Elite' : 'Growing'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Trend</p>
                        <p className="font-bold text-white">{brain?.growthTrend}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Vital Signs (Span 8) */}
        <div className="col-span-1 md:col-span-7 lg:col-span-8 flex flex-col gap-6">
            
            {/* Streak Bar */}
            <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                         <div className="p-3 bg-orange-500/10 rounded-xl">
                            <Flame size={24} className="text-orange-500 animate-pulse" />
                         </div>
                         <div>
                             <p className="text-zinc-400 text-sm font-medium">Posting Streak</p>
                             <h3 className="text-2xl font-bold flex items-center gap-2">
                                 {brain?.streak} Days <span className="text-sm font-normal text-zinc-500">consecutive</span>
                             </h3>
                         </div>
                    </div>
                    {/* Fire Animation Bars */}
                    <div className="flex gap-1 items-end h-8">
                        {[...Array(7)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2 rounded-full transition-all duration-500 ${i < (brain?.streak || 0) % 8 ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-zinc-800'}`} 
                                style={{ height: `${Math.random() * 20 + 40}%` }} 
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 w-[15%]" style={{ width: `${Math.min((brain?.streak || 0) * 10, 100)}%` }} />
                </div>
            </div>

            {/* Platform Overview Cards (Mini) */}
            <div className="grid grid-cols-2 gap-6 h-full">
                <Link href="/creator/analytics?tab=youtube" className="glass-panel p-5 flex flex-col justify-between hover:bg-white/5 transition-colors group border-l-4 border-l-red-600">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-zinc-400 text-xs font-bold uppercase mb-1">YouTube</span>
                            <span className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                                {brain?.youtube?.connected ? brain.youtube.subscribers.toLocaleString() : 'Connect'}
                            </span>
                        </div>
                        <Youtube size={24} className="text-red-600 opacity-80" />
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
                        {brain?.youtube?.connected ? (
                            <><TrendingUp size={12} className="text-green-500" /> {brain.youtube.growth} this week</>
                        ) : 'Tap to link channel'}
                    </div>
                </Link>

                <Link href="/creator/connect" className="glass-panel p-5 flex flex-col justify-between hover:bg-white/5 transition-colors group border-l-4 border-l-pink-600">
                    <div className="flex justify-between items-start">
                         <div className="flex flex-col">
                            <span className="text-zinc-400 text-xs font-bold uppercase mb-1">Instagram</span>
                            <span className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                                {brain?.instagram?.connected ? brain.instagram.followers.toLocaleString() : 'Connect'}
                            </span>
                        </div>
                        <Instagram size={24} className="text-pink-600 opacity-80" />
                    </div>
                     <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
                        {brain?.instagram?.connected ? (
                            <><TrendingUp size={12} className="text-green-500" /> {brain.instagram.growth} this week</>
                        ) : 'Tap to link account'}
                    </div>
                </Link>
            </div>
        </div>
      </div>

      {/* 3. BOTTOM PANEL: AI Coach & Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* AI Daily Coach */}
          <div className="md:col-span-2 glass-panel p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
               <div className="relative z-10 flex gap-6 items-start">
                   <div className="hidden sm:flex flex-col items-center gap-2">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                           <Sparkles size={32} className="text-white animate-pulse" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">AI Coach</span>
                   </div>
                   
                   <div className="flex-1">
                       <h3 className="text-xl font-bold text-white mb-2">Daily Briefing</h3>
                       <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                           "{brain?.aiCoachMessage}"
                       </p>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {brain?.actionItems.map((item, i) => (
                               <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${item.type === 'urgent' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                                   {item.type === 'urgent' ? <Activity size={18} className="text-red-400 mt-1 shrink-0" /> : <CheckCircle2 size={18} className="text-emerald-400 mt-1 shrink-0" />}
                                   <div>
                                       <p className="text-sm font-medium text-white">{item.title}</p>
                                       <p className="text-xs text-zinc-500 uppercase font-bold mt-1">{item.type}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
          </div>

          {/* Quick Actions / Next Idea */}
          <div className="glass-panel p-6 flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent">
              <div>
                  <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap size={14} className="text-yellow-400" /> Opportunity
                  </h4>
                  <div className="mb-6">
                      <p className="text-sm text-zinc-500 mb-1">Next Viral Concept</p>
                      <p className="text-xl font-bold text-white leading-tight">
                          {brain?.nextViralIdea}
                      </p>
                  </div>
              </div>
              
              <Link href="/creator/ai-studio" className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                  Open Studio <ArrowRight size={18} />
              </Link>
          </div>

      </div>
    </div>
  );
}
