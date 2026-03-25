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
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-100 rounded-2xl border border-zinc-200">
      <div className="flex items-end gap-4 mb-4">
        {/* Poster */}
        <div className={`w-32 ${getAspectRatio()} bg-white shadow-lg border border-zinc-300 flex items-center justify-center text-zinc-400 text-[10px] font-mono`}>
          {size.split(' ')[0]}
        </div>
        {/* Comparison Object (Smartphone) */}
        <div className="flex flex-col items-center gap-1">
          <Smartphone className="w-6 h-10 text-zinc-500" />
          <span className="text-[9px] text-zinc-400">스마트폰</span>
        </div>
      </div>
      <div className="text-sm font-medium text-zinc-600">
        {selectedOptions['용지 종류'] || '아트지 150g'} / {selectedOptions['코팅'] || '코팅 없음'}
      </div>
    </div>
  );
};
