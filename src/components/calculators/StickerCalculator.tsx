import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Product, PAPER_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';

interface StickerCalculatorProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedOptions: Record<string, string>;
  handleOptionChange: (name: string, value: string) => void;
  unitPrice: number;
  totalPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  onGenerate: (customSize?: { width: string; height: string }) => void;
}

export const StickerCalculator: React.FC<StickerCalculatorProps> = ({
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
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>('일반/기본 용지');

  React.useEffect(() => {
    const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
    if (materialOption) {
      const selectedValue = selectedOptions[materialOption.name];
      const material = PAPER_MATERIALS.find(m => m.name === selectedValue);
      if (material) {
        setExpandedGroup(material.group);
      }
    }
  }, [selectedOptions, product.options]);

  return (
    <div className="space-y-10">
      {/* 1. Material Selection (Special UI for Stickers) */}
      {product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지')).map((option) => (
        <div key={option.name} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
              {option.name}
            </label>
          </div>
          <div className="space-y-3">
            {['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'].map(group => {
              const materialsInGroup = PAPER_MATERIALS.filter(m => m.group === group);
              if (materialsInGroup.length === 0) return null;

              const isExpanded = expandedGroup === group;
              const hasSelectedInGroup = materialsInGroup.some(m => selectedOptions[option.name] === m.name);

              return (
                <div key={group} className="border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50/50">
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : group)}
                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                      isExpanded ? 'bg-zinc-100' : 'hover:bg-zinc-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        hasSelectedInGroup ? 'text-emerald-600' : 'text-zinc-500'
                      }`}>
                        {group}
                      </span>
                      {hasSelectedInGroup && !isExpanded && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          {selectedOptions[option.name]}
                        </span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                          {materialsInGroup.map((material) => {
                            const isSelected = selectedOptions[option.name] === material.name;
                            const productOptionValue = option.values?.find(v => v.label === material.name);
                            
                            let priceModifier = productOptionValue?.priceModifier;
                            if (priceModifier === undefined) {
                              if (group === '일반/기본 용지') priceModifier = 0;
                              else if (group === '방수/합성지') priceModifier = 500;
                              else if (group === '투명/PET') priceModifier = 1500;
                              else if (group === '메탈/광택 특수 재질') priceModifier = 2000;
                              else if (group === '프리미엄 라벨(GMUND)') priceModifier = 3000;
                              else priceModifier = 0;
                            }
                            
                            return (
                              <button
                                key={material.id}
                                onClick={() => handleOptionChange(option.name, material.name)}
                                className={`group p-4 rounded-xl text-left border transition-all ${
                                  isSelected
                                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                    : 'bg-white border-zinc-100 hover:border-emerald-200 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                                    {material.name}
                                  </span>
                                  {priceModifier !== 0 && (
                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                      {priceModifier > 0 ? `+${priceModifier.toLocaleString()}원` : `${priceModifier.toLocaleString()}원`}
                                    </span>
                                  )}
                                </div>
                                {material.shortDescription && (
                                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                                    {material.shortDescription}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 2. Standard Options */}
      {product.options.filter(opt => {
        const normalizedName = opt.name.replace(/\s/g, '');
        if (opt.name.includes('재질') || opt.name.includes('용지')) return false;
        const exclusions = [
          '재단방식', '코팅유무', '후가공옵션', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', 
          '부분UV', '모양코팅', '제작수량', '수량', '주문수량'
        ];
        if (exclusions.includes(normalizedName)) return false;
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

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="STICKER"
        customSize={{ width: '', height: '' }}
      />
      <OrderTitleSection />
      <FileUploadSection />
      <NotesSection product={product} />
      <ActionButtons onGenerate={onGenerate} />
    </div>
  );
};
