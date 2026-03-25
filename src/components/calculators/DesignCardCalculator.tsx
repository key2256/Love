import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Settings2, ShoppingCart } from 'lucide-react';
import { Product, BUSINESS_CARD_MATERIALS, DESIGN_CARD_TEMPLATES, Template } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { OptionGroup } from './shared/OptionGroup';
import { PRODUCT_CONFIG } from './shared/constants';
import { CalculatorAccordion } from './shared/CalculatorAccordion';
import { ChevronLeft, ChevronRight, X, Check, Search } from 'lucide-react';

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
  onAddToCart?: () => void;
  onSaveDraft?: () => void;
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
  onGenerate,
  onAddToCart,
  onSaveDraft
}) => {
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string>('기본 대중형');
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  
  const config = PRODUCT_CONFIG[product.id];

  const categories = ['전체', ...Array.from(new Set(DESIGN_CARD_TEMPLATES.map(t => t.category)))];
  const filteredTemplates = selectedCategory === '전체' 
    ? DESIGN_CARD_TEMPLATES 
    : DESIGN_CARD_TEMPLATES.filter(t => t.category === selectedCategory);

  const selectedTemplate = DESIGN_CARD_TEMPLATES.find(t => t.id === selectedTemplateId);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 344; // w-320 + gap-6
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplateId(template.id);
    handleOptionChange('선택된 템플릿', template.name);
    setIsTemplateModalOpen(false);
  };

  const renderOption = (option: any) => {
    if (option.name.includes('용지')) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {config && config.groups.length > 1 && config.groups.map(group => (
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

  const sections = [
    {
      id: 'template',
      title: '디자인 템플릿 선택',
      icon: Layers,
      children: (
        <div className="space-y-4">
          <div 
            onClick={() => setIsTemplateModalOpen(true)}
            className={`group relative p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
              selectedTemplate 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : 'border-zinc-200 hover:border-emerald-400 hover:bg-zinc-50'
            }`}
          >
            {selectedTemplate ? (
              <div className="flex items-center gap-6">
                <div className="w-32 h-20 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={selectedTemplate.image} 
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 uppercase tracking-wider">
                      {selectedTemplate.category}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      ID: {selectedTemplate.id}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-zinc-900">{selectedTemplate.name}</h4>
                  <p className="text-xs text-emerald-600 font-bold mt-1">템플릿이 선택되었습니다. 클릭하여 변경하세요.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <Check className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <Search className="w-7 h-7 text-zinc-400 group-hover:text-emerald-500" />
                </div>
                <h4 className="text-base font-black text-zinc-900 mb-1">템플릿 찾아보기</h4>
                <p className="text-sm text-zinc-500">업종별 다양한 디자인 템플릿이 준비되어 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'basic',
      title: '용지 선택',
      icon: Box,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => opt.name.includes('용지')).map((option) => (
            <OptionGroup key={option.name} label={option.name} icon={Layers}>
              {renderOption(option)}
            </OptionGroup>
          ))}
        </div>
      )
    },
    {
      id: 'options',
      title: '상세 옵션 및 후가공',
      icon: Settings2,
      children: (
        <div className="space-y-8">
          {product.options.filter(opt => {
            const normalizedName = opt.name.replace(/\s/g, '');
            if (opt.name.includes('용지')) return false;
            
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
            pattern="DESIGN_CARD"
            expandedPostOption={expandedPostOption}
            setExpandedPostOption={setExpandedPostOption}
          />
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
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <CalculatorAccordion sections={sections} />

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTemplateModalOpen(false)}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">디자인 템플릿 선택</h3>
                <p className="text-sm text-zinc-500 mt-1">원하는 디자인을 선택하고 정보만 입력하세요.</p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="px-8 py-4 bg-white border-b border-zinc-100 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                      selectedCategory === category
                        ? 'bg-zinc-900 text-white shadow-lg'
                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Carousel/Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/30">
              <div className="relative group/carousel">
                <div 
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
                >
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -8 }}
                      onClick={() => handleTemplateSelect(template)}
                      className={`flex-none w-[280px] sm:w-[320px] snap-start cursor-pointer group/item`}
                    >
                      <div className={`relative aspect-[1.6/1] rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                        selectedTemplateId === template.id 
                          ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
                          : 'border-white group-hover/item:border-emerald-200 group-hover/item:shadow-xl group-hover/item:shadow-emerald-500/10'
                      }`}>
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold flex items-center gap-2">
                            자세히 보기 <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        {selectedTemplateId === template.id && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 px-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                            {template.category}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-zinc-900 group-hover/item:text-emerald-600 transition-colors">
                          {template.name}
                        </h5>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Carousel Navigation Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden lg:block">
                  <button 
                    onClick={() => scrollCarousel('left')}
                    className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all border border-zinc-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden lg:block">
                  <button 
                    onClick={() => scrollCarousel('right')}
                    className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all border border-zinc-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between bg-white">
              <div className="text-sm text-zinc-500">
                총 <span className="font-bold text-zinc-900">{filteredTemplates.length}</span>개의 템플릿이 있습니다.
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-8 py-3 bg-zinc-900 text-white rounded-xl text-sm font-black hover:bg-zinc-800 transition-all"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
      
      <NotesSection product={product} />
      
      <ActionButtons onGenerate={onGenerate} onAddToCart={onAddToCart} onSaveDraft={onSaveDraft} />
    </div>
  );
};
