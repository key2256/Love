import React from 'react';
import { Box, Settings2, ShoppingCart, Info } from 'lucide-react';
import { Product } from '../../types';
import { PromoProductPreview } from './PromoProductPreview';
import { PromoProductIcon } from '../ui/PromoProductIcon';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { OptionGroup } from './shared/OptionGroup';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

interface PromotionalCalculatorProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: any) => void;
  unitPrice: number;
  totalPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  onGenerate: () => void;
  onAddToCart: () => void;
  onSaveDraft: () => void;
  pattern: string;
}

export const PromotionalCalculator: React.FC<PromotionalCalculatorProps> = ({ 
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
  const renderOption = (option: any) => {
    return (
      <OptionGroup key={option.name} label={option.name}>
        {option.type === 'select' && (
          <select
            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
            value={selectedOptions[option.name] || ''}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
          >
            <option value="">선택하세요</option>
            {option.values?.map((v: any) => (
              <option key={v.label} value={v.label}>{v.label}</option>
            ))}
          </select>
        )}
        {option.type === 'radio' && (
          <div className="grid grid-cols-2 gap-3">
            {option.values?.map((v: any) => (
              <button
                key={v.label}
                onClick={() => handleOptionChange(option.name, v.label)}
                className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left ${
                  selectedOptions[option.name] === v.label
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        {option.type === 'text' && (
          <input
            type="text"
            placeholder={option.placeholder}
            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
            value={selectedOptions[option.name] || ''}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
          />
        )}
      </OptionGroup>
    );
  };

  const sections = [
    {
      id: 'preview',
      title: '상품 미리보기',
      icon: Info,
      children: (
        <div className="bg-white p-6 rounded-2xl border border-zinc-100">
          <PromoProductPreview product={product} selectedOptions={selectedOptions} />
        </div>
      )
    },
    {
      id: 'options',
      title: '상세 옵션',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {product.options.map(renderOption)}
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
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
        <PromoProductIcon subCategory={product.subCategory} className="w-12 h-12 text-emerald-600" />
        <div>
          <h2 className="text-xl font-black tracking-tight">{product.name}</h2>
          <p className="text-zinc-500 text-sm">{product.tagline}</p>
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
        pattern={pattern}
        customSize={{ width: '', height: '' }}
      />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};

export default PromotionalCalculator;
