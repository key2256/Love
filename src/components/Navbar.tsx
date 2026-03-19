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
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry' | 'portfolio') => void;
  onCategorySelect: (id: string) => void;
  onSubCategorySelect: (sub: string) => void;
  onLogoClick: () => void;
  activeCategory: string;
  activeSubCategory: string;
  isScrolled: boolean;
}

export const Navbar = ({ 
  onNavigate, 
  onCategorySelect, 
  onSubCategorySelect,
  onLogoClick,
  activeCategory,
  activeSubCategory,
  isScrolled 
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory);
  const displaySubCategories = hoveredCategory 
    ? CATEGORIES.find(c => c.id === hoveredCategory)?.subCategories 
    : currentCategory?.subCategories;

  const activeDisplayCategory = hoveredCategory || activeCategory;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'}`}>
      {/* Main Navbar */}
      <div className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-12">
            <button 
              onClick={onLogoClick}
              className="text-2xl font-black tracking-tighter cursor-pointer text-emerald-600"
            >
              WANDOO<span className="text-zinc-900">PRINT</span>
            </button>
            
            <div className="hidden lg:flex items-center gap-8">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`text-sm font-bold transition-all relative py-2 ${
                    activeCategory === cat.id ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-6 mr-6 border-r border-zinc-100 pr-6">
              <button onClick={() => onNavigate('guide')} className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">파일 가이드</button>
              <button onClick={() => onNavigate('inquiry')} className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">견적 문의</button>
              <button onClick={() => onNavigate('portfolio')} className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">제작 사례</button>
            </div>

            <div className="hidden sm:flex items-center bg-zinc-100 rounded-full px-4 py-1.5">
              <Search size={16} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="검색" 
                className="bg-transparent text-sm outline-none w-24 focus:w-40 transition-all text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            <button className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-zinc-900 text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
            </button>
            <button className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors">
              <User size={20} />
            </button>
            <button 
              className="lg:hidden p-2 text-zinc-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Sub-navigation Bar */}
      <AnimatePresence>
        {(activeCategory !== 'all' || hoveredCategory) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm hidden lg:block"
            onMouseEnter={() => hoveredCategory && setHoveredCategory(hoveredCategory)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mr-4">
                {CATEGORIES.find(c => c.id === activeDisplayCategory)?.name} 옵션
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSubCategorySelect('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeSubCategory === 'all' && activeCategory === activeDisplayCategory
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  전체보기
                </button>
                {displaySubCategories?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      onCategorySelect(activeDisplayCategory);
                      onSubCategorySelect(sub);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeSubCategory === sub && activeCategory === activeDisplayCategory
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                        : 'text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
