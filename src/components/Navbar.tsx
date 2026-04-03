import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Lock,
  FileText,
  MessageSquare,
  Briefcase,
  MapPin,
  HelpCircle,
  Grid,
  Bookmark,
  ShoppingBag,
  Home
} from 'lucide-react';
import { getIconForCategory } from '../lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, SubCategoryGroup, PRODUCTS } from '../types';
import { useAuth } from '../hooks/useAuth';

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
  onDraftsClick: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
  onAuthClick: (mode: 'login' | 'signup' | 'reset') => void;
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
  onCartClick,
  onDraftsClick,
  onOrdersClick,
  onProfileClick,
  onAuthClick
}: NavbarProps) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [selectedSubSubGroup, setSelectedSubSubGroup] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverCategory = (id: string | null) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (id) {
      setHoveredCategory(id);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategory(null);
      }, 150);
    }
  };

  // Focus management and body scroll lock
  useEffect(() => {
    const mainContent = document.getElementById('root');
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      mainContent?.setAttribute('aria-hidden', 'true');
      
      // Focus the first element when opened
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        const timer = setTimeout(() => {
          (focusableElements[0] as HTMLElement).focus();
        }, 200); // Slightly longer delay for smoother transition
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = '';
      mainContent?.removeAttribute('aria-hidden');
      // Return focus to menu button when closed
      menuButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
      mainContent?.removeAttribute('aria-hidden');
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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMenuOpen ? 'bg-white' : (isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md')}`}>
        {/* Main Navbar */}
      <div className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4 xl:gap-12">
            <button 
              onClick={onLogoClick}
              className="text-2xl font-black tracking-tighter cursor-pointer text-emerald-600 shrink-0"
            >
              WANDOO<span className="text-zinc-900">PRINT</span>
            </button>
            
            <div className="hidden lg:flex items-center gap-2 xl:gap-8 shrink-0 overflow-x-auto no-scrollbar max-w-[40%] xl:max-w-none">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onMouseEnter={() => handleHoverCategory(cat.id)}
                  onMouseLeave={() => handleHoverCategory(null)}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`text-sm font-bold transition-all relative py-2 whitespace-nowrap shrink-0 ${
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

          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            <div className="hidden xl:flex items-center gap-3 xl:gap-6 mr-2 xl:mr-6 border-r border-zinc-100 pr-2 xl:pr-6 shrink-0">
              <div className="relative group shrink-0">
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
                  className="pl-9 pr-10 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-24 lg:w-28 xl:w-32 focus:w-64"
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
                className={`text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${currentView === 'guide' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                {React.createElement(getIconForCategory('calendar'), { size: 16 })}
                파일 가이드
              </button>
              <button 
                onClick={() => onNavigate('inquiry')} 
                className={`text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${currentView === 'inquiry' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                {React.createElement(getIconForCategory('pricing'), { size: 16 })}
                견적 문의
              </button>
              <button 
                onClick={() => onNavigate('portfolio')} 
                className={`text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${currentView === 'portfolio' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                {React.createElement(getIconForCategory('logo'), { size: 16 })}
                제작 사례
              </button>
              <button 
                onClick={() => onNavigate('faq')} 
                className={`text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${currentView === 'faq' ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                {React.createElement(getIconForCategory('settings'), { size: 16 })}
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
            <button 
              onClick={onDraftsClick}
              className={`hidden md:flex p-2 rounded-full transition-colors relative ${currentView === 'drafts' ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-600 hover:bg-zinc-100'}`}
              title="임시저장 견적"
            >
              <Bookmark size={20} />
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  if (user) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  } else {
                    onAuthClick('login');
                  }
                }}
                className={`p-2 rounded-full transition-colors ${isUserMenuOpen ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-600 hover:bg-zinc-100'}`}
              >
                <User size={20} />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 bg-zinc-50 border-b border-zinc-100">
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">내 계정</p>
                        <p className="text-sm font-black text-zinc-900 truncate">{user.displayName || '사용자'}</p>
                        <p className="text-[10px] font-medium text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            onProfileClick();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-3"
                        >
                          <User size={16} />
                          마이페이지
                        </button>
                        <button
                          onClick={() => {
                            onOrdersClick();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-3"
                        >
                          <ShoppingBag size={16} />
                          주문 내역
                        </button>
                        <button
                          onClick={() => {
                            onDraftsClick();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-3"
                        >
                          <Bookmark size={16} />
                          임시저장 견적
                        </button>
                        <div className="h-[1px] bg-zinc-100 my-1 mx-2" />
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-3"
                        >
                          <X size={16} />
                          로그아웃
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
            onMouseEnter={() => handleHoverCategory(displayCategoryId)}
            onMouseLeave={() => handleHoverCategory(null)}
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
                  const isActuallyActive = (activeSubCategory === groupName || 
                    (typeof sub !== 'string' && sub.items.some(item => 
                      (typeof item === 'string' ? item : item.groupName) === activeSubCategory
                    ))) && activeCategory === displayCategoryId;
                  
                  return (
                    <button
                      key={groupName}
                      onMouseEnter={() => {
                        setSelectedSubGroup(groupName);
                        setSelectedSubSubGroup(null);
                      }}
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
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap relative flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                          : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      {groupName}
                      {typeof sub !== 'string' && sub.isLocked && (
                        <Lock size={10} className={isActive ? 'text-white' : 'text-emerald-500'} />
                      )}
                      {isActuallyActive && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
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
                              onMouseEnter={() => {
                                if (typeof item !== 'string') {
                                  setSelectedSubSubGroup(item.groupName);
                                } else {
                                  setSelectedSubSubGroup(null);
                                }
                              }}
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
    </nav>

    {/* Mobile Menu Backdrop */}
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[60] lg:hidden"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>

    {/* Mobile Menu Drawer */}
    <AnimatePresence mode="wait">
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
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[70] shadow-2xl lg:hidden flex flex-col overflow-hidden"
        >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                  <Menu size={20} />
                </div>
                <div>
                  <h2 id="mobile-menu-title" className="text-lg font-black text-zinc-900 leading-none">전체 메뉴</h2>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Navigation</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                aria-label="메뉴 닫기"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-20">
              {/* Search Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
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
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-zinc-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => onSearchChange('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all"
                      aria-label="검색어 지우기"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {suggestions.map((item: any, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSuggestionClick(item);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-6 py-4 text-sm font-bold hover:bg-zinc-50 transition-colors flex items-center gap-3 border-b border-zinc-50 last:border-0"
                        >
                          <Search size={14} className="text-emerald-500" />
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Quick Access Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
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
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]' 
                        : 'bg-white border-zinc-100 text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <item.icon size={20} className={item.active ? 'text-white' : 'text-emerald-600'} />
                    <span className="text-xs font-black tracking-normal">{item.label}</span>
                  </button>
                ))}
              </motion.div>
              
              {/* Categories Accordion */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider">제작 카테고리</h3>
                  <div className="h-[1px] flex-1 bg-zinc-100 ml-4" />
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className="overflow-hidden">
                      <button 
                        onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                        className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all ${
                          expandedCategory === cat.id 
                            ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' 
                            : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
                        }`}
                        aria-expanded={expandedCategory === cat.id}
                      >
                        <span className="font-black tracking-tight text-base">{cat.name}</span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${expandedCategory === cat.id ? 'bg-white/10 rotate-180' : 'bg-zinc-200/50'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedCategory === cat.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-zinc-50/50 rounded-b-[32px] -mt-4 pt-8 pb-4 px-4 space-y-2"
                          >
                            <button
                              onClick={() => {
                                onCategorySelect(cat.id);
                                onSubCategorySelect('all');
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left p-4 text-sm font-black text-emerald-600 hover:bg-white rounded-2xl transition-all flex items-center justify-between group"
                            >
                              {cat.name} 전체보기
                              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="space-y-1">
                              {cat.subCategories.map((sub, i) => {
                                if (typeof sub === 'string') {
                                  const isActive = activeSubCategory === sub && activeCategory === cat.id;
                                  return (
                                    <button 
                                      key={i}
                                      onClick={() => {
                                        onCategorySelect(cat.id);
                                        onSubCategorySelect(sub);
                                        setIsMenuOpen(false);
                                      }}
                                      className={`w-full text-left p-4 text-sm font-bold rounded-2xl transition-all flex items-center justify-between ${
                                        isActive 
                                          ? 'bg-white text-emerald-600 shadow-sm' 
                                          : 'text-zinc-500 hover:bg-white'
                                      }`}
                                    >
                                      {sub}
                                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div key={i} className="py-4 space-y-3">
                                      <div className="px-4 text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                        {sub.groupName}
                                        {sub.isLocked && <Lock size={10} className="text-emerald-500" />}
                                        <div className="h-[1px] flex-1 bg-zinc-200/50" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        {sub.items.map((item, j) => {
                                          const itemName = typeof item === 'string' ? item : item.groupName;
                                          const isActive = activeSubCategory === itemName && activeCategory === cat.id;
                                          return (
                                            <button 
                                              key={`${i}-${j}`}
                                              onClick={() => {
                                                onCategorySelect(cat.id);
                                                onSubCategorySelect(itemName);
                                                setIsMenuOpen(false);
                                              }}
                                              className={`p-4 rounded-2xl text-xs font-bold text-center transition-all border ${
                                                isActive 
                                                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200' 
                                                  : 'bg-white border-zinc-100 text-zinc-500 hover:border-emerald-200'
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
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Footer Links */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-10 border-t border-zinc-100"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '제작 사례', view: 'portfolio', icon: Briefcase },
                    { label: '오시는 길', view: 'location', icon: MapPin },
                    { label: '자주 묻는 질문', view: 'faq', icon: HelpCircle },
                  ].map((item) => (
                    <button 
                      key={item.view}
                      onClick={() => { onNavigate(item.view as any); setIsMenuOpen(false); }} 
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${
                        currentView === item.view 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' 
                          : 'bg-zinc-50 border-transparent text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <item.icon size={16} className={currentView === item.view ? 'text-emerald-600' : 'text-zinc-400'} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
