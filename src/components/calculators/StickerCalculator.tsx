import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Settings2, ShoppingCart, ChevronDown, ChevronUp, Info, Palette } from 'lucide-react';
import { Product, PAPER_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { SHAPE_ICONS, PRODUCT_CONFIG } from './shared/constants';
import { StickerPreview } from './shared/StickerPreview';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

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
  onAddToCart?: () => void;
  onSaveDraft?: () => void;
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
  onGenerate,
  onAddToCart,
  onSaveDraft
}) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('일반/기본 용지');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const config = PRODUCT_CONFIG[product.id];
  const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
  const materialOptionName = materialOption?.name;

  useEffect(() => {
    if (config) {
      setExpandedGroup(config.defaultGroup);
      const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
      if (materialOption && !selectedOptions[materialOption.name]) {
        const defaultMaterial = PAPER_MATERIALS.find(m => m.group === config.defaultGroup);
        if (defaultMaterial) {
          handleOptionChange(materialOption.name, defaultMaterial.name);
        }
      }
    }
  }, [product.id]);

  const renderOption = (option: any) => {
    // [Rule 3] Selection UI Type Grammar - Accordion + Card Style for Material
    if (option.name.includes('재질') || option.name.includes('용지')) {
      return (
        <div className="space-y-3">
          {(config?.groups || ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)']).map(group => {
            const materialsInGroup = PAPER_MATERIALS.filter(m => m.group === group);
            const isExpanded = expandedGroup === group;
            const hasSelectedInGroup = materialsInGroup.some(m => selectedOptions[option.name] === m.name);

            if (materialsInGroup.length === 0) return null;

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
                
                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                    {materialsInGroup.map((material) => {
                      const isSelected = selectedOptions[option.name] === material.name;
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
                          </div>
                          <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                            {material.shortDescription}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // [Rule 3] Selection UI Type Grammar - Icon Card Style for Shape
    if (option.name === '모양') {
      return (
        <div className="grid grid-cols-4 gap-3">
          {option.values?.map((val: any) => {
            const IconNode = SHAPE_ICONS[val.label] || <Info className="w-6 h-6" />;
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <div className={`${isSelected ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {IconNode}
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">{val.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (option.type === 'text') {
      return (
        <input
          type="text"
          value={selectedOptions[option.name]}
          onChange={(e) => handleOptionChange(option.name, e.target.value)}
          placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
        />
      );
    }

    // [Rule 3] Selection UI Type Grammar - 2-Column Buttons
    return (
      <div className="grid grid-cols-2 gap-3">
        {option.values?.map((val: any) => {
          const isSelected = selectedOptions[option.name] === val.label;
          return (
            <button
              key={val.label}
              onClick={() => handleOptionChange(option.name, val.label)}
              className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
              }`}
            >
              <span className="relative z-10">{val.label}</span>
              {/* [Rule 4] State Expression Wording Grammar */}
              {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                <span className={`block text-[10px] mt-1 opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // [Rule 1] Section Order Grammar
  const sections = [
    {
      id: 'basic',
      title: '기본 사양',
      description: '스티커의 모양과 규격을 선택해주세요.',
      icon: Box,
      children: (
        <div className="space-y-8">
          <StickerPreview selectedOptions={selectedOptions} />
          {product.options.filter(opt => opt.name === '모양' || (!opt.name.includes('재질') && !opt.name.includes('용지') && !['코팅', '귀돌이', '타공', '오시', '미싱', '접지'].some(n => opt.name.includes(n)) && !opt.visibleIf)).map((option) => (
            <OptionGroup key={option.name} label={option.name}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'material',
      title: '재질 및 옵션',
      description: '스티커가 제작될 용지 재질을 선택합니다.',
      icon: Palette,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지')).map((option) => (
            <OptionGroup key={option.name} label={option.name} icon={Layers}>
              {renderOption(option)}
            </OptionGroup>
          ))}
          {/* Dependent options */}
          {product.options.filter(opt => opt.visibleIf).map((option) => {
            const parentVal = selectedOptions[option.visibleIf!.optionName];
            if (parentVal !== option.visibleIf!.value) return null;
            return (
              <OptionGroup key={option.name} label={option.name}>
                {renderOption(option)}
              </OptionGroup>
            );
          })}
        </div>
      )
    },
    {
      id: 'postprocess',
      title: '후가공',
      description: '코팅 등 스티커의 완성도를 높이는 옵션입니다.',
      icon: Settings2,
      children: (
        <PostProcessingSection 
          product={product} 
          selectedOptions={selectedOptions} 
          handleOptionChange={handleOptionChange} 
          pattern="STICKER"
          expandedPostOption={expandedPostOption}
          setExpandedPostOption={setExpandedPostOption}
          materialOptionName={materialOptionName}
        />
      )
    },
    {
      id: 'order',
      title: '주문 정보',
      description: '제작 수량과 주문 제목을 입력해주세요.',
      icon: ShoppingCart,
      children: (
        <div className="space-y-8">
          <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
          <OrderTitleSection />
          <FileUploadSection />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <CalculatorAccordion sections={sections} />

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
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};

