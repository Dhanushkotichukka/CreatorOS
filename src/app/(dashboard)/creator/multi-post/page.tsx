"use client";

import { useState, useRef } from 'react';
import { Share2, Check, Instagram, Twitter, Linkedin, Facebook, Sparkles, Youtube, Wand2, UploadCloud, Image as ImageIcon, X, Users, MessageSquare, Hash, Calendar, Clock, ChevronDown } from 'lucide-react';

export default function MultiPost() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<string>('instagram');
  const [postType, setPostType] = useState<string>('post');
  const [status, setStatus] = useState<'idle' | 'generating' | 'posting' | 'success'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
      { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C', types: ['Post', 'Reel', 'Story'], gradient: 'from-purple-500 to-pink-500' },
      { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', types: ['Shorts', 'Video', 'Post'], gradient: 'from-red-500 to-red-600' },
      { id: 'twitter', label: 'X / Twitter', icon: Twitter, color: '#1DA1F2', types: ['Tweet', 'Thread'], gradient: 'from-blue-400 to-blue-600' },
      { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', types: ['Post', 'Article'], gradient: 'from-blue-600 to-blue-800' },
      { id: 'community', label: 'Community', icon: Users, color: '#8b5cf6', types: ['Post', 'Announcement'], gradient: 'from-violet-500 to-purple-600' },
  ];

  const activePlatform = platforms.find(p => p.id === platform) || platforms[0];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handlePost = async () => {
    if (!content && !file) {
        alert("Please add some content or media first.");
        return;
    }
    setStatus('posting');
    
    try {
        // Simulate API call to /api/post/create
        await fetch('/api/post/create', {
            method: 'POST',
            body: JSON.stringify({
                platforms: [platform],
                postType,
                content,
                mediaUrl: preview, // sending base64 for demo
                scheduledDate: new Date().toISOString()
            })
        });

        setStatus('success');
        // toast.success(`Successfully published to ${activePlatform.label}!`);
        
        setTimeout(() => {
            setStatus('idle');
            setContent('');
            setFile(null);
            setPreview(null);
        }, 3000);
    } catch (e) {
        console.error(e);
        alert("Failed to publish post.");
        setStatus('idle');
    }
  };

  const generateAI = async (type: 'caption' | 'hashtags' | 'rewrite') => {
      if (status === 'generating') return;
      if (type === 'rewrite' && !content) {
          alert("Write something first for AI to rewrite!");
          return;
      }

      setStatus('generating');
      // const toastId = toast.loading("AI is thinking...");

      try {
          const res = await fetch('/api/ai/generate', {
              method: 'POST',
              body: JSON.stringify({
                  topic: content || "Viral content about creativity", // Fallback topic if empty
                  type,
                  platform: activePlatform.label, 
                  language: 'English'
              })
          });
          
          if (!res.ok) throw new Error("AI Generation failed");
          
          const data = await res.json();
          const text = data.result || data.text; // Handle both potential response formats

          if (type === 'caption' || type === 'rewrite') {
              setContent(text.replace(/^["']|["']$/g, '')); // Strip quotes
          } else if (type === 'hashtags') {
              setContent(prev => prev + "\n" + text);
          }
          
          // toast.dismiss(toastId);
          // toast.success("Content generated!");
      } catch (e) {
          console.error(e);
          // toast.dismiss(toastId);
          alert("Failed to generate content.");
      } finally {
          setStatus('idle');
      }
  };

  return (
    <div className="fade-in-up container mx-auto max-w-6xl p-4">
      {/* Header */}
      <header className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">
                Multi-Post Hub
            </h1>
            <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
                <Share2 size={16} /> Create once, publish everywhere.
            </p>
        </div>
        
        {/* Quick Platform Toggle (Mobile/Desktop) */}
        <div className="flex bg-zinc-900/80 p-1 rounded-full border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
            {platforms.map((p) => (
                <button
                    key={p.id}
                    onClick={() => { setPlatform(p.id); setPostType(p.types[0].toLowerCase()); }}
                    className={`p-2.5 rounded-full transition-all duration-300 relative group ${platform === p.id ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-400 hover:text-white'}`}
                    title={p.label}
                >
                    <p.icon size={20} className={platform === p.id ? `text-[${p.color}]` : ''} style={{ color: platform === p.id ? p.color : 'currentColor' }} />
                    {platform === p.id && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full" />}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activePlatform.gradient}`} />
                
                {/* Checkbox Platform Indicator */}
                <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl bg-gradient-to-br ${activePlatform.gradient} bg-opacity-10`}>
                             <activePlatform.icon size={24} className="text-white" />
                         </div>
                         <div>
                             <h2 className="font-bold text-lg text-white">{activePlatform.label}</h2>
                             <div className="flex gap-2 mt-1">
                                 {activePlatform.types.map(t => (
                                     <button 
                                        key={t}
                                        onClick={() => setPostType(t.toLowerCase())}
                                        className={`text-xs px-2 py-0.5 rounded-md border ${postType === t.toLowerCase() ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-400 hover:text-white'}`}
                                     >
                                         {t}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     </div>

                     <div className="flex gap-2">
                         <button className="glass-button-sm text-xs flex items-center gap-1" onClick={() => generateAI('rewrite')}>
                             <Wand2 size={12} /> Rewrite
                         </button>
                     </div>
                </div>

                {/* Text Area */}
                <div className="relative mb-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Write your ${activePlatform.label} ${postType} here...`}
                        className="w-full h-64 bg-zinc-900/50 rounded-xl p-4 text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none border border-white/5 transition-all"
                    />
                    
                    {/* Floating AI Tools */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button 
                            onClick={() => generateAI('caption')}
                            className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1.5 border border-white/10 transition-colors"
                        >
                            <Sparkles size={12} className="text-purple-400" />
                            Generate Caption
                        </button>
                        <button 
                            onClick={() => generateAI('hashtags')}
                            className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1.5 border border-white/10 transition-colors"
                        >
                            <Hash size={12} className="text-pink-400" />
                            Add Tags
                        </button>
                    </div>
                </div>

                {/* Media Uploader */}
                <div 
                    className={`relative border-2 border-dashed ${preview ? 'border-transparent' : 'border-zinc-700 hover:border-zinc-500'} rounded-2xl h-48 transition-all cursor-pointer bg-zinc-900/30 overflow-hidden flex flex-col items-center justify-center group/upload`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-100 transition-opacity" />
                            <div className="absolute top-2 right-2 z-10">
                                <button className="p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors" onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}>
                                    <X size={14} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover/upload:scale-110 transition-transform">
                                <UploadCloud size={24} className="text-zinc-400 group-hover/upload:text-white" />
                            </div>
                            <p className="text-zinc-300 font-medium">Click to upload media</p>
                            <p className="text-zinc-500 text-xs mt-1">Drag and drop or browse</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*,video/*" />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-4">
                <button className="glass-button text-zinc-400 hover:text-white px-6">
                    Save Draft
                </button>
                <button 
                    onClick={handlePost}
                    disabled={status !== 'idle' || (!content && !file)}
                    className={`btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${
                        status === 'posting' ? 'opacity-80 cursor-wait' : 'hover:scale-105'
                    }`}
                >
                    {status === 'posting' ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                    ) : status === 'success' ? (
                        <><Check size={18} /> Published!</>
                    ) : (
                        <><Share2 size={18} /> Publish Now</>
                    )}
                </button>
            </div>
        </div>

        {/* Sidebar: Scheduling & Settings */}
        <div className="space-y-6">
             {/* Scheduler */}
             <div className="glass-panel p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Calendar size={18} className="text-zinc-400" /> Scheduling
                 </h3>
                 
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                             <Clock size={16} className="text-zinc-400" />
                             <div>
                                 <p className="text-sm font-medium text-white">Post Immediately</p>
                                 <p className="text-xs text-zinc-500">Best time: Now</p>
                             </div>
                         </div>
                         <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                     </div>

                     <div className="bg-white/5 rounded-lg border border-white/5 p-4 opacity-50 cursor-not-allowed">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-zinc-400">Schedule Date</span>
                            <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">Pro</span>
                         </div>
                         <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                             <div className="h-full bg-zinc-700 w-0" />
                         </div>
                     </div>
                 </div>
             </div>

             {/* Preview Card (Mockup) */}
             <div className="glass-panel p-6 border-t-4 border-t-zinc-700">
                 <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider">Preview</h3>
                 
                 <div className="bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
                     {/* Header */}
                     <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                         <div>
                             <p className="text-xs font-bold text-white">dhanush_creator</p>
                             <p className="text-[10px] text-zinc-500">{activePlatform.label}</p>
                         </div>
                     </div>
                     
                     {/* Media */}
                     <div className="aspect-square bg-zinc-900 flex items-center justify-center text-zinc-700">
                         {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon size={32} />}
                     </div>

                     {/* Caption */}
                     <div className="p-3">
                         <p className="text-xs text-zinc-300 line-clamp-3">
                             {content || <span className="text-zinc-600 italic">Caption will appear here...</span>}
                         </p>
                     </div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
}
