import React from 'react';
import { Hash } from 'lucide-react';
import { Product } from '../../../types';

interface QuantitySectionProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
}

export const QuantitySection: React.FC<QuantitySectionProps> = ({ 
  product, 
  quantity, 
  setQuantity 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <Hash className="w-4 h-4 text-zinc-400" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">주문 수량</label>
        </div>
        <span className="text-xs font-bold text-emerald-600">최소 {product.minQuantity}개부터</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))}
          className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-600 font-bold text-xl hover:bg-zinc-200 transition-colors"
        >
          -
        </button>
        <input 
          type="number" 
          min={product.minQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || 0))}
          className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-lg transition-colors h-[64px] text-center"
        />
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-600 font-bold text-xl hover:bg-zinc-200 transition-colors"
        >
          +
        </button>
      </div>
      <div className="flex gap-2">
        {[10, 50, 100].map(add => (
          <button 
            key={add}
            onClick={() => setQuantity(prev => prev + add)}
            className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-bold hover:bg-zinc-200 transition-colors"
          >
            +{add}
          </button>
        ))}
      </div>
    </div>
  );
};
