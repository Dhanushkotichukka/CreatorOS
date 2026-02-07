"use client";

import { useAuth } from '@/context/AuthContext';
import { DollarSign, ExternalLink } from 'lucide-react';

export default function Monetization() {
  const { user } = useAuth();

  let estimatedEarnings = 0;
  if (user?.youtubeStats) {
      try {
           const parsed = JSON.parse(user.youtubeStats);
           // Simple estimation: 1 sub ~= $0.05 lifetime value or views-based
           const val = parsed.followers; // e.g. "12.5K"
           let multiplier = 1;
           if (val.includes('K')) multiplier = 1000;
           if (val.includes('M')) multiplier = 1000000;
           
           const num = parseFloat(val) * multiplier;
           estimatedEarnings = (num * 0.02); // Mock logic: $0.02 per sub/month
      } catch(e) {}
  }

  return (
    <div className="fade-in-up">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Monetization Hub</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Earnings Card */}
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '1.5rem', borderRadius: 'var(--radius)', color: 'white' }}>
          <h3 style={{ marginBottom: '0.5rem', opacity: 0.9 }}>Estimated Monthly Revenue</h3>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>${estimatedEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>Based on your channel size ({user?.youtubeHandle || 'Not Connected'})</p>
          <button style={{ marginTop: '1rem', background: 'white', color: '#059669', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
            Withdraw Funds
          </button>
        </div>

        {/* Brand Deals */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} /> Active Brand Deals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>TechGear Sponsorship</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Due: Oct 24 • $500</p>
              </div>
              <span style={{ background: '#f59e0b', color: 'black', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Pending</span>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>SaaS Promo Video</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Due: Oct 30 • $1,200</p>
              </div>
              <span style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Active</span>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Affiliate Opportunities</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Product Name {i}</h4>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>Earn 20% commission on every sale you refer.</p>
            <button style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              View Details <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
