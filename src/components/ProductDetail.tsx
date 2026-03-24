import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight,
  ShoppingCart, 
  FileUp, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  Info,
  FileText,
  Droplets,
  Scissors,
  Layers,
  Sparkles,
  RotateCcw,
  Zap,
  Crown,
  ChevronDown,
  ChevronUp,
  Share2,
  Upload,
  Star,
  StarHalf,
  ThumbsUp,
  MessageCircle,
  Plus,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { Product, Quotation, PRODUCTS, CATEGORIES, PAPER_MATERIALS, PaperMaterial, CartItem, Review } from '../types';
import { QuotationCalculator } from './QuotationCalculator';
import { ProductIntroSection } from './calculators/shared/ProductIntroSection';
import PaperMaterialCard from './PaperMaterialCard';
import { SocialShare } from './SocialShare';

interface UsageRecommendation {
  title: string;
  description: string;
  recommendationText: string;
  recommendedProducts: { id: string; badge: string; features: string[] }[];
  selectionGuide: string[];
}

const USAGE_RECOMMENDATIONS: Record<string, UsageRecommendation> = {
  'usage-study': {
    title: '공부자료 제본',
    description: '시험 대비 요약본, 개인 정리노트, 프린트 묶음처럼 공부할 때 자주 보는 자료를 제본하는 상품입니다.',
    recommendationText: '가볍게 정리한 자료는 중철제본, 자주 펼쳐보며 필기할 자료는 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', badge: '얇은 자료 추천', features: ['가벼움', '저렴함'] },
      { id: 'binding-spring', badge: '필기용 추천', features: ['360도 펼침', '필기 용이'] }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  'usage-learning': {
    title: '학습자료 제본',
    description: '학원, 과외, 자습용 자료처럼 체계적으로 정리된 학습용 인쇄물을 제본하는 상품입니다.',
    recommendationText: '얇은 자료는 중철제본, 두꺼운 정리본은 무선제본, 필기와 펼침이 중요하면 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', badge: '얇은 자료 추천', features: ['가벼움', '저렴함'] },
      { id: 'binding-wireless', badge: '두꺼운 정리본 추천', features: ['깔끔함', '보관 용이'] },
      { id: 'binding-spring', badge: '필기용 추천', features: ['360도 펼침', '필기 용이'] }
    ],
    selectionGuide: ['얇은 자료 → 중철제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  'usage-teaching': {
    title: '수업교안 제본',
    description: '강의용 프린트, 수업 자료, 설명용 교안처럼 전달력과 가독성이 중요한 자료를 위한 제본 상품입니다.',
    recommendationText: '간단한 수업 자료는 중철제본, 수업 중 펼쳐두고 사용할 자료는 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', badge: '얇은 자료 추천', features: ['가벼움', '저렴함'] },
      { id: 'binding-spring', badge: '필기용 추천', features: ['360도 펼침', '필기 용이'] }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  'usage-workbook': {
    title: '문제집 제본',
    description: '문제풀이 자료, 오답노트, 연습문제 모음처럼 반복해서 펼치고 직접 써가며 사용하는 자료에 적합한 상품입니다.',
    recommendationText: '필기와 반복 풀이에는 스프링/트윈링 제본, 두꺼운 문제집 형태로 만들고 싶다면 무선제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-spring', badge: '필기용 추천', features: ['360도 펼침', '필기 용이'] },
      { id: 'binding-twinring', badge: '제출용 추천', features: ['고급스러움', '튼튼함'] },
      { id: 'binding-wireless', badge: '두꺼운 정리본 추천', features: ['깔끔함', '보관 용이'] }
    ],
    selectionGuide: ['자주 펼치고 필기할 자료 → 스프링/트윈링 제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천']
  },
  'usage-book': {
    title: '단행본/소책자 제작',
    description: '개인 출판물, 브랜드북, 소책자, 작품집처럼 한 권의 완성된 인쇄물 형태로 만들고 싶은 경우에 적합합니다.',
    recommendationText: '기본적인 책자 제작은 무선제본, 감성적이고 정성스러운 제작은 실제본, 얇은 소책자는 중철제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-wireless', badge: '두꺼운 정리본 추천', features: ['깔끔함', '보관 용이'] },
      { id: 'binding-sewn', badge: '감성적인 제작물 추천', features: ['고급스러움', '완성도 높음'] },
      { id: 'binding-saddle', badge: '얇은 자료 추천', features: ['가벼움', '저렴함'] }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천', '감성적이고 완성도 높은 제작물 → 실제본 추천']
  },
  'usage-submission': {
    title: '기관/학교 제출용 제본',
    description: '보고서, 발표자료, 제출용 문서, 기관 배포자료처럼 정돈된 인상과 깔끔한 마감이 중요한 제본 상품입니다.',
    recommendationText: '깔끔한 제출용 자료는 무선제본, 넘김이 편한 자료집은 트윈링제본, 완성도와 보관성을 높이고 싶다면 실제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-wireless', badge: '두꺼운 정리본 추천', features: ['깔끔함', '보관 용이'] },
      { id: 'binding-twinring', badge: '제출용 추천', features: ['고급스러움', '튼튼함'] },
      { id: 'binding-sewn', badge: '감성적인 제작물 추천', features: ['고급스러움', '완성도 높음'] }
    ],
    selectionGuide: ['두꺼운 정리본/보고서 → 무선제본 추천', '제출용/정돈된 자료 → 트윈링제본 추천', '감성적이고 완성도 높은 제작물 → 실제본 추천']
  }
};

