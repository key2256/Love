import React from 'react';
import { FileText, ShoppingCart, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ActionButtonsProps {
  onGenerate: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate }) => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4">
      <button 
        onClick={onGenerate}
        className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
      >
        <FileText className="w-5 h-5 text-emerald-400" />
        <span>견적서 발행하기</span>
      </button>
      <div className="grid grid-cols-2 gap-4">
        <button className="py-4 bg-white border-2 border-zinc-900 text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
          <ShoppingCart className="w-4 h-4" />
          <span>장바구니</span>
        </button>
        <button className="py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100">
          <HelpCircle className="w-4 h-4" />
          <span>1:1 문의</span>
        </button>
      </div>
      <button className="w-full py-4 bg-zinc-100 text-zinc-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
        <CheckCircle2 className="w-4 h-4" />
        <span>바로구매</span>
      </button>
    </div>
  );
};
