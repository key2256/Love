import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';

interface BusinessCardCalculatorProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedOptions: Record<string, string>;
  handleOptionChange: (name: string, value: string) => void;
  unitPrice: number;
  totalPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  onGenerate: () => void;
}

export const BusinessCardCalculator: React.FC<BusinessCardCalculatorProps> = ({
  product,
  quantity,
  setQuantity,
  selectedOptions,
  handleOptionChange,
  unitPrice,
  totalPrice,
  discountRate,
  estimatedDeliveryDate,
  onGenerate
}) => {
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* 1. Material Selection */}
      {product.options.filter(opt => opt.name.includes('용지')).map((option) => (
        <div key={option.name} className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <Layers className="w-4 h-4 text-zinc-400" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
              {option.name}
            </label>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {['기본 대중형', '고급 감성형', '내추럴/친환경형', '특수지/프리미엄형']
                .filter(group => {
                  if (product.id === 'bc-standard') return group === '기본 대중형';
                  if (product.id === 'bc-premium') return group !== '기본 대중형';
                  return true;
                })
                .map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedBusinessCardGroup(group)}
                    className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                      selectedBusinessCardGroup === group
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {group}
                  </button>
                ))}
            </div>

            {selectedBusinessCardGroup && (
              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {BUSINESS_CARD_MATERIALS.filter(m => m.group === selectedBusinessCardGroup).map((material) => {
                  const isSelected = selectedOptions[option.name] === `${material.name} ${material.weight}`;
                  return (
                    <button
                      key={material.id}
                      onClick={() => handleOptionChange(option.name, `${material.name} ${material.weight}`)}
                      className={`p-5 rounded-2xl border text-left transition-all relative group ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-white border-zinc-100 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                            {material.name}
                          </span>
                          <span className="ml-2 text-xs text-zinc-400 font-bold">{material.weight}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                          isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {material.recommendationLabel}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-500'}`}>
                        {material.features}
                      </p>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-emerald-100 space-y-2"
                        >
                          <div className="flex gap-2">
                            <span className="text-[10px] font-black text-emerald-600 uppercase shrink-0">추천용도:</span>
                            <span className="text-[10px] text-emerald-800/70">{material.recommendedUse}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-black text-amber-600 uppercase shrink-0">주의사항:</span>
                            <span className="text-[10px] text-amber-800/70">{material.precautions}</span>
                          </div>
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 2. Standard Options */}
      {product.options.filter(opt => {
        const normalizedName = opt.name.replace(/\s/g, '');
        if (opt.name.includes('용지')) return false;
        
        const handledByIconGrid = [
          '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
          '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
          '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', '접지방향', '접지형태', 
          '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
        ].includes(normalizedName);
        if (handledByIconGrid) return false;

        if (opt.visibleIf) {
          const parentVal = selectedOptions[opt.visibleIf.optionName];
          if (parentVal !== opt.visibleIf.value) return false;
        }

        return true;
      }).map((option) => (
        <div key={option.name} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
              {option.name}
            </label>
          </div>
          {option.type === 'text' ? (
            <input
              type="text"
              value={selectedOptions[option.name]}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
              placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
              className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {option.values?.map((val) => (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                    selectedOptions[option.name] === val.label
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                  }`}
                >
                  <span className="relative z-10">{val.label}</span>
                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                    <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                      {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <PostProcessingSection 
        product={product} 
        selectedOptions={selectedOptions} 
        handleOptionChange={handleOptionChange} 
        pattern="BUSINESS_CARD"
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="BUSINESS_CARD"
        customSize={{ width: '', height: '' }}
      />
      <OrderTitleSection />
      <FileUploadSection />
      <NotesSection product={product} />
      <ActionButtons onGenerate={onGenerate} />
    </div>
  );
};
