import React from 'react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { InfoCard } from './shared/InfoCard';

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
  pattern
}) => {
  const getOption = (name: string) => product.options.find(o => o.name === name);
  
  const optionsToRender = [
    { name: '인쇄 색상', cols: 2 },
    { name: '표지 인쇄', cols: 2 },
    { name: '내지 인쇄', cols: 2 },
    { name: '표지 용지', cols: 3 },
    { name: '내지 용지', cols: 3 },
    { name: '페이지 수', cols: 2 },
    { name: '제본 방향', cols: 2 },
    { name: '스프링 색상', cols: 2 },
    { name: '표지 코팅', cols: 3 },
  ];

  return (
    <div className="space-y-10">
      <InfoCard 
        content="A4 (210x297mm) 고정 / 별도 크기 선택 없음"
      />

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {optionsToRender.map((optConfig) => {
        const option = getOption(optConfig.name);
        if (!option) return null;
        
        return (
          <OptionGroup key={option.name} label={option.name}>
            <div className={`grid grid-cols-2 md:grid-cols-${optConfig.cols} gap-3`}>
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
                </button>
              ))}
            </div>
          </OptionGroup>
        );
      })}

      <InfoCard 
        title="스프링제본"
        content={[
          "잘 펼쳐지고 필기하기 편한 방식",
          "문제집 / 학습자료 / 교안 / 프린트 묶음에 적합",
          "자주 넘겨보는 자료에 적합합니다"
        ]}
      />

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
      
      <OrderTitleSection />
      <FileUploadSection />
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} />
    </div>
  );
};
