import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Clock, CheckCircle2, ShoppingCart, FileText } from 'lucide-react';
import { Product, Quotation } from '../types';

interface QuotationCalculatorProps {
  product: Product;
  onGenerateQuotation: (quotation: Quotation) => void;
}

export const QuotationCalculator: React.FC<QuotationCalculatorProps> = ({ product, onGenerateQuotation }) => {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      initial[opt.name] = opt.values[0].label;
    });
    return initial;
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customSize, setCustomSize] = useState({ width: '', height: '' });

  useEffect(() => {
    let pricePerUnit = product.basePrice;
    
    product.options.forEach(opt => {
      const selectedValue = opt.values.find(v => v.label === selectedOptions[opt.name]);
      if (selectedValue?.priceModifier) {
        pricePerUnit += selectedValue.priceModifier;
      }
    });

    setUnitPrice(pricePerUnit);
    setTotalPrice(pricePerUnit * quantity);
  }, [product, quantity, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    const quotation: Quotation = {
      id: `Q-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      options: {
        ...selectedOptions,
        ...(selectedOptions['사이즈'] === '직접입력' ? { '사이즈 상세': `${customSize.width}x${customSize.height}mm` } : {})
      },
      quantity,
      unitPrice,
      totalPrice,
      leadTime: product.leadTime,
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
        {product.options.map((option) => (
          <div key={option.name} className="space-y-4">
            <label className="text-xs font-black text-zinc-900 uppercase tracking-widest block">
              {option.name}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {option.values.map((val) => (
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
            {option.name === '사이즈' && selectedOptions['사이즈'] === '직접입력' && (
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
              <span className="text-xs font-bold text-zinc-900">{unitPrice.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">예상 제작기간</span>
              </div>
              <span className="text-xs font-bold text-zinc-900">{product.leadTime}</span>
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
