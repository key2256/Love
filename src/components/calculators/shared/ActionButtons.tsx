import React from 'react';
import { FileText, ShoppingCart, HelpCircle, CheckCircle2, Bookmark } from 'lucide-react';

interface ActionButtonsProps {
  onGenerate: (customSize?: { width: string; height: string }) => void;
  onAddToCart?: () => void;
  onSaveDraft?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate, onAddToCart, onSaveDraft }) => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4">
      <button 
        onClick={() => onGenerate()}
        className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
      >
        <FileText className="w-5 h-5" />
        <span>견적서 발행하기</span>
      </button>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onAddToCart}
          className="py-4 bg-white border-2 border-zinc-200 text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-zinc-300 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>장바구니</span>
        </button>
        <button 
          onClick={onSaveDraft}
          className="py-4 bg-white border-2 border-zinc-200 text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-zinc-300 transition-all"
        >
          <Bookmark className="w-4 h-4" />
          <span>임시저장</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="py-4 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-zinc-300 transition-all">
          <HelpCircle className="w-4 h-4" />
          <span>1:1 문의</span>
        </button>
        <button className="py-4 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all">
          <CheckCircle2 className="w-4 h-4" />
          <span>바로구매</span>
        </button>
      </div>
    </div>
  );
};
