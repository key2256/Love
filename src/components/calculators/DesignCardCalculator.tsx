import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, FileUp, FileText } from 'lucide-react';
import { Product, DESIGN_CARD_TEMPLATES } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';

interface DesignCardCalculatorProps {
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
}

export const DesignCardCalculator: React.FC<DesignCardCalculatorProps> = ({
  product,
  quantity,
  setQuantity,
  selectedOptions,
  handleOptionChange,
  unitPrice,
  totalPrice,
  discountRate,
  estimatedDeliveryDate,
  onGenerate
}) => {
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedOptions['수량']) {
      const qty = parseInt(selectedOptions['수량'].replace('매', '')) || 100;
      if (qty !== quantity) {
        setQuantity(qty);
      }
    }
  }, [selectedOptions['수량'], quantity, setQuantity]);

  return (
    <div className="space-y-10">
      {/* 1. Standard Options */}
      {product.options.filter(opt => {
        const normalizedName = opt.name.replace(/\s/g, '');
        const handledByIconGrid = [
          '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
          '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
          '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', '접지방향', '접지형태', 
          '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
        ].includes(normalizedName);
        if (handledByIconGrid) return false;

        const infoFields = ['이름', '직함', '연락처', '이메일', '주소/SNS', '로고 업로드', '요청사항'];
        if (infoFields.includes(opt.name)) return false;

        if (opt.visibleIf) {
          const parentVal = selectedOptions[opt.visibleIf.optionName];
          if (parentVal !== opt.visibleIf.value) return false;
        }

        return true;
      }).map((option) => (
        <div key={option.name} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
              {option.name}
            </label>
          </div>

          {option.name === '템플릿 카테고리' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {option.values?.map((val) => (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                      selectedOptions[option.name] === val.label
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                    }`}
                  >
                    <span className="relative z-10">{val.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {DESIGN_CARD_TEMPLATES.filter(t => t.category === selectedOptions['템플릿 카테고리']).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleOptionChange('템플릿 선택', template.id)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedOptions['템플릿 선택'] === template.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                        : 'border-zinc-100 hover:border-emerald-200'
                    }`}
                  >
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {selectedOptions['템플릿 선택'] === template.id && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-[2px]">
                      <p className="text-[9px] font-black text-white truncate text-center uppercase tracking-tighter">{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {option.name !== '템플릿 카테고리' && (
            option.type === 'text' ? (
              <input
                type="text"
                value={selectedOptions[option.name]}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
              />
            ) : (
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
            )
          )}
        </div>
      ))}

      <PostProcessingSection 
        product={product} 
        selectedOptions={selectedOptions} 
        handleOptionChange={handleOptionChange} 
        pattern="DESIGN_CARD"
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      <div className="space-y-8 pt-8 border-t border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">명함 정보 입력</h4>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Business Card Information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.options.filter(opt => 
            ['이름', '직함', '연락처', '이메일', '주소/SNS', '로고 업로드', '요청사항'].includes(opt.name)
          ).map((option) => (
            <div key={option.name} className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{option.name}</label>
              {option.name === '로고 업로드' ? (
                <div className="relative group">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleOptionChange('로고 업로드', file.name);
                    }}
                  />
                  <label 
                    htmlFor="logo-upload"
                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold text-sm outline-none cursor-pointer group-hover:border-emerald-200 transition-all flex items-center justify-between"
                  >
                    <span className={selectedOptions['로고 업로드'] ? 'text-zinc-900' : 'text-zinc-400'}>
                      {selectedOptions['로고 업로드'] || option.placeholder}
                    </span>
                    <FileUp className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedOptions[option.name]}
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  placeholder={option.placeholder}
                  className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="DESIGN_CARD"
        customSize={{ width: '', height: '' }}
      />
      <OrderTitleSection />
      <FileUploadSection />
      <NotesSection product={product} />
      <ActionButtons onGenerate={onGenerate} />
    </div>
  );
};
