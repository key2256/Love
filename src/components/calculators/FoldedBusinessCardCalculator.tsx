import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';

interface FoldedBusinessCardCalculatorProps {
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

const FoldedPreview = ({ type, direction }: { type: string, direction: string }) => {
  const is3Fold = type === '3단 명함';
  const isVertical = direction === '세로형';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100"
    >
      <div className={`relative ${isVertical ? 'w-32 h-48' : 'w-48 h-32'} bg-white rounded-lg border-2 border-zinc-200 shadow-sm overflow-hidden flex transition-all duration-500`}>
        {isVertical ? (
          <div className="flex flex-col w-full h-full">
            <div className="flex-1 border-b border-dashed border-emerald-400 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 1</span>
            </div>
            {is3Fold && <div className="flex-1 border-b border-dashed border-emerald-400 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 2</span>
            </div>}
            <div className="flex-1 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">{is3Fold ? 'Panel 3' : 'Panel 2'}</span>
            </div>
          </div>
        ) : (
          <div className="flex w-full h-full">
            <div className="flex-1 border-r border-dashed border-emerald-400 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 1</span>
            </div>
            {is3Fold && <div className="flex-1 border-r border-dashed border-emerald-400 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 2</span>
            </div>}
            <div className="flex-1 relative">
               <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">{is3Fold ? 'Panel 3' : 'Panel 2'}</span>
            </div>
          </div>
        )}
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-black text-zinc-900">{type} {direction}</p>
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
          {is3Fold ? '2개의 접는 선 (오시)' : '1개의 접는 선 (오시)'}
        </p>
      </div>
    </motion.div>
  );
};

const WorkPrecautions = () => (
  <div className="mt-12 p-8 bg-zinc-900 rounded-[32px] text-white space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
        <FileText className="w-4 h-4 text-emerald-400" />
      </div>
      <div>
        <h4 className="text-sm font-black tracking-tight">작업 시 주의사항</h4>
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Design Guidelines</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-2">
        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">안전 영역</p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          재단선으로부터 <span className="text-emerald-400 font-bold">안쪽으로 3mm</span> 여유를 두고 디자인해 주세요.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">접지선 위치</p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          접히는 부분에 중요한 텍스트나 로고가 걸리지 않도록 주의해 주세요.
        </p>
      </div>
    </div>
  </div>
);

export const FoldedBusinessCardCalculator: React.FC<FoldedBusinessCardCalculatorProps> = ({
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

  return (
    <div className="space-y-10">
      {product.options.filter(opt => {
        const normalizedName = opt.name.replace(/\s/g, '');
        const handledByIconGrid = [
          '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
          '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
          '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', '접지방향', '접지형태', 
          '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
        ].includes(normalizedName);
        if (handledByIconGrid) return false;

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

          {option.type === 'text' ? (
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
          )}

          {option.name === '방향' && (
            <FoldedPreview 
              type={selectedOptions['접지 형태'] || '2단 명함'} 
              direction={selectedOptions['방향'] || '가로형'} 
            />
          )}
        </div>
      ))}

      <PostProcessingSection 
        product={product} 
        selectedOptions={selectedOptions} 
        handleOptionChange={handleOptionChange} 
        pattern="FOLDED_BUSINESS_CARD"
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      <WorkPrecautions />

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="FOLDED_BUSINESS_CARD"
        customSize={{ width: '', height: '' }}
      />
      <OrderTitleSection />
      <FileUploadSection />
      <NotesSection product={product} />
      <ActionButtons onGenerate={onGenerate} />
    </div>
  );
};
