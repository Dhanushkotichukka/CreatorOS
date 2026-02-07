"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, X, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Planner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), platform: 'YouTube' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        await fetchPosts();
        setShowModal(false);
        setNewPost({ ...newPost, title: '' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for start grid
  const startDay = monthStart.getDay(); 
  const paddingDays = Array.from({ length: startDay });

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Content Planner</h1>
          <p style={{ color: '#a1a1aa' }}>Schedule your success, one post at a time.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary neon-border"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: 600
          }}>
          <Plus size={18} /> Add Post
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{format(currentDate, 'MMMM yyyy')}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="glass-button" style={{ padding: '0.5rem 1rem' }}>Prev</button>
            <button onClick={() => setCurrentDate(new Date())} className="glass-button" style={{ padding: '0.5rem 1rem' }}>Today</button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="glass-button" style={{ padding: '0.5rem 1rem' }}>Next</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1rem', textAlign: 'center', color: '#9ca3af', fontWeight: 600 }}>
          {days.map(d => <div key={d}>{d}</div>)}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {paddingDays.map((_, i) => (
             <div key={`pad-${i}`} style={{ background: 'var(--card)', height: '120px', opacity: 0.5 }}></div>
          ))}
          
          {calendarDays.map((date) => {
            const dayPosts = posts.filter(p => isSameDay(new Date(p.scheduledDate), date));
            return (
              <div 
                key={date.toISOString()} 
                style={{ 
                  background: 'var(--card)', 
                  height: '120px', 
                  padding: '0.5rem',
                  transition: 'background 0.2s',
                }}
                className="calendar-chunk"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    color: isSameDay(date, new Date()) ? 'var(--accent)' : 'var(--foreground)',
                    fontWeight: isSameDay(date, new Date()) ? 'bold' : 'normal',
                    background: isSameDay(date, new Date()) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                  }}>
                    {format(date, 'd')}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: '80px' }}>
                  {dayPosts.map(post => (
                    <div key={post.id} style={{ 
                      fontSize: '0.7rem', 
                      background: post.platform === 'YouTube' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                      color: post.platform === 'YouTube' ? '#ef4444' : '#10b981', 
                      padding: '0.2rem 0.4rem', 
                      borderRadius: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {post.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Schedule Post</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>Title / Idea</label>
                <input 
                  type="text" 
                  value={newPost.title} 
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="glass-input"
                  placeholder="e.g. New Vlog Teaser"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>Date</label>
                <input 
                  type="date" 
                  value={newPost.date} 
                  onChange={e => setNewPost({...newPost, date: e.target.value})}
                  className="glass-input"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>Platform</label>
                 <select 
                    value={newPost.platform}
                    onChange={e => setNewPost({...newPost, platform: e.target.value})}
                    className="glass-input"
                    style={{ width: '100%' }}
                 >
                   <option value="YouTube">YouTube</option>
                   <option value="Instagram">Instagram</option>
                 </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="glass-button" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? <Loader2 className="spin" size={18} /> : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
