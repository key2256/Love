import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { TrustSection } from './components/TrustSection';
import { ProductDetail } from './components/ProductDetail';
import { QuotationDocument } from './components/QuotationDocument';
import { UsageBasedOrdering } from './components/UsageBasedOrdering';
import { Footer } from './components/Footer';
import { Portfolio } from './components/Portfolio';
import { FAQ } from './components/FAQ';
import { InquiryForm } from './components/InquiryForm';
import { Cart } from './components/Cart';
import { MyDrafts } from './components/MyDrafts';
import MyOrders from './components/MyOrders';
import MyPage from './components/MyPage';
import Checkout from './components/Checkout';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { Draft } from './services/draftService';
import { PRODUCTS, CATEGORIES, Product, Quotation, ORDER_STEPS, PORTFOLIO_ITEMS, SUBCATEGORY_METADATA, SubCategoryGroup, CartItem } from './types';
import { createDefaultCartItem } from './lib/cartUtils';
import { FileUp, Send, CheckCircle2, MessageSquare, ArrowRight, Box, Search, Star, Zap, Calculator, MapPin, Phone, Mail, ChevronLeft, ChevronRight, AlertTriangle, Info } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Toaster } from 'sonner';

const center = { lat: 37.6438, lng: 126.7868 }; // Approximate coordinates for Ilsan-donggu, Goyang-si

const API_KEY = 
  process.env.GOOGLE_MAPS_PLATFORM_KEY || 
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || 
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

type View = 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'quotation_doc' | 'custom_inquiry' | 'portfolio' | 'location' | 'faq' | 'usage_ordering' | 'drafts' | 'orders' | 'profile' | 'checkout';

