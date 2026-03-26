import React from 'react';
import { Product } from '../../../types';
import { Lock } from 'lucide-react';

interface ProductIntroSectionProps {
  product: Product;
  isLocked?: boolean;
}

export const ProductIntroSection: React.FC<ProductIntroSectionProps> = ({ product, isLocked }) => {
  return (
    <div className="space-y-2 pb-6 border-b border-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.subCategory && (
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {product.subCategory}
            </span>
          )}
        </div>
        {isLocked && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded-full shadow-lg shadow-zinc-200">
            <Lock size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
        {product.name}
      </h2>
      {product.tagline && (
        <p className="text-sm text-zinc-500 font-medium">
          {product.tagline}
        </p>
      )}
    </div>
  );
};
