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
import { CATEGORIES, SubCategoryGroup } from '../types';

interface NavbarProps {
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry' | 'portfolio' | 'location') => void;
  onCategorySelect: (id: string) => void;
  onSubCategorySelect: (sub: string) => void;
  onLogoClick: () => void;
  activeCategory: string;
  activeSubCategory: string;
  isScrolled: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: string;
}

export const Navbar = ({ 
  onNavigate, 
  onCategorySelect, 
  onSubCategorySelect,
  onLogoClick,
  activeCategory,
  activeSubCategory,
  isScrolled,
  searchQuery,
  onSearchChange,
  currentView
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [selectedSubSubGroup, setSelectedSubSubGroup] = useState<string | null>(null);

  // The category we are actually showing in the sub-nav
  const displayCategoryId = hoveredCategory || (activeCategory !== 'all' ? activeCategory : null);
  const displayCategory = CATEGORIES.find(c => c.id === displayCategoryId);

  // Sync selectedSubGroup and selectedSubSubGroup when the ACTIVE category/subcategory changes
  // But don't let it interfere with the HOVER state
  useEffect(() => {
    if (activeCategory === 'all') {
      // If no category is active, and we aren't hovering, clear the subgroups
      if (!hoveredCategory) {
        setSelectedSubGroup(null);
        setSelectedSubSubGroup(null);
      }
      return;
    }

    // Only sync if we are NOT hovering (or if we are hovering over the active category)
    if (!hoveredCategory || hoveredCategory === activeCategory) {
      const activeCatData = CATEGORIES.find(c => c.id === activeCategory);
      if (activeCatData) {
        if (activeSubCategory === 'all') {
          setSelectedSubGroup('all');
          setSelectedSubSubGroup(null);
        } else {
          // Find which group (and sub-group) the activeSubCategory belongs to
          let foundSubGroup: string | null = null;
          let foundSubSubGroup: string | null = null;

          const search = (items: (string | SubCategoryGroup)[], parentGroupName: string | null) => {
            for (const item of items) {
              if (typeof item === 'string') {
                if (item === activeSubCategory) {
                  if (parentGroupName) {
                    // Check if this parent is a top-level sub-category or nested
                    const isTopLevel = activeCatData.subCategories.some(s => typeof s !== 'string' && s.groupName === parentGroupName);
                    if (isTopLevel) {
                      foundSubGroup = parentGroupName;
                    } else {
                      // It's a nested group, find its parent
                      const findParent = (list: (string | SubCategoryGroup)[]): string | null => {
                        for (const s of list) {
                          if (typeof s !== 'string') {
                            if (s.items.some(i => typeof i !== 'string' && i.groupName === parentGroupName)) return s.groupName;
                            const p = findParent(s.items);
                            if (p) return p;
                          }
                        }
                        return null;
                      };
                      foundSubSubGroup = parentGroupName;
                      foundSubGroup = findParent(activeCatData.subCategories);
                    }
                  } else {
                    foundSubGroup = item;
                  }
                  return true;
                }
              } else {
                if (item.groupName === activeSubCategory) {
                  // If the active sub-category IS a group name
                  const isTopLevel = activeCatData.subCategories.some(s => typeof s !== 'string' && s.groupName === item.groupName);
                  if (isTopLevel) {
                    foundSubGroup = item.groupName;
                  } else {
                    foundSubSubGroup = item.groupName;
                    const findParent = (list: (string | SubCategoryGroup)[]): string | null => {
                      for (const s of list) {
                        if (typeof s !== 'string') {
                          if (s.items.some(i => typeof i !== 'string' && i.groupName === item.groupName)) return s.groupName;
                          const p = findParent(s.items);
                          if (p) return p;
                        }
                      }
                      return null;
                    };
                    foundSubGroup = findParent(activeCatData.subCategories);
                  }
                  return true;
                }
                if (search(item.items, item.groupName)) return true;
              }
            }
            return false;
          };

          search(activeCatData.subCategories, null);
          if (foundSubGroup) setSelectedSubGroup(foundSubGroup);
          if (foundSubSubGroup) setSelectedSubSubGroup(foundSubSubGroup);
        }
      }
    }
  }, [activeCategory, activeSubCategory, hoveredCategory]);

  // When hovering starts, if the hovered category has subcategories, default to 'all'
  useEffect(() => {
    if (hoveredCategory && hoveredCategory !== activeCategory) {
      setSelectedSubGroup('all');
      setSelectedSubSubGroup(null);
    }
  }, [hoveredCategory, activeCategory]);

  const handleCategoryClick = (id: string) => {
    onCategorySelect(id);
    setHoveredCategory(null);
    setSelectedSubGroup('all');
    setSelectedSubSubGroup(null);
  };

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
              <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="제품 검색..." 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 pr-10 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-40 focus:w-64"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button 
                onClick={() => onNavigate('guide')} 
                className={`text-xs font-bold transition-colors ${currentView === 'guide' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                파일 가이드
              </button>
              <button 
                onClick={() => onNavigate('inquiry')} 
                className={`text-xs font-bold transition-colors ${currentView === 'inquiry' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                견적 문의
              </button>
              <button 
                onClick={() => onNavigate('portfolio')} 
                className={`text-xs font-bold transition-colors ${currentView === 'portfolio' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                제작 사례
              </button>
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
        {displayCategoryId && displayCategoryId !== 'all' && (
          <motion.div 
            key={displayCategoryId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm hidden lg:block"
            onMouseEnter={() => setHoveredCategory(displayCategoryId)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Tier 1: Groups/Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-zinc-50/50">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mr-4 whitespace-nowrap opacity-70">
                {displayCategory?.name} 분류
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onCategorySelect(displayCategoryId);
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
                {displayCategory?.subCategories.map((sub) => {
                  const groupName = typeof sub === 'string' ? sub : sub.groupName;
                  const isActive = selectedSubGroup === groupName;
                  
                  return (
                    <button
                      key={groupName}
                      onClick={() => {
                        setSelectedSubGroup(groupName);
                        setSelectedSubSubGroup(null);
                        onCategorySelect(displayCategoryId);
                        if (typeof sub === 'string') {
                          onSubCategorySelect(sub);
                        } else {
                          onSubCategorySelect(sub.groupName);
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
                const group = displayCategory?.subCategories.find(sub => 
                  (typeof sub !== 'string' && sub.groupName === selectedSubGroup)
                );
                
                if (!group || typeof group === 'string' || group.items.length === 0) return null;

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
                        {group.items.map((item, idx) => {
                          const itemName = typeof item === 'string' ? item : item.groupName;
                          const isActive = activeSubCategory === itemName && activeCategory === displayCategoryId;
                          
                          return (
                            <button
                              key={itemName || idx}
                              onClick={() => {
                                if (typeof item !== 'string') {
                                  setSelectedSubSubGroup(item.groupName);
                                } else {
                                  setSelectedSubSubGroup(null);
                                }
                                onCategorySelect(displayCategoryId);
                                if (typeof item === 'string') {
                                  onSubCategorySelect(item);
                                } else {
                                  onSubCategorySelect(item.groupName);
                                }
                              }}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                isActive
                                  ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200'
                                  : 'text-zinc-500 hover:bg-zinc-100'
                              }`}
                            >
                              {itemName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Tier 3: Sub-sub-items */}
            <AnimatePresence mode="wait">
              {selectedSubSubGroup && (() => {
                const parentGroup = displayCategory?.subCategories.find(sub => 
                  (typeof sub !== 'string' && sub.groupName === selectedSubGroup)
                ) as SubCategoryGroup | undefined;
                
                const group = parentGroup?.items.find(sub => 
                  (typeof sub !== 'string' && sub.groupName === selectedSubSubGroup)
                ) as SubCategoryGroup | undefined;
                
                if (!group || group.items.length === 0) return null;

                return (
                  <motion.div
                    key={selectedSubSubGroup}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-100/30 overflow-hidden"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter mr-4 whitespace-nowrap pl-16">
                        세부 선택
                      </span>
                      <div className="flex items-center gap-1">
                        {group.items.map((item, idx) => {
                          const itemName = typeof item === 'string' ? item : item.groupName;
                          const isActive = activeSubCategory === itemName && activeCategory === displayCategoryId;
                          
                          return (
                            <button
                              key={itemName || idx}
                              onClick={() => {
                                onCategorySelect(displayCategoryId);
                                if (typeof item === 'string') {
                                  onSubCategorySelect(item);
                                } else {
                                  onSubCategorySelect(item.groupName);
                                }
                              }}
                              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                                isActive
                                  ? 'bg-zinc-800 text-white shadow-md shadow-zinc-200'
                                  : 'text-zinc-500 hover:bg-zinc-100'
                              }`}
                            >
                              {itemName}
                            </button>
                          );
                        })}
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
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder="제품 검색..." 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
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
                          return (
                            <div key={i} className="space-y-3 pl-4 border-l-2 border-zinc-100">
                              <button 
                                onClick={() => {
                                  onCategorySelect(cat.id);
                                  onSubCategorySelect(sub.groupName);
                                  setIsMenuOpen(false);
                                }}
                                className={`text-sm font-black text-left ${activeSubCategory === sub.groupName && activeCategory === cat.id ? 'text-emerald-600' : 'text-zinc-900'}`}
                              >
                                {sub.groupName}
                              </button>
                              <div className="flex flex-wrap gap-2">
                                {sub.items.map((item, j) => {
                                  const itemName = typeof item === 'string' ? item : item.groupName;
                                  return (
                                    <button 
                                      key={`${i}-${j}`}
                                      onClick={() => {
                                        onCategorySelect(cat.id);
                                        onSubCategorySelect(itemName);
                                        setIsMenuOpen(false);
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeSubCategory === itemName && activeCategory === cat.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}
                                    >
                                      {itemName}
                                    </button>
                                  );
                                })}
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
                <button 
                  onClick={() => { onNavigate('guide'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-black tracking-tight ${currentView === 'guide' ? 'text-emerald-600' : 'text-zinc-900'}`}
                >
                  파일 가이드
                </button>
                <button 
                  onClick={() => { onNavigate('inquiry'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-black tracking-tight ${currentView === 'inquiry' ? 'text-emerald-600' : 'text-zinc-900'}`}
                >
                  견적 문의
                </button>
                <button 
                  onClick={() => { onNavigate('portfolio'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-black tracking-tight ${currentView === 'portfolio' ? 'text-emerald-600' : 'text-zinc-900'}`}
                >
                  제작 사례
                </button>
                <button 
                  onClick={() => { onNavigate('location'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-black tracking-tight ${currentView === 'location' ? 'text-emerald-600' : 'text-zinc-900'}`}
                >
                  오시는 길
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
