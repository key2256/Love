import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  FileText,
  MessageSquare,
  Briefcase,
  MapPin,
  HelpCircle,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, SubCategoryGroup, PRODUCTS } from '../types';

interface NavbarProps {
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry' | 'portfolio' | 'location' | 'faq') => void;
  onCategorySelect: (id: string) => void;
  onSubCategorySelect: (sub: string) => void;
  onLogoClick: () => void;
  activeCategory: string;
  activeSubCategory: string;
  isScrolled: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: string;
  cartCount: number;
  onCartClick: () => void;
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
  currentView,
  cartCount,
  onCartClick
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [selectedSubSubGroup, setSelectedSubSubGroup] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus management and body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      
      // Focus the drawer or first element when opened
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        // Small delay to ensure animation has started/element is visible
        const timer = setTimeout(() => {
          (focusableElements[0] as HTMLElement).focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = '';
      // Return focus to menu button when closed
      menuButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Focus trap logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isMenuOpen || !drawerRef.current) return;

    if (e.key === 'Escape') {
      setIsMenuOpen(false);
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const productSuggestions = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).slice(0, 5);
    const categorySuggestions = CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(query)
    ).slice(0, 3);
    return [...productSuggestions, ...categorySuggestions];
  }, [searchQuery]);

  const handleSuggestionClick = (item: any) => {
    onSearchChange('');
    setShowSuggestions(false);
    if (item.category && item.id) { // It's a product
      onNavigate('detail');
      // Assuming there's a mechanism to set the active product, 
      // but for now, just navigating to detail might be enough or 
      // I might need to trigger product selection.
      // Looking at the App.tsx might reveal how product selection works.
    } else { // It's a category
      onCategorySelect(item.id);
      onNavigate('category');
    }
  };

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
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-9 pr-10 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-40 focus:w-64"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    {suggestions.map((item: any, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(item)}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-50 transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
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
              <button 
                onClick={() => onNavigate('faq')} 
                className={`text-xs font-bold transition-colors ${currentView === 'faq' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                자주 묻는 질문
              </button>
            </div>

            <button 
              onClick={onCartClick}
              className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-zinc-900 text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors">
              <User size={20} />
            </button>
            <button 
              ref={menuButtonRef}
              className="lg:hidden p-2 text-zinc-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
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

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            ref={drawerRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            onKeyDown={handleKeyDown}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[70] shadow-2xl lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 id="mobile-menu-title" className="text-xl font-black text-zinc-900">메뉴</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all"
                aria-label="메뉴 닫기"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10">
              {/* Search Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="어떤 제품을 찾으시나요?" 
                    value={searchQuery}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-[20px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-zinc-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => onSearchChange('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {suggestions.map((item: any, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSuggestionClick(item);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-6 py-4 text-sm font-bold hover:bg-zinc-50 transition-colors flex items-center gap-3"
                        >
                          <Search size={14} className="text-zinc-300" />
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Access Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '카테고리', icon: Grid, action: () => setExpandedCategory(expandedCategory === 'all' ? null : 'all'), active: expandedCategory === 'all' },
                  { label: '파일가이드', icon: FileText, action: () => { onNavigate('guide'); setIsMenuOpen(false); } },
                  { label: '견적문의', icon: MessageSquare, action: () => { onNavigate('inquiry'); setIsMenuOpen(false); } },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                      item.active 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'bg-white border-zinc-100 text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <item.icon size={20} className={item.active ? 'text-white' : 'text-emerald-600'} />
                    <span className="text-[11px] font-black tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Categories Accordion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">제작 카테고리</h3>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="overflow-hidden">
                      <button 
                        onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          expandedCategory === cat.id 
                            ? 'bg-zinc-900 text-white' 
                            : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="font-black tracking-tight">{cat.name}</span>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform duration-300 ${expandedCategory === cat.id ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedCategory === cat.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-zinc-50/50 rounded-b-2xl -mt-2 pt-4 pb-2 px-4 space-y-1"
                          >
                            <button
                              onClick={() => {
                                onCategorySelect(cat.id);
                                onSubCategorySelect('all');
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left p-3 text-sm font-bold text-emerald-600 hover:bg-white rounded-xl transition-all"
                            >
                              {cat.name} 전체보기
                            </button>
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
                                    className={`w-full text-left p-3 text-sm font-bold rounded-xl transition-all ${
                                      activeSubCategory === sub && activeCategory === cat.id 
                                        ? 'bg-white text-emerald-600 shadow-sm' 
                                        : 'text-zinc-500 hover:bg-white'
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                );
                              } else {
                                return (
                                  <div key={i} className="py-2 space-y-2">
                                    <div className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                      {sub.groupName}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
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
                                            className={`p-3 rounded-xl text-xs font-bold text-center transition-all ${
                                              activeSubCategory === itemName && activeCategory === cat.id 
                                                ? 'bg-zinc-900 text-white shadow-md' 
                                                : 'bg-white text-zinc-500 border border-zinc-100 hover:border-emerald-200'
                                            }`}
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer Links */}
              <div className="pt-8 border-t border-zinc-100">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: '제작 사례', view: 'portfolio', icon: Briefcase },
                    { label: '오시는 길', view: 'location', icon: MapPin },
                    { label: '자주 묻는 질문', view: 'faq', icon: HelpCircle },
                  ].map((item) => (
                    <button 
                      key={item.view}
                      onClick={() => { onNavigate(item.view as any); setIsMenuOpen(false); }} 
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                        currentView === item.view 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="text-sm font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
