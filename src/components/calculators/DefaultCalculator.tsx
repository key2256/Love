import React from 'react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';

interface DefaultCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
  pattern: string;
}

export const DefaultCalculator: React.FC<DefaultCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice,
  pattern
}) => {
  const filteredOptions = product.options.filter(opt => {
    const normalizedName = opt.name.replace(/\s/g, '');
    const generalExclusions = [
      '제작수량', '수량', '주문수량'
    ];
    if (generalExclusions.includes(normalizedName)) return false;
    if (opt.name.includes('용지')) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {/* Options Section */}
      <div className="space-y-8">
        {filteredOptions.map((option) => (
          <div key={option.name} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {option.name}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {option.values?.map((val) => {
                const isSelected = selectedOptions[option.name] === val.label;
                return (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`py-4 px-6 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]'
                        : 'bg-white border-zinc-100 text-zinc-500 hover:border-emerald-200'
                    }`}
                  >
                    <span>{val.label}</span>
                    {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                      <span className={`text-[10px] opacity-70 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                        {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <FileUploadSection />

      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern={pattern}
        customSize={{ width: '', height: '' }}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
