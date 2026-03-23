import React from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { Product } from '../../../types';

interface SummarySectionProps {
  product: Product;
  selectedOptions: Record<string, any>;
  pattern: string;
  customSize: { width: string; height: string };
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  product,
  selectedOptions,
  pattern,
  customSize,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice
}) => {
  return (
    <div className="pt-8 border-t border-zinc-100">
      <div className="bg-zinc-50 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 font-medium">선택 옵션 요약</span>
          <div className="flex flex-wrap justify-end gap-2">
            {Object.entries(selectedOptions)
              .filter(([key, val]) => {
                // 1. Basic filtering (empty or 'none')
                if (!val || val === '없음' || String(val).trim() === '') return false;

                // 2. Check if option is visible for this product
                const option = product.options.find(opt => opt.name === key);
                if (pattern === 'DESIGN_CARD' && key === '템플릿 카테고리') return false;
                if (option?.visibleIf) {
                  const parentVal = selectedOptions[option.visibleIf.optionName];
                  if (parentVal !== option.visibleIf.value) return false;
                }

                // 3. Parent-Child dependency filtering
                const dependencies: Record<string, string> = {
                  '코팅 면수': '코팅',
                  '귀돌이 크기': '귀돌이',
                  '귀돌이 면수': '귀돌이',
                  '귀돌이 방향': '귀돌이',
                  '타공 크기': '타공',
                  '타공 설명': '타공',
                  '오시 줄 수': '오시',
                  '오시 설명': '오시',
                  '미싱 줄 수': '미싱',
                  '미싱 설명': '미싱',
                  '접지 방향': '접지',
                  '접지 형태': '접지',
                  '폴리백 사이즈': '폴리백 개별포장',
                };

                const parentKey = dependencies[key];
                if (parentKey) {
                  const parentVal = selectedOptions[parentKey];
                  if (!parentVal || parentVal === '없음') return false;
                  
                  // Special case for 귀돌이 방향
                  if (key === '귀돌이 방향' && selectedOptions['귀돌이 면수'] !== '1면') return false;
                }

                return true;
              })
              .map(([key, val]) => {
                let displayVal = val;
                if (pattern === 'MEMO_PAD' && key === '사이즈' && val === '직접입력') {
                  displayVal = `직접입력 (${customSize.width || 0}x${customSize.height || 0}mm)`;
                }
                return (
                  <span key={key} className="px-2 py-1 bg-white rounded-md text-[10px] font-bold text-zinc-400 border border-zinc-100">
                    {displayVal}
                  </span>
                );
              })}
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
  );
};
