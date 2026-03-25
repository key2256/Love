import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Layers, Settings2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { PRODUCT_CONFIG } from './shared/constants';
import { Stepper, StepNavigation, TermTooltip } from '../UXComponents';

const FOLDED_CARD_TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '용지': {
    description: '접지 명함 제작에 사용되는 종이의 재질과 두께를 선택합니다. 접히는 부분의 터짐을 방지하기 위해 적절한 두께의 종이를 추천합니다.',
    imageUrl: 'https://picsum.photos/seed/folded-card-paper/400/250'
  }
};

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
  onAddToCart?: () => void;
  onSaveDraft?: () => void;
}

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
  onGenerate,
  onAddToCart,
  onSaveDraft
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const config = PRODUCT_CONFIG[product.id];

  const steps = [
    { title: '용지 선택', icon: Box },
    { title: '상세 옵션', icon: Settings2 },
    { title: '주문 정보', icon: ShoppingCart }
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
      
      // Auto-select '있음' for 접지
      if (product.id.includes('folded')) {
        handleOptionChange('접지', '있음');
      }
    }
  }, [product.id]);

  const renderOption = (option: any) => {
    if (option.name.includes('용지')) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {(config?.groups || ['기본 대중형', '고급 감성형']).map(group => (
              <button
                key={group}
                onClick={() => setSelectedBusinessCardGroup(group)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedBusinessCardGroup === group
                    ? 'bg-zinc-900 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {option.values?.filter((val: any) => {
              const material = BUSINESS_CARD_MATERIALS.find(m => `${m.name} ${m.weight}` === val.label);
              return material?.group === selectedBusinessCardGroup;
            }).map((val: any) => {
              const material = BUSINESS_CARD_MATERIALS.find(m => `${m.name} ${m.weight}` === val.label);
              const isSelected = selectedOptions[option.name] === val.label;
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`group p-5 rounded-2xl text-left border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-white border-zinc-100 hover:border-emerald-200 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                      {material?.name}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {material?.weight}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed mb-3 ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                    {material?.features}
                  </p>
                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                    <div className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`}>
                      {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
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
              {product.options.filter(opt => {
                if (opt.name === '용지 타입' || opt.name === '상세 용지 (고급지)') return false;
                return opt.name.includes('용지');
              }).map((option) => (
                <OptionGroup 
                  key={option.name} 
                  label="용지 선택" 
                  icon={Layers}
                  tooltip={FOLDED_CARD_TERM_TOOLTIPS['용지']}
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
                if (opt.name.includes('용지')) return false;
                
                // Keep 규격, 방향, 인쇄도수
                const allowedOptions = ['규격', '규격(mm)', '방향', '인쇄도수', '인쇄 도수'];
                if (allowedOptions.includes(opt.name)) return true;
                
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
                <OptionGroup key={option.name} label={option.name}>
                  {renderOption(option)}
                </OptionGroup>
              ))}

              <PostProcessingSection 
                product={product} 
                selectedOptions={selectedOptions} 
                handleOptionChange={handleOptionChange} 
                pattern="FOLDED_BUSINESS_CARD"
                expandedPostOption={expandedPostOption}
                setExpandedPostOption={setExpandedPostOption}
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
        pattern="FOLDED_BUSINESS_CARD"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
