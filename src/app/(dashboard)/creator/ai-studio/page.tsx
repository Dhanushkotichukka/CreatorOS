"use client";

import { useState } from 'react';
import { Sparkles, Copy, Loader2, BookOpen, Image as ImageIcon, Video, Mic, PenTool } from 'lucide-react';

export default function AIStudio() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('hook'); // hook, caption, script, story, thumbnail, image
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    setImageUrl('');
    
    // Choose endpoint based on type
    let endpoint = '/api/ai/generate';
    if (type === 'story') endpoint = '/api/ai/story';
    if (type === 'thumbnail' || type === 'image') endpoint = '/api/ai/thumbnail';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, language, prompt: topic, title: topic }),
      });
      const data = await res.json();
      
      if (type === 'thumbnail' || type === 'image') {
          setImageUrl(data.url);
          setResult(data.alt || 'Image generated successfully');
      } else {
          setResult(data.result);
      }
    } catch (e) {
      console.error(e);
      setResult('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modes = [
      { id: 'hook', label: 'Viral Hook', icon: Sparkles },
      { id: 'caption', label: 'Caption', icon: Mic },
      { id: 'script', label: 'Video Script', icon: Video },
      { id: 'story', label: 'Story', icon: BookOpen },
      { id: 'thumbnail', label: 'Thumbnail', icon: ImageIcon },
      { id: 'image', label: 'Post Image', icon: PenTool },
  ];

  return (
    <div className="fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>AI Creative Studio</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem' }}>Generate hooks, scripts, and visuals with one click.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        {/* Controls */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          
          {/* Mode Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generation Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setType(m.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: type === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: type === m.id ? 'white' : '#a1a1aa',
                    border: type === m.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <m.icon size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{m.label}</span>
                </button>
              ))}
            </div>
            
            {/* Telugu Special Button */}
             <button
                  onClick={() => { setType('story'); setLanguage('telugu'); }}
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)',
                    color: 'black',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: 0.9
                  }}
                >
                   🇮🇳 Telugu Story Special
            </button>
          </div>

          {/* Language Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Output Language</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setLanguage('english')}
                style={{ 
                  flex: 1, padding: '0.75rem', borderRadius: '0.75rem', 
                  background: language === 'english' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: language === 'english' ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                  color: language === 'english' ? 'white' : '#a1a1aa',
                  fontWeight: 500
                }}
              >
                🇬🇧 English
              </button>
              <button 
                onClick={() => setLanguage('telugu')}
                style={{ 
                  flex: 1, padding: '0.75rem', borderRadius: '0.75rem', 
                  background: language === 'telugu' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: language === 'telugu' ? '1px solid white' : '1px solid rgba(255,255,255,0.1)',
                  color: language === 'telugu' ? 'white' : '#a1a1aa',
                  fontWeight: 500
                }}
              >
                🇮🇳 Telugu
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {type === 'thumbnail' || type === 'image' ? 'Image Prompt' : 'Topic / Context'}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={type === 'thumbnail' ? "Describe the video thumbnail..." : "What is this content about?"}
              style={{
                width: '100%',
                height: '120px',
                resize: 'none',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !topic}
            className="btn-primary"
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              height: '54px', fontSize: '1rem',
              opacity: loading || !topic ? 0.7 : 1,
              cursor: loading || !topic ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Processing...' : 'Generate Now'}
          </button>
        </div>

        {/* Output Area */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                <BookOpen size={18} color="white" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Result</h3>
            </div>
            {result && !imageUrl && (
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <Copy size={14} /> Copy
              </button>
            )}
          </div>
          
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,0,0,0.2)', 
            padding: '1.5rem', 
            borderRadius: '1rem', 
            whiteSpace: 'pre-wrap',
            color: result ? '#e4e4e7' : '#52525b',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            border: '1px dashed rgba(255,255,255,0.1)',
            display: 'flex', alignItems: imageUrl ? 'center' : 'flex-start', justifyContent: imageUrl ? 'center' : 'flex-start'
          }}>
            {imageUrl ? (
                <div style={{ textAlign: 'center' }}>
                    <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                    <p style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>{result}</p>
                </div>
            ) : (
                result || 'Select a mode and enter a topic to begin...'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
