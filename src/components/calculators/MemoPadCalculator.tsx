import React from 'react';
import { FileText } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { MEMO_SIZE_ICONS } from './constants';

interface MemoPadCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
  customSize: { width: string; height: string };
  setCustomSize: (size: { width: string; height: string } | ((prev: { width: string; height: string }) => { width: string; height: string })) => void;
}

export const MemoPadCalculator: React.FC<MemoPadCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice,
  customSize,
  setCustomSize
}) => {
  const filteredOptions = product.options.filter(opt => {
    const normalizedName = opt.name.replace(/\s/g, '');
    const memoExclusions = [
      '후가공', '낱장 접착', '측면 인쇄', '엣지디자인', '거치대', '케이스',
      '제작수량', '수량', '주문수량'
    ];
    if (memoExclusions.includes(normalizedName)) return false;
    if (normalizedName === '용지') return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {/* Options Section */}
      <div className="space-y-8">
        {filteredOptions.map((option) => (
          <div key={option.name} className="space-y-4">
            {option.name === '두께' && (
              <div className="space-y-4 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                    기본 용지 사양
                  </label>
                </div>
                <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-900">백색 모조지 70g</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Fixed Specification</p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                      필기감이 우수하고 잉크 번짐이 적어<br />
                      메모지 제작에 가장 최적화된 용지입니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {option.name}
              </label>
            </div>
            
            {option.name === '사이즈' ? (
              <div className="grid grid-cols-2 gap-3">
                {option.values?.map((val) => {
                  const isSelected = selectedOptions[option.name] === val.label;
                  return (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange(option.name, val.label)}
                      className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                          : 'bg-white border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                          : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                      }`}>
                        {MEMO_SIZE_ICONS[val.label]}
                      </div>
                      <div className="text-center">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                          isSelected ? 'text-emerald-900' : 'text-zinc-500'
                        }`}>
                          {val.label}
                        </span>
                        {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                          <span className={`block text-[9px] font-bold mt-0.5 ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
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

            {option.name === '사이즈' && selectedOptions['사이즈'] === '직접입력' && (
              <div className="grid grid-cols-2 gap-4 p-6 rounded-3xl bg-zinc-50 border border-zinc-100 mt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">가로 (mm)</label>
                  <input 
                    type="number" 
                    value={customSize.width}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                    placeholder="최소 40"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-emerald-500 outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">세로 (mm)</label>
                  <input 
                    type="number" 
                    value={customSize.height}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="최소 40"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-emerald-500 outline-none font-bold text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <FileUploadSection />

      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern="MEMO_PAD"
        customSize={customSize}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
