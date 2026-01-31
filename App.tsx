
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PlatformGrid from './components/PlatformGrid';
import ResultCard from './components/ResultCard';
import { extractVideoMetadata } from './services/geminiService';
import { ProcessingState, RecentDownload } from './types';

// THEME CONFIGURATION - Centralized site management
const THEME_CONFIG = {
  siteName: "StreamPulse",
  tagline: "The Future of Content Extraction",
  telegram: "https://t.me/saifadvisor",
  telegramHandle: "@saifadvisor",
  supportEmail: "support@streampulse.pro",
  socials: {
    twitter: "#",
    github: "#"
  }
};

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    result: null,
    sources: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('streampulse_downloads');
    if (saved) {
      setRecentDownloads(JSON.parse(saved));
    }
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const urlPattern = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be|facebook\.com|fb\.watch|instagram\.com|tiktok\.com|vimeo\.com)\/.+$/;
    if (!urlPattern.test(url)) {
      setProcessing({ isLoading: false, error: 'Link validation failed. Please use a supported platform URL.', result: null, sources: [] });
      return;
    }

    setProcessing({ isLoading: true, error: null, result: null, sources: [] });

    try {
      const { metadata, sources } = await extractVideoMetadata(url);
      setProcessing({ isLoading: false, error: null, result: metadata, sources });
      // Scroll to result on desktop
      if (window.innerWidth > 1024) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setProcessing({ isLoading: false, error: 'Neural extraction failed. Link might be restricted or offline.', result: null, sources: [] });
    }
  };

  const addDownloadToHistory = (download: RecentDownload) => {
    const updated = [download, ...recentDownloads].slice(0, 5);
    setRecentDownloads(updated);
    localStorage.setItem('streampulse_downloads', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center selection:bg-blue-600/30">
      <Navbar />

      {/* Floating Telegram Access Button */}
      <a 
        href={THEME_CONFIG.telegram} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[200] w-14 h-14 bg-[#24A1DE] text-white rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(36,161,222,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.61-.2-1.1-.31-1.05-.66.02-.18.27-.36.75-.56 2.93-1.27 4.88-2.11 5.85-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
        <span className="absolute right-16 bg-[#24A1DE] text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest shadow-xl pointer-events-none">Get Support</span>
      </a>

      <main className="flex-grow w-full flex flex-col items-center px-6 pt-40 pb-24 max-w-7xl mx-auto z-10">
        
        {/* HERO SECTION */}
        <section id="hero" className="w-full flex flex-col items-center mb-32">
          <div className="fade-up mb-8">
            <span className="px-5 py-2 rounded-full glass-panel text-[10px] font-black tracking-[0.3em] text-blue-400 border border-blue-500/20 uppercase inline-flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              Neural Network Online
            </span>
          </div>

          <div className="text-center mb-16 max-w-5xl fade-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] lg:px-20">
              Your Media, <br />
              <span className="neon-text shimmer-text">Without Limits</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
              Professional-grade extraction for digital archivists. Save 4K Master files and lossless FLAC/MP3 from any source.
            </p>

            {/* Premium Download Bar */}
            <form onSubmit={handleDownload} className="relative group max-w-3xl mx-auto mb-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[2.2rem] blur opacity-15 group-focus-within:opacity-40 transition duration-700"></div>
              <div className="relative flex flex-col sm:flex-row gap-3 bg-[#0a0a0c]/90 p-3 rounded-[2rem] border border-white/10 group-focus-within:border-blue-500/30 transition-all shadow-2xl backdrop-blur-3xl">
                <div className="flex-grow flex items-center px-5">
                  <svg className="w-6 h-6 text-gray-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <input 
                    type="text"
                    placeholder="Enter URL: YouTube, Facebook, Instagram..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-white py-4 text-xl placeholder:text-gray-700 outline-none font-semibold"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={processing.isLoading}
                  className="btn-premium text-white font-black px-12 py-5 rounded-[1.6rem] transition-all flex items-center justify-center gap-4 group/btn shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  {processing.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="tracking-[0.1em]">PROCESSING</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-[0.1em]">EXTRACT NOW</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="fade-up flex justify-center gap-4" style={{ animationDelay: '0.2s' }}>
              <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                  <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#050506]" src={`https://i.pravatar.cc/100?img=${i+10}`} alt=""/>
                ))}
              </div>
              <p className="text-gray-600 text-xs font-bold self-center">Trusted by 1.2k+ creators today</p>
            </div>

            {processing.error && (
              <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-sm font-bold flex items-center gap-3 justify-center animate-shake">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>
                {processing.error}
              </div>
            )}
          </div>

          <div id="result-section" className="w-full flex flex-col items-center min-h-[100px]">
            {processing.result ? (
              <ResultCard 
                data={processing.result} 
                sources={processing.sources} 
                onDownloadComplete={addDownloadToHistory}
              />
            ) : (
              !processing.isLoading && (
                <div id="origins" className="w-full pt-12 flex flex-col items-center">
                  <h3 className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] mb-12">Verified Processing Nodes</h3>
                  <PlatformGrid />
                </div>
              )
            )}
          </div>
        </section>

        {/* PRICING TABLE */}
        <section id="pricing" className="w-full py-40 border-t border-white/5">
          <div className="text-center mb-24">
             <span className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4 block">Pricing Models</span>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Choose Your Level</h2>
             <p className="text-gray-500 font-medium max-w-xl mx-auto">From casual archivists to professional data miners, we have a pipeline for you.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
            {[
              { name: 'Basic', price: '$0', popular: false, features: ['5 Monthly Extractions', '720p Quality', 'Basic Servers'] },
              { name: 'Elite Pro', price: '$12', popular: true, features: ['Unlimited Extractions', '8K Pro Res Support', 'Neural Buffer Nodes', 'No Ads Forever', 'Batch Support'] },
              { name: 'Enterprise', price: '$49', popular: false, features: ['API Endpoint Access', 'Team Management', 'Priority Neural Support', 'Custom Pipelines'] }
            ].map((plan, i) => (
              <div key={plan.name} className={`relative p-12 rounded-[3rem] glass-panel border transition-all duration-700 flex flex-col group hover:-translate-y-4 ${plan.popular ? 'border-blue-500/50 bg-blue-500/[0.03] scale-105 z-10' : 'border-white/5 hover:border-white/20'}`}>
                {plan.popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl">Recommended</div>}
                <h4 className="text-xl font-black uppercase tracking-widest mb-10 text-gray-400 group-hover:text-white transition-colors">{plan.name}</h4>
                <div className="flex items-baseline gap-2 mb-12">
                   <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                   <span className="text-gray-600 text-sm font-bold">/month</span>
                </div>
                <div className="space-y-6 mb-16 flex-grow">
                  {plan.features.map(feat => (
                    <div key={feat} className="flex items-center gap-4">
                       <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                       </div>
                       <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        {!processing.result && recentDownloads.length > 0 && (
          <section id="history" className="w-full py-32 border-t border-white/5 flex flex-col items-center">
             <div className="max-w-2xl w-full">
                <h3 className="text-2xl font-black mb-10 text-center tracking-tight">Recent Sessions</h3>
                <div className="space-y-4">
                   {recentDownloads.map(dl => (
                     <div key={dl.id} className="glass-panel p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                              <img src={dl.thumbnail} className="w-full h-full object-cover" alt=""/>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{dl.title}</span>
                              <span className="text-[10px] text-gray-600 font-black uppercase mt-1">{dl.quality} • {new Date(dl.timestamp).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-blue-600 transition-all">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#030304] border-t border-white/5 py-24 px-10 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="flex flex-col max-w-sm">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
               </div>
               <span className="text-3xl font-black tracking-tighter">{THEME_CONFIG.siteName}</span>
            </div>
            <p className="text-gray-600 font-medium leading-relaxed mb-10">Premium digital media extraction service. High-fidelity streams, encrypted pipelines, and total creative freedom.</p>
            <div className="flex gap-6">
               <a href={THEME_CONFIG.telegram} className="text-gray-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.61-.2-1.1-.31-1.05-.66.02-.18.27-.36.75-.56 2.93-1.27 4.88-2.11 5.85-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg></a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
             <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-white uppercase tracking-widest">Platform</span>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Extractor</a>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Batch Sync</a>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Neural Nodes</a>
             </div>
             <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-white uppercase tracking-widest">Legal</span>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Privacy</a>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">DMCA Policy</a>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Compliance</a>
             </div>
             <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-white uppercase tracking-widest">Support</span>
                <a href={THEME_CONFIG.telegram} className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Telegram Help</a>
                <a href="#" className="text-gray-600 hover:text-blue-400 text-sm font-bold transition-all">Email Support</a>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex justify-between items-center">
           <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">© 2024 {THEME_CONFIG.siteName} Digital Media Group</span>
           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Designed by {THEME_CONFIG.telegramHandle}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
