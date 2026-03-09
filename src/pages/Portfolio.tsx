import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';
import { categoriesData, portfolioItemsData } from '../data';

export default function Portfolio() {
  const [categories, setCategories] = useState<any[]>(categoriesData);
  const [items, setItems] = useState<any[]>(portfolioItemsData);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.25 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
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
        if (data.categories) setCategories(data.categories);
        if (data.portfolioItems) setItems(data.portfolioItems);
      })
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Disable right click
  };

  const handleItemClick = (item: any) => {
    playClick();
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-40 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" onMouseEnter={() => playHover()} onClick={() => playClick()} className="text-xl font-bold tracking-tighter flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Quay lại
          </Link>
          <div className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Sản phẩm đã làm</div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        {/* Animated Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-20 animate-blob transition-colors duration-500"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-20 animate-blob animation-delay-2000 transition-colors duration-500"></div>
          <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-20 animate-blob animation-delay-4000 transition-colors duration-500"></div>
        </div>

        {categories.map((category, index) => {
          const categoryItems = items.filter(i => i.category_id === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} className="mb-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-10 border-b border-indigo-100 dark:border-indigo-900/30 pb-6"
              >
                <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">{category.name}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">{category.type}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-100 dark:from-indigo-900/30 to-transparent"></div>
                </div>
              </motion.div>

              {/* Slider Container */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
              >
                {categoryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onMouseEnter={() => playHover()}
                    className="flex-none w-80 md:w-96 snap-start cursor-pointer group relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white dark:border-neutral-800 aspect-[4/3]"
                    onClick={() => handleItemClick(item)}
                  >
                    {category.type === 'image' ? (
                      <img 
                        src={item.media_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onContextMenu={handleContextMenu}
                        draggable={false}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src={`https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/maxresdefault.jpg`}
                          className="w-full h-full object-cover"
                          alt={item.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-black backdrop-blur-sm">
                            <Play className="w-6 h-6 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay Info */}
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-indigo-900/90 via-purple-900/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{item.title}</h3>
                      <p className="text-sm text-indigo-100 line-clamp-2 font-medium">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
            onContextMenu={handleContextMenu}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Logo Watermark */}
            <div className="absolute bottom-8 right-8 z-50 pointer-events-none opacity-50">
              <div className="text-2xl font-bold text-white tracking-tighter drop-shadow-lg">PORTFOLIO</div>
            </div>

            {/* Content */}
            <div 
              className="relative max-w-6xl w-full max-h-[90vh] p-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.category_type === 'image' ? (
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  src={getGoogleDriveDirectLink(selectedItem.media_url)} 
                  alt={selectedItem.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                  draggable={false}
                  onContextMenu={handleContextMenu}
                />
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                >
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedItem.media_url)}?autoplay=1`} 
                    title={selectedItem.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </motion.div>
              )}
              
              {/* Info Overlay in Lightbox */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-8 max-w-md bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white pointer-events-none"
              >
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-white/70">{selectedItem.description}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
