import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS, BusinessCardPaperMaterial } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { WorkPrecautions } from './shared/WorkPrecautions';
import { FOLDING_DIRECTION_ICONS, FOLDING_TYPE_ICONS } from './constants';

interface BusinessCardCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
  selectedBusinessCardGroup: string | null;
  setSelectedBusinessCardGroup: (group: string | null) => void;
  expandedPostOption: string | null;
  setExpandedPostOption: (id: string | null) => void;
}

export const BusinessCardCalculator: React.FC<BusinessCardCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice,
  selectedBusinessCardGroup,
  setSelectedBusinessCardGroup,
  expandedPostOption,
  setExpandedPostOption
}) => {
  const pattern = product.id === 'bc-folded' ? 'FOLDED_BUSINESS_CARD' : 'BUSINESS_CARD';
  const materialGroups = Array.from(new Set(BUSINESS_CARD_MATERIALS.map(m => m.group)));
  const allowedGroups = product.id === 'bc-premium' 
    ? ['특수지/프리미엄형'] 
    : product.id === 'bc-standard' || product.id === 'bc-folded'
      ? ['기본 대중형', '고급 감성형', '내추럴/친환경형']
      : materialGroups;

  const filteredOptions = product.options.filter(opt => {
    const normalizedName = opt.name.replace(/\s/g, '');
    const handledByIconGrid = [
      '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
      '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
      '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', '접지방향', '접지형태', 
      '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
    ].includes(normalizedName);
    
    if (handledByIconGrid) return false;
    if (opt.name.includes('용지')) return false;
    
    if (opt.visibleIf) {
      const parentVal = selectedOptions[opt.visibleIf.optionName];
      if (parentVal !== opt.visibleIf.value) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-10">
      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {/* Material Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">용지 선택</label>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {allowedGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedBusinessCardGroup(group)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedBusinessCardGroup === group
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {BUSINESS_CARD_MATERIALS
            .filter(m => !selectedBusinessCardGroup || m.group === selectedBusinessCardGroup)
            .map((material) => {
              const isSelected = selectedOptions['용지'] === material.name;
              return (
                <button
                  key={material.name}
                  onClick={() => handleOptionChange('용지', material.name)}
                  className={`p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                      : 'bg-white border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
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
      </div>

      {/* Other Options */}
      <div className="space-y-8">
        {filteredOptions.map((option) => (
          <div key={option.name} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {option.name}
              </label>
            </div>
            {option.name === '접지 방향' ? (
              <div className="grid grid-cols-2 gap-3">
                {option.values?.map((val) => (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-white border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                    }`}>
                      {FOLDING_DIRECTION_ICONS[val.label]}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      selectedOptions[option.name] === val.label ? 'text-emerald-900' : 'text-zinc-500'
                    }`}>
                      {val.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : option.name === '접지 형태' ? (
              <div className="grid grid-cols-2 gap-3">
                {option.values?.map((val) => (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-white border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                    }`}>
                      {FOLDING_TYPE_ICONS[val.label]}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      selectedOptions[option.name] === val.label ? 'text-emerald-900' : 'text-zinc-500'
                    }`}>
                      {val.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {option.values?.map((val) => {
                  const isSelected = selectedOptions[option.name] === val.label;
                  return (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange(option.name, val.label)}
                      className={`py-4 px-6 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]'
                          : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
                      }`}
                    >
                      <span>{val.label}</span>
                      {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                        <span className={`text-[10px] opacity-70 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                          {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post Processing */}
      <PostProcessingSection 
        product={product}
        pattern="BUSINESS_CARD"
        selectedOptions={selectedOptions}
        handleOptionChange={handleOptionChange}
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      {product.id === 'bc-folded' && <WorkPrecautions />}

      <FileUploadSection />

      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern={pattern}
        customSize={{ width: '', height: '' }}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
