import React from 'react';
import { Layers, Info, Book, Box, Settings2, ShoppingCart, Palette, Ruler } from 'lucide-react';
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
  getNoteGroup
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

    // [Rule 3] Selection UI Type Grammar - Card Style for Size/Inner Type
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
                  {NOTE_SIZE_ICONS[val.label] || <Ruler className="w-6 h-6" />}
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
                    {val.label.split(' ')[1] || ''}
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
                  {NOTE_INNER_ICONS[val.label] || <Layers className="w-6 h-6" />}
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

    // [Rule 3] Selection UI Type Grammar - Swatch Style
    if (option.name === '내지 색상' || option.name === '스프링 색상' || option.name === '커버 스타일') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val: any) => {
            const isSelected = selectedOptions[option.name] === val.label;
            let colorHex = '#FFFFFF';
            if (option.name === '내지 색상') {
              colorHex = val.label === '백색' ? '#FFFFFF' : '#F5F5DC';
            } else if (option.name === '스프링 색상') {
              if (val.label === '실버') colorHex = '#C0C0C0';
              if (val.label === '블랙') colorHex = '#000000';
              if (val.label === '화이트') colorHex = '#FFFFFF';
            } else if (option.name === '커버 스타일') {
              if (val.label.includes('블랙')) colorHex = '#1A1A1A';
              if (val.label.includes('브라운')) colorHex = '#5D4037';
              if (val.label.includes('네이비')) colorHex = '#1A237E';
              if (val.label.includes('그린')) colorHex = '#1B5E20';
            }

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
                {/* [Rule 4] State Expression Wording Grammar */}
                {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                  <span className={`ml-auto text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                    추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    // [Rule 3] Selection UI Type Grammar - 2-Column Buttons
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {option.values?.map((val: any) => {
            const isSelected = selectedOptions[option.name] === val.label;
            const Icon = getIconForOption(option.name, val.label);
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
                    {Icon ? <Icon className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                  <span className={`text-sm font-black ${
                    isSelected ? 'text-emerald-900' : 'text-zinc-900'
                  }`}>
                    {val.label}
                  </span>
                </div>
                {/* [Rule 4] State Expression Wording Grammar */}
                {val.priceModifier !== undefined && val.priceModifier !== 0 ? (
                  <span className={`text-[11px] font-bold ${
                    isSelected ? 'text-emerald-600' : 'text-zinc-400'
                  }`}>
                    추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                  </span>
                ) : (
                  <span className={`text-[11px] font-bold ${
                    isSelected ? 'text-emerald-600' : 'text-zinc-400'
                  }`}>
                    기본 포함
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
        {option.name === '제본 안내' && (
          <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Book className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-900">제본 안내</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Binding Guide</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 leading-relaxed">• 선택하신 제본 방식에 맞춰 제작됩니다.</p>
              <p className="text-xs text-zinc-600 leading-relaxed">• 얇은 노트, 소책자, 브랜드북 제작에 적합합니다.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // [Rule 1] Section Order Grammar
  const sections = [
    {
      id: 'basic',
      title: '기본 사양',
      description: '노트의 규격과 형태를 선택해주세요.',
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
      id: 'material',
      title: '재질 및 옵션',
      description: '표지와 내지의 용지 및 세부 옵션을 설정합니다.',
      icon: Palette,
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
      id: 'postprocess',
      title: '후가공 및 제본',
      description: '코팅이나 제본 방식 등 마감 옵션을 선택하세요.',
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
      title: '주문 정보',
      description: '제작 수량과 인쇄용 파일을 확인해주세요.',
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
