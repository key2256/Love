import React from 'react';
import { motion } from 'motion/react';
import { 
  StickyNote, 
  FileText, 
  Box, 
  Gift, 
  MessageSquare,
  LucideIcon 
} from 'lucide-react';
import { CATEGORIES } from '../types';

const iconMap: Record<string, LucideIcon> = {
  StickyNote,
  FileText,
  Box,
  Gift,
  MessageSquare,
};

interface CategorySectionProps {
  onSelectCategory: (id: string) => void;
  activeCategory: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory, activeCategory }) => {
  return (
    <section className="py-12 lg:py-24 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-20">
          <h2 className="text-2xl lg:text-4xl font-black text-zinc-900 mb-2 lg:mb-4 tracking-tight">주요 제작 품목</h2>
          <p className="text-xs lg:text-lg text-zinc-500 max-w-2xl mx-auto font-medium">
            원하시는 카테고리를 선택하여 다양한 제작 옵션을 확인해 보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
          {CATEGORIES.map((cat, idx) => {
            const Icon = iconMap[cat.icon] || StickyNote;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-6 lg:p-10 rounded-[24px] lg:rounded-[40px] border transition-all flex flex-col items-center text-center group ${
                  activeCategory === cat.id 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl lg:shadow-2xl shadow-emerald-600/20' 
                    : 'bg-zinc-50 border-zinc-100 text-zinc-900 hover:border-emerald-200 hover:bg-white'
                }`}
              >
                <div className={`w-12 h-12 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-4 lg:mb-8 transition-all group-hover:scale-110 ${
                  activeCategory === cat.id ? 'bg-white/20' : 'bg-white shadow-sm lg:shadow-md'
                }`}>
                  <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${activeCategory === cat.id ? 'text-white' : 'text-emerald-600'}`} strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-sm lg:text-xl mb-1 lg:mb-3 tracking-tight uppercase">{cat.name}</h3>
                <p className={`text-[8px] lg:text-[10px] font-black mb-2 lg:mb-4 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {cat.entryPhrase}
                </p>
                <p className={`text-[10px] lg:text-sm leading-relaxed font-medium line-clamp-2 ${
                  activeCategory === cat.id ? 'text-emerald-100' : 'text-zinc-400'
                }`}>
                  {cat.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
