import React from 'react';
import { Product } from '../../../types';

interface ProductIntroSectionProps {
  product: Product;
}

export const ProductIntroSection: React.FC<ProductIntroSectionProps> = ({ product }) => {
  return (
    <div className="space-y-2 pb-6 border-b border-zinc-100">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        {product.subcategory && (
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {product.subcategory}
          </span>
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
