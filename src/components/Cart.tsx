import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity,
  onCheckout,
  onClear
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">장바구니</h2>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {items.length}개의 품목
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={onClear}
                    className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    전체 삭제
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-zinc-900 truncate pr-4">{item.product.name}</h3>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-zinc-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium space-y-0.5 mb-3">
                        {Object.entries(item.options).map(([key, value]) => (
                          <p key={key}>{key}: {value}</p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-zinc-100 rounded-full p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(item.product.minQuantity || 1, item.quantity - 1))}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-zinc-500 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min={item.product.minQuantity || 1}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= (item.product.minQuantity || 1)) {
                                onUpdateQuantity(item.id, val);
                              }
                            }}
                            className="w-10 text-center text-xs font-bold text-zinc-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-zinc-500 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-black text-zinc-900">
                          {item.totalPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-[32px] bg-zinc-50 flex items-center justify-center text-zinc-200 mb-6">
                    <ShoppingCart className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">장바구니가 비어 있습니다</h3>
                  <p className="text-zinc-500 text-sm max-w-[200px]">
                    원하시는 상품을 담아 한 번에 견적을 받아보세요.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-zinc-100 bg-zinc-50/50">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">총 합계 금액</p>
                    <p className="text-3xl font-black text-zinc-900">
                      {totalAmount.toLocaleString()}원
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium">배송비 별도</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                >
                  전체 품목 견적 문의하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
