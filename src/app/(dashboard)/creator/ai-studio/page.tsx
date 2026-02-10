"use client";

import { useState } from 'react';
import { Sparkles, Copy, Loader2, BookOpen, Image as ImageIcon, Video, Mic, PenTool, Check, Wand2, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function AIStudio() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('hook'); // hook, caption, script, story, thumbnail, image
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
      { id: 'hook', label: 'Viral Hook', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
      { id: 'caption', label: 'Caption', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-400/10' },
      { id: 'script', label: 'Video Script', icon: Video, color: 'text-red-400', bg: 'bg-red-400/10' },
      { id: 'story', label: 'Story', icon: BookOpen, color: 'text-green-400', bg: 'bg-green-400/10' },
      { id: 'thumbnail', label: 'Thumbnail', icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-400/10' },
      { id: 'image', label: 'Post Image', icon: PenTool, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 ring-1 ring-purple-500/20">
            <Wand2 size={32} className="text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4">
            AI Creative Studio
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Generate viral hooks, engaging scripts, and stunning visuals in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel p-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Generation Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setType(m.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 border ${
                            type === m.id 
                            ? 'bg-zinc-800 border-white/20 shadow-lg scale-[1.02]' 
                            : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800 hover:border-white/10 text-zinc-400'
                        }`}
                    >
                        <div className={`p-2 rounded-lg ${type === m.id ? m.bg : 'bg-zinc-800'} transition-colors`}>
                            <m.icon size={20} className={type === m.id ? m.color : 'text-zinc-500'} />
                        </div>
                        <span className={`text-xs font-bold ${type === m.id ? 'text-white' : 'text-zinc-500'}`}>{m.label}</span>
                    </button>
                ))}
              </div>

               <button
                  onClick={() => { setType('story'); setLanguage('telugu'); }}
                  className="w-full mt-4 p-3 rounded-xl bg-gradient-to-r from-orange-500 via-white to-green-500 text-black font-black text-sm uppercase tracking-wide opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all shadow-lg"
                >
                   🇮🇳 Telugu Story Special
                </button>
          </div>

          <div className="glass-panel p-6">
               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Globe size={14} /> Output Language
               </h3>
               <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                   {['english', 'telugu'].map((lang) => (
                       <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                language === lang 
                                ? 'bg-zinc-700 text-white shadow-md' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                       >
                           {lang === 'english' ? '🇬🇧 English' : '🇮🇳 Telugu'}
                       </button>
                   ))}
               </div>
          </div>

          <div className="glass-panel p-6">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Input Context</h3>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={type === 'thumbnail' ? "Describe the video thumbnail..." : "What is this content about? (e.g., 'How to start a business in 2024')"}
                    className="w-full h-32 bg-zinc-900/50 rounded-xl border border-white/5 p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none transition-all placeholder:text-zinc-600"
                />
          </div>

          <button
            onClick={generate}
            disabled={loading || !topic}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                loading || !topic 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} className="text-purple-600" />}
            {loading ? 'Generating Magic...' : 'Generate Content'}
          </button>

        </div>

        {/* Right Column: Output (Span 8) */}
        <div className="lg:col-span-8 flex flex-col h-full">
            <div className="glass-panel flex-1 flex flex-col p-8 relative overflow-hidden min-h-[600px] border border-white/10 group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-all duration-1000" />
                
                <div className="flex justify-between items-center mb-6 relative z-10 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
                             <BookOpen size={20} className="text-white" />
                         </div>
                         <div>
                             <h3 className="text-lg font-bold text-white">AI Output</h3>
                             <p className="text-xs text-zinc-500">Generated by Gemini Pro</p>
                         </div>
                    </div>
                    
                    {result && !imageUrl && (
                        <button 
                            onClick={copyToClipboard}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                                copied ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    )}
                </div>

                <div className="flex-1 relative z-10">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="text-purple-400 animate-pulse" size={32} />
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Creating your content...</h4>
                            <p className="text-zinc-500">Analyzing trends and crafting the perfect hook.</p>
                        </div>
                    ) : (
                        <div className={`h-full w-full rounded-2xl ${!result && !imageUrl ? 'flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/30' : ''}`}>
                            {imageUrl ? (
                                <div className="text-center w-full">
                                    <img src={imageUrl} alt="AI Generated" className="max-h-[500px] mx-auto rounded-xl shadow-2xl border border-white/10" />
                                    <p className="mt-4 text-zinc-400 italic text-sm">{result}</p>
                                    <a href={imageUrl} download className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 text-sm font-bold">
                                        <ImageIcon size={16} /> Download Image
                                    </a>
                                </div>
                            ) : result ? (
                                <div className="prose prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-lg text-zinc-300 leading-relaxed bg-transparent border-none p-0">
                                        {result}
                                    </pre>
                                </div>
                            ) : (
                                <div className="text-center max-w-sm mx-auto p-6">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <PenTool className="text-zinc-600" size={32} />
                                    </div>
                                    <h4 className="text-zinc-300 font-bold mb-2">Ready to Create</h4>
                                    <p className="text-zinc-500 text-sm">Select a mode from the left sidebar and enter a topic to start generating amazing content.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
