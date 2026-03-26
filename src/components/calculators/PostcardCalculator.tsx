import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Settings2, ShoppingCart, FileText, Scissors, CheckCircle2 } from 'lucide-react';
import { Product, POSTCARD_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { SHAPE_ICONS, PRODUCT_CONFIG } from './shared/constants';
import { CalculatorAccordion } from './shared/CalculatorAccordion';

const POSTCARD_TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '용지': {
    description: '엽서 제작에 사용되는 종이의 종류와 두께를 선택합니다. 대중적인 스노우지부터 고급 수입지까지 다양하게 준비되어 있습니다.',
    imageUrl: 'https://picsum.photos/seed/postcard-paper/400/250'
  },
  '모양': {
    description: '엽서의 전체적인 형태를 선택합니다. 일반적인 직사각형 외에도 라운드형이나 자유로운 모양으로 제작이 가능합니다.',
    imageUrl: 'https://picsum.photos/seed/postcard-shape/400/250'
  }
};

interface PostcardCalculatorProps {
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

export const PostcardCalculator: React.FC<PostcardCalculatorProps> = ({
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
  const [selectedPostcardGroup, setSelectedPostcardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const config = PRODUCT_CONFIG[product.id as keyof typeof PRODUCT_CONFIG];
  const materialOption = product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
  const materialOptionName = materialOption?.name;

  useEffect(() => {
    if (config) {
      setSelectedPostcardGroup(config.defaultGroup);
      const materialOption = product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
      if (materialOption && !selectedOptions[materialOption.name]) {
        const defaultMaterial = POSTCARD_MATERIALS.find(m => m.group === config.defaultGroup);
        if (defaultMaterial) {
          handleOptionChange(materialOption.name, `${defaultMaterial.name} ${defaultMaterial.weight}`);
        }
      }
    }
  }, [product.id]);

  const renderOption = (option: any, skipTabs: boolean = false) => {
    const optionName = option.name;

    // 1. Paper Options (Swatch/Card Style)
    if (optionName.includes('용지') && optionName !== '용지 그룹') {
      return (
        <div className="space-y-6">
          {!skipTabs && config && config.groups.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {config.groups.map(group => (
                <button
                  key={group}
                  onClick={() => setSelectedPostcardGroup(group)}
                  className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                    selectedPostcardGroup === group
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            {option.values?.filter((val: any) => {
              if (config?.allowedMaterials && !config.allowedMaterials.includes(val.label)) return false;
              const material = POSTCARD_MATERIALS.find(m => `${m.name} ${m.weight}` === val.label);
              return material?.group === selectedPostcardGroup;
            }).map((val: any) => {
              const material = POSTCARD_MATERIALS.find(m => `${m.name} ${m.weight}` === val.label);
              const isSelected = selectedOptions[option.name] === val.label;
              return (
                <button
                  key={val.label}
                  onClick={() => handleOptionChange(option.name, val.label)}
                  className={`p-5 rounded-2xl border text-left transition-all relative group ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : 'bg-white border-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                        {material?.name}
                      </span>
                      <span className="ml-2 text-xs text-zinc-400 font-bold">{material?.weight}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className={`text-[11px] leading-relaxed mb-3 ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                    {material?.features}
                  </p>
                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                    <div className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`}>
                      추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Shape Options (Icon Card Style)
    if (optionName === '모양') {
      return (
        <div className="grid grid-cols-4 gap-3">
          {option.values?.map((val: any, index: number) => {
            const IconNode = SHAPE_ICONS[val.label] || <Layers className="w-6 h-6" />;
            const isSelected = selectedOptions[option.name] === val.label;
            return (
              <button
                key={val.label + index}
                onClick={() => handleOptionChange(option.name, val.label)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                    : 'bg-white border-zinc-100 text-zinc-400 hover:border-emerald-200'
                }`}
              >
                <div className={`${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {IconNode}
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">{val.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // 3. 2-Column Button Style for others
    return (
      <div className="grid grid-cols-2 gap-3">
        {option.values?.map((val: any, index: number) => {
          const isSelected = selectedOptions[option.name] === val.label;
          return (
            <button
              key={val.label + index}
              onClick={() => handleOptionChange(option.name, val.label)}
              className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex flex-col gap-1 ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
              }`}
            >
              <span className="relative z-10">{val.label}</span>
              {val.priceModifier !== undefined && val.priceModifier !== 0 ? (
                <span className={`block text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  추가 비용: {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                </span>
              ) : (
                <span className={`block text-[10px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  기본 포함
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
      title: '기본 사양',
      description: '엽서의 규격과 모양, 인쇄 방식을 선택하세요.',
      icon: FileText,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => ['규격(mm)', '모양', '인쇄도수'].includes(opt.name)).map((option) => (
            <OptionGroup key={option.name} label={option.name} tooltip={POSTCARD_TERM_TOOLTIPS[option.name]}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'material',
      title: '재질 및 옵션',
      description: '엽서의 느낌을 결정하는 용지를 선택하세요.',
      icon: Layers,
      children: (
        <div className="space-y-8">
          {(() => {
            const paperOptions = product.options.filter(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
            if (paperOptions.length === 0) return null;

            if (paperOptions.length === 1) {
              const option = paperOptions[0];
              return (
                <OptionGroup label={option.name} tooltip={POSTCARD_TERM_TOOLTIPS[option.name]}>
                  {renderOption(option, true)}
                </OptionGroup>
              );
            }

            return (
              <OptionGroup label="상세용지">
                {config && config.groups.length > 1 && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {config.groups.map(group => (
                      <button
                        key={group}
                        onClick={() => setSelectedPostcardGroup(group)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                          selectedPostcardGroup === group
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                )}
                {(() => {
                  const groupToOptionName: Record<string, string> = {
                    '기본 대중형': '상세 용지 (기본)',
                    '고급 감성형': '상세 용지 (고급)',
                    '친환경/내추럴형': '상세 용지 (친환경)',
                    '컬러/특수지형': '상세 용지 (특수)'
                  };
                  const optionName = groupToOptionName[selectedPostcardGroup];
                  const optionToRender = product.options.find(o => o.name === optionName);
                  return optionToRender ? renderOption(optionToRender, true) : null;
                })()}
              </OptionGroup>
            );
          })()}
        </div>
      )
    },
    {
      id: 'post',
      title: '후가공',
      description: '코팅이나 귀도리 등 특별한 효과를 추가하세요.',
      icon: Scissors,
      children: (
        <PostProcessingSection 
          product={product} 
          selectedOptions={selectedOptions} 
          handleOptionChange={handleOptionChange} 
          pattern="POSTCARD"
          expandedPostOption={expandedPostOption}
          setExpandedPostOption={setExpandedPostOption}
          materialOptionName={materialOptionName}
        />
      )
    },
    {
      id: 'order',
      title: '주문 정보',
      description: '수량 확인 및 제작에 필요한 정보를 입력하세요.',
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
        pattern="POSTCARD"
        customSize={{ width: '', height: '' }}
      />
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
