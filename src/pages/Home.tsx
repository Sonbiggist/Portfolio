import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Briefcase, User, Image as ImageIcon, Moon, Sun, Send, Play, Download, ArrowUp, Sparkles, Ghost, Cat, Heart } from 'lucide-react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { profileData, portfolioItemsData } from '../data';

export default function Home() {
  const [profile, setProfile] = useState<any>(profileData);
  const [portfolioItems, setPortfolioItems] = useState<any[]>(portfolioItemsData.slice(0, 10));
  const [isDark, setIsDark] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.25 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const sliderRef = useRef<HTMLDivElement>(null);

  // Helper to extract youtube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper to convert Google Drive link to direct image link
  const getGoogleDriveDirectLink = (url: string) => {
    if (!url.includes('drive.google.com')) return url;
    const regExp = /\/d\/([^\/]+)/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://drive.google.com/uc?id=${match[1]}`;
    }
    const idParam = new URLSearchParams(new URL(url).search).get('id');
    if (idParam) {
      return `https://drive.google.com/uc?id=${idParam}`;
    }
    return url;
  };

  useEffect(() => {
    // Fetch data from JSON
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
        if (data.portfolioItems) setPortfolioItems(data.portfolioItems.slice(0, 10));
      })
      .catch(err => console.error('Error loading data:', err));

    // Check initial dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Auto-scroll for featured slider
    const sliderInterval = setInterval(() => {
      if (sliderRef.current && !hoveredItem) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(sliderInterval);
    };
  }, [hoveredItem]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    playClick();
    setIsDark(!isDark);
    
    // Trigger confetti on dark mode toggle
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: isDark ? ['#facc15', '#fef08a'] : ['#818cf8', '#c084fc']
    });
  };

  const handlePageClick = (e: React.MouseEvent) => {
    const newSparkle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setSparkles(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  };

  const handleLinkClick = () => {
    playClick();
  };

  return (
    <div 
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500"
      onClick={handlePageClick}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes anime-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .anime-float {
          animation: anime-float 4s ease-in-out infinite;
        }
      `}} />

      {/* Anime Mascot following mouse */}
      <motion.div
        className="fixed pointer-events-none z-[100] hidden lg:block"
        animate={{
          x: mousePos.x + 20,
          y: mousePos.y + 20,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150, mass: 0.5 }}
      >
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900/30"
        >
          <Cat className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        </motion.div>
      </motion.div>

      {/* Floating Decorative Anime Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            y: [0, -40, 0], 
            x: [0, 20, 0],
            rotate: [0, 45, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[5%] text-pink-400/20 dark:text-pink-400/10"
        >
          <Heart className="w-24 h-24 fill-current" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 50, 0], 
            x: [0, -30, 0],
            rotate: [0, -30, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[5%] text-indigo-400/20 dark:text-indigo-400/10"
        >
          <Sparkles className="w-32 h-32" />
        </motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[15%] text-purple-400/20 dark:text-purple-400/10"
        >
          <Ghost className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => {
              playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => playHover()}
            className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            <div className="absolute -top-12 right-0 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-100 dark:border-indigo-900/30">
              Lên đầu trang ✨
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sparkle Effects */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 180 }}
            exit={{ opacity: 0 }}
            className="fixed pointer-events-none z-[200] text-yellow-400"
            style={{ left: sparkle.x - 10, top: sparkle.y - 10 }}
          >
            <Sparkles className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-50 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {profile.name || 'Portfolio'}
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300 items-center">
            <Link to="/about" onMouseEnter={() => playHover()} onClick={handleLinkClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Về bản thân</Link>
            <Link to="/experience" onMouseEnter={() => playHover()} onClick={handleLinkClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kinh nghiệm</Link>
            <Link to="/portfolio" onMouseEnter={() => playHover()} onClick={handleLinkClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sản phẩm</Link>
            <Link to="/contact" onMouseEnter={() => playHover()} onClick={handleLinkClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Liên hệ</Link>
            
            <button 
              onClick={toggleDarkMode}
              onMouseEnter={() => playHover()}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Backdrop for blurring everything else when hovering slider */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/40 dark:bg-black/60 backdrop-blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 max-w-6xl mx-auto relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/50 dark:via-neutral-950 dark:to-purple-950/50 -z-20 transition-colors duration-500"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob transition-colors duration-500"></div>
        <div className="absolute top-40 -left-10 w-72 h-72 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000 transition-colors duration-500"></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-4000 transition-colors duration-500"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-white/40 dark:border-neutral-700/40 shadow-sm text-sm font-semibold text-indigo-600 dark:text-indigo-400"
          >
            ✨ Welcome to my universe
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 pb-2 drop-shadow-sm">
              {profile.title || 'Creative Professional'}
            </span>
          </h1>
          
          {/* Featured Portfolio Slider */}
          {portfolioItems.length > 0 && (
            <div className="relative w-full max-w-5xl mx-auto mb-12 z-50">
              <div 
                ref={sliderRef}
                className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar items-center"
              >
                {portfolioItems.map((item) => (
                  <motion.div
                    key={item.id}
                    onMouseEnter={() => { playHover(); setHoveredItem(item); }}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ scale: 1.15 }}
                    className={`flex-none w-64 md:w-72 snap-center cursor-pointer relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-white dark:border-neutral-800 aspect-[4/3] transition-all duration-500 ${hoveredItem && hoveredItem.id !== item.id ? 'opacity-30 blur-sm scale-95' : ''} ${hoveredItem?.id === item.id ? 'shadow-2xl shadow-indigo-500/50 z-50' : 'shadow-xl shadow-indigo-100/50 dark:shadow-none z-10'}`}
                  >
                    {item.category_type === 'image' ? (
                      <img 
                        src={getGoogleDriveDirectLink(item.media_url)} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src={`https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/maxresdefault.jpg`}
                          className="w-full h-full object-cover"
                          alt={item.title}
                          onError={(e) => {
                            // Fallback to hqdefault if maxresdefault is not available
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-black backdrop-blur-sm">
                            <Play className="w-6 h-6 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={`absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-indigo-900/90 via-purple-900/50 to-transparent text-white transition-all duration-300 ${hoveredItem?.id === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <h3 className="text-xl font-bold mb-1 drop-shadow-md truncate">{item.title}</h3>
                      <p className="text-xs text-indigo-100 line-clamp-2 font-medium">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-50">
            <Link 
              to="/portfolio"
              onMouseEnter={() => playHover()}
              onClick={handleLinkClick}
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1 text-lg group"
            >
              Xem sản phẩm <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about"
              onMouseEnter={() => playHover()}
              onClick={handleLinkClick}
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </motion.div>
      </section>

      {/* About & Experience Split */}
      <section className="py-32 px-6 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-900/20 dark:via-neutral-950 dark:to-neutral-950 -z-10 transition-colors duration-500"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white dark:border-neutral-800 shadow-2xl shadow-indigo-100/50 dark:shadow-none hover:shadow-indigo-200/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-indigo-300 dark:to-purple-300">Về bản thân</h2>
            </div>
            <div className="prose prose-lg prose-neutral dark:prose-invert">
              <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
                {profile.profile_image && (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={profile.profile_image} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a.png if a.jpg fails
                        if ((e.target as HTMLImageElement).src.endsWith('.jpg')) {
                          (e.target as HTMLImageElement).src = '/a.png';
                        }
                      }}
                    />
                  </div>
                )}
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-medium m-0">
                  {profile.about}
                </p>
              </div>
              
              {profile.cv_url && (
                <a 
                  href={profile.cv_url} 
                  download 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  Tải CV của tôi
                </a>
              )}
            </div>
          </motion.div>

          <motion.div 
            id="experience"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white dark:border-neutral-800 shadow-2xl shadow-purple-100/50 dark:shadow-none hover:shadow-purple-200/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-900 dark:from-purple-300 dark:to-pink-300">Kinh nghiệm</h2>
            </div>
            <div className="prose prose-lg prose-neutral dark:prose-invert">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-medium">
                {profile.experience}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-500 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight drop-shadow-lg">Sẵn sàng hợp tác?</h2>
          <p className="text-xl text-indigo-100 mb-12 font-medium">Hãy cùng nhau tạo ra những sản phẩm tuyệt vời.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/portfolio"
              onMouseEnter={() => playHover()}
              onClick={handleLinkClick}
              className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 text-xl group"
            >
              Khám phá các dự án <ImageIcon className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
            </Link>
            
            {profile.contact_link && (
              <a 
                href={profile.contact_link}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playHover()}
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold hover:from-pink-400 hover:to-rose-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50 text-xl group"
              >
                Liên hệ ngay <Send className="ml-3 w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </motion.div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
