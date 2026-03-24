import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircle, FileText, Truck, Clock, AlertCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, category, isOpen, onToggle }) => {
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
            {category}
          </span>
          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
            {question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-emerald-600' : 'text-zinc-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-zinc-600 leading-relaxed font-medium whitespace-pre-line">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: '주문/결제',
      question: '최소 주문 수량은 몇 개인가요?',
      answer: '상품마다 상이합니다. 스티커나 명함의 경우 1개부터 제작 가능한 상품이 있으며, 대량 생산이 필요한 상품은 기본 수량이 정해져 있습니다. 각 상품 상세 페이지의 견적 계산기에서 최소 수량을 확인하실 수 있습니다.'
    },
    {
      category: '제작/공정',
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '일반적인 인쇄물은 시안 확정 후 영업일 기준 2~4일 정도 소요됩니다. 후가공(박, 형압, 도송 등)이 포함된 경우 1~2일이 추가될 수 있습니다. 급한 일정의 경우 고객센터로 별도 문의 부탁드립니다.'
    },
    {
      category: '파일/디자인',
      question: '파일은 어떤 형식으로 보내야 하나요?',
      answer: '가장 권장하는 형식은 일러스트레이터(AI) 파일입니다. PDF, PSD, 고해상도 JPG 파일도 가능하지만, 인쇄 품질을 위해 모든 폰트는 아웃라인(Outline) 처리가 되어 있어야 하며 색상 모드는 CMYK로 작업해 주셔야 합니다.'
    },
    {
      category: '배송/수령',
      question: '배송비는 얼마인가요?',
      answer: '기본 배송비는 3,000원이며, 5만원 이상 구매 시 무료 배송 혜택을 드립니다. 도서산간 지역의 경우 추가 비용이 발생할 수 있습니다.'
    },
    {
      category: '배송/수령',
      question: '직접 방문 수령이 가능한가요?',
      answer: '네, 가능합니다. 일산 동구에 위치한 완두프린트 작업실에서 방문 수령이 가능하며, 주문 시 배송 방법을 "방문 수령"으로 선택해 주세요. 제작 완료 시 알림톡을 보내드립니다.'
    },
    {
      category: '제작/공정',
      question: '인쇄물 색상이 화면(모니터)과 달라요.',
      answer: '모니터는 빛의 3원색(RGB)을 사용하고, 인쇄는 색의 4원색(CMYK)을 사용하기 때문에 물리적인 색상 차이가 발생할 수밖에 없습니다. 또한 모니터의 설정값에 따라 다르게 보일 수 있으므로, 정확한 색상이 중요한 경우 팬톤(PANTONE) 컬러 지정이나 샘플 인쇄를 권장합니다.'
    },
    {
      category: '주문/결제',
      question: '재주문 시 색상이 똑같이 나오나요?',
      answer: '인쇄 시점의 온도, 습도, 기계 상태, 종이의 생산 로트(Lot)에 따라 약 5~10% 정도의 색상 편차가 발생할 수 있습니다. 이전 주문과 완벽하게 동일한 색상을 보장하기는 어려우나, 최대한 근접하게 맞추기 위해 노력하고 있습니다.'
    },
    {
      category: '파일/디자인',
      question: '디자인 의뢰도 가능한가요?',
      answer: '네, 전문 디자이너가 맞춤 디자인 서비스를 제공하고 있습니다. 간단한 편집부터 로고 디자인, 브랜딩까지 가능하며 디자인 비용은 작업 난이도에 따라 별도로 책정됩니다. 견적 문의 시 "디자인 의뢰" 항목을 체크해 주세요.'
    }
  ];

  const categories = ['전체', ...new Set(faqs.map(f => f.category))];
  const filteredFaqs = activeCategory === '전체' ? faqs : faqs.filter(f => f.category === activeCategory);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Reset expanded index when category changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setExpandedIndex(null);
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mb-6">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black mb-6 tracking-tight">자주 묻는 질문</h1>
        <p className="text-lg text-zinc-500">궁금하신 점을 빠르게 확인해 보세요. 해결되지 않는 문의는 고객센터로 연락주세요.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-12 overflow-x-auto pb-2 no-scrollbar justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeCategory === cat
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20'
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-[40px] border border-zinc-100 p-8 md:p-12 shadow-xl shadow-zinc-100/50">
        {filteredFaqs.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {filteredFaqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                {...faq} 
                isOpen={expandedIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 font-medium">해당 카테고리에 질문이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[32px] bg-zinc-900 text-white flex items-center gap-6 group cursor-pointer hover:bg-zinc-800 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">카카오톡 실시간 상담</h4>
            <p className="text-zinc-400 text-sm">평일 10:00 - 18:00 (주말/공휴일 휴무)</p>
          </div>
        </div>
        <div className="p-8 rounded-[32px] bg-emerald-600 text-white flex items-center gap-6 group cursor-pointer hover:bg-emerald-700 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">1:1 견적 문의하기</h4>
            <p className="text-emerald-100/70 text-sm">상세 사양을 남겨주시면 답변 드립니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
