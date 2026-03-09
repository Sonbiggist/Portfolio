import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Facebook, Briefcase, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';
import { profileData, portfolioItemsData } from '../data';

export default function Experience() {
  const [profile, setProfile] = useState<any>(profileData);
  const [items, setItems] = useState<any[]>(portfolioItemsData.slice(4, 10));
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.25 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
        if (data.portfolioItems) setItems(data.portfolioItems.slice(4, 10));
      });

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden">
      {/* 3D Floating Particles Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [Math.random() * 1000, Math.random() * 1000],
              x: [Math.random() * 1000, Math.random() * 1000],
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-2 h-2 bg-purple-500 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <Link to="/" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors font-bold">
          <Home className="w-5 h-5" /> Home
        </Link>
        <div className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">EXPERIENCE</div>
        <a href="https://www.facebook.com/Nxs.brohome" target="_blank" rel="noopener noreferrer" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-pink-400 hover:text-white transition-colors font-bold">
          <Facebook className="w-5 h-5" /> Contact
        </a>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold mb-6">
            <Briefcase className="w-4 h-4" /> JOURNEY
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-12 leading-tight">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Timeline</span>
          </h1>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-transparent"></div>
            
            <div className="space-y-16">
              <motion.div 
                whileHover={{ x: 10 }}
                className="relative pl-24 group"
              >
                <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-150 transition-transform"></div>
                <div className="bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap text-lg">
                    {profile.experience}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Auto-scrolling Portfolio */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
            <span className="w-12 h-px bg-purple-500"></span>
            PROJECT SHOWCASE
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
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                }}
                className="flex-none w-80 md:w-96 snap-center bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group perspective-1000"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {/* Hologram Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(168,85,247,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