function App() {
  const { user } = useAuth();
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryQuotation, setInquiryQuotation] = useState<Quotation | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [bypassMapCheck, setBypassMapCheck] = useState(false);
  const [initialDraftOptions, setInitialDraftOptions] = useState<Record<string, string> | undefined>(undefined);
  const [initialDraftQuantity, setInitialDraftQuantity] = useState<number | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'reset'>('login');

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if item with same product and options already exists
      const existingIndex = prev.findIndex(i => 
        i.product.id === item.product.id && 
        JSON.stringify(i.options) === JSON.stringify(item.options)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        const existingItem = newCart[existingIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        newCart[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: existingItem.unitPrice * newQuantity
        };
        return newCart;
      }
      return [...prev, item];
    });
    // Optional: show success feedback
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '' && view !== 'category') {
      setView('category');
      setActiveCategory('all');
      setActiveSubCategory('all');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    setView('home');
    setActiveCategory('all');
    setActiveSubCategory('all');
    setVisibleCount(8);
    setInitialDraftOptions(undefined);
    setInitialDraftQuantity(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (id: string) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setView('detail');
      setInitialDraftOptions(undefined);
      setInitialDraftQuantity(undefined);
      window.scrollTo(0, 0);
    }
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setActiveSubCategory('all');
    setVisibleCount(8);
    setView('category');
    window.scrollTo(0, 0);
  };

  const handleSubCategorySelect = (sub: string) => {
    setActiveSubCategory(sub);
    setVisibleCount(8);
    setView('category');
    window.scrollTo(0, 0);
  };

  const getLeafSubCategories = (categoryOrGroup: string): string[] => {
    const names: string[] = [];
    const findGroup = (items: (string | SubCategoryGroup)[]): SubCategoryGroup | undefined => {
      for (const item of items) {
        if (typeof item !== 'string') {
          if (item.groupName === categoryOrGroup) return item;
          const found = findGroup(item.items);
          if (found) return found;
        }
      }
      return undefined;
    };

    const cat = CATEGORIES.find(c => c.id === categoryOrGroup);
    let items: (string | SubCategoryGroup)[] = [];

    if (cat) {
      items = cat.subCategories;
    } else {
      // Search in all categories for a group with this name
      for (const c of CATEGORIES) {
        const group = findGroup(c.subCategories);
        if (group) {
          items = group.items;
          names.push(group.groupName); // Include the group name itself
          break;
        }
      }
    }

    if (items.length === 0) return [categoryOrGroup];

    const flatten = (list: (string | SubCategoryGroup)[]) => {
      list.forEach(item => {
        if (typeof item === 'string') {
          names.push(item);
        } else {
          flatten(item.items);
        }
      });
    };
    flatten(items);
    return names;
  };

  const handleQuotationGenerated = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setView('quotation_doc');
    window.scrollTo(0, 0);
  };

  const handleInquiry = (quotation?: Quotation) => {
    setInquiryQuotation(quotation);
    setShowInquiry(true);
  };

  const onNavigate = (v: View) => {
    setView(v);
    if (v !== 'detail') {
      setInitialDraftOptions(undefined);
      setInitialDraftQuantity(undefined);
    }
    window.scrollTo(0, 0);
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'reset' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoadDraft = (draft: Draft) => {
    const product = PRODUCTS.find(p => p.id === draft.productId);
    if (product) {
      setSelectedProduct(product);
      setInitialDraftOptions(draft.options);
      setInitialDraftQuantity(draft.quantity);
      setView('detail');
      window.scrollTo(0, 0);
    }
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    
    if (activeSubCategory === 'all' || activeSubCategory === '전체보기') {
      return p.category === activeCategory;
    }
    
    // If activeSubCategory is a group name, match any leaf node under it
    // BUT if the product's subCategory EXACTLY matches the activeSubCategory, it's a direct match.
    // The issue was that if activeSubCategory is a leaf node, we should ONLY match that leaf node.
    
    const findGroup = (items: (string | SubCategoryGroup)[]): SubCategoryGroup | undefined => {
      for (const item of items) {
        if (typeof item !== 'string') {
          if (item.groupName === activeSubCategory) return item;
          const found = findGroup(item.items);
          if (found) return found;
        }
      }
      return undefined;
    };

    const cat = CATEGORIES.find(c => c.id === activeCategory);
    const group = cat ? findGroup(cat.subCategories) : undefined;

    if (group) {
      // It's a group, show all leaf nodes under it AND the group's representative product if it exists
      const leafNodes = getLeafSubCategories(activeSubCategory);
      return p.category === activeCategory && leafNodes.includes(p.subCategory);
    } else {
      // It's a leaf node, show ONLY products that match this subCategory exactly
      return p.category === activeCategory && p.subCategory === activeSubCategory;
    }
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  if (!hasValidKey && !bypassMapCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 font-sans p-6">
        <div className="max-w-2xl w-full bg-white rounded-[48px] p-10 md:p-16 shadow-2xl shadow-zinc-200/50 border border-zinc-100 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 opacity-50" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50/50 rounded-full -ml-20 -mb-20 opacity-50" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-100 animate-in zoom-in duration-500">
              <MapPin className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-6 tracking-tight leading-tight">
              Google Maps API 설정이<br />필요합니다
            </h2>
            
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-12 max-w-md mx-auto font-medium">
              완두프린트의 오시는 길 안내와 지도 기능을 활성화하려면 Google Cloud Platform의 API 키가 필요합니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
              <div className="space-y-6 bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 md:col-span-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">설정 가이드</p>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-md shadow-emerald-200">1</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 mb-1">API 키 발급</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener" className="text-emerald-600 font-bold hover:underline">Google Cloud Console</a>에 접속하여 새 프로젝트를 생성하고 API 키를 발급받으세요.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-md shadow-emerald-200">2</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 mb-1">Secrets 메뉴 접속</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      현재 화면 우측 상단의 <strong>설정(⚙️)</strong> 아이콘을 클릭한 후 <strong>Secrets</strong> 탭을 선택합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-md shadow-emerald-200">3</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 mb-1">환경 변수 등록</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      이름에 <code className="bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-800 font-mono text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code>를 입력하고, 값에 발급받은 API 키를 붙여넣으세요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <p className="text-xs font-bold text-amber-900">주의사항</p>
                </div>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  API 키 생성 시 'Maps JavaScript API'가 활성화되어 있는지 반드시 확인해 주세요.
                </p>
              </div>

              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={16} className="text-emerald-600" />
                  <p className="text-xs font-bold text-emerald-900">도움말</p>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  키를 등록하면 앱이 자동으로 다시 빌드되며, 이후에는 지도 기능이 정상적으로 작동합니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setBypassMapCheck(true)}
                className="w-full py-5 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 group"
              >
                지도 없이 앱 계속하기
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-zinc-400 font-medium">
                나중에 언제든지 설정을 통해 API 키를 추가할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        onNavigate={onNavigate} 
        onCategorySelect={handleCategorySelect}
        onSubCategorySelect={handleSubCategorySelect}
        onLogoClick={handleLogoClick}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        isScrolled={isScrolled}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentView={view}
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
        onDraftsClick={() => onNavigate('drafts')}
        onOrdersClick={() => onNavigate('orders')}
        onProfileClick={() => onNavigate('profile')}
        onAuthClick={openAuthModal}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />

      <Cart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onClear={clearCart}
        onCheckout={() => {
          if (!user) {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
            return;
          }
          setShowCart(false);
          setView('checkout');
        }}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onExplore={() => handleCategorySelect('all')} onNavigate={onNavigate} />
            
            {/* Hero Info Block */}
            <section className="relative z-10 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-[40px] bg-white shadow-2xl shadow-zinc-900/5 border border-zinc-100">
                {[
                  { label: '최소수량', value: '1개부터 제작 가능', icon: CheckCircle2 },
                  { label: '제작품목', value: '스티커 / 지류 / 굿즈', icon: Box },
                  { label: '진행방식', value: '견적 → 파일 → 제작', icon: ArrowRight },
                  { label: '문의방식', value: '1:1 맞춤상담 가능', icon: MessageSquare },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 ${i !== 3 ? 'md:border-r border-zinc-100' : ''} px-4`}>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-bold text-zinc-900">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <CategorySection 
              onSelectCategory={handleCategorySelect} 
              activeCategory={activeCategory} 
            />

            {/* Redesigned Recommendation Section */}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <button 
                    onClick={() => handleCategorySelect('sticker')}
                    className="group relative h-[320px] rounded-[48px] overflow-hidden bg-zinc-900"
                  >
                    <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-700">
                      <img 
                        src="https://picsum.photos/seed/print/1200/800" 
                        alt="Sticker" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 text-left">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 block">Best Seller</span>
                      <h3 className="text-3xl font-black text-white mb-4 tracking-tight">자유형 스티커</h3>
                      <p className="text-zinc-300 text-sm font-medium mb-6 max-w-xs">원하는 모양 그대로, 소량부터 대량까지 완벽하게 제작하세요.</p>
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <span>제작하기</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setView('inquiry')}
                    className="group relative h-[320px] rounded-[48px] overflow-hidden bg-emerald-600"
                  >
                    <div className="absolute inset-0 p-12 flex flex-col justify-center">
                      <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black mb-2">빠른 견적 계산기</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">원하는 사양을 선택하고 실시간 제작 비용을 바로 확인하세요.</p>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <span>계산기 바로가기</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </section>

             {/* Order Process Section */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black mb-4">주문 진행 안내</h2>
                  <p className="text-zinc-500">완두프린트의 쉽고 빠른 주문 프로세스를 확인하세요.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ORDER_STEPS.map((step) => (
                    <div key={step.number} className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 hover:border-emerald-200 transition-colors group">
                      <span className="text-4xl font-black text-zinc-200 group-hover:text-emerald-100 transition-colors block mb-6">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <TrustSection onNavigate={onNavigate} />

            {/* Portfolio Section */}
            <section className="py-24 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">제작 사례</h2>
                    <p className="text-zinc-500">완두프린트와 함께한 다양한 프로젝트를 확인하세요.</p>
                  </div>
                  <button 
                    onClick={() => setView('portfolio')}
                    className="px-8 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
                  >
                    전체 사례 보기
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {PORTFOLIO_ITEMS.slice(0, 4).map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -10 }}
                      onClick={() => setView('portfolio')}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-6 bg-zinc-100 border border-zinc-100">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">
                        {CATEGORIES.find(c => c.id === item.category)?.name}
                      </span>
                      <h3 className="font-bold text-zinc-900">{item.title}</h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {view === 'category' && (
          <motion.main
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 md:pt-32"
          >
            <section id="products" className="py-24 bg-zinc-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mb-12 gap-8">
                  {/* Section Title */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <button 
                          onClick={() => setView('home')}
                          className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                        >
                          HOME
                        </button>
                        <div className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          {activeCategory === 'all' ? 'ALL PRODUCTS' : CATEGORIES.find(c => c.id === activeCategory)?.name}
                        </span>
                        {activeSubCategory !== 'all' && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-zinc-300" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                              {activeSubCategory}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-5xl font-black text-zinc-900 mb-4 tracking-tight">
                        {activeSubCategory !== 'all' ? activeSubCategory : (activeCategory === 'all' ? '제품 탐색' : CATEGORIES.find(c => c.id === activeCategory)?.name)}
                      </h2>
                      <p className="text-zinc-500 font-medium text-lg max-w-2xl">
                        {activeSubCategory !== 'all' 
                          ? SUBCATEGORY_METADATA[activeSubCategory]?.description || (filteredProducts.length > 0 ? filteredProducts[0].description : '')
                          : (activeCategory === 'all' 
                              ? '완두프린트의 다양한 제작 상품을 만나보세요.' 
                              : CATEGORIES.find(c => c.id === activeCategory)?.description)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subcategory Info Section - Redesigned for better hierarchy */}
                {activeSubCategory !== 'all' && filteredProducts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 p-8 md:p-12 rounded-[48px] bg-white border border-zinc-100 shadow-xl shadow-zinc-900/5 flex flex-col md:flex-row gap-12 items-center"
                  >
                    <div className="w-full md:w-1/3 aspect-square rounded-[40px] overflow-hidden bg-zinc-100 shadow-inner">
                      <img 
                        src={filteredProducts[0].image} 
                        alt={activeSubCategory}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            대표 제작 재질
                            <span className="text-zinc-400 font-normal lowercase">(이외 다양한 재질 선택 가능)</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {filteredProducts[0].options.find(o => o.name.includes('재질'))?.values.slice(0, 5).map(v => (
                              <span key={v.label} className="px-4 py-2 bg-zinc-50 rounded-xl text-xs font-bold text-zinc-600 border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-default">{v.label}</span>
                            )) || <span className="text-xs font-bold text-zinc-400">상세 페이지에서 확인 가능합니다.</span>}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            가공 및 특징
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {filteredProducts[0].features.map(f => (
                              <span key={f} className="px-4 py-2 bg-emerald-50/50 rounded-xl text-xs font-bold text-emerald-700 border border-emerald-100/50">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 flex flex-wrap gap-4">
                        <button 
                          onClick={() => handleProductClick(filteredProducts[0].id)}
                          className="px-10 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 group"
                        >
                          상세 견적 보기
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleInquiry()}
                          className="px-10 py-4 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100"
                        >
                          1:1 제작 문의
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {displayedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayedProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={handleProductClick} 
                        onAddToCart={(p) => addToCart(createDefaultCartItem(p))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center bg-white rounded-[48px] border border-zinc-100 shadow-sm">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">검색 결과가 없습니다</h3>
                    <p className="text-zinc-500 mb-8">다른 검색어를 입력하거나 카테고리를 선택해 보세요.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                        setActiveSubCategory('all');
                      }}
                      className="px-8 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all"
                    >
                      전체 상품 보기
                    </button>
                  </div>
                )}

                {hasMore && (
                  <div className="mt-16 flex justify-center">
                    <button 
                      onClick={handleLoadMore}
                      className="px-12 py-5 rounded-2xl bg-white border-2 border-zinc-900 text-zinc-900 font-black hover:bg-zinc-900 hover:text-white transition-all shadow-xl shadow-zinc-200/50 active:scale-[0.98]"
                    >
                      더 많은 상품 보기
                    </button>
                  </div>
                )}
              </div>
            </section>
          </motion.main>
        )}

        {view === 'detail' && selectedProduct && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setView('home')} 
              onProductClick={handleProductClick}
              onQuotationGenerated={handleQuotationGenerated}
              onAddToCart={addToCart}
              onAuthClick={openAuthModal}
              initialOptions={initialDraftOptions}
              initialQuantity={initialDraftQuantity}
            />
          </motion.div>
        )}

        {view === 'drafts' && (
          <motion.div
            key="drafts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MyDrafts 
              onBack={() => setView('home')}
              onLoadDraft={handleLoadDraft}
              onAuthClick={openAuthModal}
            />
          </motion.div>
        )}

        {view === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MyOrders />
          </motion.div>
        )}

        {view === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MyPage 
              onNavigate={(v) => {
                if (v === 'home') setView('home');
                else setView(v);
              }}
            />
          </motion.div>
        )}

        {view === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Checkout 
              items={cart} 
              onBack={() => setView('home')} 
              onSuccess={() => {
                clearCart();
                setView('home');
              }} 
            />
          </motion.div>
        )}

        {view === 'quotation_doc' && currentQuotation && (
          <motion.div
            key="quotation_doc"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <QuotationDocument 
              quotation={currentQuotation}
              onBack={() => setView('detail')}
              onInquiry={handleInquiry}
            />
          </motion.div>
        )}

        {view === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 max-w-4xl mx-auto px-4"
          >
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-8"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
            </button>
            <h1 className="text-4xl font-black mb-8">파일 가이드</h1>
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  작업 사이즈 및 재단선
                </h2>
                <p className="text-zinc-600 leading-relaxed">
                  모든 작업물은 실제 사이즈보다 사방 2mm씩 크게 작업해 주세요. (예: 50x50mm 스티커 {"->"} 54x54mm 작업)
                  재단 시 1~2mm 정도의 오차가 발생할 수 있으므로 중요한 정보는 재단선 안쪽으로 3mm 이상 여유를 두고 배치해 주세요.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  색상 모드 (CMYK)
                </h2>
                <p className="text-zinc-600 leading-relaxed">
                  인쇄물은 반드시 CMYK 모드로 작업해 주세요. RGB 모드로 작업된 파일은 인쇄 시 색상이 탁해질 수 있습니다.
                  특히 검정색(K100) 표현 시 C, M, Y 값이 너무 높으면 뒷묻음이 발생할 수 있으니 주의해 주세요.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  폰트 아웃라인 처리
                </h2>
                <p className="text-zinc-600 leading-relaxed">
                  일러스트레이터(AI) 작업 시 모든 폰트는 반드시 Create Outlines(윤곽선 만들기) 처리를 해주셔야 폰트 유실 없이 인쇄됩니다.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {view === 'usage_ordering' && (
          <motion.div
            key="usage_ordering"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UsageBasedOrdering 
              onBack={() => setView('home')} 
              onProductClick={handleProductClick}
              allProducts={PRODUCTS}
            />
          </motion.div>
        )}

        {view === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Portfolio onBack={() => setView('home')} />
          </motion.div>
        )}

        {view === 'inquiry' && (
          <motion.div
            key="inquiry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24"
          >
            <div className="max-w-3xl mx-auto px-4">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-8"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
              </button>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black mb-4 tracking-tight">견적 문의</h1>
                <p className="text-zinc-500">원하시는 제작 사양을 남겨주시면 전문가가 확인 후 연락드립니다.</p>
              </div>
              <div className="bg-white rounded-[40px] border border-zinc-100 p-8 md:p-12 shadow-xl shadow-zinc-100/50">
                <InquiryForm isInline onClose={() => setView('home')} />
              </div>
            </div>
          </motion.div>
        )}

        {view === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24"
          >
            <div className="max-w-7xl mx-auto px-4">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-8"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
              </button>
              <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-6 tracking-tight">오시는 길</h1>
                <p className="text-lg text-zinc-500">완두프린트 오프라인 매장 및 작업실 위치를 안내해 드립니다.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="bg-zinc-50 rounded-[40px] p-10 border border-zinc-100">
                    <h2 className="text-2xl font-bold mb-8">연락처 및 주소</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-400 mb-1 uppercase tracking-wider">Address</p>
                          <p className="text-lg font-bold text-zinc-900">서울특별시 중구 을지로 123 완두빌딩 4층</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-400 mb-1 uppercase tracking-wider">Phone</p>
                          <p className="text-lg font-bold text-zinc-900">02-1234-5678</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-400 mb-1 uppercase tracking-wider">Email</p>
                          <p className="text-lg font-bold text-zinc-900">contact@wandooprint.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-2xl shadow-emerald-600/20">
                    <h2 className="text-2xl font-bold mb-4">운영 시간</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="font-medium opacity-80">평일 (Mon - Fri)</span>
                        <span className="font-bold">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="font-medium opacity-80">점심 시간 (Lunch)</span>
                        <span className="font-bold">12:00 - 13:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 opacity-60">
                        <span className="font-medium">주말 및 공휴일</span>
                        <span className="font-bold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="aspect-square lg:aspect-auto lg:h-full min-h-[500px] rounded-[40px] overflow-hidden border border-zinc-100 shadow-xl relative bg-zinc-100">
                  {hasValidKey ? (
                    <Map
                      defaultCenter={center}
                      defaultZoom={17}
                      mapId="DEMO_MAP_ID"
                      className="w-full h-full"
                    >
                      <AdvancedMarker position={center}>
                        <Pin background={'#10b981'} glyphColor={'#fff'} borderColor={'#059669'} />
                      </AdvancedMarker>
                    </Map>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400 mb-6">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">지도를 불러올 수 없습니다</h3>
                      <p className="text-zinc-500 max-w-sm">
                        Google Maps API 키가 설정되지 않았거나 유효하지 않습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {view === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="max-w-7xl mx-auto px-4 pt-32">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-8"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
              </button>
            </div>
            <FAQ />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer onNavigate={onNavigate} onLogoClick={handleLogoClick} />

      <AnimatePresence>
        {showInquiry && (
          <InquiryForm 
            quotation={inquiryQuotation} 
            onClose={() => setShowInquiry(false)} 
          />
        )}
      </AnimatePresence>
    </div>
    </APIProvider>
  );
}

export default App;
