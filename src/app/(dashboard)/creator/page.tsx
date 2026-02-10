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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      {/* 1. TOP HEADER: Creator Vital Signs */}
      <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{user?.name?.split(' ')[0]}</span>
              </h1>
              <span className="w-fit px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs font-mono text-zinc-400">v2.0 PRO</span>
           </div>
           <p className="text-zinc-400 text-lg">Your operating system is ready.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <Link href="/creator/multi-post" className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all flex items-center gap-2 border border-zinc-700 transform hover:scale-105 active:scale-95">
                <Edit3 size={18} /> 
                <span>Create</span>
            </Link>
            <Link href="/creator/ai-studio" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 transform hover:scale-105 active:scale-95">
                <Sparkles size={18} /> 
                <span>AI Studio</span>
            </Link>
            <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN HUD: Health, Streak, Momentum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Creator Health Score Ring (Span 4) */}
        <div className="lg:col-span-4 glass-panel p-8 relative overflow-hidden group min-h-[400px] flex flex-col justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col items-center relative z-10">
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                    {/* Background Ring */}
                    <div className="absolute inset-0 rounded-full border-[12px] border-zinc-800/50" />
                    
                    {/* Foreground Ring - Using simpler CSS approach for reliability */}
                    <svg className="w-full h-full rotate-[-90deg] relative z-20">
                         <circle 
                            cx="50%" cy="50%" r="84" // (48 * 4 / 2) - stroke/2 roughly
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="12" 
                            strokeDasharray={527} // 2 * PI * 84
                            strokeDashoffset={527 - (527 * (brain?.healthScore || 0)) / 100} 
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white tracking-tighter">{brain?.healthScore}</span>
                        <span className="text-sm text-emerald-400 font-bold uppercase tracking-widest mt-1">Health</span>
                    </div>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Status</p>
                        <p className="font-bold text-emerald-400 text-lg">{brain?.healthScore && brain.healthScore > 80 ? 'Elite' : 'Growing'}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Trend</p>
                        <p className="font-bold text-white text-lg flex items-center justify-center gap-1">
                            {brain?.growthTrend}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Vital Signs (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Streak Bar */}
            <div className="glass-panel p-8 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                    <div className="flex items-center gap-4">
                         <div className="p-4 bg-orange-500/10 rounded-2xl ring-1 ring-orange-500/20">
                            <Flame size={32} className="text-orange-500 animate-pulse" />
                         </div>
                         <div>
                             <p className="text-zinc-400 text-sm font-medium mb-1">Posting Streak</p>
                             <h3 className="text-3xl font-bold flex items-center gap-2 text-white">
                                 {brain?.streak} Days <span className="text-sm font-normal text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">consecutive</span>
                             </h3>
                         </div>
                    </div>
                    {/* Fire Animation Bars - Adjusted for better visibility */}
                    <div className="flex gap-1.5 items-end h-12">
                        {[...Array(7)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-3 rounded-full transition-all duration-500 ${i < (brain?.streak || 0) % 8 ? 'bg-gradient-to-t from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-zinc-800/50'}`} 
                                style={{ height: `${Math.random() * 40 + 30}%` }} 
                            />
                        ))}
                    </div>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full bg-zinc-900/50 h-4 rounded-full overflow-hidden border border-zinc-800/50 relative">
                     {/* Glossy overlay */}
                     <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{ width: `${Math.min((brain?.streak || 0) * 10, 100)}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]" />
                    </div>
                </div>
            </div>

            {/* Platform Overview Cards (Mini) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <Link href="/creator/analytics?tab=youtube" className="glass-panel p-6 flex flex-col justify-between hover:bg-zinc-800/50 transition-all group border-l-[6px] border-l-red-600 relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500">
                        <Youtube size={120} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex flex-col">
                            <span className="text-zinc-400 text-xs font-bold uppercase mb-2 tracking-wider">YouTube</span>
                            <span className="text-4xl font-bold text-white group-hover:translate-x-1 transition-transform origin-left">
                                {brain?.youtube?.connected ? brain.youtube.subscribers.toLocaleString() : 'Connect'}
                            </span>
                        </div>
                        <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                            <Youtube size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6 text-sm font-medium">
                        {brain?.youtube?.connected ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                                <TrendingUp size={14} /> {brain.youtube.growth}
                            </span>
                        ) : <span className="text-zinc-500">Tap to link channel</span>}
                    </div>
                </Link>

                <Link href="/creator/connect" className="glass-panel p-6 flex flex-col justify-between hover:bg-zinc-800/50 transition-all group border-l-[6px] border-l-pink-600 relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500">
                         <Instagram size={120} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                         <div className="flex flex-col">
                            <span className="text-zinc-400 text-xs font-bold uppercase mb-2 tracking-wider">Instagram</span>
                            <span className="text-4xl font-bold text-white group-hover:translate-x-1 transition-transform origin-left">
                                {brain?.instagram?.connected ? brain.instagram.followers.toLocaleString() : 'Connect'}
                            </span>
                        </div>
                         <div className="p-3 rounded-full bg-pink-500/10 text-pink-500">
                            <Instagram size={24} />
                        </div>
                    </div>
                     <div className="flex items-center gap-2 mt-6 text-sm font-medium">
                        {brain?.instagram?.connected ? (
                             <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                                <TrendingUp size={14} /> {brain.instagram.growth}
                            </span>
                        ) : <span className="text-zinc-500">Tap to link account</span>}
                    </div>
                </Link>
            </div>
        </div>
      </div>

      {/* 3. BOTTOM PANEL: AI Coach & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Daily Coach */}
          <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full" />
               <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start">
                   <div className="flex sm:flex-col items-center gap-3 shrink-0">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-white/5">
                           <Sparkles size={32} className="text-white animate-pulse" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 text-center">AI Coach</span>
                   </div>
                   
                   <div className="flex-1 w-full">
                       <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Daily Briefing</h3>
                            <span className="text-xs text-zinc-500 font-mono">{new Date().toLocaleDateString()}</span>
                       </div>
                       
                       <p className="text-lg text-zinc-300 leading-relaxed mb-8 font-light italic border-l-4 border-indigo-500/50 pl-4">
                           "{brain?.aiCoachMessage}"
                       </p>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {brain?.actionItems.map((item, i) => (
                               <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${item.type === 'urgent' ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800'}`}>
                                   {item.type === 'urgent' ? <Activity size={20} className="text-red-400 mt-0.5 shrink-0" /> : <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 shrink-0" />}
                                   <div>
                                       <p className="text-sm font-semibold text-white">{item.title}</p>
                                       <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1 tracking-wider">{item.type}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
          </div>

          {/* Quick Actions / Next Idea */}
          <div className="glass-panel p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800">
              <div>
                  <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Zap size={16} /> Viral Opportunity
                  </h4>
                  <div className="mb-8">
                      <p className="text-sm text-zinc-500 mb-2">Based on your niche, try this:</p>
                      <p className="text-2xl font-bold text-white leading-tight">
                          {brain?.nextViralIdea}
                      </p>
                  </div>
              </div>
              
              <Link href="/creator/ai-studio" className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors group">
                  Open Studio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>

      </div>
    </div>
  );
}
