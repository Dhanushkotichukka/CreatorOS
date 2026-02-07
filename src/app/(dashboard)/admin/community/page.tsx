"use client";

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  user: { name: string; role: string };
  createdAt: string;
}

export default function AdminCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/community');
    const data = await res.json();
    if (data.posts) setPosts(data.posts);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    // API to delete would go here (not implemented for demo simplicity, just UI removal)
    // await fetch(`/api/community/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Community Moderation</h1>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ background: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{post.user.name}</p>
              <p style={{ color: '#9ca3af' }}>{post.content}</p>
            </div>
            <button 
              onClick={() => handleDelete(post.id)}
              style={{ color: 'var(--destructive)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p>No posts to moderate.</p>}
      </div>
    </div>
  );
}
