import React from 'react';
import { Product } from '../../types';

interface PromoProductPreviewProps {
  product: Product;
  selectedOptions: Record<string, any>;
}

export const PromoProductPreview: React.FC<PromoProductPreviewProps> = ({ product, selectedOptions }) => {
  const renderPreview = () => {
    switch (product.subCategory) {
      case '리플렛':
        const fold = selectedOptions['접지 방식'];
        return (
          <svg viewBox="0 0 200 150" className="w-full h-auto border border-gray-300 bg-white">
            <rect x="10" y="10" width="180" height="130" fill="#f9fafb" stroke="#374151" strokeWidth="2" />
            {fold === '3단' && (
              <>
                <line x1="70" y1="10" x2="70" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                <line x1="130" y1="10" x2="130" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
              </>
            )}
            {fold === '2단' && (
              <line x1="100" y1="10" x2="100" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
            )}
            {fold === '대문' && (
              <>
                <line x1="50" y1="10" x2="50" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                <line x1="150" y1="10" x2="150" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
              </>
            )}
            <text x="50%" y="90%" textAnchor="middle" className="text-[10px] fill-gray-500">{fold || '접지 선택'}</text>
          </svg>
        );
      case '전단지':
        const size = selectedOptions['사이즈'];
        const scale = size === 'A5' ? 0.7 : size === 'A3' ? 1.3 : 1;
        return (
          <svg viewBox="0 0 150 200" className="w-full h-auto border border-gray-300 bg-white">
            <rect x={10 + (130 * (1 - scale) / 2)} y={10 + (180 * (1 - scale) / 2)} width={130 * scale} height={180 * scale} fill="#ffffff" stroke="#374151" strokeWidth="2" />
            <text x="50%" y="90%" textAnchor="middle" className="text-[10px] fill-gray-500">{size || '사이즈 선택'}</text>
          </svg>
        );
      case '캘린더':
        const type = selectedOptions['형태'];
        const binding = selectedOptions['제본 방식'] || '트윈링';
        return (
          <svg viewBox="0 0 210 150" className="w-full h-auto border border-gray-300 bg-white">
            {/* 탁상형 본체 */}
            {type === '탁상' && (
              <>
                <rect x="20" y="30" width="170" height="100" fill="#f3f4f6" stroke="#374151" strokeWidth="1" />
                {/* 트윈링 */}
                {binding === '트윈링' && (
                  <g stroke="#9ca3af" strokeWidth="2">
                    {[...Array(10)].map((_, i) => (
                      <line key={i} x1={30 + i * 15} y1="25" x2={30 + i * 15} y2="35" />
                    ))}
                  </g>
                )}
                {/* 삼각대 */}
                <path d="M20 130 L190 130 L105 150 Z" fill="#e5e7eb" stroke="#374151" strokeWidth="1" />
              </>
            )}
            {type === '벽걸이' && <rect x="50" y="20" width="100" height="140" fill="#f3f4f6" stroke="#374151" strokeWidth="2" />}
            {type === '포스터형' && <rect x="30" y="20" width="140" height="160" fill="#f3f4f6" stroke="#374151" strokeWidth="2" />}
            <text x="50%" y="90%" textAnchor="middle" className="text-[10px] fill-gray-500">{type || '형태 선택'} | {binding}</text>
          </svg>
        );
      case '현수막':
        const finish = selectedOptions['마감'];
        return (
          <svg viewBox="0 0 300 100" className="w-full h-auto border border-gray-300 bg-white">
            <rect x="10" y="20" width="280" height="60" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
            {finish === '아일렛' && (
              <>
                <circle cx="20" cy="30" r="5" fill="white" stroke="black" />
                <circle cx="280" cy="30" r="5" fill="white" stroke="black" />
              </>
            )}
            {finish === '줄미싱' && <line x1="10" y1="20" x2="290" y2="20" stroke="black" strokeWidth="2" strokeDasharray="4" />}
            <text x="50%" y="90%" textAnchor="middle" className="text-[10px] fill-gray-500">{finish || '마감 선택'}</text>
          </svg>
        );
      case '티켓':
        const rawFinishing = selectedOptions['후가공'];
        const finishing = Array.isArray(rawFinishing) ? rawFinishing : (rawFinishing ? [rawFinishing] : []);
        return (
          <svg viewBox="0 0 200 80" className="w-full h-auto border border-gray-300 bg-white">
            <rect x="10" y="10" width="180" height="60" rx="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            {finishing.includes('미싱') && <line x1="50" y1="10" x2="50" y2="70" stroke="#374151" strokeWidth="1" strokeDasharray="2" />}
            {finishing.includes('타공') && <circle cx="170" cy="40" r="5" fill="white" stroke="black" />}
            <text x="50%" y="90%" textAnchor="middle" className="text-[10px] fill-gray-500">{finishing.length > 0 ? finishing.join(', ') : '후가공 선택'}</text>
          </svg>
        );
      default:
        return <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500">미리보기 준비중</div>;
    }
  };

  return (
    <div className="mt-4 border p-4 rounded-lg bg-white shadow-inner">
      <h4 className="text-sm font-bold mb-2 text-gray-700">실시간 미리보기</h4>
      {renderPreview()}
    </div>
  );
};
