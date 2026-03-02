import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wand2, 
  Download, 
  RefreshCw, 
  History, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Layers,
  Music,
  TreePine,
  Mic2,
  Image as ImageIcon,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { generateImage, editImage, suggestPrompt } from './services/gemini';
import { cn } from './lib/utils';

interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

const SUGGESTIONS = [
  {
    title: "Yggdrasil & Portals",
    prompt: "A central Yggdrasil world tree at night, with nine glowing circular portals along its trunk, each radiating colored sound waves. Subtle rune-like symbols inside each circle. Northern lights in the sky, starry background, deep blues and aurora greens, roots fading into darkness. Minimalist human silhouette meditating at the base of the tree. Norse knotwork border, mystical and serene atmosphere."
  },
  {
    title: "Viking Voyage",
    prompt: "A majestic Viking longship sailing through a misty fjord at dawn. The water is calm and reflective. In the sky, a faint silhouette of a giant raven made of stars. Ethereal sound waves rippling from the ship's prow. Cinematic lighting, epic scale, misty atmosphere."
  },
  {
    title: "Runic Monolith",
    prompt: "A single massive stone monolith standing in a snowy tundra. Ancient glowing runes are carved deep into the stone, pulsing with golden light. A blizzard swirls around it, but the area near the stone is calm. A sense of ancient power and solitude."
  },
  {
    title: "Celestial Valkyrie",
    prompt: "A Valkyrie silhouette against a giant blood-red moon. Her wings are made of shimmering light and sound frequencies. She holds a spear that drips stardust. Ethereal, powerful, and divine Norse aesthetic."
  }
];

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [basePrompt, setBasePrompt] = useState(SUGGESTIONS[0].prompt);
  const [keywords, setKeywords] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [title, setTitle] = useState('9 Lydportaler');
  const [subtitle, setSubtitle] = useState('Norse Sound Portals');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [status, setStatus] = useState<string>('');

  const generateInitial = async () => {
    setIsGenerating(true);
    setStatus('Summoning the Vision...');
    const prompt = `Book cover design for ‘${title}’. Subtitle: ‘${subtitle}’. ${basePrompt} Elegant rune-inspired title typography for ‘${title}’, modern subtitle typography for ‘${subtitle}’. High quality, cinematic lighting, 4k.`;
    try {
      const url = await generateImage(prompt);
      setCurrentImage(url);
      addToHistory(url, prompt);
    } catch (error) {
      console.error(error);
      setStatus('The runes are silent. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentImage || !editPrompt.trim()) return;

    setIsGenerating(true);
    setStatus(`Weaving: ${editPrompt}...`);
    try {
      const url = await editImage(currentImage, editPrompt);
      setCurrentImage(url);
      addToHistory(url, editPrompt);
      setEditPrompt('');
    } catch (error) {
      console.error(error);
      setStatus('The transformation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToHistory = (url: string, prompt: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      prompt,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const downloadImage = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `9-lydportaler-cover-${Date.now()}.png`;
    link.click();
  };

  const handleSuggestPrompt = async () => {
    if (!keywords.trim()) return;
    setIsSuggesting(true);
    try {
      const suggestion = await suggestPrompt(keywords);
      setBasePrompt(suggestion);
      setKeywords('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nordic-gold/20 flex items-center justify-center border border-nordic-gold/30">
            <TreePine className="text-nordic-gold w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-widest uppercase text-nordic-gold">{title || '9 Lydportaler'}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-sans">{subtitle || 'Norse Sound Portals'}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="glass-panel p-3 hover:bg-white/10 transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-16">
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-nordic-gold/60">The Vision</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight">Craft Your Sacred Portal</h2>
                <p className="text-white/60 font-light leading-relaxed">
                  Explore the nine Norse sounds as portals into ancient wisdom. Use the power of Gemini to visualize the Yggdrasil and its mystical resonance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Book Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-nordic-gold/30 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Subtitle</label>
                  <input 
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Enter Subtitle"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-nordic-gold/30 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">AI Prompt Assistant</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords (e.g. 'frozen lake, giant wolf')"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-nordic-gold/30 transition-colors text-sm"
                    />
                    <button 
                      onClick={handleSuggestPrompt}
                      disabled={isSuggesting || !keywords.trim()}
                      className="px-4 bg-nordic-gold/10 border border-nordic-gold/30 text-nordic-gold rounded-xl hover:bg-nordic-gold/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase">Suggest</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Cover Concept Prompt</label>
                  <textarea 
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    placeholder="Describe your cover vision..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-nordic-gold/30 transition-colors text-sm resize-none"
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setBasePrompt(s.prompt)}
                        className={cn(
                          "text-[10px] px-3 py-1 rounded-full border transition-all",
                          basePrompt === s.prompt 
                            ? "bg-nordic-gold/20 border-nordic-gold text-nordic-gold" 
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                        )}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {!currentImage ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateInitial}
                disabled={isGenerating}
                className="w-full py-6 rounded-2xl bg-nordic-gold text-nordic-blue font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-nordic-gold/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                {isGenerating ? 'Summoning...' : 'Generate Initial Cover'}
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <form onSubmit={handleEdit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-nordic-gold/60">Transform Design</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="e.g. 'Add more northern lights' or 'Make it retro'"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:border-nordic-gold/50 transition-colors placeholder:text-white/20"
                      />
                      <button 
                        type="submit"
                        disabled={isGenerating || !editPrompt.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-nordic-gold rounded-xl flex items-center justify-center text-nordic-blue disabled:opacity-50"
                      >
                        <Wand2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={generateInitial}
                    disabled={isGenerating}
                    className="glass-panel py-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                    <span className="text-sm">Regenerate</span>
                  </button>
                  <button 
                    onClick={downloadImage}
                    className="glass-panel py-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Music, label: 'Sound Waves' },
              { icon: Mic2, label: 'Vocal Portals' },
              { icon: Layers, label: 'Norse Runes' }
            ].map((f, i) => (
              <div key={i} className="glass-panel p-4 flex flex-col items-center gap-2 text-center">
                <f.icon className="w-5 h-5 text-nordic-gold/60" />
                <span className="text-[10px] uppercase tracking-wider opacity-60">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
          <div className="relative w-full max-w-[450px] aspect-[3/4] group">
            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full h-full rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 nordic-border"
                >
                  <img 
                    src={currentImage} 
                    alt="Book Cover Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay for status */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <Loader2 className="w-12 h-12 text-nordic-gold animate-spin" />
                      <p className="font-serif text-xl italic text-nordic-gold">{status}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  className="w-full h-full glass-panel flex flex-col items-center justify-center gap-6 p-12 text-center border-dashed"
                  animate={{ borderColor: isGenerating ? 'rgba(197, 160, 89, 0.5)' : 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl opacity-40">The Canvas Awaits</h3>
                    <p className="text-sm opacity-30">Begin the journey to visualize the nine portals of Yggdrasil.</p>
                  </div>
                  {isGenerating && (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-nordic-gold animate-spin" />
                      <span className="text-xs font-mono text-nordic-gold uppercase tracking-widest">{status}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative elements around image */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-nordic-gold/20 rounded-tr-3xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-nordic-gold/20 rounded-bl-3xl pointer-events-none" />
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl">Design History</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 opacity-30 gap-4">
                  <History className="w-12 h-12" />
                  <p>No designs yet</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {history.map((item) => (
                    <div key={item.id} className="space-y-3 group">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                        <img 
                          src={item.url} 
                          alt="History Item" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => {
                              setCurrentImage(item.url);
                              setShowHistory(false);
                            }}
                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold"
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-white/40 italic line-clamp-2">"{item.prompt}"</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="mt-16 text-center space-y-4 opacity-40 hover:opacity-100 transition-opacity pb-8">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">Powered by Gemini 2.5 Flash Image</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
