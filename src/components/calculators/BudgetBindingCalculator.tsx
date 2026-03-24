import React from 'react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { InfoCard } from './shared/InfoCard';

interface BudgetBindingCalculatorProps {
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
  description: string;
}

export const BudgetBindingCalculator: React.FC<BudgetBindingCalculatorProps> = ({
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
  pattern,
  description
}) => {
  const getOption = (name: string) => product.options.find(o => o.name === name);
  
  // Filter options to only render those present in product.options
  const optionsToRender = product.options.map(o => o.name);

  return (
    <div className="space-y-10">
      <InfoCard 
        title="작업 규격 안내"
        content={[
          "A4 (210x297mm) 고정",
          "별도 크기 선택 없음"
        ]}
      />

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {optionsToRender.map((optionName) => {
        const option = getOption(optionName);
        if (!option) return null;
        
        return (
          <OptionGroup key={option.name} label={option.name}>
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
                </button>
              ))}
            </div>
          </OptionGroup>
        );
      })}

      <InfoCard 
        title="제본 안내"
        content={description.split('\n')}
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
