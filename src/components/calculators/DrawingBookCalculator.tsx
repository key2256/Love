import React from 'react';
import { Box, Layers, Settings2, ShoppingCart, Palette, FileText, Scissors, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { OptionGroup } from './shared/OptionGroup';
import { CalculatorAccordion } from './shared/CalculatorAccordion';
import { 
  DRAWING_SIZE_ICONS, 
  DRAWING_COVER_ICONS, 
  DRAWING_PAPER_ICONS,
  FOLDING_DIRECTION_ICONS
} from './shared/constants';

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

  const renderOption = (optionName: string, type: 'card' | 'button' | 'swatch' = 'button') => {
    const option = getOption(optionName);
    if (!option) return null;

    if (type === 'swatch' && optionName === '스프링 색상') {
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
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-500'}`}>
                    {val.label}
                  </span>
                </button>
              );
            })}
          </div>
        </OptionGroup>
      );
    }

    if (type === 'card') {
      const iconMap = 
        optionName === '규격' ? DRAWING_SIZE_ICONS :
        optionName === '커버 종류' ? DRAWING_COVER_ICONS :
        optionName === '용지' ? DRAWING_PAPER_ICONS :
        optionName === '제본 방향' ? FOLDING_DIRECTION_ICONS : null;

      return (
        <OptionGroup key={option.name} label={option.name}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {option.values?.map((val) => {
              const isSelected = selectedOptions[option.name] === val.label;
              const iconKey = Object.keys(iconMap || {}).find(key => val.label.includes(key)) || val.label;
              const Icon = iconMap ? iconMap[iconKey] : Box;
              
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`group p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-zinc-100 text-zinc-400 hover:border-emerald-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-50 text-zinc-400'
                  }`}>
                    {typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : Icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-black ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
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
      description: '드로잉북의 규격과 제본 방향, 커버를 선택하세요.',
      icon: FileText,
      children: (
        <div className="space-y-8">
          {renderOption('규격', 'card')}
          {renderOption('제본 방향', 'card')}
          {renderOption('커버 종류', 'card')}
        </div>
      )
    },
    {
      id: 'material',
      title: '재질 및 옵션',
      description: '내지 용지와 스프링 색상을 선택하세요.',
      icon: Layers,
      children: (
        <div className="space-y-8">
          {renderOption('용지', 'button')}
          {renderOption('스프링 색상', 'swatch')}
        </div>
      )
    },
    {
      id: 'post',
      title: '후가공',
      description: '표지 코팅 등 완성도를 높이는 옵션을 선택하세요.',
      icon: Scissors,
      children: (
        <div className="space-y-8">
          {renderOption('표지 코팅', 'button')}
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
        pattern="DRAWING_BOOK"
        customSize={{ width: '', height: '' }}
      />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
