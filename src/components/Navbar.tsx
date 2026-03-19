import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../types';

interface NavbarProps {
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry') => void;
  onCategorySelect: (id: string) => void;
  isScrolled: boolean;
}

export const Navbar = ({ onNavigate, onCategorySelect, isScrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => onNavigate('home')}
            className={`text-2xl font-black tracking-tighter cursor-pointer transition-colors ${isScrolled ? 'text-emerald-600' : 'text-white'}`}
          >
            WANDOO<span className={isScrolled ? 'text-zinc-900' : 'text-emerald-400'}>PRINT</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <button className={`text-sm font-bold flex items-center gap-1 transition-colors ${isScrolled ? 'text-zinc-900 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>
                카테고리 <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onCategorySelect(cat.id)}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => onNavigate('guide')} className={`text-sm font-bold transition-colors ${isScrolled ? 'text-zinc-900 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>파일 가이드</button>
            <button onClick={() => onNavigate('inquiry')} className={`text-sm font-bold transition-colors ${isScrolled ? 'text-zinc-900 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>견적 문의</button>
            <button onClick={() => onNavigate('custom_inquiry')} className={`text-sm font-bold transition-colors ${isScrolled ? 'text-zinc-900 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>맞춤 제작</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center rounded-full px-4 py-1.5 transition-colors ${isScrolled ? 'bg-zinc-100' : 'bg-white/10'}`}>
            <Search size={16} className={isScrolled ? 'text-zinc-400 mr-2' : 'text-white/40 mr-2'} />
            <input 
              type="text" 
              placeholder="무엇을 제작할까요?" 
              className={`bg-transparent text-sm outline-none w-32 focus:w-48 transition-all ${isScrolled ? 'text-zinc-900 placeholder:text-zinc-400' : 'text-white placeholder:text-white/30'}`}
            />
          </div>
          <button className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white hover:bg-white/10'}`}>
            <ShoppingCart size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-zinc-900 text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
          </button>
          <button className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white hover:bg-white/10'}`}>
            <User size={20} />
          </button>
          <button 
            className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-zinc-600' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-zinc-100 shadow-xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    className="text-left py-3 px-4 bg-zinc-50 rounded-xl text-sm font-bold text-zinc-900"
                    onClick={() => {
                      onCategorySelect(cat.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-4 pt-6 border-t border-zinc-100">
                <button onClick={() => { onNavigate('guide'); setIsMenuOpen(false); }} className="text-left text-lg font-bold">파일 가이드</button>
                <button onClick={() => { onNavigate('inquiry'); setIsMenuOpen(false); }} className="text-left text-lg font-bold">견적 문의</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
