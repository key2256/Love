import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shapes, 
  Layers, 
  Scissors, 
  Droplets, 
  Paintbrush, 
  FileUp, 
  ShoppingCart, 
  Package,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../../../types';

interface PostProcessingSectionProps {
  product: Product;
  pattern: string;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  expandedPostOption: string | null;
  setExpandedPostOption: (id: string | null) => void;
  POSTCARD_CONFIG?: any;
}

export const PostProcessingSection: React.FC<PostProcessingSectionProps> = ({
  product,
  pattern,
  selectedOptions,
  handleOptionChange,
  expandedPostOption,
  setExpandedPostOption,
  POSTCARD_CONFIG
}) => {
  const config = pattern === 'POSTCARD' ? POSTCARD_CONFIG?.[product.id] : null;

  const postProcessingItems = [
    { 
      id: 'shape-cutting', 
      name: '모양커팅', 
      icon: <Shapes className="w-5 h-5" />, 
      active: true, 
      hidden: !config?.allowedPostProcessing?.includes('모양커팅')
    },
    { 
      id: 'coating', 
      name: '코팅', 
      icon: <Layers className="w-5 h-5" />, 
      active: selectedOptions['코팅'] !== '없음', 
      hidden: product.id === 'bc-premium' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('코팅'))
    },
    { 
      id: 'rounding', 
      name: '귀돌이', 
      icon: <Scissors className="w-5 h-5" />, 
      active: selectedOptions['귀돌이'] === '있음',
      hidden: config?.allowedPostProcessing && !config.allowedPostProcessing.includes('귀돌이')
    },
    { 
      id: 'punching', 
      name: '타공', 
      icon: <Droplets className="w-5 h-5" />, 
      active: selectedOptions['타공'] === '있음', 
      hidden: pattern === 'DESIGN_CARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('타공'))
    },
    { 
      id: 'creasing', 
      name: '오시', 
      icon: <Paintbrush className="w-5 h-5" />, 
      active: selectedOptions['오시'] === '있음', 
      hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('오시'))
    },
    { 
      id: 'perforation', 
      name: '미싱', 
      icon: <Scissors className="w-5 h-5" />, 
      active: selectedOptions['미싱'] === '있음', 
      hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('미싱'))
    },
    { 
      id: 'folding', 
      name: '접지', 
      icon: <FileUp className="w-5 h-5" />, 
      active: selectedOptions['접지'] === '있음', 
      hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('접지'))
    },
    { 
      id: 'packaging', 
      name: '포장', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      active: selectedOptions['폴리백 개별포장'] === '있음', 
      hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('폴리백 개별포장'))
    },
    { 
      id: 'case', 
      name: '케이스', 
      icon: <Package className="w-5 h-5" />, 
      active: selectedOptions['명함케이스'] !== '없음', 
      hidden: pattern === 'DESIGN_CARD' || pattern === 'POSTCARD'
    }
  ].filter(item => !item.hidden);

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            후가공 선택
          </label>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          아이콘을 클릭하여 상세 옵션 선택
        </span>
      </div>

      <div className="bg-zinc-50/50 rounded-[32px] p-6 border border-zinc-100 space-y-6">
        {/* Icon Grid */}
        <div className="grid grid-cols-4 gap-3">
          {postProcessingItems.map(item => {
            const isExpanded = expandedPostOption === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setExpandedPostOption(isExpanded ? null : item.id)}
                className={`flex flex-col items-center gap-2 group transition-all ${
                  isExpanded ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  isExpanded 
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                    : item.active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-white text-zinc-400 border border-zinc-100 group-hover:border-zinc-300'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                  isExpanded ? 'text-emerald-600' : item.active ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expanded Sub-options */}
        <AnimatePresence mode="wait">
          {expandedPostOption && (() => {
            const expandedOption = product.options.find(opt => {
              if (expandedPostOption === 'shape-cutting') return opt.name === '모양커팅';
              if (expandedPostOption === 'coating') return opt.name === '코팅';
              if (expandedPostOption === 'rounding') return opt.name === '귀돌이';
              if (expandedPostOption === 'punching') return opt.name === '타공';
              if (expandedPostOption === 'creasing') return opt.name === '오시';
              if (expandedPostOption === 'perforation') return opt.name === '미싱';
              if (expandedPostOption === 'folding') return opt.name === '접지';
              if (expandedPostOption === 'packaging') return opt.name === '폴리백 개별포장';
              if (expandedPostOption === 'case') return opt.name === '명함케이스';
              return false;
            });

            if (!expandedOption) return null;

            return (
              <motion.div
                key={expandedPostOption}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-900">{expandedOption.name} 상세 설정</span>
                    {expandedOption.name !== '모양커팅' && (
                      <button 
                        onClick={() => handleOptionChange(expandedOption.name, expandedOption.name === '코팅' || expandedOption.name === '명함케이스' ? '없음' : '없음')}
                        className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {expandedOption.values?.map((val) => {
                      const isSelected = selectedOptions[expandedOption.name] === val.label;
                      return (
                        <button
                          key={val.label}
                          onClick={() => handleOptionChange(expandedOption.name, val.label)}
                          className={`py-3 px-4 rounded-xl text-[11px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {expandedOption.type === 'checkbox' && (
                              <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-white border-white' : 'border-zinc-300'
                              }`}>
                                {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                              </div>
                            )}
                            <span>{val.label}</span>
                          </div>
                          {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                            <span className={`text-[9px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                              {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};
