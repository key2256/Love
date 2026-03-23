import { useState, useEffect, useCallback } from 'react';
import { Product, Quotation } from '../types';

export const useQuotationLogic = (product: Product, onGenerateQuotation: (quotation: Quotation) => void) => {
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

  const handleOptionChange = useCallback((name: string, value: string) => {
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
  }, [product.options]);

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

  const generateQuotation = useCallback((customSize?: { width: string; height: string }) => {
    const quotation: Quotation = {
      id: `Q-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      options: {
        ...selectedOptions,
        ...(customSize && (selectedOptions['사이즈'] === '직접입력' || selectedOptions['규격(mm)'] === '직접입력' || selectedOptions['작업 사이즈'] === '직접입력') 
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
  }, [product, selectedOptions, quantity, unitPrice, totalPrice, estimatedDeliveryDate, onGenerateQuotation]);

  return {
    quantity,
    setQuantity,
    selectedOptions,
    setSelectedOptions,
    handleOptionChange,
    unitPrice,
    totalPrice,
    discountRate,
    estimatedDeliveryDate,
    generateQuotation
  };
};
