"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Users, Plus, Hash, Globe, Lock, Search, Send, User } from 'lucide-react';

export default function CommunityHub() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Group Form State
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const [publicGroups, setPublicGroups] = useState<any[]>([]);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  async function fetchCommunityData() {
      try {
          const [postsRes, groupsRes, publicRes] = await Promise.all([
              fetch('/api/community?type=feed'), 
              fetch('/api/community/groups/list'),
              fetch('/api/community/groups/public')
          ]);
          
          if (postsRes.ok) {
              const data = await postsRes.json();
              setPosts(data);
          }
          if (groupsRes.ok) {
              const gData = await groupsRes.json();
              if (Array.isArray(gData)) setGroups(gData);
          }
          if (publicRes.ok) {
              const pData = await publicRes.json();
              if (Array.isArray(pData)) setPublicGroups(pData);
          }
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  }

  async function handleJoinGroup(groupId: string) {
      if (!confirm('Join this group?')) return;
      try {
          const res = await fetch('/api/community/groups/join', {
              method: 'POST',
              body: JSON.stringify({ groupId })
          });
          if (res.ok) {
              alert('Joined successfully!');
              fetchCommunityData(); // Refresh everything
          } else {
              const err = await res.json();
              alert(err.error || 'Failed to join');
          }
      } catch (error) {
          console.error(error);
      }
  }

  async function handlePost() {
      if (!newPost.trim()) return;
      try {
          const res = await fetch('/api/community', {
              method: 'POST',
              body: JSON.stringify({
                  content: newPost,
                  groupId: selectedGroup
              })
          });
          if (res.ok) {
              const post = await res.json();
              setPosts([post, ...posts]); 
              setNewPost('');
          }
      } catch (error) {
          console.error(error);
      }
  }

  async function createGroup() {
      if (!groupName) return;
      try {
          const res = await fetch('/api/community/groups/create', {
              method: 'POST',
              body: JSON.stringify({ name: groupName, description: groupDesc, isPrivate })
          });
          if (res.ok) {
              const newGroup = await res.json();
              setGroups([newGroup, ...groups]);
              setShowCreateGroup(false);
              setGroupName('');
              setGroupDesc('');
          }
      } catch (error) {
          console.error(error);
      }
  }

  // Invite Logic
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  async function inviteUser() {
      if (!inviteEmail || !selectedGroup) return;
      try {
        const res = await fetch('/api/community/groups/invite', {
            method: 'POST',
            body: JSON.stringify({ email: inviteEmail, groupId: selectedGroup })
        });
        if (res.ok) {
            alert('Invitation sent!');
            setShowInviteModal(false);
            setInviteEmail('');
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to invite');
        }
      } catch (e) {
        console.error(e);
      }
  }

  const currentGroup = groups.find(g => g.id === selectedGroup);
  const isAdmin = currentGroup?.members?.[0]?.role === 'ADMIN';

  return (
    <div className="fade-in-up" style={{ height: 'calc(100vh - 100px)', display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: '2rem' }}>
      
      {/* Left Sidebar: Groups */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> Groups
            </h3>
            <button onClick={() => setShowCreateGroup(true)} className="btn-ghost" style={{ padding: '0.25rem', borderRadius: '50%' }}>
                <Plus size={18} />
            </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            <button 
                onClick={() => setSelectedGroup(null)}
                className={`text-left p-2 rounded-lg flex items-center gap-2 transition-all ${!selectedGroup ? 'bg-white/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}
            >
                <Globe size={16} /> Global Feed
            </button>
            {groups.map((group) => (
                <button 
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`text-left p-2 rounded-lg flex items-center gap-2 transition-all ${selectedGroup === group.id ? 'bg-white/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}
                >
                    {group.isPrivate ? <Lock size={14} /> : <Hash size={14} />}
                    <span className="truncate">{group.name}</span>
                </button>
            ))}
        </div>
        
        {/* Create Group Modal */}
        {showCreateGroup && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ width: '400px', padding: '2rem', background: '#18181b' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Create New Group</h3>
                    <input 
                        type="text" 
                        placeholder="Group Name" 
                        className="glass-input mb-4 w-full"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <textarea 
                        placeholder="Description" 
                        className="glass-input mb-4 w-full"
                        value={groupDesc}
                        onChange={(e) => setGroupDesc(e.target.value)}
                    />
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input 
                            type="checkbox" 
                            checked={isPrivate} 
                            onChange={(e) => setIsPrivate(e.target.checked)} 
                            style={{ width: 'auto' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Private Group (Invite Only)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setShowCreateGroup(false)} className="btn-ghost">Cancel</button>
                        <button onClick={createGroup} className="btn-primary">Create Group</button>
                    </div>
                </div>
            </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ width: '400px', padding: '2rem', background: '#18181b' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Invite Member</h3>
                    <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Add members to <strong>{currentGroup?.name}</strong> by email.</p>
                    <input 
                        type="email" 
                        placeholder="user@example.com" 
                        className="glass-input mb-4 w-full"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setShowInviteModal(false)} className="btn-ghost">Cancel</button>
                        <button onClick={inviteUser} className="btn-primary">Send Invite</button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Center: Feed */}
      <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {/* Group Header */}
          {selectedGroup && currentGroup && (
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{currentGroup.name}</h2>
                      <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{currentGroup.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                           <span className='flex items-center gap-1'><Users size={14}/> {currentGroup._count?.members || 1} Members</span>
                           <span className='flex items-center gap-1'><MessageSquare size={14}/> {currentGroup._count?.posts || 0} Posts</span>
                      </div>
                  </div>
                  {isAdmin && (
                      <button onClick={() => setShowInviteModal(true)} className="btn-secondary flex items-center gap-2">
                          <Plus size={16} /> Invite
                      </button>
                  )}
              </div>
          )}

          {/* Post Creator */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                      {user?.name?.[0] || 'U'}
                  </div>
                  <textarea 
                    placeholder={selectedGroup ? `Post to ${currentGroup?.name}...` : "Share with the community..."}
                    className="glass-input w-full"
                    style={{ minHeight: '80px', resize: 'none', border: 'none', background: 'transparent', padding: '0.5rem' }}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', color: '#a1a1aa' }}>
                      {/* Icons for attachments could go here */}
                  </div>
                  <button 
                    onClick={handlePost}
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: newPost.trim() ? 1 : 0.5 }}
                    disabled={!newPost.trim()}
                  >
                      <Send size={16} /> Post
                  </button>
              </div>
          </div>

          {/* Feed Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts
                .filter(p => selectedGroup ? p.groupId === selectedGroup : !p.groupId) // Filter posts locally for now or refetch
                .map((post) => (
                  <PostCard key={post.id} post={post} />
              ))}
              {posts.filter(p => selectedGroup ? p.groupId === selectedGroup : !p.groupId).length === 0 && !loading && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#52525b' }}>
                      <p>No posts yet in this {selectedGroup ? 'group' : 'feed'}. Be the first!</p>
                  </div>
              )}
          </div>
      </div>

      {/* Right Sidebar: Suggestions */}
      <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
              Suggested Groups
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {publicGroups.map((group) => (
                  <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {group.imageUrl ? <img src={group.imageUrl} alt={group.name} /> : <Hash size={16} className='text-zinc-500' />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#71717a' }}>Public • {group._count?.members || 0} Members</p>
                      </div>
                      <button 
                        onClick={() => handleJoinGroup(group.id)}
                        className="btn-ghost" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: '#10b981' }}
                      >
                        Join
                      </button>
                  </div>
              ))}
              {publicGroups.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: '#52525b' }}>No new public groups found.</p>
              )}
          </div>
      </div>
    </div>
  );
}

function PostCard({ post }: any) {
    const [likes, setLikes] = useState(post.likes || 0);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
        // Fire and forget API call
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                         {post.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.user?.name || 'Anonymous'}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                {/* <button className="btn-ghost" style={{ padding: '0.25rem' }}><MoreHorizontal size={16} /></button> */}
            </div>
            
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--foreground)', marginBottom: '1rem' }}>
                {post.content}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: liked ? '#ec4899' : '#a1a1aa', cursor: 'pointer' }}>
                    <Heart size={18} fill={liked ? '#ec4899' : 'none'} /> {likes}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                    <MessageSquare size={18} /> {post.comments?.length || 0}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    );
}
