import React from 'react';

export const OrderTitleSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
        <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">주문제목</label>
      </div>
      <input 
        type="text" 
        placeholder="제목을 입력해 주세요."
        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
      />
    </div>
  );
};
