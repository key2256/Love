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
import { trackView } from '../services/recommendationService';
import { Product, Quotation, PRODUCTS, CATEGORIES, PAPER_MATERIALS, PaperMaterial, CartItem, Review } from '../types';
import { createDefaultCartItem } from '../lib/cartUtils';
import { QuotationCalculator } from './QuotationCalculator';
import { useAuth } from '../hooks/useAuth';
import { saveDraft } from '../services/draftService';
import { toast } from 'sonner';
import { ProductIntroSection } from './calculators/shared/ProductIntroSection';
import PaperMaterialCard from './PaperMaterialCard';
import { SocialShare } from './SocialShare';
import { ProductCard } from './ProductCard';
import { ProductGuides } from './ProductGuides';

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

const SpecificationsSection: React.FC<{ product: Product }> = ({ product }) => {
  const materials = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
  const printing = product.options.find(opt => opt.name.includes('인쇄'));
  const finishing = product.options.filter(opt => 
    ['코팅', '귀돌이', '박', '형압', '엠보싱', '타공', '오시', '미싱', '도입'].some(f => opt.name.includes(f))
  );

  const specItems = [
    {
      label: '주요 특징',
      value: product.features.slice(0, 3).join(', '),
      icon: Zap
    },
    {
      label: '기본 재질',
      value: materials?.values?.map(v => v.label).slice(0, 2).join(', ') + (materials?.values && materials.values.length > 2 ? ' 외' : '') || '상품 상세 옵션에서 선택 가능',
      icon: Layers
    },
    {
      label: '인쇄/가공',
      value: [
        printing?.values?.[0]?.label,
        ...finishing.slice(0, 2).map(f => f.name)
      ].filter(Boolean).join(', ') || '고품질 인쇄 및 후가공',
      icon: Sparkles
    },
    {
      label: '제작 기간',
      value: product.leadTime,
      icon: Clock
    }
  ];

  return (
    <section className="py-32 border-t border-zinc-100">
      <div className="mb-16">
        <h2 className="text-4xl font-black mb-4 tracking-tight">상세 사양</h2>
        <p className="text-zinc-500 font-medium text-lg">상품의 재질, 인쇄 방식 및 제작 관련 상세 정보입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {specItems.map((item, i) => (
          <div key={i} className="p-8 rounded-[40px] bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all mb-6 shadow-sm">
              <item.icon size={24} />
            </div>
            <h4 className="font-black text-zinc-400 text-[10px] uppercase tracking-widest mb-2">{item.label}</h4>
            <p className="text-zinc-900 font-bold leading-relaxed">{item.value}</p>
          </div>
        ))}
      </div>

      {product.warnings && product.warnings.length > 0 && (
        <div className="p-10 rounded-[48px] bg-rose-50 border border-rose-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-2xl font-black text-rose-900">주의사항 및 안내</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {product.warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                <p className="text-rose-800/80 text-sm font-medium leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onProductClick: (id: string) => void;
  onQuotationGenerated: (quotation: Quotation) => void;
  onAddToCart: (item: CartItem) => void;
  onAuthClick: (mode: 'login' | 'signup' | 'reset') => void;
  initialOptions?: Record<string, string>;
  initialQuantity?: number;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onProductClick, 
  onQuotationGenerated, 
  onAddToCart,
  onAuthClick,
  initialOptions,
  initialQuantity
}) => {
  const isUsageBased = product.id.startsWith('usage-');
  const [activeTab, setActiveTab] = useState<'calc' | 'info'>('calc');
  const { user } = useAuth();

  useEffect(() => {
    trackView(user?.uid, product.id);
  }, [user?.uid, product.id]);

  const handleSaveDraft = async (options: Record<string, string>, quantity: number) => {
    if (!user) {
      toast.error('로그인이 필요한 서비스입니다.', {
        description: '임시저장을 위해 로그인을 진행해주세요.',
        action: {
          label: '로그인',
          onClick: () => onAuthClick('login')
        }
      });
      return;
    }

    try {
      await saveDraft({
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        options,
        quantity
      });
      toast.success('임시저장 완료!', {
        description: '마이페이지에서 저장된 견적을 확인하실 수 있습니다.'
      });
    } catch (error) {
      console.error('Draft save error:', error);
      toast.error('저장 실패', {
        description: '잠시 후 다시 시도해주세요.'
      });
    }
  };
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<PaperMaterial['group']>('일반/기본 용지');
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  
  const productImages = useMemo(() => [
    product.image,
    ...[1, 2, 3].map(i => `https://picsum.photos/seed/${product.id}-${i}/800/800`)
  ], [product.id, product.image]);

  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string | null>(null);
  
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
    let filtered = PRODUCTS
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
      .sort((a, b) => b.score - a.score);

    if (selectedMaterialFilter) {
      filtered = filtered.filter(item => {
        const p = item.product;
        // Check if any material in PAPER_MATERIALS or BUSINESS_CARD_MATERIALS matches the filter and is in the product's options
        const materialOption = p.options.find(opt => opt.name.includes('재질'));
        if (materialOption && materialOption.values) {
          const matchesOption = materialOption.values.some(val => {
            // Check sticker materials
            if (p.category === 'sticker') {
              return PAPER_MATERIALS.some(m => m.group === selectedMaterialFilter && val.label.includes(m.name));
            }
            // Check business card materials
            if (p.category === 'card-paper') {
              // We'd need BUSINESS_CARD_MATERIALS here, but for now we can check if the label contains keywords from the group name
              const keywords = selectedMaterialFilter.split('/');
              return keywords.some(k => val.label.includes(k));
            }
            return val.label.includes(selectedMaterialFilter);
          });
          if (matchesOption) return true;
        }
        // Fallback to features/badges
        return p.features.some(f => f.includes(selectedMaterialFilter)) || 
               p.badges?.some(b => b.includes(selectedMaterialFilter));
      });
    }

    return filtered.slice(0, 8).map(item => item.product);
  }, [product, selectedMaterialFilter]);

  const categoryMaterialGroups = useMemo(() => {
    if (product.category === 'sticker') {
      return [
        '일반/기본 용지',
        '방수/합성지',
        '투명/PET',
        '메탈/광택 특수 재질',
        '프리미엄 라벨(GMUND)'
      ];
    }
    if (product.category === 'card-paper') {
      return [
        '기본 대중형',
        '고급 감성형',
        '내추럴/친환경형',
        '특수지/프리미엄형'
      ];
    }
    return ['Standard', 'Premium', 'Eco-friendly', 'Special'];
  }, [product.category]);

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
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
              <div className="flex flex-col sticky top-24">
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
                      onSaveDraft={handleSaveDraft}
                      initialOptions={initialOptions}
                      initialQuantity={initialQuantity}
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
                <div className="max-w-6xl mx-auto px-4">
                  <div className="text-center mb-24">
                    <h2 className="text-5xl font-black text-zinc-900 mb-8 tracking-tighter">
                      스티커의 완성도를 높이는 <span className="text-emerald-600">특별한 후가공</span>
                    </h2>
                    <p className="text-zinc-500 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                      용도와 디자인에 맞는 최적의 코팅과 효과를 선택하여 브랜드의 가치를 전달하세요. 
                      작은 차이가 명품 스티커를 만듭니다.
                    </p>
                  </div>

                  {/* Product Guides Section */}
                  <ProductGuides category={product.category} subCategory={product.subCategory} />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="p-10 rounded-[48px] bg-emerald-50 border border-emerald-100 overflow-hidden relative group flex-1">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <Crown size={120} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                              <Crown size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-emerald-950">대량 주문 혜택</h3>
                          </div>
                          <p className="text-emerald-700 text-base leading-relaxed mb-8">
                            1,000매 이상의 대량 주문이 필요하신가요? <br />
                            대량 주문 시 추가 할인 혜택과 전담 매니저의 1:1 관리를 받으실 수 있습니다. 
                            견적 문의를 남겨주시면 빠르게 안내해 드립니다.
                          </p>
                          <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                            대량 주문 견적 문의
                          </button>
                        </div>
                      </div>

                      <div className="p-10 rounded-[48px] bg-zinc-50 border border-zinc-100 overflow-hidden relative group flex-1">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <RotateCcw size={120} className="text-zinc-300" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white">
                              <RotateCcw size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900">재주문 안내</h3>
                          </div>
                          <p className="text-zinc-500 text-base leading-relaxed mb-8">
                            이전에 주문하셨던 디자인 그대로 다시 주문하고 싶으신가요? <br />
                            주문 내역에서 '재주문' 버튼을 클릭하시면 모든 옵션이 그대로 적용되어 
                            간편하게 주문하실 수 있습니다.
                          </p>
                          <button className="px-10 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-black text-sm hover:bg-zinc-900 hover:text-white transition-all active:scale-95">
                            재주문 가이드 보기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Specifications Section */}
            <SpecificationsSection product={product} />

            {/* Review Section */}
            <ReviewSection productId={product.id} />

            {/* You might also like Section */}
            {similarProducts.length > 0 && (
              <section className="py-32 border-t border-zinc-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">You might also like</h2>
                    <p className="text-zinc-500 font-medium text-lg">다른 제작 옵션이나 관련 상품들도 확인해 보세요.</p>
                  </div>
                  <button 
                    onClick={onBack}
                    className="px-8 py-3 rounded-2xl bg-zinc-100 text-zinc-900 font-bold text-sm hover:bg-zinc-200 transition-all"
                  >
                    전체 상품 보기
                  </button>
                </div>

                {/* Material Filter */}
                <div className="flex flex-wrap gap-2 mb-12">
                  <button
                    onClick={() => setSelectedMaterialFilter(null)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      selectedMaterialFilter === null
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    전체 재질
                  </button>
                  {categoryMaterialGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedMaterialFilter(group)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        selectedMaterialFilter === group
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100'
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                <div className="relative group/carousel">
                  <div 
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 no-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {similarProducts.map(p => (
                      <div key={p.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard 
                          product={p} 
                          onClick={onProductClick}
                          onAddToCart={(prod) => onAddToCart(createDefaultCartItem(prod))}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Carousel Navigation */}
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden lg:block">
                    <button 
                      onClick={(e) => {
                        const container = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                        container.scrollBy({ left: -400, behavior: 'smooth' });
                      }}
                      className="w-12 h-12 bg-white rounded-full shadow-xl border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  </div>
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden lg:block">
                    <button 
                      onClick={(e) => {
                        const container = e.currentTarget.parentElement?.previousElementSibling as HTMLElement;
                        container.scrollBy({ left: 400, behavior: 'smooth' });
                      }}
                      className="w-12 h-12 bg-white rounded-full shadow-xl border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
