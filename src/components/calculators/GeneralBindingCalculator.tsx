import React, { useState, useEffect } from 'react';
import { Box, Layers, Settings2, ShoppingCart, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';

interface GeneralBindingCalculatorProps {
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

export const GeneralBindingCalculator: React.FC<GeneralBindingCalculatorProps> = ({
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
        <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-3`}>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Options */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <Settings2 className="text-emerald-500" />
            상품 옵션 선택
          </h3>
          <div className="space-y-8">
            {renderOption('규격(사이즈)', 3)}
            {renderOption('제본 방식', 2)}
            {renderOption('내지 용지', 2)}
            {renderOption('표지 용지', 2)}
            {renderOption('인쇄 방식', 2)}
            {renderOption('페이지 수', 3)}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <ShoppingCart className="text-emerald-500" />
            수량 및 주문 정보
          </h3>
          <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
          <OrderTitleSection />
          <FileUploadSection />
        </div>
      </div>

      {/* Right: Sticky Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
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
      </div>
    </div>
  );
};
