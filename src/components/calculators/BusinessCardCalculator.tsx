import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Settings2, ShoppingCart, Info } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS } from '../../types';
import { BUSINESS_CARD_TEMPLATES } from './constants';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { PRODUCT_CONFIG } from './shared/constants';
import { Stepper, StepNavigation } from '../UXComponents';

const TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '귀돌이': {
    description: '명함의 모서리를 둥글게 깎는 가공입니다. 부드러운 인상을 주며 모서리 마모를 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/corner/400/250'
  },
  '오시': {
    description: '종이가 잘 접히도록 누름 자국을 내는 가공입니다. 두꺼운 종이가 터지는 것을 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/crease/400/250'
  },
  '미싱': {
    description: '손으로 쉽게 뜯을 수 있도록 점선 모양의 구멍을 내는 가공입니다. 쿠폰이나 티켓에 주로 사용됩니다.',
    imageUrl: 'https://picsum.photos/seed/perforation/400/250'
  },
  '타공': {
    description: '종이에 구멍을 뚫는 가공입니다. 택(Tag)이나 고리를 걸 때 사용합니다.',
    imageUrl: 'https://picsum.photos/seed/hole/400/250'
  }
};

interface BusinessCardCalculatorProps {
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

export const BusinessCardCalculator: React.FC<BusinessCardCalculatorProps> = ({
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
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const config = PRODUCT_CONFIG[product.id];

  const steps = [
    { id: 'basic', title: '용지 선택', icon: Layers },
    { id: 'options', title: '상세 옵션', icon: Settings2 },
    { id: 'order', title: '주문 정보', icon: ShoppingCart }
  ];

  useEffect(() => {
    if (config) {
      setSelectedBusinessCardGroup(config.defaultGroup);
      const materialOption = product.options.find(opt => opt.name.includes('용지'));
      if (materialOption && !selectedOptions[materialOption.name]) {
        const defaultMaterial = BUSINESS_CARD_MATERIALS.find(m => m.group === config.defaultGroup);
        if (defaultMaterial) {
          handleOptionChange(materialOption.name, `${defaultMaterial.name} ${defaultMaterial.weight}`);
        }
      }
    }
  }, [product.id]);

  const renderOption = (option: any) => {
    if (option.name.includes('용지')) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(config?.groups || ['기본 대중형', '고급 감성형', '내추럴/친환경형', '특수지/프리미엄형'])
              .map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedBusinessCardGroup(group)}
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                    selectedBusinessCardGroup === group
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {group}
                </button>
              ))}
          </div>

          {selectedBusinessCardGroup && (
            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {BUSINESS_CARD_MATERIALS.filter(m => m.group === selectedBusinessCardGroup).map((material) => {
                const isSelected = selectedOptions[option.name] === `${material.name} ${material.weight}`;
                return (
                  <button
                    key={material.id}
                    onClick={() => handleOptionChange(option.name, `${material.name} ${material.weight}`)}
                    className={`p-5 rounded-2xl border text-left transition-all relative group ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-white border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                          {material.name}
                        </span>
                        <span className="ml-2 text-xs text-zinc-400 font-bold">{material.weight}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                        isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {material.recommendationLabel}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-500'}`}>
                      {material.features}
                    </p>
                    
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-emerald-100 space-y-2"
                      >
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black text-emerald-600 uppercase shrink-0">추천용도:</span>
                          <span className="text-[10px] text-emerald-800/70">{material.recommendedUse}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black text-amber-600 uppercase shrink-0">주의사항:</span>
                          <span className="text-[10px] text-amber-800/70">{material.precautions}</span>
                        </div>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
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
        {option.values?.filter((val: any) => val.label !== '직접입력').map((val: any, index: number) => (
          <button
            key={val.label + index}
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

      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {product.options.filter(opt => opt.name.includes('용지')).map((option) => (
              <OptionGroup key={option.name} label={option.name} icon={Layers}>
                {renderOption(option)}
              </OptionGroup>
            ))}
            <StepNavigation onNext={() => setCurrentStep(1)} isFirst={true} isLast={false} />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {product.options.filter(opt => {
              const normalizedName = opt.name.replace(/\s/g, '');
              if (opt.name.includes('용지')) return false;
              
              // Filter out forbidden options for template products
              if (product.id === 'bc-template') {
                const forbidden = ['화이트 인쇄', '모양커팅', '모양 선택', '후가공 옵션', '템플릿 카테고리', '템플릿 선택', '디자인 템플릿'];
                if (forbidden.includes(opt.name)) return false;
                
                const forbiddenKeywords = ['화이트', '모양', '템플릿', '후가공'];
                if (forbiddenKeywords.some(keyword => opt.name.includes(keyword))) return false;
              }
              
              // Only allow '규격(mm)' and '인쇄도수' for standard business cards
              if (product.id === 'bc-standard') {
                const allowedOptions = ['규격(mm)', '인쇄도수'];
                if (!allowedOptions.includes(opt.name)) return false;
              }
              
              // Remove specific options for premium business cards
              if (product.id === 'bc-premium') {
                const allowedOptions = ['인쇄도수', '규격(mm)'];
                if (!allowedOptions.includes(opt.name)) return false;
              }
              
              const handledByIconGrid = [
                '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
                '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
                '제작수량', '수량', '주문수량', '디자인템플릿'
              ].includes(normalizedName);
              if (handledByIconGrid) return false;

              if (opt.visibleIf) {
                const parentVal = selectedOptions[opt.visibleIf.optionName];
                if (parentVal !== opt.visibleIf.value) return false;
              }

              return true;
            }).map((option) => (
              <OptionGroup 
                key={option.name} 
                label={option.name}
                tooltip={TERM_TOOLTIPS[option.name]}
              >
                {renderOption(option)}
              </OptionGroup>
            ))}

            <PostProcessingSection 
              product={product} 
              selectedOptions={selectedOptions} 
              handleOptionChange={handleOptionChange} 
              pattern="BUSINESS_CARD"
              expandedPostOption={expandedPostOption}
              setExpandedPostOption={setExpandedPostOption}
            />
            <StepNavigation onNext={() => setCurrentStep(2)} onPrev={() => setCurrentStep(0)} isFirst={false} isLast={false} />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
            <OrderTitleSection />
            <FileUploadSection />
            <StepNavigation onPrev={() => setCurrentStep(1)} isFirst={false} isLast={true} />
          </motion.div>
        )}
      </div>

      <SummarySection 
        product={product} 
        selectedOptions={selectedOptions} 
        unitPrice={unitPrice} 
        totalPrice={totalPrice} 
        discountRate={discountRate} 
        estimatedDeliveryDate={estimatedDeliveryDate} 
        pattern="BUSINESS_CARD"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
