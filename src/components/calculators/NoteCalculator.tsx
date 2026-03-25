import React from 'react';
import { Layers, Info, Book, Box, Settings2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { getIconForOption } from '../../lib/optionIcons';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { OptionGroup } from './shared/OptionGroup';
import { CalculatorAccordion } from './shared/CalculatorAccordion';
import { 
  NOTE_SIZE_ICONS, 
  NOTE_INNER_ICONS, 
  getNoteGroup,
  NOTE_GROUPS
} from './shared/constants';

interface NoteCalculatorProps {
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
  subPattern?: 'NOTE_SPIRAL' | 'NOTE_LEATHER' | 'NOTE_SADDLE';
}

export const NoteCalculator: React.FC<NoteCalculatorProps> = ({
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
  subPattern
}) => {
  const renderOption = (option: any) => {
    if (option.type === 'text') {
      return (
        <input
          type="text"
          value={selectedOptions[option.name]}
          onChange={(e) => handleOptionChange(option.name, e.target.value)}
          placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
        />
      );
    }

    if (option.name === '규격') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {option.values?.map((val: any) => {
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`group p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
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
                  {NOTE_SIZE_ICONS[val.label]}
                </div>
                <div className="text-center">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${
                    isSelected ? 'text-emerald-900' : 'text-zinc-500'
                  }`}>
                    {val.label.split(' ')[0]}
                  </p>
                  <p className={`text-[9px] font-bold ${
                    isSelected ? 'text-emerald-600' : 'text-zinc-400'
                  }`}>
                    {val.label.split(' ')[1]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    if (option.name === '내지 종류') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val: any) => {
            const isSelected = selectedOptions[option.name] === val.label;
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
                  {NOTE_INNER_ICONS[val.label]}
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
      );
    }

    if (option.name === '내지 색상') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val: any) => {
            const isSelected = selectedOptions[option.name] === val.label;
            const colorHex = val.label === '백색' ? '#FFFFFF' : '#F5F5DC';
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex items-center gap-3 ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full border ${isSelected ? 'border-white/30' : 'border-zinc-200'}`}
                  style={{ backgroundColor: colorHex }}
                />
                <span className="relative z-10">{val.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (option.name === '내지 장수' || option.name === '페이지 수') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {option.values?.map((val: any) => {
              const isSelected = selectedOptions[option.name] === val.label;
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`group p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-white border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                    }`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-black ${
                      isSelected ? 'text-emerald-900' : 'text-zinc-900'
                    }`}>
                      {val.label}
                    </span>
                  </div>
                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                    <span className={`text-[11px] font-bold ${
                      isSelected ? 'text-emerald-600' : 'text-zinc-400'
                    }`}>
                      {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {option.name === '페이지 수' && (
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 px-2">
              <Info className="w-3 h-3" />
              페이지 수는 4의 배수 기준으로 제작됩니다.
            </p>
          )}
        </div>
      );
    }

    if (option.name === '제본 안내') {
      return (
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Book className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900">중철 제본 안내</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saddle Stitch Binding</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 leading-relaxed">• 가운데 철심으로 고정되는 방식입니다.</p>
            <p className="text-xs text-zinc-600 leading-relaxed">• 얇은 노트, 소책자, 브랜드북 제작에 적합합니다.</p>
            <p className="text-xs text-emerald-600 font-bold leading-relaxed">• 페이지 수는 4의 배수(8p, 16p, 24p, 32p)로 제작됩니다.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {option.values?.map((val: any) => {
          const Icon = getIconForOption(option.name, val.label);
          return (
            <button
              key={val.label}
              onClick={() => handleOptionChange(option.name, val.label)}
              className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                selectedOptions[option.name] === val.label
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
              }`}
            >
              {Icon && <Icon className="w-6 h-6" />}
              <span className="relative z-10">{val.label}</span>
              {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                  {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const sections = [
    {
      id: 'basic',
      title: '외부 구성 및 규격',
      icon: Box,
      children: (
        <div className="space-y-8">
          {product.options.filter(o => getNoteGroup(o.name) === '외부 구성').map(option => (
            <OptionGroup key={option.name} label={option.name}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'inner',
      title: '내부 구성 및 내지',
      icon: Layers,
      children: (
        <div className="space-y-8">
          {product.options.filter(o => getNoteGroup(o.name) === '내부 구성').map(option => (
            <OptionGroup key={option.name} label={option.name}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'options',
      title: '후가공 및 제본',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {product.options.filter(o => {
            const group = getNoteGroup(o.name);
            const isHiddenSaddleOption = product.id === 'note-saddle' && (group === '후가공 선택' || group === '제본/마감');
            return (group === '후가공 선택' || group === '제본/마감') && !isHiddenSaddleOption;
          }).map(option => (
            <OptionGroup key={option.name} label={option.name}>
              {renderOption(option)}
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
        pattern="NOTE"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons 
        onGenerate={onGenerate} 
        onAddToCart={onAddToCart}
        onSaveDraft={onSaveDraft}
      />
    </div>
  );
};
