"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, MessageSquare, Share2, Send, MoreHorizontal, User } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        const res = await fetch('/api/community');
        const data = await res.json();
        setPosts(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handlePost = async () => {
      if (!newPost.trim()) return;
      setPosting(true);
      try {
          const res = await fetch('/api/community', {
              method: 'POST',
              body: JSON.stringify({ content: newPost })
          });
          const post = await res.json();
          setPosts([post, ...posts]);
          setNewPost('');
      } catch (error) {
          console.error(error);
      } finally {
          setPosting(false);
      }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in-up">
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Creator Community</h1>
        <p style={{ color: '#a1a1aa' }}>Connect, collaborate, and grow with fellow creators.</p>
      </header>

      {/* Create Post */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                  <textarea 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your latest win or ask for advice..."
                    style={{ 
                        width: '100%', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1rem', 
                        resize: 'none', 
                        minHeight: '80px',
                        outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <button 
                        onClick={handlePost}
                        disabled={posting || !newPost.trim()}
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !newPost.trim() ? 0.5 : 1 }}
                      >
                          {posting ? 'Posting...' : <><Send size={16} /> Post</>}
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Feed */}
      {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#a1a1aa' }}>Loading feed...</div>
      ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
          </div>
      )}
    </div>
  );
}

function PostCard({ post }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#a1a1aa' }}>{post.author[0]}</span>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600 }}>{post.author}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#71717a' }}>{new Date(post.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                <button className="btn-ghost" style={{ padding: '0.5rem' }}><MoreHorizontal size={18} /></button>
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', color: '#e4e4e7' }}>{post.content}</p>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', padding: '0.5rem' }}>
                    <Heart size={18} /> <span style={{ fontSize: '0.9rem' }}>{post.likes}</span>
                </button>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', padding: '0.5rem' }}>
                    <MessageSquare size={18} /> <span style={{ fontSize: '0.9rem' }}>{post.replies?.length || 0}</span>
                </button>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', padding: '0.5rem' }}>
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    );
}
