"use client";

import { useAuth } from '@/context/AuthContext';
import { Youtube, Instagram, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInstagram = async () => {
    try {
      const res = await fetch('/api/instagram/profile');
      if (res.ok) {
        const data = await res.json();
        setInstagramData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleYouTubeConnect = () => {
      signIn('google');
  };

  const handleInstagramConnect = () => {
      window.location.href = '/api/instagram/connect';
  };

  return (
    <div className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Connect & Sync
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem' }}>
          Link your accounts to unlock AI-powered insights.
        </p>
      </header>

      {errorParam && (
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <span>
                  {errorParam === 'no_instagram_business_account' 
                    ? "We couldn't find an Instagram Business account linked to your Facebook page. Please make sure you have converted your Instagram to a Business/Creator account and linked it to a Facebook Page." 
                    : "An error occurred while connecting. Please try again."}
              </span>
          </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* YouTube Card */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
            <Youtube size={120} color="#ff0000" />
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '1rem', height: 'fit-content' }}>
              <Youtube size={32} color="#ff0000" />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>YouTube Channel</h3>
                {channelData && (
                  <span className="glass-card" style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} /> Connected
                  </span>
                )}
              </div>

              {channelData ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <img src={channelData.thumbnail} alt="Profile" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                      <div>
                          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{channelData.title}</p>
                          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{channelData.customUrl}</p>
                      </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <StatBox label="Subscribers" value={parseInt(channelData.subscriberCount).toLocaleString()} />
                    <StatBox label="Total Views" value={parseInt(channelData.viewCount).toLocaleString()} />
                    <StatBox label="Videos" value={parseInt(channelData.videoCount).toLocaleString()} />
                  </div>
                  
                  <button 
                    onClick={fetchYouTube}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    Refresh YouTube Data
                  </button>
                </>
              ) : (
                <>
                   <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                     Connect to fetch videos, analyze performance, and get AI coaching.
                   </p>
                   <button 
                     onClick={handleYouTubeConnect}
                     className="btn-primary"
                     style={{ background: '#ff0000', border: 'none', width: '100%' }}
                   >
                     Connect with Google
                   </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
             <Instagram size={120} color="#ec4899" />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '1rem', height: 'fit-content' }}>
              <Instagram size={32} color="#ec4899" />
            </div>
            
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Instagram</h3>
                   {instagramData && (
                      <span className="glass-card" style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={14} /> Connected
                      </span>
                   )}
                </div>

               {instagramData ? (
                 <>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      {instagramData.profile_picture_url ? (
                          <img src={instagramData.profile_picture_url} alt="Profile" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                      ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Instagram size={24} /></div>
                      )}
                      
                      <div>
                          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>@{instagramData.username}</p>
                          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Business Account</p>
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                      <StatBox label="Followers" value={instagramData.followers?.toLocaleString() || '-'} />
                      <StatBox label="Media" value={instagramData.media_count?.toLocaleString() || '-'} />
                      <StatBox label="Reach" value={instagramData.reach?.toLocaleString() || '-'} />
                   </div>

                   <button 
                      onClick={fetchInstagram}
                      disabled={loading}
                      className="btn-primary"
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none' }}
                   >
                      <RefreshCw size={18} className={loading ? 'spin' : ''} />
                      Refresh Instagram Data
                   </button>
                 </>
               ) : (
                  <>
                     <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                       Connect your Instagram Business account to track followers, reach, and engagement.
                     </p>
                     <button 
                        onClick={handleInstagramConnect}
                        className="btn-primary"
                        style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none', width: '100%' }}
                     >
                       Connect Instagram
                     </button>
                     <p style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '0.5rem', textAlign: 'center' }}>
                         Requires an Instagram Business/Creator account linked to a Facebook Page.
                     </p>
                  </>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{value}</p>
    </div>
  );
}
