import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingCart, CheckCircle2, Zap, ArrowRight, Plus, Clock } from 'lucide-react';
import { SocialShare } from './SocialShare';
import { CATEGORIES } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const categoryName = CATEGORIES.find(c => c.id === product.category)?.name || product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
      onClick={() => onClick(product.id)}
      className="group cursor-pointer bg-white rounded-[40px] border border-zinc-100 overflow-hidden hover:border-emerald-200 hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] transition-all duration-500"
    >
      <div className="aspect-[4/5] overflow-hidden bg-zinc-50 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black text-zinc-900 rounded-full uppercase tracking-widest shadow-sm border border-white/20">
              {categoryName}
            </span>
            {product.isNew && (
              <span className="px-4 py-1.5 bg-zinc-900 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                <Zap size={10} fill="currentColor" />
                NEW
              </span>
            )}
          </div>
          {product.minQuantity === 1 && (
            <span className="px-4 py-1.5 bg-emerald-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-sm self-start">
              1개부터 주문 가능
            </span>
          )}
        </div>

        {/* Share Button */}
        <div className="absolute top-6 right-6 z-10" onClick={(e) => e.stopPropagation()}>
          <SocialShare title={product.name} className="scale-75 origin-right" />
        </div>

        {/* Hover Overlay Actions - Desktop */}
        <div className="absolute inset-0 bg-emerald-900/10 transition-opacity duration-500 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center">
          <div className="flex flex-col gap-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-8 md:p-10">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-2xl font-black text-zinc-900 tracking-tight group-hover:text-emerald-600 transition-colors leading-tight">
              {product.name}
            </h3>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-zinc-900 block">
                {product.basePrice.toLocaleString()}원
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">예상 견적</span>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            {product.tagline}
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.badges.map((badge, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-500 rounded-lg uppercase tracking-wider">
                  {badge}
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {product.features.slice(0, 4).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">제작 기간</span>
            <span className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-400" />
              {product.leadTime}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="md:hidden w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
            >
              <Plus size={20} />
            </button>
            <div className="flex items-center gap-2 text-zinc-900 font-black text-xs group-hover:text-emerald-600 transition-colors">
              상세보기
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
