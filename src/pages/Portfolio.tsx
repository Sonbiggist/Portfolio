import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/portfolio').then(res => res.json()).then(setItems);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Disable right click
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Quay lại
          </Link>
          <div className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Sản phẩm đã làm</div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        {/* Animated Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
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
                className="mb-10 border-b border-indigo-100 pb-6"
              >
                <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">{category.name}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest">{category.type}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-100 to-transparent"></div>
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
                    className="flex-none w-80 md:w-96 snap-start cursor-pointer group relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-indigo-100/50 border border-white aspect-[4/3]"
                    onClick={() => setSelectedItem(item)}
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
                        <video 
                          src={item.media_url} 
                          className="w-full h-full object-cover"
                          muted playsInline
                          onContextMenu={handleContextMenu}
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
              <div className="text-2xl font-bold text-white tracking-tighter">PORTFOLIO</div>
            </div>

            {/* Content */}
            <div 
              className="relative max-w-6xl w-full max-h-[90vh] p-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.category_type === 'image' ? (
                <img 
                  src={selectedItem.media_url} 
                  alt={selectedItem.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  draggable={false}
                  onContextMenu={handleContextMenu}
                />
              ) : (
                <video 
                  src={selectedItem.media_url} 
                  controls
                  controlsList="nodownload"
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  onContextMenu={handleContextMenu}
                />
              )}
              
              {/* Info Overlay in Lightbox */}
              <div className="absolute bottom-8 left-8 max-w-md bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white pointer-events-none">
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-white/70">{selectedItem.description}</p>
              </div>
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
