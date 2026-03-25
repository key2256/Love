import React, { useState, useEffect } from 'react';
import { Box, Settings2, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../types';
import { getIconForOption } from '../../lib/optionIcons';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { OrderWizard } from './shared/OrderWizard';
import { PosterPreview } from './shared/PosterPreview';
import { MobileBottomSheet } from './shared/MobileBottomSheet';

interface PosterCalculatorProps {
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
  pattern: string;
}

export const PosterCalculator: React.FC<PosterCalculatorProps> = ({
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
  onSaveDraft,
  pattern
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getOption = (name: string) => product.options.find(o => o.name === name);
  
  const renderOption = (optionName: string, cols: number = 2) => {
    const option = getOption(optionName);
    if (!option) return null;

    return (
      <OptionGroup key={option.name} label={option.name}>
        <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-3`}>
          {option.values?.map((val) => {
            const Icon = getIconForOption(option.name, val.label);
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                  selectedOptions[option.name] === val.label
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                {Icon && <Icon className="w-6 h-6" />}
                <span className="relative z-10">{val.label}</span>
                {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                  <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                    {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </OptionGroup>
    );
  };

  const sections = [
    {
      id: 'basic',
      title: '기본 사양 선택',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {renderOption('사이즈', 3)}
          {renderOption('용지 종류', 3)}
          {renderOption('코팅', 3)}
        </div>
      )
    },
    {
      id: 'preview',
      title: '미리보기 확인',
      icon: Box,
      children: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-500 text-center">선택하신 옵션으로 제작될 포스터의 대략적인 형태입니다.</p>
          <PosterPreview selectedOptions={selectedOptions} />
        </div>
      )
    },
    {
      id: 'order',
      title: '수량 및 파일 업로드',
      icon: ShoppingCart,
      children: (
        <div className="space-y-8">
          <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
          <OrderTitleSection />
          <FileUploadSection />
        </div>
      )
    },
    {
      id: 'summary',
      title: '최종 견적 확인',
      icon: Check,
      children: (
        <div className="space-y-8">
          <SummarySection 
            product={product} 
            selectedOptions={selectedOptions} 
            unitPrice={unitPrice} 
            totalPrice={totalPrice} 
            discountRate={discountRate} 
            estimatedDeliveryDate={estimatedDeliveryDate} 
            pattern={pattern}
            customSize={{ width: '', height: '' }}
          />
          <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {isMobile ? (
        <div className="space-y-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setOpenSheet(section.id)}
              className="w-full p-6 bg-white border border-zinc-100 rounded-2xl flex items-center justify-between shadow-sm"
            >
              <span className="font-bold text-zinc-900">{section.title}</span>
              <Check className="w-5 h-5 text-emerald-500" />
            </button>
          ))}
          {sections.map(section => (
            <MobileBottomSheet
              key={section.id}
              isOpen={openSheet === section.id}
              onClose={() => setOpenSheet(null)}
              title={section.title}
            >
              {section.children}
            </MobileBottomSheet>
          ))}
        </div>
      ) : (
        <OrderWizard sections={sections} />
      )}
    </div>
  );
};
