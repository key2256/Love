import React from 'react';
import { FileText } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { SHAPE_ICONS } from './constants';

interface StickerCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
}

export const StickerCalculator: React.FC<StickerCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice
}) => {
  const filteredOptions = product.options.filter(opt => {
    const normalizedName = opt.name.replace(/\s/g, '');
    return !opt.name.includes('재질') && 
           !opt.name.includes('용지') && 
           !['재단방식', '코팅유무', '후가공옵션', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', '부분UV', '모양코팅', '제작수량', '수량', '주문수량'].includes(normalizedName);
  });

  return (
    <div className="space-y-10">
      {/* Quantity Section */}
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
            
            {option.name === '모양 선택' ? (
              <div className="grid grid-cols-2 gap-3">
                {option.values?.map((val) => (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-white border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                    }`}>
                      {SHAPE_ICONS[val.label]}
                    </div>
                    <div className="text-center">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        selectedOptions[option.name] === val.label ? 'text-emerald-900' : 'text-zinc-500'
                      }`}>
                        {val.label}
                      </span>
                      {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                        <span className={`block text-[9px] font-bold mt-0.5 ${
                          selectedOptions[option.name] === val.label ? 'text-emerald-600' : 'text-zinc-400'
                        }`}>
                          {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
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
                          : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
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
            )}
          </div>
        ))}
      </div>

      {/* File Upload */}
      <FileUploadSection />

      {/* Summary Section */}
      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern="STICKER"
        customSize={{ width: '', height: '' }}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
