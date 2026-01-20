import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Quote, Music, Library, ChevronRight, Sparkles, Heart, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

const BentoCard = ({ title, description, icon: Icon, onClick, color, className }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "glass rounded-[2.5rem] p-8 md:p-10 group flex flex-col justify-between cursor-pointer overflow-hidden relative border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/50",
      className
    )}
  >
    {/* Animated Background Glow */}
    <div className={cn("absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700", color)} />

    <div className="relative z-10">
      <div className={cn("p-4 rounded-[1.5rem] w-fit mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", color, "bg-opacity-20 border border-white/10")}>
        <Icon className={cn("w-7 h-7", color.replace('bg-', 'text-'))} />
      </div>
      <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/60 transition-colors">{description}</p>
    </div>

    <div className="relative z-10 flex items-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-all duration-500">
      <span>Management</span>
      <div className="h-[1px] flex-1 bg-white/5 mx-4" />
      <ChevronRight className="w-4 h-4 translate-x-[-10px] group-hover:translate-x-0 transition-transform" />
    </div>
  </motion.div>
);

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-foreground p-6 md:p-12 lg:p-20 overflow-hidden relative flex flex-col justify-center">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24 space-y-4 text-center md:text-left"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin Dashboard</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                Quran Dashboard
              </h1>
              <p className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mt-4">
                The central hub for managing your digital Quran library, recitations, and community insights.
              </p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="glass px-6 py-3 rounded-2xl flex items-center gap-3 text-white/70 hover:text-white hover:border-red-500/30 transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                <span className="font-semibold">Logout</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Improved Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-[280px]">
          {/* Main Module (Large) */}
          <BentoCard
            title="Surahs"
            description="Edit holy chapters, map verse counts, and update revelation details."
            icon={Library}
            onClick={() => navigate('/surahs')}
            color="bg-primary"
            className="md:col-span-2 md:row-span-2"
          />

          {/* Secondary Module (Wide) */}
          <BentoCard
            title="Audios"
            description="Manage recitation uploads and teacher profiles."
            icon={Music}
            onClick={() => navigate('/audios')}
            color="bg-orange-600"
            className="md:col-span-2"
          />

          {/* Complementary Modules (Square) */}
          <BentoCard
            title="Books"
            description="Digital library & resources."
            icon={Book}
            onClick={() => navigate('/books')}
            color="bg-purple-600"
            className="md:col-span-1"
          />

          <BentoCard
            title="Quotes"
            description="Archive of daily wisdom."
            icon={Quote}
            onClick={() => navigate('/quotes')}
            color="bg-blue-600"
            className="md:col-span-1"
          />

          <BentoCard
            title="Duas"
            description="Manage supplications and prayers."
            icon={Heart}
            onClick={() => navigate('/duas')}
            color="bg-red-500"
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
