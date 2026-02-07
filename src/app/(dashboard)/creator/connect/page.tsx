"use client";

import { useAuth } from '@/context/AuthContext';
import { Youtube, Instagram, CheckCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function Connect() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [channelData, setChannelData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChannelData();
  }, []);

  const fetchChannelData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/youtube/channel');
      if (res.ok) {
        const data = await res.json();
        setChannelData(data);
      } else {
        if (res.status !== 401) {
            // Only show error if it's not just "unauthorized" (which implies not connected yet)
            const err = await res.json();
             // Quietly fail for 401/404 on initial load, user just needs to connect
             if (res.status !== 404) console.error(err);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
      signIn('google');
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
                    onClick={fetchChannelData}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    {loading ? 'Syncing...' : 'Refresh Data'}
                  </button>
                </>
              ) : (
                <>
                   <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                     Connect to fetch videos, analyze performance, and get AI coaching.
                   </p>
                   <button 
                     onClick={handleConnect}
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
        <div className="glass-panel" style={{ padding: '2rem', opacity: 0.7 }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '1rem', height: 'fit-content' }}>
              <Instagram size={32} color="#ec4899" />
            </div>
            <div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instagram</h3>
               <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>Coming soon in Phase 3.</p>
               <button disabled className="btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Connect Instagram</button>
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
