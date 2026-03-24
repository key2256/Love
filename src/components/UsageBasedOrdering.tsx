import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ArrowRight, BookOpen, BookText, GraduationCap, School, BookMarked, Users } from 'lucide-react';
import { Product } from '../types';

interface UsageCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  recommendedProductIds: string[];
  recommendationText: string;
}

const USAGE_CATEGORIES: UsageCategory[] = [
  { 
    id: 'study', 
    title: '공부자료 제본', 
    description: '시험 대비 요약본, 개인 정리노트, 프린트 묶음처럼 공부할 때 자주 보는 자료를 제본하는 상품입니다. 가볍게 넘겨보는 용도부터 필기용 자료까지 목적에 맞게 선택할 수 있습니다.', 
    icon: BookOpen, 
    recommendedProductIds: ['binding-saddle', 'binding-spring'],
    recommendationText: '가볍게 정리한 자료는 중철제본, 자주 펼쳐보며 필기할 자료는 스프링제본을 추천합니다.'
  },
  { 
    id: 'learning', 
    title: '학습자료 제본', 
    description: '학원, 과외, 자습용 자료처럼 체계적으로 정리된 학습용 인쇄물을 제본하는 상품입니다. 분량과 사용 방식에 따라 얇은 자료집부터 두꺼운 정리본까지 제작할 수 있습니다.', 
    icon: GraduationCap, 
    recommendedProductIds: ['binding-saddle', 'binding-wireless', 'binding-spring'],
    recommendationText: '얇은 자료는 중철제본, 두꺼운 정리본은 무선제본, 필기와 펼침이 중요하면 스프링제본을 추천합니다.'
  },
  { 
    id: 'teaching', 
    title: '수업교안 제본', 
    description: '강의용 프린트, 수업 자료, 설명용 교안처럼 전달력과 가독성이 중요한 자료를 제본하는 상품입니다. 수업 중 넘겨보기 쉽고, 필요한 내용을 깔끔하게 정리해 사용할 수 있습니다.', 
    icon: BookText, 
    recommendedProductIds: ['binding-saddle', 'binding-spring'],
    recommendationText: '간단한 수업 자료는 중철제본, 수업 중 펼쳐두고 필기할 자료는 스프링제본을 추천합니다.'
  },
  { 
    id: 'workbook', 
    title: '문제집 제본', 
    description: '문제풀이 자료, 오답노트, 연습문제 모음처럼 반복해서 펼치고 직접 써가며 사용하는 자료에 적합한 제본 상품입니다. 자주 넘겨보는 사용 환경을 고려해 실용적으로 제작할 수 있습니다.', 
    icon: BookMarked, 
    recommendedProductIds: ['binding-spring', 'binding-twinring', 'binding-wireless'],
    recommendationText: '필기와 반복 풀이에는 스프링/트윈링 제본, 두꺼운 문제집 형태로 만들고 싶다면 무선제본을 추천합니다.'
  },
  { 
    id: 'book', 
    title: '단행본/소책자 제작', 
    description: '개인 출판물, 브랜드북, 소책자, 작품집처럼 한 권의 완성된 인쇄물 형태로 만들고 싶은 경우에 적합한 상품입니다. 가벼운 소책자부터 보관용 제작물까지 목적에 따라 선택할 수 있습니다.', 
    icon: BookOpen, 
    recommendedProductIds: ['binding-wireless', 'binding-sewn', 'binding-saddle'],
    recommendationText: '기본적인 책자 제작은 무선제본, 감성적이고 정성스러운 제작은 실제본, 얇은 소책자는 중철제본을 추천합니다.'
  },
  { 
    id: 'submission', 
    title: '기관/학교 제출용 제본', 
    description: '보고서, 발표자료, 제출용 문서, 기관 배포자료처럼 정돈된 인상과 깔끔한 마감이 중요한 제본 상품입니다. 공식적인 제출물에 어울리도록 단정하고 안정적인 형태로 제작할 수 있습니다.', 
    icon: School, 
    recommendedProductIds: ['binding-wireless', 'binding-twinring', 'binding-sewn'],
    recommendationText: '깔끔한 제출용 자료는 무선제본, 넘김이 편한 자료집은 트윈링제본, 완성도와 보관성을 높이고 싶다면 실제본을 추천합니다.'
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
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-12"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
      </button>

      {!selectedUsage ? (
        <div className="space-y-12">
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
          
          <div className="bg-zinc-50 rounded-[48px] p-12 border border-zinc-100">
            <h2 className="text-4xl font-black mb-6">{selectedUsage.title}</h2>
            <p className="text-lg text-zinc-600 mb-6">{selectedUsage.description}</p>
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl mb-10 font-bold text-sm border border-emerald-100">
              {selectedUsage.recommendationText}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedUsage.recommendedProductIds.map(id => {
                const product = allProducts.find(p => p.id === id);
                if (!product) return null;
                return (
                  <div key={product.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                    <h4 className="font-bold text-zinc-900 mb-2">{product.name}</h4>
                    <p className="text-xs text-zinc-500 mb-6">{product.tagline}</p>
                    <button 
                      onClick={() => onProductClick(product.id)}
                      className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
                    >
                      바로 주문하기
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
