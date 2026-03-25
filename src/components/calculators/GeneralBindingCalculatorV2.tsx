import React, { useState } from 'react';
import { Calculator, ShoppingCart, Info, CheckCircle2, ChevronRight, BookOpen, BookText, Layers, Scissors, Palette, FileText, Zap } from 'lucide-react';
import { Product } from '../../types';
import { BINDING_TYPES, SIZES, PRINT_OPTIONS } from '../../data/generalBindingData';
import { SummarySection } from './shared/SummarySection';
import { ActionButtons } from './shared/ActionButtons';

interface GeneralBindingCalculatorV2Props {
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
  pattern: string;
}

export const GeneralBindingCalculatorV2: React.FC<GeneralBindingCalculatorV2Props> = ({
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
  pattern
}) => {
  const [activeBinding, setActiveBinding] = useState(BINDING_TYPES[0].id);

  const handleBindingChange = (id: string) => {
    setActiveBinding(id);
    handleOptionChange('제본 방식', BINDING_TYPES.find(b => b.id === id)?.name || '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Options */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* 1. 기본 사양 */}
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <Zap className="text-emerald-500" />
            1. 기본 사양
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">규격 (사이즈)</label>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(s => (
                  <button key={s.label} className="p-4 border rounded-2xl font-bold hover:border-emerald-500">{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 인쇄 옵션 */}
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <Palette className="text-emerald-500" />
            2. 인쇄 옵션
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {PRINT_OPTIONS.map(opt => (
              <button key={opt.id} className="flex items-center gap-3 p-4 border rounded-2xl font-bold hover:border-emerald-500">
                <opt.icon /> {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 제본 / 용지 */}
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <BookOpen className="text-emerald-500" />
            3. 제본 / 용지
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BINDING_TYPES.map(b => (
              <button 
                key={b.id}
                onClick={() => handleBindingChange(b.id)}
                className={`p-6 border rounded-3xl text-left transition-all ${activeBinding === b.id ? 'border-emerald-500 bg-emerald-50' : 'hover:border-emerald-500'}`}
              >
                <b.icon className="mb-2 text-emerald-600" />
                <div className="font-black">{b.name}</div>
                <div className="text-xs text-zinc-500">{b.description}</div>
                <div className="text-[10px] text-emerald-600 mt-2">{b.pageRange}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Sticky Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <SummarySection 
            product={product} 
            selectedOptions={selectedOptions} 
            unitPrice={unitPrice} 
            totalPrice={totalPrice} 
            discountRate={discountRate} 
            estimatedDeliveryDate={estimatedDeliveryDate} 
            pattern={pattern}
            customSize={{ width: '', height: '' }}
          />
          <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
        </div>
      </div>
    </div>
  );
};
