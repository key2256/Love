import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { TrustSection } from './components/TrustSection';
import { ProductDetail } from './components/ProductDetail';
import { QuotationDocument } from './components/QuotationDocument';
import { Footer } from './components/Footer';
import { Portfolio } from './components/Portfolio';
import { InquiryForm } from './components/InquiryForm';
import { PRODUCTS, CATEGORIES, Product, Quotation, ORDER_STEPS, PORTFOLIO_ITEMS, SUBCATEGORY_METADATA } from './types';
import { FileUp, Send, CheckCircle2, MessageSquare, ArrowRight, Box, Search } from 'lucide-react';

type View = 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'quotation_doc' | 'custom_inquiry' | 'portfolio';

function App() {
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryQuotation, setInquiryQuotation] = useState<Quotation | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

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
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (id: string) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setView('detail');
      window.scrollTo(0, 0);
    }
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setActiveSubCategory('all');
    setSearchQuery('');
    setView('home');
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveCategory('all');
    setView('home');
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleInquiryFromQuotation = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setView('inquiry');
    window.scrollTo(0, 0);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSubCategory = activeSubCategory === 'all' || p.subCategory === activeSubCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badges?.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        onNavigate={(v) => setView(v as View)} 
        onCategorySelect={handleCategorySelect}
        onSubCategorySelect={setActiveSubCategory}
        onLogoClick={handleLogoClick}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        isScrolled={isScrolled}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onExplore={() => handleCategorySelect('all')} />
            
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

            {/* Quick Find Tags */}
            <section className="py-12 bg-zinc-50 border-b border-zinc-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <span className="text-sm font-black text-zinc-900 whitespace-nowrap">빠른 상품 찾기</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '1개부터 가능', '소량 테스트', '방수 스티커', '아크릴 굿즈', '패키지 제작', '파일업로드 가능', '당일 출고 가능'
                    ].map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                          searchQuery === tag 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-500 hover:text-emerald-600'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
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

            <section id="products" className="py-24 bg-zinc-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mb-12 gap-8">
                  {/* Section Title & Search */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">
                        {activeCategory === 'all' ? '제품 탐색' : CATEGORIES.find(c => c.id === activeCategory)?.name}
                        {activeSubCategory !== 'all' && <span className="text-emerald-500 ml-2">/ {activeSubCategory}</span>}
                      </h2>
                      <p className="text-zinc-500 font-medium">
                        {activeCategory === 'all' 
                          ? '완두프린트의 다양한 제작 상품을 만나보세요.' 
                          : CATEGORIES.find(c => c.id === activeCategory)?.description}
                      </p>
                    </div>
                    <div className="relative w-full md:w-80">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="상품명, 태그 검색..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular/Recommended Section (Moved inside products for better context) */}
                {activeCategory === 'all' && !searchQuery && (
                  <div className="mb-12 p-8 rounded-[32px] bg-white border border-zinc-100 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">처음 주문한다면</span>
                        <div className="flex flex-wrap gap-4">
                          {['방수 스티커', '아크릴 키링', '엽서', '일반 명함'].map(item => (
                            <button 
                              key={item} 
                              onClick={() => handleTagClick(item)}
                              className="text-sm font-bold text-zinc-900 hover:text-emerald-600 transition-colors"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-8">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">추천 테마</span>
                        <div className="flex flex-wrap gap-6">
                          {['소량 제작', '패키지 제작', '굿즈 필수'].map(item => (
                            <button 
                              key={item} 
                              onClick={() => handleTagClick(item)}
                              className="text-sm font-bold text-zinc-50 hover:text-zinc-900 transition-colors"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subcategory Info Section */}
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
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            {CATEGORIES.find(c => c.id === activeCategory)?.name}
                          </span>
                          <div className="h-px w-8 bg-zinc-200" />
                          <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Sub Category</span>
                        </div>
                        <h3 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">{activeSubCategory}</h3>
                        <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl">
                          {SUBCATEGORY_METADATA[activeSubCategory]?.description || filteredProducts[0].description}
                        </p>
                      </div>
                      
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={handleProductClick} 
                    />
                  ))}
                </div>
              </div>
            </section>

            <TrustSection />

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
              onQuotationGenerated={handleQuotationGenerated}
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

        {view === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Portfolio />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <AnimatePresence>
        {showInquiry && (
          <InquiryForm 
            quotation={inquiryQuotation} 
            onClose={() => setShowInquiry(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
