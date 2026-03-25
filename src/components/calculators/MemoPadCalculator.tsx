import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Layers, Check, AlertCircle, Box, Settings2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { OptionGroup } from './shared/OptionGroup';
import { SHAPE_ICONS, MEMO_SIZE_ICONS } from './shared/constants';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

interface MemoPadCalculatorProps {
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
}

export const MemoPadCalculator: React.FC<MemoPadCalculatorProps> = ({
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
  onSaveDraft
}) => {
  const [customSize, setCustomSize] = useState({ width: '', height: '' });

  const sections = [
    {
      id: 'basic',
      title: '기본 사양 및 규격',
      icon: Box,
      children: (
        <div className="space-y-8">
          <OptionGroup label="기본 용지 사양" icon={FileText}>
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
          </OptionGroup>

          {product.options.find(o => o.name === '모양 선택') && (
            <OptionGroup label="모양 선택">
              <div className="grid grid-cols-2 gap-3">
                {product.options.find(o => o.name === '모양 선택')?.values?.map((val) => (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange('모양 선택', val.label)}
                    className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedOptions['모양 선택'] === val.label
                        ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-white border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      selectedOptions['모양 선택'] === val.label
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                    }`}>
                      {SHAPE_ICONS[val.label]}
                    </div>
                    <div className="text-center">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        selectedOptions['모양 선택'] === val.label ? 'text-emerald-900' : 'text-zinc-500'
                      }`}>
                        {val.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </OptionGroup>
          )}

          {product.options.find(o => o.name === '사이즈') && (
            <OptionGroup label="사이즈">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {product.options.find(o => o.name === '사이즈')?.values?.map((val) => {
                    const isSelected = selectedOptions['사이즈'] === val.label;
                    const [sizeText, unit] = val.label.split(' mm');
                    const subLabel = val.label === '90 x 90 mm' ? '정사각형' :
                                   val.label === '90 x 60 mm' ? '가로형' :
                                   val.label === '40 x 90 mm' ? '세로형' :
                                   val.label === '직접입력' ? '커스텀' : '';

                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange('사이즈', val.label)}
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
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {subLabel}
                          </p>
                          <div className="flex items-baseline justify-center gap-0.5">
                            <span className={`text-sm font-black ${
                              isSelected ? 'text-emerald-900' : 'text-zinc-900'
                            }`}>
                              {sizeText}
                            </span>
                            {unit !== undefined && (
                              <span className={`text-[10px] font-bold ${
                                isSelected ? 'text-emerald-600' : 'text-zinc-400'
                              }`}>
                                mm
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedOptions['사이즈'] === '직접입력' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-2"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">가로 (mm)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={customSize.width}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setCustomSize(prev => ({ ...prev, width: val }));
                            }}
                            placeholder="최대 90"
                            className={`w-full px-4 py-3 rounded-xl bg-white border font-bold text-sm outline-none transition-all ${
                              parseInt(customSize.width) > 90 ? 'border-red-500 text-red-600' : 'border-zinc-200 focus:border-emerald-500'
                            }`}
                          />
                          <span className="absolute right-4 top-3.5 text-xs font-bold text-zinc-400">mm</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">세로 (mm)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={customSize.height}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setCustomSize(prev => ({ ...prev, height: val }));
                            }}
                            placeholder="최대 90"
                            className={`w-full px-4 py-3 rounded-xl bg-white border font-bold text-sm outline-none transition-all ${
                              parseInt(customSize.height) > 90 ? 'border-red-500 text-red-600' : 'border-zinc-200 focus:border-emerald-500'
                            }`}
                          />
                          <span className="absolute right-4 top-3.5 text-xs font-bold text-zinc-400">mm</span>
                        </div>
                      </div>
                    </div>
                    {(parseInt(customSize.width) > 90 || parseInt(customSize.height) > 90) && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1.5 ml-1">
                        <AlertCircle className="w-3 h-3" />
                        직접입력은 최대 90 x 90mm 이하만 가능합니다.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </OptionGroup>
          )}
        </div>
      )
    },
    {
      id: 'options',
      title: '매수 및 상세 옵션',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {product.options.find(o => o.name === '두께') && (
            <OptionGroup label="두께 (매수)">
              <div className="grid grid-cols-1 gap-3">
                {product.options.find(o => o.name === '두께')?.values?.map((val) => {
                  const isSelected = selectedOptions['두께'] === val.label;
                  const [title, sheets] = val.label.split(' · ');
                  
                  return (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange('두께', val.label)}
                      className={`group p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                          : 'bg-white border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                        }`}>
                          <Layers className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-black ${
                            isSelected ? 'text-emerald-900' : 'text-zinc-900'
                          }`}>
                            {title}
                          </p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {sheets}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                          <p className={`text-xs font-black ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                          </p>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-200'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </OptionGroup>
          )}

          {product.options.filter(opt => {
            const normalizedName = opt.name.replace(/\s/g, '');
            return !['제작수량', '수량', '주문수량', '모양 선택', '사이즈', '두께'].includes(normalizedName);
          }).map((option) => (
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
                    {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                      <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                        {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </OptionGroup>
          ))}
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
        pattern="MEMO_PAD"
        customSize={customSize}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons 
        onGenerate={() => {
          if (selectedOptions['사이즈'] === '직접입력') {
            const w = parseInt(customSize.width) || 0;
            const h = parseInt(customSize.height) || 0;
            if (w > 90 || h > 90) {
              alert('직접입력 사이즈는 최대 90 x 90 mm 이하만 가능합니다.');
              return;
            }
          }
          onGenerate(customSize);
        }} 
        onAddToCart={onAddToCart}
        onSaveDraft={onSaveDraft}
      />
    </div>
  );
};
