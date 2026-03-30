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
        return (
          <svg viewBox="0 0 200 150" className="w-full h-auto border border-gray-300">
            <rect x="10" y="10" width="180" height="130" fill="#f9fafb" stroke="#374151" strokeWidth="2" />
            {(selectedOptions['접지 방식'] === '3단' || selectedOptions['접지 방식'] === '병풍') && (
              <>
                <line x1="70" y1="10" x2="70" y2="140" stroke="#9ca3af" strokeDasharray="4" />
                <line x1="130" y1="10" x2="130" y2="140" stroke="#9ca3af" strokeDasharray="4" />
              </>
            )}
            {selectedOptions['접지 방식'] === '2단' && (
              <line x1="100" y1="10" x2="100" y2="140" stroke="#9ca3af" strokeDasharray="4" />
            )}
            <text x="50%" y="50%" textAnchor="middle" className="text-xs font-mono text-gray-500">Leaflet Preview</text>
          </svg>
        );
      case '전단지':
        return (
          <svg viewBox="0 0 150 200" className="w-full h-auto border border-gray-300">
            <rect x="10" y="10" width="130" height="180" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            <text x="50%" y="50%" textAnchor="middle" className="text-xs font-mono text-gray-500">Flyer Preview</text>
          </svg>
        );
      case '캘린더':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-auto border border-gray-300">
            <rect x="20" y="20" width="160" height="120" fill="#f3f4f6" stroke="#374151" strokeWidth="2" />
            <rect x="40" y="150" width="120" height="30" fill="#d1d5db" />
            <text x="50%" y="50%" textAnchor="middle" className="text-xs font-mono text-gray-500">Calendar Preview</text>
          </svg>
        );
      case '현수막':
        return (
          <svg viewBox="0 0 300 100" className="w-full h-auto border border-gray-300">
            <rect x="10" y="20" width="280" height="60" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
            {selectedOptions['마감'] === '아일렛' && (
              <>
                <circle cx="20" cy="30" r="5" fill="white" stroke="black" />
                <circle cx="280" cy="30" r="5" fill="white" stroke="black" />
              </>
            )}
            <text x="50%" y="50%" textAnchor="middle" className="text-xs font-mono text-gray-500">Banner Preview</text>
          </svg>
        );
      case '티켓':
        return (
          <svg viewBox="0 0 200 80" className="w-full h-auto border border-gray-300">
            <rect x="10" y="10" width="180" height="60" rx="5" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            {selectedOptions['후가공']?.includes('미싱') && (
              <line x1="50" y1="10" x2="50" y2="70" stroke="#9ca3af" strokeDasharray="2" />
            )}
            <text x="50%" y="50%" textAnchor="middle" className="text-xs font-mono text-gray-500">Ticket Preview</text>
          </svg>
        );
      default:
        return <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500">Preview Unavailable</div>;
    }
  };

  return <div className="mt-4">{renderPreview()}</div>;
};
