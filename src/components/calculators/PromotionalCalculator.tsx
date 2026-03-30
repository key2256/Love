import React, { useState } from 'react';
import { BookOpen, FileText, Calendar, Flag, Ticket } from 'lucide-react';
import { Product } from '../../types';

interface PromotionalCalculatorProps {
  product: Product;
}

const PromotionalCalculator: React.FC<PromotionalCalculatorProps> = ({ product }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const getIcon = () => {
    switch (product.id) {
      case 'leaflet': return <BookOpen className="w-12 h-12 text-blue-500" />;
      case 'flyer': return <FileText className="w-12 h-12 text-green-500" />;
      case 'calendar': return <Calendar className="w-12 h-12 text-red-500" />;
      case 'banner': return <Flag className="w-12 h-12 text-purple-500" />;
      case 'ticket': return <Ticket className="w-12 h-12 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
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
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                >
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
                        value={v.label}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                      />
                      {v.label}
                    </label>
                  ))}
                </div>
              )}
              {option.type === 'checkbox' && (
                <div className="flex gap-4">
                  {option.values?.map(v => (
                    <label key={v.label} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={v.label}
                        onChange={(e) => handleOptionChange(option.name, e.target.checked ? v.label : '')}
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
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">미리보기 및 정보</h3>
          <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
            {product.name} 미리보기
          </div>
          <div className="space-y-2">
            <p><strong>특징:</strong> {product.features.join(', ')}</p>
            <p><strong>제작 기간:</strong> {product.leadTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalCalculator;
