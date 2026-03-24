import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_ITEMS, CATEGORIES } from '../types';
import { Search, Filter, ArrowRight, ChevronLeft } from 'lucide-react';

interface PortfolioProps {
  onBack?: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = PORTFOLIO_ITEMS.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.finishing.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group mb-12"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">이전으로</span>
          </button>
        )}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 tracking-tight">제작 사례</h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            완두프린트가 제작한 다양한 실제 사례들을 확인해 보세요. 카테고리, 재질, 후가공별로 검색이 가능합니다.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="재질, 후가공, 상품명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', ...CATEGORIES.map(c => c.id)].map(id => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`px-8 py-4 rounded-[20px] text-sm font-bold whitespace-nowrap transition-all border ${
                  activeFilter === id
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20'
                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {id === 'all' ? '전체' : CATEGORIES.find(c => c.id === id)?.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden mb-6 relative bg-zinc-100 border border-zinc-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <p className="text-white/80 text-sm font-medium mb-2">{item.description}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                        {item.material}
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                        {item.finishing}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {CATEGORIES.find(c => c.id === item.category)?.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-bold text-zinc-400">{item.subCategory}</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-zinc-400 font-medium">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
