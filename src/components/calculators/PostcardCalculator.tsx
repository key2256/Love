import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product, POSTCARD_MATERIALS } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { OrderTitleSection } from './shared/OrderTitleSection';
import { ActionButtons } from './shared/ActionButtons';
import { NotesSection } from './shared/NotesSection';
import { PostProcessingSection } from './shared/PostProcessingSection';
import { POSTCARD_CONFIG } from './shared/constants';

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
  onGenerate
}) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);
  const [selectedPostcardGroup, setSelectedPostcardGroup] = useState<string | null>(null);

  const config = POSTCARD_CONFIG[product.id];

  const handlePostcardGroupChange = (group: string) => {
    setSelectedPostcardGroup(group);
    const materialOption = product.options.find(opt => opt.name === '상세 용지 (기본)') || 
                           product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
    
    if (materialOption) {
      const firstMaterial = POSTCARD_MATERIALS.find(m => m.group === group);
      if (firstMaterial) {
        handleOptionChange(materialOption.name, `${firstMaterial.name} ${firstMaterial.weight}`);
      }
    }
  };

  React.useEffect(() => {
    if (product.id === 'stk-postcard-special') {
      setSelectedPostcardGroup(null);
      const materialOption = product.options.find(opt => opt.name.includes('용지'));
      if (materialOption && !selectedOptions[materialOption.name]) {
        handleOptionChange(materialOption.name, '아트지 250g');
      }
    } else if (config) {
      const currentGroup = selectedOptions['용지 그룹'] || config.allowedGroups?.[0] || '기본 대중형';
      setSelectedPostcardGroup(currentGroup);
      
      const materialOption = product.options.find(opt => opt.name === '상세 용지 (기본)') || 
                             product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
      if (materialOption) {
        const currentVal = selectedOptions[materialOption.name];
        const currentMaterial = POSTCARD_MATERIALS.find(m => `${m.name} ${m.weight}` === currentVal);
        
        if (!currentVal || !currentMaterial || !config.allowedGroups?.includes(currentMaterial.group)) {
          const firstMaterial = POSTCARD_MATERIALS.find(m => m.group === currentGroup);
          if (firstMaterial) {
            handleOptionChange(materialOption.name, `${firstMaterial.name} ${firstMaterial.weight}`);
          }
        }
      }
    }
  }, [product.id]);

  return (
    <div className="space-y-10">
      {/* 1. Material Selection */}
      {product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지')).map((option) => (
        <div key={option.name} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
              {option.name}
            </label>
          </div>
          <div className="space-y-3">
            {['기본 대중형', '고급 감성형', '친환경/내추럴형', '컬러/특수지형'].map(group => {
              if (config?.allowedGroups && !config.allowedGroups.includes(group)) return null;
              
              const materialsInGroup = POSTCARD_MATERIALS.filter(m => {
                if (m.group !== group) return false;
                if (config?.allowedMaterials && !config.allowedMaterials.includes(m.name)) return false;
                return true;
              });

              if (materialsInGroup.length === 0) return null;

              const isExpanded = expandedGroup === group;
              const hasSelectedInGroup = materialsInGroup.some(m => selectedOptions[option.name] === m.name);

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
                            {material.features && (
                              <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                                {material.features}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 2. Standard Options */}
      {product.options.filter(opt => {
        const normalizedName = opt.name.replace(/\s/g, '');
        if (opt.name.includes('재질') || opt.name.includes('용지')) return false;
        
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
        </div>
      ))}

      <PostProcessingSection 
        product={product} 
        selectedOptions={selectedOptions} 
        handleOptionChange={handleOptionChange} 
        pattern="POSTCARD"
        expandedPostOption={expandedPostOption}
        setExpandedPostOption={setExpandedPostOption}
      />

      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />
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
      <OrderTitleSection />
      <FileUploadSection />
      <NotesSection product={product} />
      <ActionButtons onGenerate={onGenerate} />
    </div>
  );
};
