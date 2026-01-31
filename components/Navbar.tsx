
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Downloader', id: 'hero' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Origins', id: 'origins' },
    { name: 'Add-ons', id: 'addons' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] py-4 px-6 md:px-12 flex justify-center transition-all duration-500 ${scrolled ? 'translate-y-2' : 'translate-y-0'}`}>
        <div className={`w-full max-w-7xl flex justify-between items-center backdrop-blur-2xl border border-white/5 rounded-3xl p-4 px-8 shadow-2xl transition-all duration-500 ${scrolled ? 'bg-[#0a0a0c]/80 border-white/10 mx-4' : 'bg-transparent'}`}>
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-all duration-500">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="text-xl font-black text-white tracking-tighter">StreamPulse</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
            <div className="flex items-center gap-3">
              <a 
                href="https://t.me/saifadvisor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#24A1DE]/10 hover:bg-[#24A1DE] text-[#24A1DE] hover:text-white border border-[#24A1DE]/20 rounded-full transition-all duration-300 shadow-lg"
                title="Join Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.61-.2-1.1-.31-1.05-.66.02-.18.27-.36.75-.56 2.93-1.27 4.88-2.11 5.85-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </a>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="px-6 py-2.5 bg-white text-black rounded-full font-black hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Go Unlimited
              </button>
            </div>
          </div>

          <div className="md:hidden">
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-[#050506]/95 backdrop-blur-xl md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navLinks.map((link, idx) => (
            <button 
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-2xl font-black text-white uppercase tracking-widest transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              {link.name}
            </button>
          ))}
          <a 
            href="https://t.me/saifadvisor" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-8 py-4 bg-[#24A1DE] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.61-.2-1.1-.31-1.05-.66.02-.18.27-.36.75-.56 2.93-1.27 4.88-2.11 5.85-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            Telegram Channel
          </a>
          <button 
            onClick={() => scrollToSection('pricing')}
            className={`w-full max-w-xs py-5 bg-white text-black rounded-2xl font-black text-lg shadow-xl transition-all transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '0.5s' }}
          >
            Upgrade To Pro
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
