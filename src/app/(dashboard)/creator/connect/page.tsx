"use client";

import { useAuth } from '@/context/AuthContext';
import { Youtube, Instagram, CheckCircle, RefreshCw, AlertCircle, Trash2, Link as LinkIcon, ExternalLink, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Connect() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const [instagramData, setInstagramData] = useState<any>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchYouTube(), fetchInstagram()]);
    setLoading(false);
  };

  const fetchYouTube = async () => {
    try {
      const res = await fetch('/api/youtube/channel');
      if (res.ok) {
        const data = await res.json();
        setChannelData(data);
      } else {
        setChannelData(null);
      }
    } catch (e) {
      console.error(e);
      setChannelData(null);
    }
  };

  const fetchInstagram = async () => {
    try {
      // Add timestamp to prevent browser caching
      const res = await fetch(`/api/instagram/profile?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setInstagramData(data);
      } else {
        setInstagramData(null);
      }
    } catch (e) {
      console.error(e);
      setInstagramData(null);
    }
  };

  const handleYouTubeConnect = () => {
      signIn('google');
  };

  const handleInstagramConnect = () => {
      window.location.href = '/api/instagram/connect';
  };

  const handleDisconnect = async (provider: string) => {
    if(!confirm(`Are you sure you want to disconnect ${provider}?`)) return;

    setLoading(true);
    try {
        const res = await fetch('/api/auth/disconnect', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider })
        });
        
        const data = await res.json();

        if (res.ok) {
            if (provider === 'google' || provider === 'youtube') setChannelData(null);
            if (provider === 'instagram') setInstagramData(null);
            // Force a refresh of the page to ensure all states are cleared
            router.refresh();
        } else {
            alert(data.error || 'Failed to disconnect');
        }
    } catch (e) {
        console.error(e);
        alert('An error occurred during disconnection');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 ring-1 ring-blue-500/20">
            <LinkIcon size={32} className="text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4">
          Connect & Sync
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Link your accounts to unlock AI-powered insights and growth tracking.
        </p>
      </header>

      {errorParam && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-300">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
                <p className="font-bold mb-1">Connection Failed</p>
                <p className="text-sm opacity-90">
                    {getErrorMessage(errorParam)}
                </p>
                {searchParams.get('debug') && (
                    <div className="mt-2 p-2 bg-black/30 rounded-lg text-xs font-mono break-all">
                        <strong>Debug Info:</strong> {decodeURIComponent(searchParams.get('debug')!)}
                    </div>
                )}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* YouTube Card */}
        <div className="glass-panel p-8 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
            <Youtube size={200} />
          </div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-red-600/10 rounded-2xl ring-1 ring-red-600/20">
                    <Youtube size={32} className="text-red-600" />
                </div>
                {channelData && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                    <CheckCircle size={12} /> Connected
                  </span>
                )}
              </div>
            
              <h3 className="text-2xl font-bold text-white mb-6">YouTube Channel</h3>

              {channelData ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                      <img src={channelData.thumbnail} alt="Profile" className="w-16 h-16 rounded-full border-2 border-zinc-800 shadow-xl" />
                      <div>
                          <p className="font-bold text-lg text-white">{channelData.title}</p>
                          <p className="text-zinc-500 text-sm">{channelData.customUrl}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatBox label="Subscribers" value={parseInt(channelData.subscriberCount).toLocaleString()} />
                    <StatBox label="Views" value={parseInt(channelData.viewCount).toLocaleString()} />
                    <StatBox label="Videos" value={parseInt(channelData.videoCount).toLocaleString()} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={fetchYouTube}
                        disabled={loading}
                        className="py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button 
                        onClick={() => handleDisconnect('google')}
                        disabled={loading}
                        className="py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                        Disconnect
                    </button>
                  </div>
                </>
              ) : (
                <div className="min-h-[220px] flex flex-col justify-between">
                   <p className="text-zinc-400 mb-8 leading-relaxed">
                     Connect your Google account to fetch video stats, analyze performance trends, and receive AI-powered content coaching.
                   </p>
                   <button 
                     onClick={handleYouTubeConnect}
                     className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-1"
                   >
                     <Youtube size={20} /> Connect with Google
                   </button>
                </div>
              )}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="glass-panel p-8 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
             <Instagram size={200} />
          </div>

          <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-pink-600/10 rounded-2xl ring-1 ring-pink-600/20">
                    <Instagram size={32} className="text-pink-600" />
                </div>
                {instagramData && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                    <CheckCircle size={12} /> Connected
                  </span>
                )}
              </div>

               <h3 className="text-2xl font-bold text-white mb-6">Instagram</h3>

               {instagramData ? (
                 <>
                   <div className="flex items-center gap-4 mb-8">
                      {instagramData.profile_picture_url ? (
                          <img src={instagramData.profile_picture_url} alt="Profile" className="w-16 h-16 rounded-full border-2 border-zinc-800 shadow-xl" />
                      ) : (
                          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700">
                              <Instagram size={24} className="text-zinc-500" />
                          </div>
                      )}
                      
                      <div>
                          <p className="font-bold text-lg text-white">@{instagramData.username}</p>
                          <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Business Account</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mb-8">
                      <StatBox label="Followers" value={instagramData.followers?.toLocaleString() || '-'} />
                      <StatBox label="Posts" value={instagramData.media_count?.toLocaleString() || '-'} />
                      <StatBox label="Reach" value={instagramData.reach?.toLocaleString() || '-'} />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={fetchInstagram}
                        disabled={loading}
                        className="py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button 
                        onClick={() => handleDisconnect('instagram')}
                        disabled={loading}
                        className="py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                        Disconnect
                    </button>
                  </div>
                 </>
               ) : (
                  <div className="min-h-[220px] flex flex-col justify-between">
                     <div className="text-zinc-400 mb-8 space-y-2">
                        <p>Connect your Instagram Professional account to track: </p>
                        <ul className="text-sm space-y-1 list-disc list-inside text-zinc-500 ml-1">
                            <li>Follower growth & demographics</li>
                            <li>Post reach and engagement</li>
                            <li>Viral content identification</li>
                        </ul>
                     </div>
                     <button 
                        onClick={handleInstagramConnect}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1 text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 shadow-pink-500/20"
                     >
                       <Instagram size={20} /> Connect Instagram
                     </button>
                  </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-xl text-center">
      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-white truncate">{value}</p>
    </div>
  );
}

function getErrorMessage(code: string) {
  switch (code) {
    case 'instagram_auth_failed':
      return "Authentication failed. Please try again.";
    case 'no_instagram_business_account':
      return "We couldn't find an Instagram Business account linked to your Facebook page. Please make sure you have converted your Instagram to a Business/Creator account and linked it to a Facebook Page.";
    case 'server_error':
      return "A server error occurred. Please try again later.";
    default:
      return "An unknown error occurred. Please try again.";
  }
}
