import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Briefcase, User, Image as ImageIcon, LogIn } from 'lucide-react';

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
          <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {profile.name || 'Portfolio'}
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-600 items-center">
            <a href="#about" className="hover:text-indigo-600 transition-colors">Về bản thân</a>
            <a href="#experience" className="hover:text-indigo-600 transition-colors">Kinh nghiệm</a>
            <Link to="/portfolio" className="hover:text-indigo-600 transition-colors">Sản phẩm</Link>
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-900">
              <LogIn className="w-4 h-4" /> Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 max-w-6xl mx-auto relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-20"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-40 -left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
        
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
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-sm font-semibold text-indigo-600"
          >
            ✨ Welcome to my universe
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 pb-2 drop-shadow-sm">
              {profile.title || 'Creative Professional'}
            </span>
          </h1>
          <p className="text-2xl text-neutral-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            {profile.about || 'Welcome to my creative portfolio.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1 text-lg group"
            >
              Xem sản phẩm <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-white text-neutral-900 font-bold hover:bg-neutral-50 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </motion.div>
      </section>

      {/* About & Experience Split */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white -z-10"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-100/50 hover:shadow-indigo-200/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900">Về bản thân</h2>
            </div>
            <div className="prose prose-lg prose-neutral">
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap font-medium">
                {profile.about}
              </p>
            </div>
          </motion.div>

          <motion.div 
            id="experience"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-purple-100/50 hover:shadow-purple-200/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-900">Kinh nghiệm</h2>
            </div>
            <div className="prose prose-lg prose-neutral">
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap font-medium">
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
          <Link 
            to="/portfolio"
            className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 text-xl group"
          >
            Khám phá các dự án <ImageIcon className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
