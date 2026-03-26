import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Settings2, ShoppingCart, Info, Palette, Scissors, FileText, CheckCircle2 } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { PRODUCT_CONFIG } from './shared/constants';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

const TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '귀돌이': {
    description: '명함의 모서리를 둥글게 깎는 가공입니다. 부드러운 인상을 주며 모서리 마모를 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/corner/400/250'
  },
  '오시': {
    description: '종이가 잘 접히도록 누름 자국을 내는 가공입니다. 두꺼운 종이가 터지는 것을 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/crease/400/250'
  },
  '미싱': {
    description: '손으로 쉽게 뜯을 수 있도록 점선 모양의 구멍을 내는 가공입니다. 쿠폰이나 티켓에 주로 사용됩니다.',
    imageUrl: 'https://picsum.photos/seed/perforation/400/250'
  },
  '타공': {
    description: '종이에 구멍을 뚫는 가공입니다. 택(Tag)이나 고리를 걸 때 사용합니다.',
    imageUrl: 'https://picsum.photos/seed/hole/400/250'
  }
};

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
  onGenerate: (customSize?: { width: string; height: string }) => void;
  onAddToCart?: () => void;
  onSaveDraft?: () => void;
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
  onGenerate,
  onAddToCart,
  onSaveDraft
}) => {
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const config = PRODUCT_CONFIG[product.id];

  useEffect(() => {
    if (config) {
      setSelectedBusinessCardGroup(config.defaultGroup);
      const materialOption = product.options.find(opt => opt.name.includes('용지'));
      if (materialOption && !selectedOptions[materialOption.name]) {
        const defaultMaterial = BUSINESS_CARD_MATERIALS.find(m => m.group === config.defaultGroup);
        if (defaultMaterial) {
          handleOptionChange(materialOption.name, `${defaultMaterial.name} ${defaultMaterial.weight}`);
        }
      }

      if (!selectedOptions['명함케이스']) handleOptionChange('명함케이스', '없음');
      if (!selectedOptions['접지']) handleOptionChange('접지', '없음');
    }
  }, [product.id]);

  const renderOption = (option: any) => {
    const optionName = option.name;

    // 1. Card Style for Paper Groups
    if (optionName.includes('용지')) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(config?.groups || ['기본 대중형', '고급 감성형', '내추럴/친환경형', '특수지/프리미엄형'])
              .map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedBusinessCardGroup(group)}
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                    selectedBusinessCardGroup === group
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                  }`}
                >
                  {group}
                </button>
              ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {BUSINESS_CARD_MATERIALS.filter(m => m.group === selectedBusinessCardGroup).map((material) => {
              const isSelected = selectedOptions[option.name] === `${material.name} ${material.weight}`;
              return (
                <button
                  key={material.id}
                  onClick={() => handleOptionChange(option.name, `${material.name} ${material.weight}`)}
                  className={`p-5 rounded-2xl border text-left transition-all relative group ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
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
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-500'}`}>
                    {material.features}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. 2-Column Button Style for most options
    return (
      <div className="grid grid-cols-2 gap-3">
        {option.values?.filter((val: any) => val.label !== '직접입력').map((val: any, index: number) => {
          const isSelected = selectedOptions[option.name] === val.label;
          return (
            <button
              key={val.label + index}
              onClick={() => handleOptionChange(option.name, val.label)}
              className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col gap-1 ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
              }`}
            >
              <span className="relative z-10">{val.label}</span>
              {val.priceModifier !== undefined && val.priceModifier !== 0 ? (
                <span className={`block text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                </span>
              ) : (
                <span className={`block text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  기본 포함
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const sections = [
    {
      id: 'basic',
      title: '기본 사양',
      description: '명함의 규격과 인쇄 방식을 선택하세요.',
      icon: FileText,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => ['규격(mm)', '인쇄도수'].includes(opt.name)).map((option) => (
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
      description: '명함의 인상을 결정하는 용지와 케이스를 선택하세요.',
      icon: Layers,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => opt.name.includes('용지') || opt.name === '명함케이스').map((option) => (
            <OptionGroup key={option.name} label={option.name}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'post',
      title: '후가공',
      description: '특별함을 더하는 가공 옵션을 추가하세요.',
      icon: Scissors,
      children: (
        <PostProcessingSection 
          product={product} 
          selectedOptions={selectedOptions} 
          handleOptionChange={handleOptionChange} 
          pattern="BUSINESS_CARD"
          expandedPostOption={expandedPostOption}
          setExpandedPostOption={setExpandedPostOption}
        />
      )
    },
    {
      id: 'order',
      title: '주문 정보',
      description: '수량 확인 및 제작에 필요한 정보를 입력하세요.',
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
        pattern="BUSINESS_CARD"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
