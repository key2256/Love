import React, { useState } from 'react';
import { Product } from '../../types';
import { PromoProductPreview } from './PromoProductPreview';
import { PromoProductIcon } from '../ui/PromoProductIcon';

interface PromotionalCalculatorProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: any) => void;
  unitPrice: number;
  totalPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  onGenerate: () => void;
  onAddToCart: () => void;
  onSaveDraft: () => void;
}

export const PromotionalCalculator: React.FC<PromotionalCalculatorProps> = ({ 
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
  const getIcon = () => {
    return <PromoProductIcon subCategory={product.subCategory} className="w-12 h-12 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        {getIcon()}
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {product.options.map(option => (
            <div key={option.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{option.name}</label>
              {option.type === 'select' && (
                <select
                  className="w-full p-2 border rounded"
                  value={selectedOptions[option.name] || ''}
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {option.values?.map(v => (
                    <option key={v.label} value={v.label}>{v.label}</option>
                  ))}
                </select>
              )}
              {option.type === 'radio' && (
                <div className="flex gap-4">
                  {option.values?.map(v => (
                    <label key={v.label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={option.name}
                        checked={selectedOptions[option.name] === v.label}
                        value={v.label}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                      />
                      {v.label}
                    </label>
                  ))}
                </div>
              )}
              {option.type === 'checkbox' && (
                <div className="flex flex-wrap gap-4">
                  {option.values?.map(v => (
                    <label key={v.label} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(selectedOptions[option.name] || []).includes(v.label)}
                        onChange={(e) => {
                          const current = selectedOptions[option.name] || [];
                          const next = e.target.checked 
                            ? [...current, v.label] 
                            : current.filter((i: string) => i !== v.label);
                          handleOptionChange(option.name, next);
                        }}
                      />
                      {v.label}
                    </label>
                  ))}
                </div>
              )}
              {option.type === 'text' && (
                <input
                  type="text"
                  placeholder={option.placeholder}
                  className="w-full p-2 border rounded"
                  value={selectedOptions[option.name] || ''}
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">미리보기 및 정보</h3>
          <PromoProductPreview product={product} selectedOptions={selectedOptions} />
          <div className="space-y-2 mt-6">
            <p><strong>단가:</strong> {unitPrice.toLocaleString()}원</p>
            <p><strong>총 금액:</strong> {totalPrice.toLocaleString()}원</p>
            <p><strong>특징:</strong> {product.features.join(', ')}</p>
            <p><strong>제작 기간:</strong> {product.leadTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalCalculator;
