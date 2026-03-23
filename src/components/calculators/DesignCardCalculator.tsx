import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, FileUp, CheckCircle2, Layout, Palette, Type, Settings } from 'lucide-react';
import { Product, DESIGN_CARD_TEMPLATES, Template } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { PostProcessingSection } from './shared/PostProcessingSection';

interface DesignCardCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
  expandedPostOption: string | null;
  setExpandedPostOption: (id: string | null) => void;
}

export const DesignCardCalculator: React.FC<DesignCardCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice,
  expandedPostOption,
  setExpandedPostOption
}) => {
  const categories = Array.from(new Set(DESIGN_CARD_TEMPLATES.map(t => t.category)));
  const selectedCategory = selectedOptions['템플릿 카테고리'] || categories[0];
  const filteredTemplates = DESIGN_CARD_TEMPLATES.filter(t => t.category === selectedCategory);

  const filteredOptions = product.options.filter(opt => {
    return !['코팅', '귀돌이', '귀돌이 크기', '귀돌이 면수', '귀돌이 방향', '템플릿 선택', '이름', '직함', '연락처', '이메일', '주소/SNS', '로고 업로드', '요청사항', '템플릿 카테고리', '제작수량', '수량', '주문수량'].includes(opt.name);
  });

  return (
    <div className="space-y-10">
      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {/* Template Selection */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Layout className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">템플릿 선택</h4>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Your Design</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleOptionChange('템플릿 카테고리', cat)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const isSelected = selectedOptions['템플릿 선택'] === template.id;
            return (
              <button
                key={template.id}
                onClick={() => handleOptionChange('템플릿 선택', template.id)}
                className={`group relative aspect-[1.6/1] rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-zinc-100 hover:border-zinc-200'
                }`}
              >
                <img 
                  src={template.image} 
                  alt={template.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity ${
                  isSelected ? 'from-emerald-900/80 via-emerald-900/20 to-transparent opacity-100' : 'from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                }`} />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{template.id}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Options */}
      <div className="space-y-8">
        {filteredOptions.map((option) => (
          <div key={option.name} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {option.name}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {option.values?.map((val) => {
                const isSelected = selectedOptions[option.name] === val.label;
                return (
                  <button
                    key={val.label}
                    onClick={() => handleOptionChange(option.name, val.label)}
                    className={`py-4 px-6 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]'
                        : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
                    }`}
                  >
                    <span>{val.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Post Processing */}
      <PostProcessingSection 
        product={product}
        pattern="DESIGN_CARD"
        selectedOptions={selectedOptions}
        handleOptionChange={handleOptionChange}
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      {/* Business Card Info */}
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

      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern="DESIGN_CARD"
        customSize={{ width: '', height: '' }}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
