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
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [prevCategory, setPrevCategory] = useState(activeCategory);

  // Immediate state cleanup when category changes to prevent UI overlap/lag
  if (activeCategory !== prevCategory) {
    setPrevCategory(activeCategory);
    setSelectedSubGroup('all');
  }

  // Determine which category to display in the secondary navigation bar
  // Priority: activeCategory (click) > hoveredCategory (hover)
  // If a category is selected by click, hover will not overwrite the sub-navigation display.
  const activeDisplayCategory = activeCategory !== 'all' ? activeCategory : hoveredCategory;
  const currentDisplayCategory = CATEGORIES.find(c => c.id === activeDisplayCategory);

  // Sync selectedSubGroup with activeSubCategory
  useEffect(() => {
    if (activeSubCategory === 'all') {
      setSelectedSubGroup('all');
      return;
    }

    // Only sync if the active category matches what we are displaying
    if (activeCategory === activeDisplayCategory && currentDisplayCategory) {
      const group = currentDisplayCategory.subCategories.find(sub => {
        if (typeof sub === 'string') return sub === activeSubCategory;
        return sub.items.includes(activeSubCategory);
      });
      
      if (group) {
        setSelectedSubGroup(typeof group === 'string' ? group : group.groupName);
      }
    }
  }, [activeCategory, activeSubCategory, activeDisplayCategory, currentDisplayCategory]);

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
      <AnimatePresence mode="wait">
        {activeDisplayCategory && activeDisplayCategory !== 'all' && (
          <motion.div 
            key={activeDisplayCategory}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm hidden lg:block"
            onMouseEnter={() => activeCategory === 'all' && setHoveredCategory(activeDisplayCategory)}
            onMouseLeave={() => activeCategory === 'all' && setHoveredCategory(null)}
          >
            {/* Tier 1: Groups/Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-zinc-50/50">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mr-4 whitespace-nowrap opacity-70">
                {currentDisplayCategory?.name} 분류
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onCategorySelect(activeDisplayCategory);
                    onSubCategorySelect('all');
                    setSelectedSubGroup('all');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSubGroup === 'all'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  전체보기
                </button>
                {currentDisplayCategory?.subCategories.map((sub) => {
                  const groupName = typeof sub === 'string' ? sub : sub.groupName;
                  const isActive = selectedSubGroup === groupName;
                  
                  return (
                    <button
                      key={groupName}
                      onClick={() => {
                        setSelectedSubGroup(groupName);
                        onCategorySelect(activeDisplayCategory);
                        if (typeof sub === 'string') {
                          onSubCategorySelect(sub);
                        } else {
                          // Default to the first item in the group
                          onSubCategorySelect(sub.items[0]);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                          : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      {groupName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier 2: Sub-items */}
            <AnimatePresence mode="wait">
              {selectedSubGroup && selectedSubGroup !== 'all' && (() => {
                const group = currentDisplayCategory?.subCategories.find(sub => 
                  (typeof sub !== 'string' && sub.groupName === selectedSubGroup)
                );
                
                if (!group || typeof group === 'string' || group.items.length <= 1) return null;

                return (
                  <motion.div
                    key={selectedSubGroup}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-50/30 overflow-hidden"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter mr-4 whitespace-nowrap pl-12">
                        상세 선택
                      </span>
                      <div className="flex items-center gap-1">
                        {group.items.map(item => (
                          <button
                            key={item}
                            onClick={() => {
                              onCategorySelect(activeDisplayCategory);
                              onSubCategorySelect(item);
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                              activeSubCategory === item && activeCategory === activeDisplayCategory
                                ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200'
                                : 'text-zinc-500 hover:bg-zinc-100'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
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
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-zinc-100 shadow-xl overflow-y-auto max-h-[80vh]"
          >
            <div className="p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <button 
                      className={`text-lg font-black tracking-tight ${activeCategory === cat.id ? 'text-emerald-600' : 'text-zinc-900'}`}
                      onClick={() => onCategorySelect(cat.id)}
                    >
                      {cat.name}
                    </button>
                    <div className="flex flex-col gap-4">
                      {cat.subCategories.map((sub, i) => {
                        if (typeof sub === 'string') {
                          return (
                            <button 
                              key={i}
                              onClick={() => {
                                onCategorySelect(cat.id);
                                onSubCategorySelect(sub);
                                setIsMenuOpen(false);
                              }}
                              className={`px-3 py-2 rounded-xl text-sm font-bold w-fit ${activeSubCategory === sub && activeCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}
                            >
                              {sub}
                            </button>
                          );
                        } else {
                          const isSingleItem = sub.items.length === 1;
                          if (isSingleItem) {
                            return (
                              <button 
                                key={i}
                                onClick={() => {
                                  onCategorySelect(cat.id);
                                  onSubCategorySelect(sub.items[0]);
                                  setIsMenuOpen(false);
                                }}
                                className={`px-3 py-2 rounded-xl text-sm font-bold w-fit ${sub.items.includes(activeSubCategory) && activeCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}
                              >
                                {sub.groupName}
                              </button>
                            );
                          }
                          return (
                            <div key={i} className="space-y-2">
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">{sub.groupName}</span>
                              <div className="flex flex-wrap gap-2">
                                {sub.items.map((item, j) => (
                                  <button 
                                    key={`${i}-${j}`}
                                    onClick={() => {
                                      onCategorySelect(cat.id);
                                      onSubCategorySelect(item);
                                      setIsMenuOpen(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeSubCategory === item && activeCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
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
