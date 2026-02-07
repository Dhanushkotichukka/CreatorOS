"use client";

import { useState, useRef } from 'react';
import { Share2, Check, Instagram, Twitter, Linkedin, Facebook, Sparkles, Youtube, Wand2, UploadCloud, Image as ImageIcon, X, Users } from 'lucide-react';

export default function MultiPost() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<string>('instagram');
  const [postType, setPostType] = useState<string>('post');
  const [status, setStatus] = useState<'idle' | 'generating' | 'posting' | 'success'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
      { id: 'instagram', icon: Instagram, color: '#E1306C', types: ['Post', 'Reel', 'Story'] },
      { id: 'youtube', icon: Youtube, color: '#FF0000', types: ['Shorts', 'Video'] },
      { id: 'twitter', icon: Twitter, color: '#1DA1F2', types: ['Tweet', 'Thread'] },
      { id: 'community', icon: Users, color: '#8b5cf6', types: ['Post'] }, // Added Community
  ];

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
    if (!content && !file) return;
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
        setTimeout(() => {
            setStatus('idle');
            setContent('');
            setFile(null);
            setPreview(null);
        }, 3000);
    } catch (e) {
        console.error(e);
        setStatus('idle');
    }
  };

  const generateAI = async (type: 'caption' | 'hashtags') => {
      setStatus('generating');
      // Simulate AI
      setTimeout(() => {
          if (type === 'caption') setContent(prev => prev + "\n\n🚀 Just dropped something new! Check it out. #CreatorOS");
          if (type === 'hashtags') setContent(prev => prev + "\n\n#viral #creator #growth #ai");
          setStatus('idle');
      }, 1000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }} className="fade-in-up">
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Multi-Post Hub</h1>
        <p style={{ color: '#a1a1aa' }}>Create, schedule, and publish across platforms.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Left Column: Editor */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
            
            {/* Post Type Selector */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                     {platforms.find(p => p.id === platform)?.types.map(type => (
                         <button
                            key={type}
                            onClick={() => setPostType(type.toLowerCase())}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '2rem',
                                background: postType === type.toLowerCase() ? 'white' : 'rgba(255,255,255,0.05)',
                                color: postType === type.toLowerCase() ? 'black' : 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                         >
                             {type}
                         </button>
                     ))}
                 </div>
            </div>

            {/* Content Area */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 500, color: '#d4d4d8' }}>Caption / Content</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => generateAI('caption')} className="btn-ghost" style={{ fontSize: '0.8rem', display: 'flex', gap: '4px', padding: '6px 12px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }}>
                          <Wand2 size={14} /> AI Caption
                      </button>
                       <button onClick={() => generateAI('hashtags')} className="btn-ghost" style={{ fontSize: '0.8rem', display: 'flex', gap: '4px', padding: '6px 12px', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6' }}>
                          <Sparkles size={14} /> AI Tags
                      </button>
                  </div>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Write your ${platform} ${postType}...`}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '1rem',
                  borderRadius: '1rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />

              {/* Media Upload Area */}
              <div 
                style={{ 
                    border: '2px dashed rgba(255,255,255,0.1)', 
                    borderRadius: '1rem', 
                    padding: '2rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: preview ? `url(${preview}) center/cover no-repeat` : 'transparent',
                    height: '200px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                  {preview && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '1rem' }}></div>}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*,video/*" />
                    <UploadCloud size={48} color={preview ? 'white' : '#52525b'} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                    <p style={{ color: preview ? 'white' : '#a1a1aa' }}>{file ? file.name : "Click to Upload Media"}</p>
                    <p style={{ fontSize: '0.8rem', color: '#52525b' }}>JPG, PNG, MP4 supported</p>
                  </div>
                  {preview && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', zIndex: 2 }}
                       >
                          <X size={16} />
                      </button>
                  )}
              </div>
            </div>

            <button
              onClick={handlePost}
              disabled={status !== 'idle' || (!content && !file)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: status === 'idle' && (!content && !file) ? 0.5 : 1,
                cursor: status === 'idle' && (content || file) ? 'pointer' : 'default',
                transition: 'all 0.3s'
              }}
            >
              {status === 'posting' ? 'Publishing...' : status === 'success' ? (
                <>
                  <Check size={20} /> Published!
                </>
              ) : (
                <>
                  <Share2 size={20} /> Publish to {platform}
                </>
              )}
            </button>
        </div>

        {/* Right Column: Platform Selector */}
        <div>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Select Platform</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {platforms.map(({ id, icon: Icon, color }) => (
                    <button
                        key={id}
                        onClick={() => setPlatform(id)}
                        style={{
                            padding: '1rem',
                            borderRadius: '1rem',
                            background: platform === id ? color : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            border: platform === id ? '2px solid white' : '2px solid transparent',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '100%',
                            textAlign: 'left',
                            opacity: platform === id ? 1 : 0.6
                        }}
                    >
                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={20} color={color} />
                        </div>
                        <span style={{ textTransform: 'capitalize', fontSize: '1rem', fontWeight: 600 }}>{id}</span>
                        {platform === id && <Check size={18} style={{ marginLeft: 'auto' }} />}
                    </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
