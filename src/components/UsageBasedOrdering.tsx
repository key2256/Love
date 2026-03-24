import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight, BookOpen, BookText, GraduationCap, School, BookMarked, Upload, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  recommendationReason: string;
}

interface UsageCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  recommendationText: string;
  recommendedProducts: RecommendedProduct[];
  selectionGuide: string[];
}

const USAGE_CATEGORIES: UsageCategory[] = [
  { 
    id: 'study', 
    title: '공부자료 제본', 
    description: '시험 대비 요약본, 개인 정리노트, 프린트 묶음처럼 공부할 때 자주 보는 자료를 제본하는 상품입니다.', 
    icon: BookOpen, 
    recommendationText: '가볍게 정리한 자료는 중철제본, 자주 펼쳐보며 필기할 자료는 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', name: '중철제본 책자', description: '얇고 가벼운 자료집에 적합', recommendationReason: '얇고 가벼운 자료집에 적합' },
      { id: 'binding-spring', name: '스프링제본 책자', description: '자주 펼쳐보고 필기하기 편함', recommendationReason: '자주 펼쳐보고 필기하기 편함' }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  { 
    id: 'learning', 
    title: '학습자료 제본', 
    description: '학원, 과외, 자습용 자료처럼 체계적으로 정리된 학습용 인쇄물을 제본하는 상품입니다.', 
    icon: GraduationCap, 
    recommendationText: '얇은 자료는 중철제본, 두꺼운 정리본은 무선제본, 필기와 펼침이 중요하면 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', name: '중철제본 책자', description: '얇은 자료에 적합', recommendationReason: '얇은 자료에 적합' },
      { id: 'binding-wireless', name: '무선제본 책자', description: '두꺼운 정리본에 적합', recommendationReason: '두꺼운 정리본에 적합' },
      { id: 'binding-spring', name: '스프링제본 책자', description: '필기와 펼침이 중요할 때', recommendationReason: '필기와 펼침이 중요할 때' }
    ],
    selectionGuide: ['얇은 자료 → 중철제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  { 
    id: 'teaching', 
    title: '수업교안 제본', 
    description: '강의용 프린트, 수업 자료, 설명용 교안처럼 전달력과 가독성이 중요한 자료를 위한 제본 상품입니다.', 
    icon: BookText, 
    recommendationText: '간단한 수업 자료는 중철제본, 수업 중 펼쳐두고 사용할 자료는 스프링제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-saddle', name: '중철제본 책자', description: '간단한 수업 자료에 적합', recommendationReason: '간단한 수업 자료에 적합' },
      { id: 'binding-spring', name: '스프링제본 책자', description: '수업 중 펼쳐두고 사용할 때', recommendationReason: '수업 중 펼쳐두고 사용할 때' }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '자주 펼치고 필기할 자료 → 스프링제본 추천']
  },
  { 
    id: 'workbook', 
    title: '문제집 제본', 
    description: '문제풀이 자료, 오답노트, 연습문제 모음처럼 반복해서 펼치고 직접 써가며 사용하는 자료에 적합한 상품입니다.', 
    icon: BookMarked, 
    recommendationText: '필기와 반복 풀이에는 스프링/트윈링 제본, 두꺼운 문제집 형태로 만들고 싶다면 무선제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-spring', name: '스프링제본 책자', description: '필기와 반복 풀이에 적합', recommendationReason: '필기와 반복 풀이에 적합' },
      { id: 'binding-twinring', name: '트윈링제본 책자', description: '튼튼하고 펼침이 좋음', recommendationReason: '튼튼하고 펼침이 좋음' },
      { id: 'binding-wireless', name: '무선제본 책자', description: '두꺼운 문제집 형태', recommendationReason: '두꺼운 문제집 형태' }
    ],
    selectionGuide: ['자주 펼치고 필기할 자료 → 스프링/트윈링 제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천']
  },
  { 
    id: 'book', 
    title: '단행본/소책자 제작', 
    description: '개인 출판물, 브랜드북, 소책자, 작품집처럼 한 권의 완성된 인쇄물 형태로 만들고 싶은 경우에 적합합니다.', 
    icon: BookOpen, 
    recommendationText: '기본적인 책자 제작은 무선제본, 감성적이고 정성스러운 제작은 실제본, 얇은 소책자는 중철제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-wireless', name: '무선제본 책자', description: '기본적인 책자 제작', recommendationReason: '기본적인 책자 제작' },
      { id: 'binding-sewn', name: '실제본 책자', description: '감성적이고 정성스러운 제작', recommendationReason: '감성적이고 정성스러운 제작' },
      { id: 'binding-saddle', name: '중철제본 책자', description: '얇은 소책자에 적합', recommendationReason: '얇은 소책자에 적합' }
    ],
    selectionGuide: ['얇은 책자/간단한 자료 → 중철제본 추천', '두꺼운 정리본/보고서 → 무선제본 추천', '감성적이고 완성도 높은 제작물 → 실제본 추천']
  },
  { 
    id: 'submission', 
    title: '기관/학교 제출용 제본', 
    description: '보고서, 발표자료, 제출용 문서, 기관 배포자료처럼 정돈된 인상과 깔끔한 마감이 중요한 제본 상품입니다.', 
    icon: School, 
    recommendationText: '깔끔한 제출용 자료는 무선제본, 넘김이 편한 자료집은 트윈링제본, 완성도와 보관성을 높이고 싶다면 실제본을 추천합니다.',
    recommendedProducts: [
      { id: 'binding-wireless', name: '무선제본 책자', description: '깔끔한 제출용 자료', recommendationReason: '깔끔한 제출용 자료' },
      { id: 'binding-twinring', name: '트윈링제본 책자', description: '넘김이 편한 자료집', recommendationReason: '넘김이 편한 자료집' },
      { id: 'binding-sewn', name: '실제본 책자', description: '완성도와 보관성을 높임', recommendationReason: '완성도와 보관성을 높임' }
    ],
    selectionGuide: ['두꺼운 정리본/보고서 → 무선제본 추천', '제출용/정돈된 자료 → 트윈링제본 추천', '감성적이고 완성도 높은 제작물 → 실제본 추천']
  },
];

