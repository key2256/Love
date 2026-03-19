import React from 'react';
import { Droplets, Scissors, Layers, Sparkles, Crown, Zap, RotateCcw } from 'lucide-react';
import { PaperMaterial } from '../types';

interface PaperMaterialCardProps {
  material: PaperMaterial;
}

const PaperMaterialCard: React.FC<PaperMaterialCardProps> = ({ material }) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="aspect-[16/10] overflow-hidden bg-zinc-100 relative">
        <img 
          src={material.image || `https://picsum.photos/seed/${material.id}/400/300`} 
          alt={material.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black text-zinc-900 rounded-full shadow-sm border border-zinc-100">
            {material.weight}
          </span>
          {material.premium && (
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-sm flex items-center gap-1">
              <Crown size={10} /> PREMIUM
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h4 className="text-xl font-black text-zinc-900 mb-1">{material.name}</h4>
          <p className="text-sm text-emerald-600 font-bold">{material.shortDescription}</p>
        </div>
        
        <p className="text-xs text-zinc-500 leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">
          {material.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {material.waterproof && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <Droplets size={12} />
              <span className="text-[10px] font-bold">방수</span>
            </div>
          )}
          {material.tearResistant && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Scissors size={12} />
              <span className="text-[10px] font-bold">찢김방지</span>
            </div>
          )}
          {material.transparent && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
              <Layers size={12} />
              <span className="text-[10px] font-bold">투명</span>
            </div>
          )}
          {material.removable && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
              <RotateCcw size={12} />
              <span className="text-[10px] font-bold">리무버블</span>
            </div>
          )}
          {material.metal && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
              <Zap size={12} />
              <span className="text-[10px] font-bold">메탈</span>
            </div>
          )}
          {material.whiteInkRecommended && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
              <Sparkles size={12} />
              <span className="text-[10px] font-bold">화이트인쇄 권장</span>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-auto pt-4 border-t border-zinc-50">
          <div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">추천 용도</span>
            <p className="text-[11px] text-zinc-700 font-medium">{material.recommendedUse}</p>
          </div>
          {material.precautions && (
            <div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">주의사항</span>
              <p className="text-[10px] text-zinc-500 italic leading-relaxed">{material.precautions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperMaterialCard;
