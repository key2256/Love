import React from 'react';

interface StickerPreviewProps {
  selectedOptions: Record<string, string>;
}

export const StickerPreview: React.FC<StickerPreviewProps> = ({ selectedOptions }) => {
  const shape = selectedOptions['모양'] || '원형';
  const size = selectedOptions['사이즈'] || '50x50mm';
  const material = selectedOptions['재질'] || '아트지';

  const getShapeClass = () => {
    switch (shape) {
      case '원형': return 'rounded-full';
      case '사각형': return 'rounded-none';
      case '타원형': return 'rounded-[50%/20%]';
      default: return 'rounded-none';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm">
      <div className="mb-6">
        <div className={`w-32 h-32 bg-white shadow-xl shadow-zinc-200 border border-zinc-200 flex items-center justify-center text-zinc-400 text-[10px] font-black tracking-widest ${getShapeClass()}`}>
          {size}
        </div>
      </div>
      <div className="text-xs font-black text-zinc-900 uppercase tracking-widest bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
        {shape} / {size} / {material}
      </div>
    </div>
  );
};
