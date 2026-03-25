import React from 'react';
import { Box, Layers, Settings2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { OptionGroup } from './shared/OptionGroup';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

interface DefaultCalculatorProps {
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

export const DefaultCalculator: React.FC<DefaultCalculatorProps> = ({
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

    const normalizedName = option.name.replace(/\s/g, '');
    const exclusions = ['제작수량', '수량', '주문수량'];
    if (exclusions.includes(normalizedName)) return null;

    if (option.visibleIf) {
      const parentVal = selectedOptions[option.visibleIf.optionName];
      if (parentVal !== option.visibleIf.value) return null;
    }

    return (
      <OptionGroup key={option.name} label={option.name}>
        {option.type === 'text' ? (
          <input
            type="text"
            value={selectedOptions[option.name]}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
            placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
          />
        ) : (
          <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-3`}>
            {option.values?.map((val) => (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex items-center justify-between ${
                  selectedOptions[option.name] === val.label
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                <span className="relative z-10">{val.label}</span>
                {selectedOptions[option.name] === val.label && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
                {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                  <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                    {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </OptionGroup>
    );
  };

  const optionGroups = [
    {
      id: 'basic',
      title: '기본 사양 및 용지',
      icon: Box,
      filter: (o: any) => o.name.includes('용지') || o.name.includes('규격') || o.name.includes('사이즈')
    },
    {
      id: 'options',
      title: '상세 옵션',
      icon: Settings2,
      filter: (o: any) => !o.name.includes('용지') && !o.name.includes('규격') && !o.name.includes('사이즈')
    }
  ];

  const sections = [
    ...optionGroups.map(group => ({
      id: group.id,
      title: group.title,
      icon: group.icon,
      children: (
        <div className="space-y-8">
          {product.options
            .filter(group.filter)
            .map(o => renderOption(o.name, 2))}
        </div>
      )
    })),
    {
      id: 'order',
      title: '수량 및 주문 정보',
      icon: ShoppingCart,
      children: (
        <div className="space-y-8">
          <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
          <OrderTitleSection />
          <FileUploadSection />
          <NotesSection product={product} />
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
