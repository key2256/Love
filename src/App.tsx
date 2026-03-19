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
import { PRODUCTS, CATEGORIES, Product, Quotation, ORDER_STEPS } from './types';
import { FileUp, Send, CheckCircle2, MessageSquare } from 'lucide-react';

type View = 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'quotation_doc' | 'custom_inquiry';

function App() {
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleInquiryFromQuotation = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setView('inquiry');
    window.scrollTo(0, 0);
  };

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        onNavigate={(v) => setView(v as View)} 
        onCategorySelect={handleCategorySelect}
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
            
            <CategorySection 
              onSelectCategory={handleCategorySelect} 
              activeCategory={activeCategory} 
            />

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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">
                      {activeCategory === 'all' ? '전체 상품' : CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </h2>
                    <p className="text-zinc-500 font-medium">
                      {activeCategory === 'all' 
                        ? '완두프린트의 모든 제작 상품을 한눈에 확인하세요.' 
                        : `${CATEGORIES.find(c => c.id === activeCategory)?.description}`}
                    </p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', ...CATEGORIES.map(c => c.id)].map((id) => (
                      <button
                        key={id}
                        onClick={() => setActiveCategory(id)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                          activeCategory === id
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600'
                        }`}
                      >
                        {id === 'all' ? '전체' : CATEGORIES.find(c => c.id === id)?.name}
                      </button>
                    ))}
                  </div>
                </div>

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
                  <button className="px-8 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all">
                    전체 사례 보기
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { title: "브랜드 패키지", cat: "패키지", img: "https://picsum.photos/seed/pkg1/800/1000" },
                    { title: "카페 굿즈 세트", cat: "굿즈", img: "https://picsum.photos/seed/goods1/800/1000" },
                    { title: "전시회 도록", cat: "지류", img: "https://picsum.photos/seed/print1/800/1000" },
                    { title: "캐릭터 스티커", cat: "스티커", img: "https://picsum.photos/seed/stk1/800/1000" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -10 }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-6 bg-zinc-100 border border-zinc-100">
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">{item.cat}</span>
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
              onInquiry={handleInquiryFromQuotation}
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

        {view === 'inquiry' && (
          <motion.div
            key="inquiry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 max-w-2xl mx-auto px-4"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-black">견적 문의</h1>
              {currentQuotation && (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                  견적번호: {currentQuotation.id}
                </div>
              )}
            </div>
            
            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">성함/업체명</label>
                  <input type="text" className="w-full px-4 py-4 rounded-2xl border border-zinc-200 focus:border-emerald-500 outline-none transition-colors bg-zinc-50/50" placeholder="홍길동" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">연락처</label>
                  <input type="text" className="w-full px-4 py-4 rounded-2xl border border-zinc-200 focus:border-emerald-500 outline-none transition-colors bg-zinc-50/50" placeholder="010-0000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">문의 상품</label>
                <select 
                  defaultValue={currentQuotation?.productName || "스티커"}
                  className="w-full px-4 py-4 rounded-2xl border border-zinc-200 focus:border-emerald-500 outline-none transition-colors bg-white"
                >
                  {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
                  <option>기타/커스텀</option>
                </select>
              </div>

              {currentQuotation && (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-4">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">선택된 견적 옵션</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(currentQuotation.options).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-zinc-400">{key}</span>
                        <span className="font-bold text-zinc-900">{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm border-t border-zinc-200 pt-2 col-span-2">
                      <span className="text-zinc-400">수량</span>
                      <span className="font-bold text-emerald-600">{currentQuotation.quantity.toLocaleString()}개</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-700">파일 업로드</label>
                <div className="p-12 border-2 border-dashed border-zinc-200 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <FileUp className="w-8 h-8 text-zinc-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-zinc-900">클릭하거나 파일을 드래그하여 업로드</p>
                    <p className="text-xs text-zinc-400 mt-1">AI, PDF, PSD, 고해상도 JPG (최대 50MB)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-zinc-500 font-medium">파일 추후 전달 예정</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-zinc-500 font-medium">참고 이미지만 첨부</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">추가 요청사항</label>
                <textarea rows={5} className="w-full px-4 py-4 rounded-2xl border border-zinc-200 focus:border-emerald-500 outline-none transition-colors bg-zinc-50/50" placeholder="제작 시 특별히 신경 써야 할 부분이나 궁금한 점을 적어주세요."></textarea>
              </div>

              <button type="button" className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                <span>문의 및 파일 접수하기</span>
              </button>
            </form>
          </motion.div>
        )}

        {view === 'custom_inquiry' && (
          <motion.div
            key="custom_inquiry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 max-w-4xl mx-auto px-4"
          >
            <div className="text-center mb-16">
              <h1 className="text-5xl font-black mb-6 tracking-tight">맞춤 제작 문의</h1>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                규격 외 제작, 대량 주문, 복합 패키지 등 정형화된 상품으로 해결되지 않는 특별한 프로젝트를 위한 상담 창구입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: <CheckCircle2 />, title: "규격 외 제작", desc: "특수 사이즈 및 형태" },
                { icon: <MessageSquare />, title: "대량 주문", desc: "B2B 및 대량 생산 단가" },
                { icon: <FileUp />, title: "복합 프로젝트", desc: "여러 상품 세트 구성" }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-12">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">업체명/성함</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">이메일</label>
                    <input type="email" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">문의 제목</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none transition-all" placeholder="예: 굿즈 패키지 대량 제작 문의" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">상세 내용</label>
                  <textarea rows={8} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none transition-all" placeholder="제작하고자 하는 상품의 종류, 수량, 희망 납기일 등을 상세히 적어주세요."></textarea>
                </div>
                <button className="w-full py-6 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20">
                  맞춤 제작 상담 신청하기
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