const UsageProductDetail: React.FC<{ product: Product; onProductClick: (id: string) => void }> = ({ product, onProductClick }) => {
  const recommendation = USAGE_RECOMMENDATIONS[product.id];
  if (!recommendation) return null;

  return (
    <div className="space-y-12">
      {/* Top Layout: 2-column with better balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col justify-center space-y-4 p-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
            {recommendation.title}
          </h1>
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl">
            {recommendation.description}
          </p>
        </div>
        
        {/* Recommendation Guide Box - more balanced height */}
        <div className="p-8 bg-emerald-50 rounded-[40px] text-emerald-900 border border-emerald-100 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Zap size={120} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Sparkles size={16} />
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-emerald-600">추천 가이드</p>
            </div>
            <p className="text-base md:text-lg font-bold leading-relaxed text-emerald-950">
              {recommendation.recommendationText}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Guide Box - More visually organized and integrated */}
      <div className="bg-zinc-50 rounded-[40px] p-8 md:p-10 border border-zinc-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h3 className="font-black text-2xl text-zinc-900">선택 가이드</h3>
            <p className="text-sm text-zinc-500 font-medium">용도에 맞는 최적의 제본 방식을 선택해보세요.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-200 shadow-sm">
            <Info size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-zinc-600">전문가 추천 가이드</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendation.selectionGuide.map((guide, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-zinc-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-sm font-black text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                {String(i + 1).padStart(2, '0')}
              </div>
              <p className="text-sm text-zinc-700 font-bold leading-snug pt-1">{guide}</p>
            </div>
          ))}
        </div>
      </div>
        
      {/* Recommended Products */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="font-black text-2xl text-zinc-900 tracking-tight">추천 제본 상품</h3>
          <div className="h-px flex-1 bg-zinc-100"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendation.recommendedProducts.map(item => {
            const recommendedProduct = PRODUCTS.find(p => p.id === item.id);
            if (!recommendedProduct) return null;
            return (
              <div key={recommendedProduct.id} className="group bg-white p-8 rounded-[48px] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden">
                {/* Recommendation Badge - More prominent */}
                <div className="absolute top-6 right-6 z-10">
                  <span className="inline-flex px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div className="mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors duration-500">
                    <Layers size={32} className="text-zinc-400 group-hover:text-emerald-500 transition-colors duration-500" />
                  </div>
                  <h4 className="font-black text-2xl text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {recommendedProduct.name}
                  </h4>
                  <p className="text-sm text-zinc-400 font-bold leading-relaxed">
                    {recommendedProduct.tagline}
                  </p>
                </div>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">주요 특징</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {item.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:bg-white group-hover:border-emerald-100 transition-all duration-300">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        </div>
                        <span className="text-xs font-bold text-zinc-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onProductClick(recommendedProduct.id)}
                  className="mt-auto w-full py-5 rounded-[24px] bg-zinc-900 text-white font-black text-sm hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-zinc-900/10 hover:shadow-emerald-600/30 flex items-center justify-center gap-2 group/btn"
                >
                  이 상품으로 주문하기
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReviewSection: React.FC<{ productId: string }> = ({ productId }) => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'high'>('all');

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 'r1',
      productId,
      userName: '김*현',
      rating: 5,
      comment: '색감이 너무 선명하고 예뻐요! 배송도 생각보다 빨라서 좋았습니다. 다음에도 여기서 주문할게요. 특히 종이 질감이 생각보다 훨씬 고급스러워서 대만족입니다.',
      date: '2024-03-15',
      isVerified: true,
      images: ['https://picsum.photos/seed/review1/800/800']
    },
    {
      id: 'r2',
      productId,
      userName: '이*서',
      rating: 4,
      comment: '재질이 고급스럽고 마감이 깔끔합니다. 다만 칼선이 아주 미세하게 밀린 부분이 있었는데 크게 티는 안 나네요. 전반적으로 만족스러운 퀄리티입니다.',
      date: '2024-03-12',
      isVerified: true
    },
    {
      id: 'r3',
      productId,
      userName: '박*민',
      rating: 5,
      comment: '가성비 최고입니다. 대량으로 주문했는데 파손 없이 잘 왔어요. 상담원분도 친절하셔서 기분 좋게 주문했습니다. 포장이 꼼꼼해서 좋았어요.',
      date: '2024-03-10',
      isVerified: true,
      images: [
        'https://picsum.photos/seed/review2/800/800', 
        'https://picsum.photos/seed/review3/800/800'
      ]
    },
    {
      id: 'r4',
      productId,
      userName: '최*준',
      rating: 5,
      comment: '디자인한 대로 색상이 잘 나와서 너무 기쁩니다. 소량 제작인데도 정성스럽게 만들어주셨네요.',
      date: '2024-03-08',
      isVerified: true,
      images: ['https://picsum.photos/seed/review4/800/800']
    }
  ];

  const filteredReviews = useMemo(() => {
    switch (filter) {
      case 'photo': return mockReviews.filter(r => r.images && r.images.length > 0);
      case 'high': return mockReviews.filter(r => r.rating === 5);
      default: return mockReviews;
    }
  }, [filter, mockReviews]);

  const averageRating = 4.8;
  const totalReviews = 124;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={16} className="fill-amber-400 text-amber-400" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<StarHalf key={i} size={16} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-zinc-200" />);
      }
    }
    return stars;
  };

  return (
    <section className="py-32 border-t border-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">구매 후기</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(averageRating)}
            </div>
            <span className="text-2xl font-black text-zinc-900">{averageRating}</span>
            <span className="text-zinc-400 font-bold">({totalReviews}개의 후기)</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-900/10 hover:shadow-emerald-600/20">
          <Plus size={18} />
          후기 작성하기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Rating Breakdown */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-10 rounded-[40px] bg-zinc-50 border border-zinc-100 h-fit">
            <h3 className="text-lg font-black mb-8">평점 비율</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentages = { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 };
                const percentage = percentages[star as keyof typeof percentages];
                return (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-zinc-500 w-4">{star}점</span>
                    <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-amber-400"
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 w-8">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 pt-10 border-t border-zinc-200">
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                <b>98%</b>의 구매자가 이 상품을 추천합니다. <br />
                실제 구매 고객님들이 남겨주신 소중한 후기입니다.
              </p>
            </div>
          </div>

          {/* Review Filters */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-2">정렬 및 필터</p>
            {[
              { id: 'all', label: '전체 후기' },
              { id: 'photo', label: '포토 후기' },
              { id: 'high', label: '최고 평점' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  filter === f.id 
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                    : 'bg-white text-zinc-500 border border-zinc-100 hover:border-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 md:p-10 rounded-[40px] bg-white border border-zinc-100 hover:border-emerald-200 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-zinc-900">{review.userName}</span>
                          {review.isVerified && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100 uppercase tracking-tighter">
                              구매인증
                            </span>
                          )}
                          <span className="text-xs text-zinc-400 font-medium">{review.date}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-xs font-bold">
                        <ThumbsUp size={14} />
                        도움됨
                      </button>
                    </div>
                    
                    <p className="text-zinc-600 leading-relaxed mb-6 font-medium text-base">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-6">
                        {review.images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border border-zinc-100 cursor-zoom-in group/img"
                          >
                            <img 
                              src={img} 
                              alt="review" 
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                              <Search size={20} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button className="w-full py-8 rounded-[40px] bg-zinc-50 text-zinc-500 font-black text-sm hover:bg-zinc-100 transition-all border border-dashed border-zinc-200 flex items-center justify-center gap-3">
            <MessageCircle size={18} />
            후기 더보기 (121개)
          </button>
        </div>
      </div>
    </section>
  );
};

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onProductClick: (id: string) => void;
  onQuotationGenerated: (quotation: Quotation) => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onProductClick, onQuotationGenerated, onAddToCart }) => {
  const isUsageBased = product.id.startsWith('usage-');
  const [activeTab, setActiveTab] = useState<'calc' | 'info'>('calc');
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<PaperMaterial['group']>('일반/기본 용지');
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  
  const productImages = useMemo(() => [
    product.image,
    ...[1, 2, 3].map(i => `https://picsum.photos/seed/${product.id}-${i}/800/800`)
  ], [product.id, product.image]);

  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [zoomScale, setZoomScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for smooth panning
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || isDragging) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomScale(prev => Math.min(Math.max(prev + delta, 1), 4));
  };

  const resetZoom = () => {
    setZoomScale(1);
    x.set(0);
    y.set(0);
  };

  const nextImage = () => {
    const currentIndex = productImages.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % productImages.length;
    setActiveImage(productImages[nextIndex]);
    resetZoom();
  };

  const prevImage = () => {
    const currentIndex = productImages.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + productImages.length) % productImages.length;
    setActiveImage(productImages[prevIndex]);
    resetZoom();
  };

  useEffect(() => {
    if (zoomScale === 1) {
      x.set(0);
      y.set(0);
    }
  }, [zoomScale, x, y]);

  // Find similar products based on category, subcategory, and shared features
  const similarProducts = useMemo(() => {
    return PRODUCTS
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0;
        if (p.category === product.category) score += 10;
        if (p.subCategory === product.subCategory) score += 5;
        
        // Shared features (acting as tags)
        const sharedFeatures = p.features.filter(f => product.features.includes(f));
        score += sharedFeatures.length * 2;
        
        return { product: p, score };
      })
      .filter(item => item.score > 0) // Only include if at least some similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.product);
  }, [product]);

  const isSticker = product.category === 'sticker';
  const hasWarnings = product.warnings && product.warnings.length > 0;

  const materialGroups: PaperMaterial['group'][] = [
    '일반/기본 용지',
    '방수/합성지',
    '투명/PET',
    '메탈/광택 특수 재질',
    '프리미엄 라벨(GMUND)'
  ];
  
  const filteredMaterials = PAPER_MATERIALS.filter(m => m.group === selectedMaterialGroup);
  const displayedMaterials = showAllMaterials ? filteredMaterials : filteredMaterials.slice(0, 8);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">이전으로</span>
          </button>
          {!isUsageBased && <SocialShare title={product.name} />}
        </div>

        {isUsageBased ? (
          <UsageProductDetail product={product} onProductClick={onProductClick} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              {/* Left: Images */}
              <div className="space-y-4">
                <div 
                  ref={containerRef}
                  className="aspect-square rounded-[40px] overflow-hidden bg-zinc-100 border border-zinc-100 shadow-2xl shadow-zinc-200/50 relative group select-none"
                  onWheel={handleWheel}
                  style={{ touchAction: 'none' }}
                >
                  <motion.div
                    drag={zoomScale > 1}
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    style={{ 
                      x: springX, 
                      y: springY,
                      width: '100%',
                      height: '100%',
                      cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                    }}
                    onClick={() => {
                      if (zoomScale === 1) setZoomScale(2);
                      else resetZoom();
                    }}
                  >
                    <motion.img 
                      src={activeImage} 
                      alt={product.name}
                      className="w-full h-full object-cover pointer-events-none"
                      animate={{
                        scale: zoomScale,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>

                  {/* Zoom Controls Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setZoomScale(prev => Math.min(prev + 0.5, 4)); }}
                        className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-zinc-900 shadow-lg border border-white/20 hover:bg-white transition-colors"
                        title="확대"
                      >
                        <Maximize2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setZoomScale(prev => Math.max(prev - 0.5, 1)); }}
                        className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-zinc-900 shadow-lg border border-white/20 hover:bg-white transition-colors"
                        title="축소"
                      >
                        <Minimize2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                        className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-zinc-900 shadow-lg border border-white/20 hover:bg-white transition-colors"
                        title="초기화"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-zinc-900 shadow-lg border border-white/20 flex items-center gap-2">
                      {zoomScale > 1 ? (
                        <>
                          <Zap size={12} className="text-emerald-500" />
                          드래그하여 이동 / 휠로 확대축소
                        </>
                      ) : (
                        <>
                          <Search size={12} />
                          클릭하거나 휠을 돌려 확대해보세요
                        </>
                      )}
                    </div>
                  </div>

                  {/* Carousel Navigation Arrows */}
                  {zoomScale === 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-zinc-900 shadow-xl border border-white/20 hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-zinc-900 shadow-xl border border-white/20 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Zoom Level Indicator */}
                  {zoomScale > 1 && (
                    <div className="absolute top-6 right-6 bg-zinc-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">
                      {zoomScale.toFixed(1)}X
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((imgUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setActiveImage(imgUrl);
                        resetZoom();
                      }}
                      className={`aspect-square rounded-2xl overflow-hidden bg-zinc-50 border transition-all cursor-pointer ${activeImage === imgUrl ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-zinc-100 hover:border-emerald-300'}`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`thumbnail-${i}`}
                        className={`w-full h-full object-cover transition-opacity ${activeImage === imgUrl ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quotation Calculator */}
              <div className="flex flex-col">
                <ProductIntroSection product={product} />

                <div className="flex gap-1 p-1.5 bg-zinc-100 rounded-[20px] my-10 w-fit">
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
                      onAddToCart={onAddToCart}
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

                    {hasWarnings && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">제작 시 유의사항</h3>
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 space-y-3">
                          {product.warnings?.map((w, i) => (
                            <div key={i} className="flex gap-3 text-xs text-amber-800/80 leading-relaxed">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{w}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.notes && product.notes.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">참고사항</h3>
                        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-3">
                          {product.notes.map((note, i) => (
                            <div key={i} className="flex gap-3 text-xs text-zinc-600 leading-relaxed">
                              <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                      <button className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all">
                        <FileUp className="w-4 h-4" />
                        작업 가이드 다운로드
                      </button>
                      <button className="w-full py-4 rounded-2xl bg-white border-2 border-zinc-900 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
                        <HelpCircle className="w-4 h-4" />
                        1:1 제작 문의하기
                      </button>
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

                {/* Tier 1: Material Groups */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                  {materialGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => {
                        setSelectedMaterialGroup(group);
                        setShowAllMaterials(false);
                      }}
                      className={`px-8 py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                        selectedMaterialGroup === group 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200 scale-105' 
                          : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                {/* Tier 2: Specific Materials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {displayedMaterials.map((paper) => (
                    <PaperMaterialCard key={paper.id} material={paper} />
                  ))}
                </div>

                {filteredMaterials.length > 8 && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setShowAllMaterials(!showAllMaterials)}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zinc-100 text-zinc-900 font-black text-sm hover:bg-zinc-200 transition-all"
                    >
                      {showAllMaterials ? (
                        <>접기 <ChevronUp size={16} /></>
                      ) : (
                        <>더 많은 재질 보기 ({filteredMaterials.length - 8}개 더 있음) <ChevronDown size={16} /></>
                      )}
                    </button>
                  </div>
                )}

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
                          <p className="text-sm text-zinc-600 leading-relaxed">물이나 습기에 노출되는 환경이라면 <b>유포 스티커</b>나 <b>PET</b> 재질을 선택하세요.</p>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
                              시트
                            </div>
                            <h4 className="font-bold text-zinc-900">시트형 반칼 (Kiss-cut)</h4>
                          </div>
                          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                            스티커 용지는 그대로 두고, 스티커 모양대로 칼선만 내는 방식입니다. 
                            한 장의 시트에 여러 개의 스티커가 붙어 있어 대량 부착 작업에 편리합니다.
                          </p>
                          <ul className="text-xs text-zinc-500 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-500 mt-0.5">•</span>
                              <span>다이어리 꾸미기, 라벨링 작업에 최적</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-500 mt-0.5">•</span>
                              <span>시트 전체 크기 내에서 자유로운 배치 가능</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                              개별
                            </div>
                            <h4 className="font-bold text-zinc-900">개별재단 완칼 (Full-cut)</h4>
                          </div>
                          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                            스티커와 뒷면 대지까지 모양대로 완전히 잘라내는 방식입니다. 
                            스티커가 하나씩 낱개로 떨어져 있어 배포용이나 사은품용으로 적합합니다.
                          </p>
                          <ul className="text-xs text-zinc-500 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>홍보용 배포, 굿즈 판매용으로 인기</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>하나씩 개별적으로 보관 및 사용 가능</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 p-6 bg-amber-50 rounded-[32px] border border-amber-100">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h5 className="text-lg font-bold text-amber-900 mb-1">복합 재단 (시트형 반칼 + 개별 완칼)</h5>
                            <p className="text-sm text-amber-800 leading-relaxed">
                              시트 안에 여러 개의 모양 반칼을 넣고, 그 시트 자체를 원하는 모양으로 개별 완칼하는 방식입니다. 
                              브랜드 스티커 팩 제작 시 가장 많이 활용되는 고급 사양입니다.
                            </p>
                          </div>
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

            {/* Review Section */}
            <ReviewSection productId={product.id} />

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
                    <div key={p.id} onClick={() => onProductClick(p.id)} className="group cursor-pointer">
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
          </>
        )}
      </div>
    </div>
  );
};
