import React from 'react';
import { Hash, Minus, Plus } from 'lucide-react';
import { Product } from '../../../types';
import { motion } from 'motion/react';

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
  const handleDecrement = () => {
    setQuantity(Math.max(product.minQuantity, quantity - 1));
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setQuantity(Math.max(product.minQuantity, val));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
          <Hash className="w-4 h-4 text-zinc-400" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">주문 수량</label>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-emerald-700">최소 {product.minQuantity}개부터</span>
        </div>
      </div>

      <div className="relative group">
        <div className="flex items-center p-2 bg-zinc-50 border border-zinc-200 rounded-[24px] transition-all duration-300 group-focus-within:border-emerald-500 group-focus-within:ring-4 group-focus-within:ring-emerald-500/10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDecrement}
            disabled={quantity <= product.minQuantity}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              quantity <= product.minQuantity 
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' 
                : 'bg-white text-zinc-900 shadow-sm hover:bg-zinc-900 hover:text-white border border-zinc-100'
            }`}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 relative">
            <input 
              type="number" 
              min={product.minQuantity}
              value={quantity}
              onChange={handleInputChange}
              className="w-full bg-transparent border-none outline-none text-center font-black text-2xl text-zinc-900 placeholder-zinc-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500/20 rounded-full" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleIncrement}
            className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-900/20 hover:bg-emerald-600 hover:shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[10, 50, 100].map(add => (
          <motion.button 
            key={add}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setQuantity(prev => prev + add)}
            className="group relative py-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-600 text-xs font-black hover:border-emerald-500 hover:text-emerald-600 transition-all overflow-hidden"
          >
            <span className="relative z-10">+{add.toLocaleString()}개</span>
            <div className="absolute inset-0 bg-emerald-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
