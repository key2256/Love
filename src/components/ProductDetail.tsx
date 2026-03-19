import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingCart, FileUp, CheckCircle2, Clock, Truck, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { Product, Quotation, PRODUCTS } from '../types';
import { QuotationCalculator } from './QuotationCalculator';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onQuotationGenerated: (quotation: Quotation) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onQuotationGenerated }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'info'>('calc');

  // Find similar products for comparison
  const similarProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>목록으로 돌아가기</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Images */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-100"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 cursor-pointer hover:border-emerald-500 transition-colors">
                  <img 
                    src={`https://picsum.photos/seed/${product.id}-${i}/400/400`} 
                    alt="sample"
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quotation Calculator */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-black text-zinc-900 mb-4 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed font-serif italic">
                {product.tagline}
              </p>
            </div>

            <div className="flex gap-1 p-1 bg-zinc-100 rounded-2xl mb-8 w-fit">
              <button 
                onClick={() => setActiveTab('calc')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'calc' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                견적 계산기
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                상품 정보
              </button>
            </div>

            {activeTab === 'calc' ? (
              <QuotationCalculator 
                product={product} 
                onGenerateQuotation={onQuotationGenerated} 
              />
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                    <Clock className="w-6 h-6 text-emerald-600 mb-4" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">제작 기간</p>
                    <p className="text-lg font-black text-zinc-900">{product.leadTime}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-4" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">최소 수량</p>
                    <p className="text-lg font-black text-zinc-900">{product.minQuantity}개</p>
                  </div>
                </div>
                <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100">
                  <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    제작 팁
                  </h3>
                  <p className="text-sm text-emerald-800/70 leading-relaxed">
                    {product.name} 제작 시 가장 많이 선택하시는 옵션은 '무광 코팅'입니다. 
                    고급스러운 질감을 원하신다면 무광을, 선명한 색감을 원하신다면 유광을 추천드려요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Section */}
        {similarProducts.length > 0 && (
          <section className="py-24 border-t border-zinc-100">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black mb-4">비슷한 상품 비교</h2>
                <p className="text-zinc-500">용도에 맞는 최적의 상품을 선택해 보세요.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {similarProducts.map(p => (
                <div key={p.id} className="p-8 rounded-[40px] bg-zinc-50 border border-zinc-100 flex gap-8 items-center group cursor-pointer hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <p className="text-sm text-zinc-500 mb-4 line-clamp-1">{p.tagline}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-emerald-600">
                      <span>{p.basePrice.toLocaleString()}원부터</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Sections */}
        <div className="space-y-24">
          {/* Features */}
          <section>
            <h2 className="text-2xl font-black text-zinc-900 mb-12 flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">01</span>
              제품 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.features.map((feature, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-4">{feature}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    완두프린트만의 고품질 제작 공정으로 {feature}의 완성도를 높였습니다.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Guide */}
          <section className="p-12 rounded-[40px] bg-zinc-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-l from-emerald-500 to-transparent" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-12 flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm">02</span>
                파일 작업 가이드
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 font-black">AI</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">권장 파일 형식</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Adobe Illustrator (AI), PDF (고해상도), PSD 형식을 권장합니다.
                        이미지 파일(JPG, PNG)은 300dpi 이상의 해상도가 필요합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 font-black">CMYK</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">색상 모드</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        반드시 CMYK 모드로 작업해 주세요. RGB 모드 작업 시 인쇄 시 색상 차이가 발생할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 font-black">3mm</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">재단 여분</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        사방 3mm의 재단 여분을 포함하여 작업해 주세요. 
                        중요한 텍스트나 로고는 재단선 안쪽 5mm 이내에 배치하는 것이 안전합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 font-black">OUT</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">서체 아웃라인</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        모든 텍스트는 반드시 Create Outlines(윤곽선 만들기) 처리를 해주셔야 폰트 깨짐 현상을 방지할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-black text-zinc-900 mb-12 flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">03</span>
              주문 및 제작 프로세스
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: "01", title: "상품 선택", desc: "옵션 및 수량 선택" },
                { step: "02", title: "파일 업로드", desc: "디자인 파일 제출" },
                { step: "03", title: "데이터 검수", desc: "전문가 파일 확인" },
                { step: "04", title: "제작 진행", desc: "고품질 인쇄 및 가공" },
                { step: "05", title: "배송 시작", desc: "안전한 포장 및 발송" }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 relative group">
                  <span className="text-[40px] font-black text-zinc-200 absolute top-4 right-6 group-hover:text-emerald-100 transition-colors">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-zinc-900 mb-2 relative z-10">{item.title}</h4>
                  <p className="text-xs text-zinc-500 relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Notice & Disclaimer */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-3xl bg-amber-50 border border-amber-100">
              <h3 className="text-lg font-black text-amber-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                제작 시 유의사항 (필독)
              </h3>
              <ul className="space-y-4 text-sm text-amber-800/80 leading-relaxed list-disc pl-5">
                <li>모니터(RGB)와 실제 인쇄물(CMYK)은 색상 차이가 발생할 수 있습니다.</li>
                <li>공정 특성상 사방 1~2mm 내외의 재단 오차가 발생할 수 있습니다.</li>
                <li>합판 인쇄 특성상 동일 데이터라도 재주문 시 색상 차이가 있을 수 있습니다.</li>
                <li>파일 오류로 인한 오탈자 및 디자인 실수는 교환/환불 사유가 되지 않습니다.</li>
              </ul>
            </div>
            <div className="p-10 rounded-3xl bg-zinc-50 border border-zinc-100">
              <h3 className="text-lg font-black text-zinc-900 mb-6 flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-600" />
                배송 및 교환 안내
              </h3>
              <ul className="space-y-4 text-sm text-zinc-500 leading-relaxed list-disc pl-5">
                <li>기본 배송비는 3,000원이며, 5만원 이상 구매 시 무료배송입니다.</li>
                <li>주문 제작 상품 특성상 단순 변심으로 인한 취소/환불은 불가합니다.</li>
                <li>제품 불량의 경우 수령 후 7일 이내 고객센터로 접수해 주세요.</li>
                <li>제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
