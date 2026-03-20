import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Clock, 
  CheckCircle2, 
  ShoppingCart, 
  FileText, 
  FileUp, 
  ChevronDown, 
  ChevronUp,
  Scissors,
  Layers,
  Sparkles,
  Hash,
  Zap,
  Package,
  Paintbrush,
  Droplets
} from 'lucide-react';
import { Product, Quotation, PAPER_MATERIALS } from '../types';

interface QuotationCalculatorProps {
  product: Product;
  onGenerateQuotation: (quotation: Quotation) => void;
}

export const QuotationCalculator: React.FC<QuotationCalculatorProps> = ({ product, onGenerateQuotation }) => {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      if (opt.type === 'text') {
        initial[opt.name] = '';
      } else if (opt.values && opt.values.length > 0) {
        initial[opt.name] = opt.values[0].label;
      } else {
        initial[opt.name] = '';
      }
    });
    return initial;
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [customSize, setCustomSize] = useState({ width: '', height: '' });
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);

  // Initialize expanded group based on default selected material
  useEffect(() => {
    const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
    if (materialOption) {
      const selectedValue = selectedOptions[materialOption.name];
      const material = PAPER_MATERIALS.find(m => m.name === selectedValue);
      if (material) {
        setExpandedGroup(material.group);
      } else {
        setExpandedGroup('일반/기본 용지');
      }
    }
  }, [product.id]);

  useEffect(() => {
    let pricePerUnit = product.basePrice;
    
    product.options.forEach(opt => {
      if (opt.values) {
        if (opt.type === 'checkbox') {
          const selectedList = selectedOptions[opt.name]?.split(', ').filter(Boolean) || [];
          if (opt.name === '재단 방식') {
            // Special logic for combined cutting
            if (selectedList.includes('완칼 재단') && selectedList.includes('반칼 재단')) {
              pricePerUnit += 1500;
            } else {
              selectedList.forEach(valLabel => {
                const val = opt.values?.find(v => v.label === valLabel);
                if (val?.priceModifier) pricePerUnit += val.priceModifier;
              });
            }
          } else {
            selectedList.forEach(valLabel => {
              const val = opt.values?.find(v => v.label === valLabel);
              if (val?.priceModifier) pricePerUnit += val.priceModifier;
            });
          }
        } else {
          const selectedValue = opt.values.find(v => v.label === selectedOptions[opt.name]);
          if (selectedValue?.priceModifier) {
            pricePerUnit += selectedValue.priceModifier;
          }
        }
      }
    });

    // Quantity-based discount logic
    let currentDiscount = 0;
    if (quantity >= 1000) currentDiscount = 0.15;
    else if (quantity >= 500) currentDiscount = 0.10;
    else if (quantity >= 100) currentDiscount = 0.05;
    
    setDiscountRate(currentDiscount);
    const discountedUnitPrice = Math.round(pricePerUnit * (1 - currentDiscount));
    setUnitPrice(discountedUnitPrice);
    setTotalPrice(discountedUnitPrice * quantity);

    // Estimated delivery date calculation
    const days = parseInt(product.leadTime.match(/\d+/)?.[0] || '3');
    const date = new Date();
    date.setDate(date.getDate() + days + 2); // +2 for shipping/buffer
    setEstimatedDeliveryDate(date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [product, quantity, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    const option = product.options.find(opt => opt.name === name);
    if (option?.type === 'checkbox') {
      setSelectedOptions(prev => {
        const currentValues = prev[name] ? prev[name].split(', ').filter(Boolean) : [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [name]: newValues.join(', ') };
      });
    } else {
      setSelectedOptions(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = () => {
    const quotation: Quotation = {
      id: `Q-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      options: {
        ...selectedOptions,
        ...((selectedOptions['사이즈'] === '직접입력' || selectedOptions['규격(mm)'] === '직접입력' || selectedOptions['작업 사이즈'] === '직접입력') 
          ? { '사이즈 상세': `${customSize.width}x${customSize.height}mm` } 
          : {})
      },
      quantity,
      unitPrice,
      totalPrice,
      leadTime: product.leadTime,
      estimatedDeliveryDate,
      createdAt: new Date().toISOString(),
    };
    onGenerateQuotation(quotation);
  };

  return (
    <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
      <div className="p-8 bg-zinc-900 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-black tracking-tight">실시간 견적 계산기</h3>
        </div>
        <p className="text-zinc-400 text-sm">원하는 옵션을 선택하면 즉시 예상 금액을 확인하실 수 있습니다.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Quantity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-zinc-900 uppercase tracking-widest">주문 수량</label>
            <span className="text-xs font-bold text-emerald-600">최소 {product.minQuantity}개부터</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              min={product.minQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || 0))}
              className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-lg transition-colors"
            />
            <div className="flex gap-2">
              {[10, 50, 100].map(add => (
                <button 
                  key={add}
                  onClick={() => setQuantity(prev => prev + add)}
                  className="px-4 py-4 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-bold hover:bg-zinc-200 transition-colors"
                >
                  +{add}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-8">
          {/* 1. Material Selection (Always First and Prominent) */}
          {product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지')).map((option) => (
            <div key={option.name} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  {option.name}
                </label>
              </div>
              <div className="space-y-3">
                {['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'].map(group => {
                  const materialsInGroup = PAPER_MATERIALS.filter(m => m.group === group);
                  
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
                            const productOptionValue = option.values?.find(v => v.label === material.name);
                            
                            // Use price modifier from product if available, otherwise use a default based on group
                            let priceModifier = productOptionValue?.priceModifier;
                            if (priceModifier === undefined) {
                              if (group === '일반/기본 용지') priceModifier = 0;
                              else if (group === '방수/합성지') priceModifier = 500;
                              else if (group === '투명/PET') priceModifier = 1500;
                              else if (group === '메탈/광택 특수 재질') priceModifier = 2000;
                              else if (group === '프리미엄 라벨(GMUND)') priceModifier = 3000;
                              else priceModifier = 0;
                            }
                            
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
                                  {priceModifier !== 0 && (
                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                      {priceModifier > 0 ? `+${priceModifier.toLocaleString()}원` : `${priceModifier.toLocaleString()}원`}
                                    </span>
                                  )}
                                </div>
                                {material.shortDescription && (
                                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                                    {material.shortDescription}
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

          {/* 2. Standard Options (Size, etc.) */}
          {product.options.filter(opt => 
            !opt.name.includes('재질') && 
            !opt.name.includes('용지') && 
            !['재단 방식', '코팅 유무', '후가공 옵션', '화이트 인쇄', '넘버링', '스코딕스', '포장 옵션', '부분 UV', '모양코팅'].includes(opt.name)
          ).map((option) => (
            <div key={option.name} className="space-y-4">
              <label className="text-xs font-black text-zinc-900 uppercase tracking-widest block">
                {option.name}
              </label>
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
              {(option.name === '사이즈' || option.name === '규격(mm)' || option.name === '작업 사이즈') && selectedOptions[option.name] === '직접입력' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">가로 (mm)</label>
                    <input 
                      type="number" 
                      value={customSize.width}
                      onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                      placeholder="50"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">세로 (mm)</label>
                    <input 
                      type="number" 
                      value={customSize.height}
                      onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="50"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none text-sm font-bold"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {/* 3. Post-processing Section (후가공) */}
          {(() => {
            const postProcessingOptions = product.options.filter(opt => 
              ['재단 방식', '코팅 유무', '후가공 옵션', '화이트 인쇄', '넘버링', '스코딕스', '포장 옵션', '부분 UV'].includes(opt.name)
            );

            // Special check for White Ink: only show if material is transparent
            const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
            const selectedMaterialName = materialOption ? selectedOptions[materialOption.name] : null;
            const selectedMaterial = PAPER_MATERIALS.find(m => m.name === selectedMaterialName);
            const isTransparent = selectedMaterial?.transparent || false;

            const visiblePostOptions = postProcessingOptions.filter(opt => {
              if (opt.name === '화이트 인쇄' && !isTransparent) return false;
              return true;
            });

            if (visiblePostOptions.length === 0) return null;

            const getIcon = (name: string) => {
              if (name === '재단 방식') return <Scissors className="w-5 h-5" />;
              if (name === '코팅 유무') return <Layers className="w-5 h-5" />;
              if (name === '후가공 옵션' || name === '부분 UV') return <Sparkles className="w-5 h-5" />;
              if (name === '화이트 인쇄') return <Paintbrush className="w-5 h-5" />;
              if (name === '넘버링') return <Hash className="w-5 h-5" />;
              if (name === '스코딕스') return <Zap className="w-5 h-5" />;
              if (name === '포장 옵션') return <Package className="w-5 h-5" />;
              return <Droplets className="w-5 h-5" />;
            };

            const getDisplayName = (name: string) => {
              if (name === '재단 방식') return '재단';
              if (name === '코팅 유무') return '코팅';
              if (name === '후가공 옵션') return '박 가공';
              if (name === '화이트 인쇄') return '화이트인쇄';
              if (name === '포장 옵션') return '개별포장';
              return name;
            };

            const isOptionActive = (name: string) => {
              const val = selectedOptions[name];
              return val && val !== '없음' && val !== '안함' && val !== '코팅 없음' && val !== '기본 포장' && val !== '';
            };

            const expandedOption = visiblePostOptions.find(opt => opt.name === expandedPostOption);

            return (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                      후가공 선택
                    </label>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    아이콘을 클릭하여 상세 옵션 선택
                  </span>
                </div>
                
                <div className="bg-zinc-50/50 rounded-[32px] p-6 border border-zinc-100 space-y-6">
                  {/* Icon Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {visiblePostOptions.map(option => {
                      const isActive = isOptionActive(option.name);
                      const isExpanded = expandedPostOption === option.name;
                      
                      return (
                        <button
                          key={option.name}
                          onClick={() => setExpandedPostOption(isExpanded ? null : option.name)}
                          className={`flex flex-col items-center gap-2 group transition-all ${
                            isExpanded ? 'scale-110' : 'hover:scale-105'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                            isExpanded 
                              ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                              : isActive
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-white text-zinc-400 border border-zinc-100 group-hover:border-zinc-300'
                          }`}>
                            {getIcon(option.name)}
                          </div>
                          <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                            isExpanded ? 'text-emerald-600' : isActive ? 'text-zinc-900' : 'text-zinc-400'
                          }`}>
                            {getDisplayName(option.name)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded Sub-options */}
                  <AnimatePresence mode="wait">
                    {expandedOption && (
                      <motion.div
                        key={expandedOption.name}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                              {expandedOption.name} 상세 설정
                            </h4>
                            <button 
                              onClick={() => setExpandedPostOption(null)}
                              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600"
                            >
                              닫기
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {expandedOption.values?.map((val) => {
                              const isSelected = expandedOption.type === 'checkbox'
                                ? selectedOptions[expandedOption.name]?.split(', ').includes(val.label)
                                : selectedOptions[expandedOption.name] === val.label;
                              return (
                                <button
                                  key={val.label}
                                  onClick={() => handleOptionChange(expandedOption.name, val.label)}
                                  className={`py-3 px-4 rounded-xl text-[11px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                                    isSelected
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {expandedOption.type === 'checkbox' && (
                                      <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                        isSelected ? 'bg-white border-white' : 'border-zinc-300'
                                      }`}>
                                        {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                                      </div>
                                    )}
                                    <span>{val.label}</span>
                                  </div>
                                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                                    <span className={`text-[9px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                      {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Summary Box */}
        <div className="pt-8 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 font-medium">선택 옵션 요약</span>
              <div className="flex flex-wrap justify-end gap-2">
                {Object.entries(selectedOptions).map(([key, val]) => (
                  <span key={key} className="px-2 py-1 bg-white rounded-md text-[10px] font-bold text-zinc-400 border border-zinc-100">
                    {val}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-medium">개당 단가</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-900">{unitPrice.toLocaleString()}원</span>
                {discountRate > 0 && (
                  <span className="block text-[10px] text-emerald-600 font-bold">
                    (수량 할인 {Math.round(discountRate * 100)}% 적용됨)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">예상 수령일</span>
              </div>
              <span className="text-xs font-bold text-zinc-900">{estimatedDeliveryDate}</span>
            </div>
            <div className="pt-4 border-t border-zinc-200/50 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">최종 예상 견적</p>
                <p className="text-3xl font-black text-zinc-900 tracking-tight">
                  {totalPrice.toLocaleString()}<span className="text-lg font-medium ml-1">원</span>
                </p>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full">
                VAT 포함
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {product.notes && product.notes.length > 0 && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">제작 시 주의사항</h4>
            <ul className="space-y-2">
              {product.notes.map((note, i) => (
                <li key={i} className="text-[11px] text-amber-800/80 flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Order Title */}
        <div className="space-y-4">
          <label className="text-xs font-black text-zinc-900 uppercase tracking-widest block">
            주문제목
          </label>
          <input 
            type="text" 
            placeholder="제목을 입력해 주세요."
            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="text-xs font-black text-zinc-900 uppercase tracking-widest block">
            파일 업로드
          </label>
          <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors">
              <FileUp className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-[10px] text-zinc-400 mt-1">PDF ONLY (최대 50MB)</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 pt-4">
          <button 
            onClick={handleGenerate}
            className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
          >
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>견적서 발행하기</span>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 bg-white border-2 border-zinc-900 text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span>장바구니</span>
            </button>
            <button className="py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              <span>바로구매</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
