import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingCart, CheckCircle2, Share2 } from 'lucide-react';
import { SocialShare } from './SocialShare';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      onClick={() => onClick(product.id)}
      className="group cursor-pointer bg-white rounded-[40px] border border-zinc-100 overflow-hidden hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-zinc-50 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black text-zinc-900 rounded-full uppercase tracking-widest shadow-sm">
            {product.category}
          </span>
          {product.minQuantity === 1 && (
            <span className="px-4 py-1.5 bg-emerald-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-sm">
              1개부터 주문 가능
            </span>
          )}
        </div>
        <div className="absolute top-6 right-6 z-10" onClick={(e) => e.stopPropagation()}>
          <SocialShare title={product.name} className="scale-75 origin-right" />
        </div>
        <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl scale-0 group-hover:scale-100 transition-transform duration-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className="p-10">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed italic font-serif">
            {product.tagline}
          </p>
        </div>
        
        <div className="space-y-3 mb-8">
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.badges.map((badge, i) => (
                <span key={i} className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-500 rounded-md uppercase tracking-wider">
                  {badge}
                </span>
              ))}
            </div>
          )}
          {product.features.slice(0, 2).map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">제작 기간</span>
            <span className="text-xs font-bold text-zinc-900">{product.leadTime}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block mb-1">예상 견적</span>
            <span className="text-xl font-black text-zinc-900">
              {product.basePrice.toLocaleString()}원 <span className="text-xs font-medium text-zinc-400">~</span>
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="py-3 bg-emerald-600 text-white text-[11px] font-black rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            담기
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(product.id);
            }}
            className="py-3 bg-zinc-900 text-white text-[11px] font-black rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            상세보기
          </button>
        </div>
      </div>
    </motion.div>
  );
};
