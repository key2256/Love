import React from 'react';
import { Box, Settings2, ShoppingCart, Palette, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { OptionGroup } from './shared/OptionGroup';
import { CalculatorAccordion } from './shared/CalculatorAccordion';
import { 
  DRAWING_SIZE_ICONS, 
  DRAWING_COVER_ICONS, 
  DRAWING_PAPER_ICONS,
  FOLDING_DIRECTION_ICONS
} from './shared/constants';
import { getIconForOption } from '../../lib/optionIcons';

interface DrawingBookCalculatorProps {
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

const SPRING_COLORS: Record<string, string> = {
  '검정': '#18181b',
  '하양': '#ffffff',
  '은색': '#d4d4d8',
  '금색': '#fbbf24'
};

export const DrawingBookCalculator: React.FC<DrawingBookCalculatorProps> = ({
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
  const getOption = (name: string) => product.options.find(o => o.name === name);

  const renderOption = (optionName: string) => {
    const option = getOption(optionName);
    if (!option) return null;

    if (option.visibleIf) {
      const parentVal = selectedOptions[option.visibleIf.optionName];
      if (parentVal !== option.visibleIf.value) return null;
    }

    const normalizedName = option.name.replace(/\s+/g, '');
    const exclusions = ['제작수량', '수량', '주문수량'];
    if (exclusions.includes(normalizedName)) return null;

    // 1. Color Swatches for Spring Color
    if (optionName === '스프링 색상') {
      return (
        <OptionGroup key={option.name} label={option.name}>
          <div className="flex flex-wrap gap-4">
            {option.values?.map((val) => {
              const isSelected = selectedOptions[option.name] === val.label;
              const colorHex = SPRING_COLORS[val.label] || '#e4e4e7';
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                    isSelected ? 'border-emerald-600 scale-110 shadow-lg' : 'border-zinc-200 hover:border-emerald-200'
                  }`}
                  style={{ backgroundColor: colorHex }}
                  >
                    {isSelected && (
                      <div className={`w-3 h-3 rounded-full ${val.label === '하양' ? 'bg-zinc-900' : 'bg-white'}`} />
                    )}
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-500'}`}>
                    {val.label}
                  </span>
                </button>
              );
            })}
          </div>
        </OptionGroup>
      );
    }

    // 2. Specialized Icons for Size, Cover, Paper, Direction
    const iconMap = 
      optionName === '규격' ? DRAWING_SIZE_ICONS :
      optionName === '커버 종류' ? DRAWING_COVER_ICONS :
      optionName === '용지' ? DRAWING_PAPER_ICONS :
      optionName === '제본 방향' ? FOLDING_DIRECTION_ICONS : null;

    if (iconMap) {
      return (
        <OptionGroup key={option.name} label={option.name}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {option.values?.map((val) => {
              const isSelected = selectedOptions[option.name] === val.label;
              // Handle partial matches for icons (e.g., "세로형 (상철)" -> "세로형")
              const iconKey = Object.keys(iconMap).find(key => val.label.includes(key)) || val.label;
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`group p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-white border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                  }`}>
                    {iconMap[iconKey] || <Box className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-black ${
                      isSelected ? 'text-emerald-900' : 'text-zinc-900'
                    }`}>
                      {val.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </OptionGroup>
      );
    }

    // 3. Default Grid for other options
    return (
      <OptionGroup key={option.name} label={option.name}>
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val: any) => {
            const Icon = getIconForOption(option.name, val.label);
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-50 text-zinc-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="relative z-10">{val.label}</span>
                {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                  <span className={`block text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                    {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
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
      title: '기본 구성',
      icon: Box,
      children: (
        <div className="space-y-8">
          {['규격', '제본 방향', '커버 종류'].map(name => renderOption(name))}
        </div>
      )
    },
    {
      id: 'paper',
      title: '용지 및 마감',
      icon: Palette,
      children: (
        <div className="space-y-8">
          {['용지', '표지 코팅', '스프링 색상'].map(name => renderOption(name))}
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
          <NotesSection product={product} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 bg-white p-4 sm:p-6 rounded-[2rem] border border-zinc-100 shadow-sm relative overflow-hidden">
      {/* Subtle Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-1">The Artist's Studio</h2>
            <p className="text-[10px] text-emerald-600 uppercase tracking-[0.2em] font-black">Premium Drawing Book Configuration</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Palette className="w-6 h-6" />
          </div>
        </div>

        <CalculatorAccordion sections={sections} />

        <SummarySection 
          product={product} 
          selectedOptions={selectedOptions} 
          unitPrice={unitPrice} 
          totalPrice={totalPrice} 
          discountRate={discountRate} 
          estimatedDeliveryDate={estimatedDeliveryDate} 
          pattern="DRAWING_BOOK"
          customSize={{ width: '', height: '' }}
        />
        
        <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
      </div>
    </div>
  );
};
