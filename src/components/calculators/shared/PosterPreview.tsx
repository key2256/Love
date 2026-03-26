import React from 'react';
import { Smartphone } from 'lucide-react';

interface PosterPreviewProps {
  selectedOptions: Record<string, string>;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({ selectedOptions }) => {
  const size = selectedOptions['사이즈'] || 'A3 (297x420)';
  
  // Simple aspect ratio calculation based on size
  const getAspectRatio = () => {
    if (size.includes('A3')) return 'aspect-[297/420]';
    if (size.includes('A2')) return 'aspect-[420/594]';
    if (size.includes('A1')) return 'aspect-[594/841]';
    return 'aspect-[297/420]';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm">
      <div className="flex items-end gap-6 mb-6">
        {/* Poster */}
        <div className={`w-32 ${getAspectRatio()} bg-white shadow-xl shadow-zinc-200 border border-zinc-200 flex items-center justify-center text-zinc-400 text-[10px] font-black tracking-widest`}>
          {size.split(' ')[0]}
        </div>
        {/* Comparison Object (Smartphone) */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-12 border-2 border-zinc-300 rounded-lg flex items-center justify-center">
            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">스마트폰</span>
        </div>
      </div>
      <div className="text-xs font-black text-zinc-900 uppercase tracking-widest bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
        {selectedOptions['용지 종류'] || '아트지 150g'} / {selectedOptions['코팅'] || '코팅 없음'}
      </div>
    </div>
  );
};
