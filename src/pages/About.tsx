import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Facebook, User, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';
import { profileData, portfolioItemsData } from '../data';

export default function About() {
  const [profile, setProfile] = useState<any>(profileData);
  const [items, setItems] = useState<any[]>(portfolioItemsData.slice(0, 6));
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.25 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
        if (data.portfolioItems) setItems(data.portfolioItems.slice(0, 6));
      });

    // Auto-scroll effect
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Hologram Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#3b82f6,transparent)]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <Link to="/" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors font-bold">
          <Home className="w-5 h-5" /> Home
        </Link>
        <div className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ABOUT ME</div>
        <a href="https://www.facebook.com/Nxs.brohome" target="_blank" rel="noopener noreferrer" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-pink-400 hover:text-white transition-colors font-bold">
          <Facebook className="w-5 h-5" /> Contact
        </a>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hologram Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-blue-500/20 rounded-[3rem] blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              <img 
                src={profile.profile_image || '/a.jpg'} 
                alt={profile.name} 
                className="w-full h-full object-cover mix-blend-lighten"
              />
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan"></div>
            </div>
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-blue-600 p-4 rounded-2xl shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold mb-6">
              <User className="w-4 h-4" /> BIOGRAPHY
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{profile.name}</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed mb-10 whitespace-pre-wrap">
              {profile.about}
            </p>
          </motion.div>
        </div>

        {/* Auto-scrolling Portfolio */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
            <span className="w-12 h-px bg-blue-500"></span>
            FEATURED WORKS
          </h2>
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-10 hide-scrollbar snap-x snap-mandatory"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                }}
                className="flex-none w-80 md:w-96 snap-center bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group perspective-1000"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {/* Hologram Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
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
