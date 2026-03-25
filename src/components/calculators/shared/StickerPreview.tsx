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
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-100 rounded-2xl border border-zinc-200">
      <div className="mb-4">
        <div className={`w-32 h-32 bg-white shadow-lg border border-zinc-300 flex items-center justify-center text-zinc-400 text-[10px] font-mono ${getShapeClass()}`}>
          {size}
        </div>
      </div>
      <div className="text-sm font-medium text-zinc-600 text-center">
        {shape} / {size} / {material}
      </div>
    </div>
  );
};