interface UsageBasedOrderingProps {
  onBack: () => void;
  onProductClick: (id: string) => void;
  allProducts: Product[];
}

export const UsageBasedOrdering: React.FC<UsageBasedOrderingProps> = ({ onBack, onProductClick, allProducts }) => {
  const [selectedUsage, setSelectedUsage] = useState<UsageCategory | null>(null);

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!selectedUsage ? (
        <div className="space-y-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">홈으로</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black mb-4 tracking-tight">용도별 주문</h1>
            <p className="text-zinc-500 text-lg">제작 목적에 맞는 제본 방식을 추천해 드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USAGE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedUsage(cat)}
                className="p-8 rounded-[32px] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-xl font-black mb-3">{cat.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">{cat.description}</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <span>추천 보기</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <button 
            onClick={() => setSelectedUsage(null)}
            className="flex items-center gap-2 text-emerald-600 font-bold"
          >
            <ChevronLeft size={20} />
            다른 용도 선택하기
          </button>
          
          {/* 1. Title, 2. Description, 3. Recommendation Text */}
          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tight">{selectedUsage.title}</h1>
            <p className="text-xl text-zinc-600">{selectedUsage.description}</p>
            <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-900 border border-emerald-100">
              <p className="font-bold text-sm mb-2">💡 추천 가이드</p>
              <p className="text-sm">{selectedUsage.recommendationText}</p>
            </div>
          </div>
            
          {/* 4. Recommended Product Cards */}
          <div className="space-y-6">
            <h3 className="font-black text-2xl">추천 제본 상품</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedUsage.recommendedProducts.map(rec => {
                const product = allProducts.find(p => p.id === rec.id);
                if (!product) return null;
                return (
                  <div key={product.id} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all flex flex-col">
                    <h4 className="font-black text-xl text-zinc-900 mb-2">{rec.name}</h4>
                    <p className="text-sm text-zinc-500 mb-6">{rec.description}</p>
                    <button 
                      onClick={() => onProductClick(product.id)}
                      className="mt-auto w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all"
                    >
                      상품 상세 보기
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Selection Guide */}
          <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100">
            <h3 className="font-black text-lg mb-4">선택 가이드</h3>
            <ul className="space-y-2">
              {selectedUsage.selectionGuide.map((guide, i) => (
                <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  {guide}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};
