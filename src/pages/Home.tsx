import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Briefcase, User, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">
            {profile.name || 'Portfolio'}
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-600">
            <a href="#about" className="hover:text-black transition-colors">Về bản thân</a>
            <a href="#experience" className="hover:text-black transition-colors">Kinh nghiệm</a>
            <Link to="/portfolio" className="hover:text-black transition-colors">Sản phẩm</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {profile.title || 'Creative Professional'}
          </h1>
          <p className="text-xl text-neutral-600 mb-10 leading-relaxed">
            {profile.about || 'Welcome to my creative portfolio.'}
          </p>
          <div className="flex gap-4">
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
            >
              Xem sản phẩm <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About & Experience Split */}
      <section className="py-20 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div id="about">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-semibold">Về bản thân</h2>
            </div>
            <div className="prose prose-neutral">
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {profile.about}
              </p>
            </div>
          </div>

          <div id="experience">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-semibold">Kinh nghiệm</h2>
            </div>
            <div className="prose prose-neutral">
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {profile.experience}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 bg-black text-white text-center">
        <h2 className="text-4xl font-bold mb-8">Sẵn sàng hợp tác?</h2>
        <Link 
          to="/portfolio"
          className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-white text-black font-medium hover:bg-neutral-100 transition-colors text-lg"
        >
          Khám phá các dự án <ImageIcon className="ml-2 w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
