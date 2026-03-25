import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Layers, Settings2, ShoppingCart, ChevronDown, ChevronUp, Info, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, PAPER_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { SHAPE_ICONS, PRODUCT_CONFIG } from './shared/constants';
import { StickerPreview } from './shared/StickerPreview';
import { Stepper, StepNavigation, TermTooltip } from '../UXComponents';

const STICKER_TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '모양': {
    description: '스티커의 전체적인 형태를 선택합니다. 사각형, 원형 이외에도 원하는 모양대로 제작이 가능합니다.',
    imageUrl: 'https://picsum.photos/seed/sticker-shape/400/250'
  },
  '재질': {
    description: '스티커가 인쇄될 종이의 종류입니다. 사용 용도에 따라 일반지, 방수지, 투명지 등을 선택할 수 있습니다.',
    imageUrl: 'https://picsum.photos/seed/sticker-material/400/250'
  }
};

interface StickerCalculatorProps {
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

export const StickerCalculator: React.FC<StickerCalculatorProps> = ({
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
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('일반/기본 용지');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const config = PRODUCT_CONFIG[product.id];
  const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
  const materialOptionName = materialOption?.name;

  const steps = [
    { title: '용지 및 모양', icon: Box },
    { title: '상세 옵션', icon: Settings2 },
    { title: '주문 정보', icon: ShoppingCart }
  ];

  useEffect(() => {
    if (config) {
      setExpandedGroup(config.defaultGroup);
      const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
      if (materialOption && !selectedOptions[materialOption.name]) {
        const defaultMaterial = PAPER_MATERIALS.find(m => m.group === config.defaultGroup);
        if (defaultMaterial) {
          handleOptionChange(materialOption.name, defaultMaterial.name);
        }
      }
    }
  }, [product.id]);

  const renderOption = (option: any) => {
    if (option.name.includes('재질') || option.name.includes('용지')) {
      return (
        <div className="space-y-3">
          {(config?.groups || ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)']).map(group => {
            const materialsInGroup = PAPER_MATERIALS.filter(m => m.group === group);
            const isExpanded = expandedGroup === group;
            const hasSelectedInGroup = materialsInGroup.some(m => selectedOptions[option.name] === m.name);

            if (materialsInGroup.length === 0) return null;

            return (
              <div key={group} className="border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50/50">
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group)}
                  className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                    isExpanded ? 'bg-zinc-100' : 'hover:bg-zinc-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      hasSelectedInGroup ? 'text-emerald-600' : 'text-zinc-500'
                    }`}>
                      {group}
                    </span>
                    {hasSelectedInGroup && !isExpanded && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {selectedOptions[option.name]}
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </button>
                
                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                    {materialsInGroup.map((material) => {
                      const isSelected = selectedOptions[option.name] === material.name;
                      return (
                        <button
                          key={material.id}
                          onClick={() => handleOptionChange(option.name, material.name)}
                          className={`group p-4 rounded-xl text-left border transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                              : 'bg-white border-zinc-100 hover:border-emerald-200 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                              {material.name}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                            {material.shortDescription}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (option.name === '모양') {
      return (
        <div className="grid grid-cols-4 gap-3">
          {option.values?.map((val: any) => {
            const IconNode = SHAPE_ICONS[val.label] || <Info className="w-6 h-6" />;
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <div className={`${isSelected ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {IconNode}
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">{val.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

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

    return (
      <div className="grid grid-cols-2 gap-3">
        {option.values?.map((val: any) => (
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
    );
  };

  return (
    <div className="space-y-8">
      <Stepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <div className="space-y-8">
              <StickerPreview selectedOptions={selectedOptions} />
              {product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지') || opt.name === '모양').map((option) => (
                <OptionGroup 
                  key={option.name} 
                  label={option.name} 
                  icon={option.name === '모양' ? undefined : Layers}
                  tooltip={STICKER_TERM_TOOLTIPS[option.name]}
                >
                  {renderOption(option)}
                </OptionGroup>
              ))}
              <StepNavigation 
                onNext={() => setCurrentStep(1)} 
                nextLabel="상세 옵션 선택하기"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              {product.options.filter(opt => {
                const normalizedName = opt.name.replace(/\s/g, '');
                if (opt.name.includes('재질') || opt.name.includes('용지') || opt.name === '모양') return false;
                
                if (['접지방향', '접지형태'].includes(normalizedName)) {
                  return selectedOptions['접지'] === '있음';
                }

                const handledByIconGrid = [
                  '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
                  '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
                  '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', 
                  '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
                ].includes(normalizedName);
                if (handledByIconGrid) return false;

                if (opt.visibleIf) {
                  const parentVal = selectedOptions[opt.visibleIf.optionName];
                  if (parentVal !== opt.visibleIf.value) return false;
                }

                return true;
              }).map((option) => (
                <OptionGroup key={option.name} label={option.name} tooltip={STICKER_TERM_TOOLTIPS[option.name]}>
                  {renderOption(option)}
                </OptionGroup>
              ))}

              <PostProcessingSection 
                product={product} 
                selectedOptions={selectedOptions} 
                handleOptionChange={handleOptionChange} 
                pattern="STICKER"
                expandedPostOption={expandedPostOption}
                setExpandedPostOption={setExpandedPostOption}
                materialOptionName={materialOptionName}
              />

              <StepNavigation 
                onPrev={() => setCurrentStep(0)} 
                onNext={() => setCurrentStep(2)} 
                nextLabel="주문 정보 입력하기"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
              <OrderTitleSection />
              <FileUploadSection />
              <StepNavigation 
                onPrev={() => setCurrentStep(1)} 
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="STICKER"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
