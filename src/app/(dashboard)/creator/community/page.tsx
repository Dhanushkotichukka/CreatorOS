"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Users, Plus, Hash, Globe, Lock, Search, Send, User, X } from 'lucide-react';
import { toast } from 'sonner';

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
          toast.error("Failed to load community data");
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
              toast.success('Joined group successfully!');
              fetchCommunityData(); // Refresh everything
          } else {
              const err = await res.json();
              toast.error(err.error || 'Failed to join');
          }
      } catch (error) {
          console.error(error);
          toast.error('An error occurred');
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
              toast.success('Post shared!');
          }
      } catch (error) {
          console.error(error);
          toast.error('Failed to post');
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
              toast.success('Group created successfully!');
          } else {
             toast.error('Failed to create group');
          }
      } catch (error) {
          console.error(error);
          toast.error('An error occurred');
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
            toast.success('Invitation sent!');
            setShowInviteModal(false);
            setInviteEmail('');
        } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to invite');
        }
      } catch (e) {
        console.error(e);
        toast.error('An error occurred');
      }
  }

  const currentGroup = groups.find(g => g.id === selectedGroup);
  const isAdmin = currentGroup?.members?.[0]?.role === 'ADMIN';

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6 max-w-[1600px] mx-auto p-4 fade-in-up">
      
      {/* Left Sidebar: Groups */}
      <div className="hidden lg:flex flex-col glass-panel p-6 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-white">
                <Users size={20} className="text-purple-400" /> My Groups
            </h3>
            <button 
                onClick={() => setShowCreateGroup(true)} 
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
                <Plus size={20} />
            </button>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            <button 
                onClick={() => setSelectedGroup(null)}
                className={`text-left p-3 rounded-xl flex items-center gap-3 transition-all ${!selectedGroup ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
            >
                <Globe size={18} /> 
                <span className="font-medium">Global Feed</span>
            </button>
            <div className="h-px bg-white/5 my-2" />
            {groups.map((group) => (
                <button 
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`text-left p-3 rounded-xl flex items-center gap-3 transition-all ${selectedGroup === group.id ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                >
                    {group.isPrivate ? <Lock size={16} /> : <Hash size={16} />}
                    <span className="truncate font-medium">{group.name}</span>
                </button>
            ))}
        </div>
        
        {/* Create Group Modal */}
        {showCreateGroup && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-panel w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                    <button onClick={() => setShowCreateGroup(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold mb-6 text-white">Create New Group</h3>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Group Name" 
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <textarea 
                            placeholder="Description" 
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 h-24 resize-none"
                            value={groupDesc}
                            onChange={(e) => setGroupDesc(e.target.value)}
                        />
                         <div className="flex items-center gap-3 p-2">
                            <input 
                                type="checkbox" 
                                checked={isPrivate} 
                                onChange={(e) => setIsPrivate(e.target.checked)} 
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-zinc-400">Private Group (Invite Only)</span>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={createGroup} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors">Create Group</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-panel w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 relative">
                     <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold mb-2 text-white">Invite Member</h3>
                    <p className="text-zinc-400 mb-6 text-sm">Add members to <strong className="text-white">{currentGroup?.name}</strong> by email.</p>
                    <div className="space-y-4">
                        <input 
                            type="email" 
                            placeholder="user@example.com" 
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={inviteUser} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">Send Invite</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Center: Feed */}
      <div className="flex flex-col h-full overflow-hidden">
          <div className="overflow-y-auto pr-2 custom-scrollbar h-full space-y-6">
              
              {/* Group Header */}
              {selectedGroup && currentGroup && (
                  <div className="glass-panel p-6 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-transparent border-purple-500/20">
                      <div>
                          <h2 className="text-2xl font-black text-white mb-2">{currentGroup.name}</h2>
                          <p className="text-zinc-400 text-sm mb-3">{currentGroup.description}</p>
                          <div className="flex gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                               <span className='flex items-center gap-1.5'><Users size={14} className="text-purple-400"/> {currentGroup._count?.members || 1} Members</span>
                               <span className='flex items-center gap-1.5'><MessageSquare size={14} className="text-purple-400"/> {currentGroup._count?.posts || 0} Posts</span>
                          </div>
                      </div>
                      {isAdmin && (
                          <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center gap-2 transition-all border border-white/10">
                              <Plus size={16} /> Invite
                          </button>
                      )}
                  </div>
              )}

              {/* Post Creator */}
              <div className="glass-panel p-6">
                  <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-lg">
                          {user?.name?.[0] || 'U'}
                      </div>
                      <textarea 
                        placeholder={selectedGroup ? `Post to ${currentGroup?.name}...` : "Share with the community..."}
                        className="w-full bg-transparent border-none focus:ring-0 text-lg text-white placeholder:text-zinc-600 min-h-[80px] resize-none"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                      />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex gap-4 text-zinc-500">
                          {/* Icons for attachments could go here */}
                      </div>
                      <button 
                        onClick={handlePost}
                        className="px-6 py-2 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                        disabled={!newPost.trim()}
                      >
                          <Send size={16} /> Post
                      </button>
                  </div>
              </div>

              {/* Feed Stream */}
              <div className="space-y-6 pb-8">
                  {posts
                    .filter(p => selectedGroup ? p.groupId === selectedGroup : !p.groupId) // Filter posts locally for now or refetch
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                  ))}
                  {posts.filter(p => selectedGroup ? p.groupId === selectedGroup : !p.groupId).length === 0 && !loading && (
                      <div className="text-center py-12">
                          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MessageSquare className="text-zinc-600" size={32} />
                          </div>
                          <p className="text-zinc-500 font-medium">No posts yet in this {selectedGroup ? 'group' : 'feed'}.</p>
                          <p className="text-zinc-600 text-sm mt-1">Be the first to share something!</p>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Right Sidebar: Suggestions */}
      <div className="hidden lg:flex flex-col glass-panel p-6 h-fit">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search size={14} /> Discover Groups
          </h3>
          <div className="space-y-4">
              {publicGroups.map((group) => (
                  <div key={group.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-white/5 group-hover:border-purple-500/50 transition-colors">
                          {group.imageUrl ? <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" /> : <Hash size={18} className='text-zinc-500 group-hover:text-purple-400' />}
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">{group.name}</p>
                          <p className="text-xs text-zinc-500">{group._count?.members || 0} Members</p>
                      </div>
                      <button 
                        onClick={() => handleJoinGroup(group.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-all"
                      >
                        Join
                      </button>
                  </div>
              ))}
              {publicGroups.length === 0 && (
                  <p className="text-sm text-zinc-500">No new public groups found.</p>
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
        fetch('/api/community/like', {
            method: 'POST',
            body: JSON.stringify({ postId: post.id })
        }).catch(err => console.error(err));
    };

    return (
        <div className="glass-panel p-6 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700">
                         {post.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm hover:text-purple-400 cursor-pointer transition-colors">{post.user?.name || 'Anonymous'}</h4>
                        <p className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                {/* <button className="btn-ghost" style={{ padding: '0.25rem' }}><MoreHorizontal size={16} /></button> */}
            </div>
            
            <p className="text-zinc-200 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
            </p>

            <div className="flex gap-6 border-t border-white/5 pt-4">
                <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-pink-500' : 'text-zinc-500 hover:text-pink-400'}`}>
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors">
                    <MessageSquare size={18} /> {post.comments?.length || 0}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors">
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    );
}
