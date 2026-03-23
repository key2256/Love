import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Hash, 
  Layers, 
  FileText, 
  ShoppingCart, 
  Clock, 
  FileUp, 
  HelpCircle, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Product, Quotation, PAPER_MATERIALS, POSTCARD_MATERIALS, BUSINESS_CARD_MATERIALS } from '../types';
import { POSTCARD_CONFIG } from './calculators/shared/constants';
import { StickerCalculator } from './calculators/StickerCalculator';
import { PostcardCalculator } from './calculators/PostcardCalculator';
import { BusinessCardCalculator } from './calculators/BusinessCardCalculator';
import { DesignCardCalculator } from './calculators/DesignCardCalculator';
import { MemoPadCalculator } from './calculators/MemoPadCalculator';
import { NoteCalculator } from './calculators/NoteCalculator';
import { DrawingBookCalculator } from './calculators/DrawingBookCalculator';
import { FoldedBusinessCardCalculator } from './calculators/FoldedBusinessCardCalculator';
import { DefaultCalculator } from './calculators/DefaultCalculator';

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
  const [selectedPostcardGroup, setSelectedPostcardGroup] = useState<string | null>(null);
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string | null>(null);
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);

  const getLayoutPattern = (product: Product) => {
    if (product.category === 'sticker') return 'STICKER';
    if (product.category === 'card-paper' && product.subCategory.includes('엽서')) return 'POSTCARD';
    if (product.id === 'bc-template') return 'DESIGN_CARD';
    if (product.id === 'bc-standard' || product.id === 'bc-premium') return 'BUSINESS_CARD';
    if (product.id === 'bc-folded') return 'FOLDED_BUSINESS_CARD';
    if (product.id === 'memo-standard') return 'MEMO_PAD';
    if (product.id === 'note-spring' || product.id === 'note-leather' || product.id === 'note-saddle') return 'NOTE';
    if (product.id === 'drawing-pro' || product.id === 'drawing-student') return 'DRAWING_BOOK';
    if (product.category === 'card-paper') return 'PAPER_GOODS';
    if (product.category === 'binding-booklet' || product.id === 'note-spring') return 'BINDING_GOODS';
    if (product.category === 'poster-promo') return 'LARGE_FORMAT';
    if (product.category === 'package-supply') return 'PACKAGE';
    return 'DEFAULT';
  };

  const pattern = getLayoutPattern(product);

  const getNoteSubPattern = (product: Product) => {
    if (product.id === 'note-spring') return 'NOTE_SPIRAL';
    if (product.id === 'note-leather') return 'NOTE_LEATHER';
    if (product.id === 'note-saddle') return 'NOTE_SADDLE';
    return 'NOTE_SPIRAL';
  };

  const noteSubPattern = pattern === 'NOTE' ? getNoteSubPattern(product) : null;

  // Initialize expanded group based on default selected material
  useEffect(() => {
    if (pattern === 'DESIGN_CARD' && selectedOptions['수량']) {
      const qty = parseInt(selectedOptions['수량'].replace('매', '')) || 100;
      if (qty !== quantity) {
        setQuantity(qty);
      }
    }
  }, [selectedOptions['수량'], pattern]);

  useEffect(() => {
    if (pattern === 'STICKER') {
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
    } else if (pattern === 'POSTCARD') {
      const config = POSTCARD_CONFIG[product.id];
      
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
    } else if (pattern === 'BUSINESS_CARD') {
      const materialOption = product.options.find(opt => opt.name.includes('용지'));
      if (materialOption) {
        const selectedValue = selectedOptions[materialOption.name];
        const material = BUSINESS_CARD_MATERIALS.find(m => `${m.name} ${m.weight}` === selectedValue);
        if (material) {
          setSelectedBusinessCardGroup(material.group);
        } else {
          // Default to first available group for this product
          const availableGroups = Array.from(new Set(product.options.find(opt => opt.name.includes('용지'))?.values?.map(v => {
            const m = BUSINESS_CARD_MATERIALS.find(bm => `${bm.name} ${bm.weight}` === v.label);
            return m?.group;
          }).filter(Boolean)));
          setSelectedBusinessCardGroup((availableGroups[0] as string) || '기본 대중형');
        }
      }
    }
  }, [product.id, pattern]);

  useEffect(() => {
    let pricePerUnit = product.basePrice;
    
    product.options.forEach(opt => {
      // Check conditional visibility
      if (opt.visibleIf) {
        const parentVal = selectedOptions[opt.visibleIf.optionName];
        if (parentVal !== opt.visibleIf.value) return;
      }

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

  const handlePostcardGroupChange = (group: string) => {
    setSelectedPostcardGroup(group);
    
    // Automatically select the first material in the group
    // For general postcards, we specifically target '상세 용지 (기본)'
    const materialOption = product.options.find(opt => opt.name === '상세 용지 (기본)') || 
                           product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
    
    if (materialOption) {
      const firstMaterial = POSTCARD_MATERIALS.find(m => m.group === group);
      if (firstMaterial) {
        handleOptionChange(materialOption.name, `${firstMaterial.name} ${firstMaterial.weight}`);
      }
    }
  };

  const handleGenerate = () => {
    if (pattern === 'MEMO_PAD' && selectedOptions['사이즈'] === '직접입력') {
      const w = parseInt(customSize.width) || 0;
      const h = parseInt(customSize.height) || 0;
      if (w > 90 || h > 90) {
        alert('직접입력 사이즈는 최대 90 x 90 mm 이하만 가능합니다.');
        return;
      }
    }

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

  const renderCalculator = () => {
    const calculatorProps = {
      product,
      quantity,
      setQuantity,
      selectedOptions,
      handleOptionChange,
      unitPrice,
      totalPrice,
      discountRate,
      estimatedDeliveryDate,
      onGenerate: handleGenerate,
      customSize,
      setCustomSize,
      expandedGroup,
      setExpandedGroup,
      selectedPostcardGroup,
      handlePostcardGroupChange,
      selectedBusinessCardGroup,
      setSelectedBusinessCardGroup,
      expandedPostOption,
      setExpandedPostOption,
      pattern,
    };

    switch (pattern) {
      case 'STICKER':
        return <StickerCalculator {...calculatorProps} />;
      case 'POSTCARD':
        return <PostcardCalculator {...calculatorProps} />;
      case 'BUSINESS_CARD':
        return <BusinessCardCalculator {...calculatorProps} />;
      case 'DESIGN_CARD':
        return <DesignCardCalculator {...calculatorProps} />;
      case 'MEMO_PAD':
        return <MemoPadCalculator {...calculatorProps} />;
      case 'NOTE':
        return <NoteCalculator {...calculatorProps} subPattern={noteSubPattern} />;
      case 'DRAWING_BOOK':
        return <DrawingBookCalculator {...calculatorProps} />;
      case 'FOLDED_BUSINESS_CARD':
        return <FoldedBusinessCardCalculator {...calculatorProps} />;
      default:
        return <DefaultCalculator {...calculatorProps} />;
    }
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

      <div className="p-8">
        {renderCalculator()}
      </div>
    </div>
  );
};
