import React from 'react';
import { Box, Layers, Settings2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { InfoCard } from './shared/InfoCard';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

interface SpringBindingCalculatorProps {
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

export const SpringBindingCalculator: React.FC<SpringBindingCalculatorProps> = ({
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
  const getOption = (name: string) => product.options.find(o => o.name === name);
  
  const renderOption = (optionName: string, cols: number = 2) => {
    const option = getOption(optionName);
    if (!option) return null;

    return (
      <OptionGroup key={option.name} label={option.name}>
        <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-3`}>
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
      </OptionGroup>
    );
  };

  const sections = [
    {
      id: 'basic',
      title: '기본 사양 및 용지',
      icon: Box,
      children: (
        <div className="space-y-8">
          <InfoCard 
            content="A4 (210x297mm) 고정 / 별도 크기 선택 없음"
          />
          {renderOption('표지 용지', 3)}
          {renderOption('내지 용지', 3)}
          {renderOption('페이지 수', 2)}
        </div>
      )
    },
    {
      id: 'options',
      title: '인쇄 및 제본 옵션',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {renderOption('인쇄 색상', 2)}
          {renderOption('표지 인쇄', 2)}
          {renderOption('내지 인쇄', 2)}
          {renderOption('제본 방향', 2)}
          {renderOption('스프링 색상', 2)}
          {renderOption('표지 코팅', 3)}
          <InfoCard 
            title="스프링제본"
            content={[
              "잘 펼쳐지고 필기하기 편한 방식",
              "문제집 / 학습자료 / 교안 / 프린트 묶음에 적합",
              "자주 넘겨보는 자료에 적합합니다"
            ]}
          />
        </div>
      )
    },
    {
      id: 'order',
      title: '수량 및 주문 정보',
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
        pattern={pattern}
        customSize={{ width: '', height: '' }}
      />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
