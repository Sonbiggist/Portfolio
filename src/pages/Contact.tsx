import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Facebook, Send, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';
import { profileData, portfolioItemsData } from '../data';

export default function Contact() {
  const [profile, setProfile] = useState<any>(profileData);
  const [items, setItems] = useState<any[]>(portfolioItemsData.slice(0, 6));
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.25 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
        if (data.portfolioItems) setItems(data.portfolioItems.slice(0, 6));
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
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f622,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#ec489922,transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <Link to="/" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors font-bold">
          <Home className="w-5 h-5" /> Home
        </Link>
        <div className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">CONTACT ME</div>
        <a href="https://www.facebook.com/Nxs.brohome" target="_blank" rel="noopener noreferrer" onMouseEnter={() => playHover()} onClick={() => playClick()} className="flex items-center gap-2 text-pink-400 hover:text-white transition-colors font-bold">
          <Facebook className="w-5 h-5" /> Facebook
        </a>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
          >
            LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">CONNECT</span>
          </motion.h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            I'm always open to new opportunities and collaborations. Feel free to reach out to me!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-32">
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-neutral-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Facebook className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Facebook</h2>
            <p className="text-neutral-400 mb-8">Follow me on Facebook for the latest updates and projects.</p>
            <a 
              href="https://www.facebook.com/Nxs.brohome" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Visit Profile
            </a>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-neutral-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-3xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Send className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Direct Message</h2>
            <p className="text-neutral-400 mb-8">Send me a message directly and I'll get back to you as soon as possible.</p>
            <a 
              href={profile.contact_link || '#'} 
              className="px-10 py-4 rounded-full bg-pink-600 text-white font-bold hover:bg-pink-500 transition-all shadow-lg shadow-pink-500/20"
            >
              Send Message
            </a>
          </motion.div>
        </div>

        {/* Auto-scrolling Portfolio */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
            <span className="w-12 h-px bg-pink-500"></span>
            MY PORTFOLIO
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
                  boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)"
                }}
                className="flex-none w-80 md:w-96 snap-center bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group perspective-1000"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {/* Hologram Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(236,72,153,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
