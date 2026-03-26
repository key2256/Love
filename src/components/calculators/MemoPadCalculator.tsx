import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Layers, Check, AlertCircle, ShoppingCart, CheckCircle2, Scissors, Box } from 'lucide-react';
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
import { InfoCard } from './shared/InfoCard';

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

  const getPreviewDimensions = () => {
    const size = selectedOptions['사이즈'] || '90 x 90 mm';
    let w = 90, h = 90;
    
    if (size === '90 x 60 mm') { w = 90; h = 60; }
    else if (size === '40 x 90 mm') { w = 40; h = 90; }
    else if (size === '직접입력') {
      w = parseInt(customSize.width) || 90;
      h = parseInt(customSize.height) || 90;
    }

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

  const handleSizeChange = (val: string) => {
    handleOptionChange('사이즈', val);
    if (val === '90 x 60 mm') setOrientation('landscape');
    else if (val === '40 x 90 mm') setOrientation('portrait');
  };

  const dims = getPreviewDimensions();
  const isSquare = selectedOptions['사이즈'] === '90 x 90 mm' || 
                  (selectedOptions['사이즈'] === '직접입력' && customSize.width === customSize.height && customSize.width !== '');

  const getOption = (name: string) => product.options.find(o => o.name === name);

  const renderOption = (optionName: string, type: 'card' | 'button' = 'button') => {
    const option = getOption(optionName);
    if (!option) return null;

    if (type === 'card') {
      const iconMap = optionName === '모양 선택' ? SHAPE_ICONS : 
                     optionName === '사이즈' ? MEMO_SIZE_ICONS : null;

      return (
        <OptionGroup key={option.name} label={option.name}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {option.values?.map((val) => {
              const isSelected = selectedOptions[option.name] === val.label;
              const Icon = iconMap ? iconMap[val.label] : Box;
              
              return (
                <button
                  key={val.label}
                  onClick={() => optionName === '사이즈' ? handleSizeChange(val.label) : handleOptionChange(option.name, val.label)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-zinc-100 text-zinc-400 hover:border-emerald-200'
                  }`}
                >
                  <div className={`${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {typeof Icon === 'function' ? <Icon className="w-6 h-6" /> : Icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-center leading-tight">{val.label}</span>
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
      description: '메모지의 모양과 규격을 선택하세요.',
      icon: FileText,
      children: (
        <div className="space-y-8">
          {renderOption('모양 선택', 'card')}
          {renderOption('사이즈', 'card')}

          <AnimatePresence mode="wait">
            {!isSquare && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">방향 전환</span>
                  <span className="text-[8px] text-zinc-400 font-bold">가로/세로 비율 변경</span>
                </div>
                <div className="flex-1 flex p-1 bg-zinc-200/50 rounded-xl">
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      orientation === 'landscape' ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200/50' : 'text-zinc-500'
                    }`}
                  >
                    가로형
                  </button>
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      orientation === 'portrait' ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200/50' : 'text-zinc-500'
                    }`}
                  >
                    세로형
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

          <div className="relative h-40 bg-zinc-50 rounded-3xl overflow-hidden flex items-center justify-center border border-zinc-100 shadow-inner">
            <div className="absolute top-4 left-6">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">실시간 미리보기</p>
            </div>

            <div className="relative perspective-1000">
              {[...Array(Math.max(1, Math.floor(mmThickness / 2)))].map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 bg-zinc-200 border-b border-zinc-300 rounded-md shadow-sm"
                  style={{ 
                    transform: `translateY(${i * 2}px) translateZ(${-i * 2}px)`,
                    zIndex: -i,
                    width: dims.width * 0.5,
                    height: dims.height * 0.5
                  }}
                />
              ))}

              <motion.div 
                layout
                className="relative bg-white rounded-md shadow-lg border border-zinc-100 overflow-hidden flex flex-col"
                style={{ 
                  transform: `translateY(${-mmThickness}px)`,
                  width: dims.width * 0.5,
                  height: dims.height * 0.5
                }}
              >
                <div className="h-1 w-full bg-red-600/80" />
                <div className="flex-1 flex items-center justify-center" />
              </motion.div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'material',
      title: '재질 및 옵션',
      description: '메모지의 두께와 인쇄 방식을 선택하세요.',
      icon: Layers,
      children: (
        <div className="space-y-8">
          <InfoCard 
            title="기본 용지 사양"
            content="백색 모조지 70g (필기감이 우수하고 잉크 번짐이 적은 용지)"
          />
          {renderOption('두께', 'button')}
          {product.options.filter(opt => {
            const normalizedName = opt.name.replace(/\s/g, '');
            return !['제작수량', '수량', '주문수량', '모양 선택', '사이즈', '두께'].includes(normalizedName);
          }).map((option) => renderOption(option.name, 'button'))}
        </div>
      )
    },
    {
      id: 'post',
      title: '후가공',
      description: '추가적인 가공 옵션을 선택하세요.',
      icon: Scissors,
      children: (
        <div className="space-y-8">
          <InfoCard 
            content="메모지 상품은 기본적으로 떡제본(상단 풀칠) 마감으로 제작됩니다."
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
