import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { DESIGN_CARD_TEMPLATES, Template } from '../types';

interface TemplateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  categoryName: string;
}

export const TemplateCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSelect,
  categoryName 
}: TemplateCategoryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter templates by category if needed, but for now we'll show all or a subset
  // based on the category clicked. For "디자인 템플릿 명함", we might show all DESIGN_CARD_TEMPLATES.
  const templates = DESIGN_CARD_TEMPLATES;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320; // Width of card + gap
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                {categoryName} <span className="text-emerald-600">템플릿 선택</span>
              </h2>
              <p className="text-sm text-zinc-500 font-medium mt-1">
                원하는 디자인을 선택하여 쉽고 빠르게 제작해 보세요.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="relative group">
              {/* Navigation Buttons */}
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white shadow-xl border border-zinc-100 text-zinc-400 hover:text-emerald-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white shadow-xl border border-zinc-100 text-zinc-400 hover:text-emerald-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              >
                <ChevronRight size={24} />
              </button>

              {/* Carousel */}
              <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 px-2"
              >
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ y: -8 }}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <div className="bg-zinc-50 rounded-[24px] overflow-hidden border border-zinc-100 group/card transition-all hover:shadow-2xl hover:shadow-emerald-100/50">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => onSelect(template)}
                            className="bg-white text-zinc-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 group-hover/card:translate-y-0"
                          >
                            이 템플릿으로 시작하기
                          </button>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-zinc-900 text-lg mb-1">{template.name}</h3>
                        <p className="text-xs text-zinc-500 font-medium">ID: {template.id}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features/Info Section */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: '전문가 디자인', desc: '전문 디자이너가 제작한 고품격 템플릿' },
                { title: '간편한 편집', desc: '텍스트와 이미지만 바꾸면 바로 완성' },
                { title: '빠른 제작', desc: '디자인 고민 없이 즉시 주문 가능' },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Check size={20} className="text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 font-medium text-center sm:text-left">
              템플릿을 선택하시면 해당 디자인으로 편집할 수 있는 페이지로 이동합니다.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => onSelect(templates[0])}
                className="px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-zinc-200"
              >
                인기 템플릿으로 시작
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
