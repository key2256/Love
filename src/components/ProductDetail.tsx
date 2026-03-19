import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ShoppingCart, 
  FileUp, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  Info,
  Droplets,
  Scissors,
  Layers,
  Sparkles
} from 'lucide-react';
import { Product, Quotation, PRODUCTS, CATEGORIES, PAPER_MATERIALS, PaperMaterial } from '../types';
import { QuotationCalculator } from './QuotationCalculator';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onQuotationGenerated: (quotation: Quotation) => void;
}

const PaperCard: React.FC<{ paper: PaperMaterial }> = ({ paper }) => (
  <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
    <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
      <img 
        src={paper.image} 
        alt={paper.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="p-6">
      <h4 className="text-lg font-black text-zinc-900 mb-2">{paper.name}</h4>
      <p className="text-xs text-zinc-500 font-medium mb-4">{paper.texture}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          { label: '방수', value: paper.waterproof },
          { label: '찢김방지', value: paper.tearResistant },
          { label: '투명', value: paper.transparent },
          { label: '코팅가능', value: paper.coatingAvailable },
        ].map((attr) => (
          <div key={attr.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <div className={`w-1.5 h-1.5 rounded-full ${attr.value ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
            <span className="text-[10px] font-bold text-zinc-600">{attr.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">추천 용도</span>
          <p className="text-xs text-zinc-600 leading-relaxed">{paper.recommendedUse}</p>
        </div>
        {paper.whiteInkRecommended && (
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles size={12} />
            <span className="text-[10px] font-bold">화이트 인쇄 추천</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onQuotationGenerated }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'info'>('calc');

  // Find similar products for comparison
  const similarProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const isSticker = product.category === 'sticker';

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
              className="aspect-square rounded-[40px] overflow-hidden bg-zinc-100 border border-zinc-100 shadow-2xl shadow-zinc-200/50"
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
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 cursor-pointer hover:border-emerald-500 transition-colors">
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
              <div className="flex items-center gap-2 mb-4">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  {CATEGORIES.find(c => c.id === product.category)?.name}
                </span>
                <span className="px-4 py-1.5 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-zinc-200">
                  {product.subCategory}
                </span>
                {product.isNew && (
                  <span className="px-4 py-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-black text-zinc-900 mb-6 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed font-serif italic">
                {product.tagline}
              </p>
            </div>

            <div className="flex gap-1 p-1.5 bg-zinc-100 rounded-[20px] mb-10 w-fit">
              <button 
                onClick={() => setActiveTab('calc')}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'calc' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                주문 및 견적
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                상세 정보
              </button>
            </div>

            {activeTab === 'calc' ? (
              <div className="space-y-8">
                <QuotationCalculator 
                  product={product} 
                  onGenerateQuotation={onQuotationGenerated} 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                    <Clock className="w-5 h-5 text-emerald-600 mb-3" />
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">제작 기간</p>
                    <p className="text-base font-bold text-zinc-900">{product.leadTime}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                    <Truck className="w-5 h-5 text-emerald-600 mb-3" />
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">배송 안내</p>
                    <p className="text-base font-bold text-zinc-900">3,000원 (5만원↑ 무료)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100">
                  <h3 className="font-black text-emerald-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <Sparkles className="w-5 h-5" />
                    Expert Recommendation
                  </h3>
                  <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">
                    {product.recommendation || `${product.name} 제작 시 가장 많이 선택하시는 옵션은 '무광 코팅'입니다. 고급스러운 질감을 원하신다면 무광을, 선명한 색감을 원하신다면 유광을 추천드려요.`}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">핵심 특징</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-zinc-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paper Comparison Section (Sticker Only) */}
        {isSticker && (
          <section className="py-32 border-t border-zinc-100">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                Material Guide
              </span>
              <h2 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">주문 가능 용지 안내</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto font-medium text-lg">
                용도와 디자인에 가장 적합한 재질을 비교해 보세요. <br />
                재질에 따라 인쇄 느낌과 내구성이 달라집니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PAPER_MATERIALS.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>

            <div className="mt-16 p-10 rounded-[40px] bg-zinc-50 border border-zinc-100">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                  <h3 className="text-xl font-black text-zinc-900 flex items-center gap-3">
                    <Info className="w-6 h-6 text-emerald-600" />
                    재질 선택 팁
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-xs font-black">1</div>
                      <p className="text-sm text-zinc-600 leading-relaxed">물이나 습기에 노출되는 환경이라면 <b>유포지</b>나 <b>PET</b> 재질을 선택하세요.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-xs font-black">2</div>
                      <p className="text-sm text-zinc-600 leading-relaxed">투명 용기에 부착할 때는 <b>투명 PET</b>와 <b>화이트 인쇄</b> 조합이 가장 예쁩니다.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-xs font-black">3</div>
                      <p className="text-sm text-zinc-600 leading-relaxed">고급스러운 느낌을 원하신다면 무광의 <b>그문드 라벨</b>이나 <b>유포매트</b>를 추천합니다.</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 rounded-3xl bg-white border border-zinc-100">
                  <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6">용지별 주의사항</h3>
                  <ul className="space-y-3">
                    {PAPER_MATERIALS.slice(0, 4).map(p => (
                      <li key={p.id} className="text-xs text-zinc-500 flex gap-3">
                        <span className="font-black text-emerald-600 whitespace-nowrap">{p.name}</span>
                        <span>{p.precautions}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Options & Processing (Sticker Only) */}
        {isSticker && (
          <section className="py-32 border-t border-zinc-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-16">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                    <Layers className="w-8 h-8 text-emerald-600" />
                    코팅 및 후가공
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex gap-6 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Sparkles className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 mb-2">유광/무광 코팅</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">인쇄물을 보호하고 질감을 조절합니다. 유광은 선명함을, 무광은 차분함을 더해줍니다.</p>
                      </div>
                    </div>
                    <div className="flex gap-6 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Droplets className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 mb-2">화이트 인쇄</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">투명이나 유색 용지 위에 흰색을 먼저 인쇄하여 색상을 선명하게 표현합니다.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                    <Scissors className="w-8 h-8 text-emerald-600" />
                    재단 방식 안내
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-2">반칼 재단</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">스티커 배경지는 남겨두고 스티커만 떼어낼 수 있는 방식입니다.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 mb-2">완칼 재단</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">스티커와 배경지를 함께 모양대로 잘라내는 방식입니다. (조각 스티커)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 rounded-[48px] bg-zinc-900 text-white">
                <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-emerald-400" />
                  제작 시 유의사항
                </h2>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-widest">파일 작업</h4>
                    <ul className="space-y-3 text-sm text-zinc-400 list-disc pl-5">
                      <li>칼선(Kiss-cut)은 반드시 별도의 레이어나 색상으로 구분해 주세요.</li>
                      <li>복잡한 모양의 칼선은 재단 시 오차가 발생할 수 있으니 단순화 권장합니다.</li>
                      <li>텍스트는 반드시 아웃라인 처리를 해주세요.</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-widest">인쇄 및 색상</h4>
                    <ul className="space-y-3 text-sm text-zinc-400 list-disc pl-5">
                      <li>재질에 따라 동일한 색상값이라도 다르게 표현될 수 있습니다.</li>
                      <li>투명 재질은 화이트 인쇄 유무에 따라 느낌이 크게 달라집니다.</li>
                      <li>사방 1~2mm 정도의 밀림 현상이 발생할 수 있습니다.</li>
                    </ul>
                  </div>
                  <div className="pt-8 border-t border-white/10">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      ※ 위 유의사항을 숙지하지 않아 발생하는 제작 사고는 교환/환불이 불가합니다. <br />
                      처음 주문하신다면 반드시 소량 샘플 제작을 추천드립니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="py-32 border-t border-zinc-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">함께 보면 좋은 상품</h2>
                <p className="text-zinc-500 font-medium text-lg">다른 제작 옵션이나 관련 상품들도 확인해 보세요.</p>
              </div>
              <button 
                onClick={onBack}
                className="px-8 py-3 rounded-2xl bg-zinc-100 text-zinc-900 font-bold text-sm hover:bg-zinc-200 transition-all"
              >
                전체 상품 보기
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map(p => (
                <div key={p.id} onClick={() => { onBack(); /* Should navigate to this product but for now just back */ }} className="group cursor-pointer">
                  <div className="aspect-square rounded-[32px] overflow-hidden mb-6 bg-zinc-50 border border-zinc-100">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4 line-clamp-1">{p.tagline}</p>
                  <p className="text-sm font-black text-zinc-900">{p.basePrice.toLocaleString()}원~</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
