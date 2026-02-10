"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { toast } from 'sonner';

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
      toast.error('Failed to load posts');
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
        toast.success('Post scheduled!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to schedule post');
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">Content Planner</h1>
          <p className="text-zinc-400">Schedule your success, one post at a time.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/10"
        >
          <Plus size={20} /> Add Post
        </button>
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white capitalize">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"><ChevronLeft size={20}/></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-all">Today</button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2 text-center text-zinc-500 font-bold text-sm tracking-wider uppercase">
          {days.map(d => <div key={d} className="py-2">{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
          {paddingDays.map((_, i) => (
             <div key={`pad-${i}`} className="bg-zinc-900/80 min-h-[140px] opacity-50"></div>
          ))}
          
          {calendarDays.map((date) => {
            const dayPosts = posts.filter(p => isSameDay(new Date(p.scheduledDate), date));
            const isToday = isSameDay(date, new Date());
            return (
              <div 
                key={date.toISOString()} 
                className="bg-zinc-900/50 min-h-[140px] p-3 hover:bg-zinc-900/80 transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {format(date, 'd')}
                  </span>
                </div>
                <div className="space-y-1.5 overflow-y-auto max-h-[90px] custom-scrollbar">
                  {dayPosts.map(post => (
                    <div key={post.id} className={`text-xs px-2 py-1.5 rounded-md font-medium truncate border ${
                        post.platform === 'YouTube' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                    }`}>
                      {post.title}
                    </div>
                  ))}
                </div>
                
                {/* Add button on hover */}
                <button 
                    onClick={() => {
                        setNewPost({ ...newPost, date: format(date, 'yyyy-MM-dd') });
                        setShowModal(true);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white"
                >
                    <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 shadow-2xl relative">
             <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Schedule Post</h2>
            
            <form onSubmit={handleCreatePost} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Title / Concept</label>
                <input 
                  type="text" 
                  value={newPost.title} 
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. New Vlog Teaser"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Date</label>
                <input 
                  type="date" 
                  value={newPost.date} 
                  onChange={e => setNewPost({...newPost, date: e.target.value})}
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                 <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Platform</label>
                 <select 
                    value={newPost.platform}
                    onChange={e => setNewPost({...newPost, platform: e.target.value})}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                 >
                   <option value="YouTube">YouTube</option>
                   <option value="Instagram">Instagram</option>
                 </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
