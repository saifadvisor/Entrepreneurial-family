
import React, { useState } from 'react';
import { VideoMetadata, FormatType, GroundingSource, RecentDownload } from '../types';

interface ResultCardProps {
  data: VideoMetadata;
  sources?: GroundingSource[];
  onDownloadComplete: (download: RecentDownload) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, sources = [], onDownloadComplete }) => {
  const [activeTab, setActiveTab] = useState<FormatType>(FormatType.VIDEO);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredFormats = data.formats.filter(f => f.type === activeTab);

  const startDownload = (format: any) => {
    const key = `${format.quality}-${format.type}`;
    if (downloading) return;

    setDownloading(key);
    setDownloadProgress(prev => ({ ...prev, [key]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadProgress(prev => ({ ...prev, [key]: 100 }));
        
        setTimeout(() => {
          setDownloading(null);
          const link = document.createElement('a');
          link.href = '#'; 
          link.download = `${data.title}.${format.extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          onDownloadComplete({
            id: Math.random().toString(36).substr(2, 9),
            title: data.title,
            thumbnail: data.thumbnail,
            quality: format.quality,
            timestamp: Date.now()
          });
        }, 500);
      } else {
        setDownloadProgress(prev => ({ ...prev, [key]: progress }));
      }
    }, 150);
  };

  return (
    <div className="w-full max-w-5xl mt-12 fade-up px-4">
      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row">
          {/* Enhanced Thumbnail Section */}
          <div className="lg:w-2/5 relative overflow-hidden group">
            <img 
              src={data.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'} 
              alt={data.title}
              className="w-full h-full object-cover aspect-video lg:aspect-auto group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent flex flex-col justify-end p-8">
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl w-fit mb-4 uppercase tracking-[0.2em]">
                {data.duration}
              </span>
              <div className="lg:hidden">
                <h3 className="text-2xl font-black text-white leading-tight mb-2 line-clamp-2">
                  {data.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Premium Details Section */}
          <div className="lg:w-3/5 p-10 flex flex-col bg-[#0a0a0c]/40">
            <div className="hidden lg:flex justify-between items-start mb-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-black text-white leading-tight pr-6">
                  {data.title}
                </h3>
                {sources.length > 0 && (
                   <div className="flex flex-wrap gap-4 mt-2">
                      {sources.map((s, i) => s.web && (
                        <a key={i} href={s.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
                          Verified Origin
                        </a>
                      ))}
                   </div>
                )}
              </div>
              <span className="text-blue-500/80 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10">{data.platform}</span>
            </div>

            {/* Tab Selector - Premium Design */}
            <div className="flex gap-10 mb-8 border-b border-white/5 relative">
              <button 
                onClick={() => setActiveTab(FormatType.VIDEO)}
                className={`text-[11px] font-black tracking-[0.2em] transition-all pb-4 relative z-10 ${activeTab === FormatType.VIDEO ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                VIDEO MASTER
                {activeTab === FormatType.VIDEO && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>}
              </button>
              <button 
                onClick={() => setActiveTab(FormatType.AUDIO)}
                className={`text-[11px] font-black tracking-[0.2em] transition-all pb-4 relative z-10 ${activeTab === FormatType.AUDIO ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                AUDIO LOSSLESS
                {activeTab === FormatType.AUDIO && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>}
              </button>
            </div>

            {/* Formats Grid - Custom Scrollbar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {filteredFormats.map((format, idx) => {
                const key = `${format.quality}-${format.type}`;
                const isThisDownloading = downloading === key;
                const progress = downloadProgress[key] || 0;

                return (
                  <div 
                    key={idx}
                    className={`group relative overflow-hidden flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border transition-all duration-500 ${isThisDownloading ? 'border-blue-500/50' : 'border-white/5 hover:border-white/20'}`}
                  >
                    {/* Progress Background Overlay */}
                    {isThisDownloading && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-600/[0.08] transition-all duration-300 pointer-events-none"
                        style={{ width: `${progress}%` }}
                      ></div>
                    )}

                    <div className="flex flex-col relative z-10">
                      <span className="text-white font-bold text-base tracking-tight">{format.quality}</span>
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{format.extension} • {format.size}</span>
                    </div>

                    <button 
                      onClick={() => startDownload(format)}
                      disabled={downloading !== null && !isThisDownloading}
                      className={`relative z-10 flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                        isThisDownloading 
                          ? 'bg-blue-600 text-white cursor-default shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                          : 'bg-white/5 hover:bg-white text-white hover:text-black disabled:opacity-30'
                      }`}
                    >
                      {isThisDownloading ? (
                        <>
                          <span className="animate-pulse">{Math.round(progress)}%</span>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </>
                      ) : progress === 100 ? (
                        <>
                          <span>SAVED</span>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        </>
                      ) : (
                        <>
                          <span>DOWNLOAD</span>
                          <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
