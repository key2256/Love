import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Layers, Check, AlertCircle, Box, Settings2, ShoppingCart, Smartphone, PenTool } from 'lucide-react';
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
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  const getThicknessSheets = () => {
    const thickness = selectedOptions['두께'] || '';
    if (thickness.includes('80매')) return 80;
    if (thickness.includes('160매')) return 160;
    if (thickness.includes('240매')) return 240;
    return 100;
  };

  const sheets = getThicknessSheets();
  const mmThickness = sheets / 10;
  const stackHeight = mmThickness * 2; // Scale factor for visual representation

  const getPreviewDimensions = () => {
    const size = selectedOptions['사이즈'] || '90 x 90 mm';
    let w = 90, h = 90;
    
    if (size === '90 x 60 mm') { w = 90; h = 60; }
    else if (size === '40 x 90 mm') { w = 40; h = 90; }
    else if (size === '직접입력') {
      w = parseInt(customSize.width) || 90;
      h = parseInt(customSize.height) || 90;
    }

    // Apply orientation swap if needed
    // If it's square, orientation doesn't matter much visually but we respect the toggle
    if (orientation === 'portrait' && w > h) {
      [w, h] = [h, w];
    } else if (orientation === 'landscape' && h > w) {
      [w, h] = [h, w];
    }

    const max = Math.max(w, h, 1);
    const scale = 192 / max; 
    return {
      width: w * scale,
      height: h * scale,
      actualW: w,
      actualH: h
    };
  };

  const dims = getPreviewDimensions();

  const sections = [
    {
      id: 'basic',
      title: '기본 사양 및 규격',
      icon: Box,
      children: (
        <div className="space-y-8">
          {/* Integrated Preview Section */}
          <div className="relative aspect-square bg-zinc-100 rounded-[40px] overflow-hidden flex items-center justify-center p-12 border border-zinc-200/50 shadow-inner">
            {/* Scale Reference: Smartphone (Detailed) */}
            <div className="absolute left-8 bottom-8 opacity-40 transform -rotate-6 pointer-events-none transition-all duration-500">
              <div className="w-24 h-48 bg-zinc-800 rounded-[28px] border-[3px] border-zinc-700 relative shadow-2xl ring-1 ring-white/10">
                {/* Screen */}
                <div className="absolute inset-1 bg-zinc-900 rounded-[24px] overflow-hidden">
                  {/* Screen Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5" />
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-zinc-800 rounded-full" />
                  {/* Faint UI elements */}
                  <div className="absolute top-10 left-4 right-4 h-4 bg-zinc-800/50 rounded-full" />
                  <div className="absolute top-16 left-4 right-8 h-2 bg-zinc-800/30 rounded-full" />
                  {/* Bottom Bar */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-700/50 rounded-full" />
                </div>
                {/* Side Buttons */}
                <div className="absolute -left-[4px] top-12 w-[2px] h-6 bg-zinc-700 rounded-l-sm" />
                <div className="absolute -left-[4px] top-20 w-[2px] h-10 bg-zinc-700 rounded-l-sm" />
                <div className="absolute -right-[4px] top-16 w-[2px] h-8 bg-zinc-700 rounded-r-sm" />
              </div>
              <div className="mt-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Smartphone className="w-2 h-2 text-zinc-500" />
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Phone Scale</p>
                </div>
                <p className="text-[6px] font-bold text-zinc-400">70.6 x 146.6 mm</p>
              </div>
            </div>

            {/* Scale Reference: Coin Stack (Thickness Reference) */}
            <div className="absolute right-8 bottom-8 opacity-40 pointer-events-none flex flex-col items-center transition-all duration-500">
              <div className="relative">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-12 h-1.5 bg-gradient-to-b from-zinc-200 to-zinc-400 border-b border-zinc-500 rounded-full shadow-sm"
                    style={{ transform: `translateY(${-i * 1.5}px)` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Coin Stack</p>
                <p className="text-[6px] font-bold text-zinc-400 mt-0.5">~10mm height</p>
              </div>
            </div>

            {/* 3D Stack Preview */}
            <div className="relative group perspective-1000">
              {/* Thickness Rule Label */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-zinc-200 text-[8px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
                  10 Sheets = 1mm Rule
                </span>
              </div>

              {/* Stack Layers (Thickness) */}
              {[...Array(Math.max(1, Math.floor(mmThickness)))].map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 bg-white border-b border-zinc-200 rounded-lg shadow-sm"
                  style={{ 
                    transform: `translateY(${i * 1.5}px) translateZ(${-i * 1.5}px)`,
                    zIndex: -i,
                    width: dims.width,
                    height: dims.height,
                    opacity: 1 - (i * 0.05)
                  }}
                />
              ))}

              {/* Top Sheet */}
              <motion.div 
                layout
                className="relative bg-white rounded-lg shadow-2xl border border-zinc-100 overflow-hidden flex flex-col"
                style={{ 
                  transform: `translateY(${-stackHeight}px)`,
                  width: dims.width,
                  height: dims.height
                }}
              >
                {/* Top Glue Binding */}
                <div className="h-2 w-full bg-red-600/90 shadow-sm z-10" />
                
                {/* Content Area */}
                <div className="flex-1 relative p-4">
                  {/* Sample Content Placeholder */}
                  <div className="w-full h-full border-2 border-dashed border-zinc-100 rounded-md flex items-center justify-center">
                    <p className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.2em] rotate-[-45deg]">Your Design Here</p>
                  </div>
                </div>
              </motion.div>

              {/* Thickness Ruler */}
              <div className="absolute -right-20 top-0 bottom-0 flex flex-col justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-[1px] bg-zinc-400" />
                  <span className="text-[10px] font-black text-emerald-600 whitespace-nowrap">{mmThickness}mm</span>
                </div>
                <div className="flex-1 flex flex-col justify-evenly px-1">
                  {[...Array(Math.floor(mmThickness))].map((_, i) => (
                    <div key={i} className={`w-1 h-[1px] ${i % 5 === 0 ? 'bg-zinc-400 w-2' : 'bg-zinc-200'}`} />
                  ))}
                </div>
                <div className="w-3 h-[1px] bg-zinc-400" />
              </div>

              {/* Sheets Label */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap rotate-[-90deg]">{sheets} Sheets</span>
              </div>
            </div>
          </div>

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
                {product.options.find(o => o.name === '모양 선택')?.values?.map((val, index) => (
                  <button
                    key={val.label + index}
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
              <div className="space-y-6">
                {/* Orientation Toggle */}
                <div className="flex items-center justify-between p-1 bg-zinc-100 rounded-2xl w-full">
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                      orientation === 'landscape'
                        ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200'
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <div className="w-4 h-3 border-2 border-current rounded-sm" />
                    가로형 (Landscape)
                  </button>
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                      orientation === 'portrait'
                        ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200'
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <div className="w-3 h-4 border-2 border-current rounded-sm" />
                    세로형 (Portrait)
                  </button>
                </div>

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
                {product.options.find(o => o.name === '두께')?.values?.map((val, index) => {
                  const isSelected = selectedOptions['두께'] === val.label;
                  const [title, sheets] = val.label.split(' · ');
                  
                  return (
                    <button
                      key={val.label + index}
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
                {option.values?.map((val, index) => (
                  <button
                    key={val.label + index}
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
