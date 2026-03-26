import React from 'react';
import { Layers, Settings2, ShoppingCart, FileText, Scissors, CheckCircle2, BookOpen } from 'lucide-react';
import { Product } from '../../types';
import { getIconForOption } from '../../lib/optionIcons';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { InfoCard } from './shared/InfoCard';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

interface SewnBindingCalculatorProps {
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

export const SewnBindingCalculator: React.FC<SewnBindingCalculatorProps> = ({
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
  
  const renderOption = (optionName: string, type: 'card' | 'button' | 'swatch' = 'button') => {
    const option = getOption(optionName);
    if (!option) return null;

    if (type === 'card') {
      return (
        <OptionGroup key={option.name} label={option.name}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {option.values?.map((val) => {
              const Icon = getIconForOption(option.name, val.label);
              const isSelected = selectedOptions[option.name] === val.label;
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-zinc-100 text-zinc-400 hover:border-emerald-200'
                  }`}
                >
                  <div className={`${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {Icon ? <Icon className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">{val.label}</span>
                </button>
              );
            })}
          </div>
        </OptionGroup>
      );
    }

    return (
      <OptionGroup key={option.name} label={option.name}>
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val) => {
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="relative z-10">{val.label}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white/70" />}
                </div>
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
      </OptionGroup>
    );
  };

  const sections = [
    {
      id: 'basic',
      title: '기본 사양',
      description: '책의 규격과 제본 방향, 페이지 수를 선택하세요.',
      icon: FileText,
      children: (
        <div className="space-y-8">
          <InfoCard 
            content="본 상품은 A4 (210x297mm) 규격 전용 상품입니다."
          />
          {renderOption('제본 방향', 'card')}
          {renderOption('페이지 수', 'button')}
        </div>
      )
    },
    {
      id: 'material',
      title: '재질 및 옵션',
      description: '표지와 내지의 용지 및 인쇄 방식을 선택하세요.',
      icon: Layers,
      children: (
        <div className="space-y-8">
          {renderOption('표지 용지', 'button')}
          {renderOption('내지 용지', 'button')}
          {renderOption('인쇄 색상', 'button')}
          {renderOption('표지 인쇄', 'button')}
          {renderOption('내지 인쇄', 'button')}
        </div>
      )
    },
    {
      id: 'post',
      title: '후가공',
      description: '표지 코팅 등 완성도를 높이는 옵션을 선택하세요.',
      icon: Scissors,
      children: (
        <div className="space-y-8">
          {renderOption('표지 코팅', 'button')}
          <InfoCard 
            title="실제본 안내"
            content={[
              "실로 묶는 전통적인 방식의 제본입니다.",
              "감성적인 자료집, 보관용 책자, 정성스러운 제작물에 가장 적합합니다.",
              "일반 제본보다 제작 공정이 섬세하며 완성도가 높습니다."
            ]}
          />
        </div>
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
        pattern={pattern}
        customSize={{ width: '', height: '' }}
      />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
