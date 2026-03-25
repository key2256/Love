import React from 'react';
import { 
  Calculator,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { Product, Quotation, CartItem } from '../types';
import { ShareQuoteButton } from './UXComponents';
import { motion, AnimatePresence } from 'motion/react';
import { StickerCalculator } from './calculators/StickerCalculator';
import { PostcardCalculator } from './calculators/PostcardCalculator';
import { BusinessCardCalculator } from './calculators/BusinessCardCalculator';
import { DesignCardCalculator } from './calculators/DesignCardCalculator';
import { DesignTemplateCardCalculator } from './calculators/DesignTemplateCardCalculator';
import { MemoPadCalculator } from './calculators/MemoPadCalculator';
import { NoteCalculator } from './calculators/NoteCalculator';
import { PosterCalculator } from './calculators/PosterCalculator';
import { DrawingBookCalculator } from './calculators/DrawingBookCalculator';
import { FoldedBusinessCardCalculator } from './calculators/FoldedBusinessCardCalculator';
import { SaddleBindingCalculator } from './calculators/SaddleBindingCalculator';
import { PerfectBindingCalculator } from './calculators/PerfectBindingCalculator';
import { SpringBindingCalculator } from './calculators/SpringBindingCalculator';
import { TwinRingBindingCalculator } from './calculators/TwinRingBindingCalculator';
import { SewnBindingCalculator } from './calculators/SewnBindingCalculator';
import { BudgetBindingCalculator } from './calculators/BudgetBindingCalculator';
import { DefaultCalculator } from './calculators/DefaultCalculator';

import { useQuotationLogic } from '../hooks/useQuotationLogic';

interface QuotationCalculatorProps {
  product: Product;
  onGenerateQuotation: (quotation: Quotation) => void;
  onAddToCart: (item: CartItem) => void;
  onSaveDraft?: (options: Record<string, string>, quantity: number) => void;
  initialOptions?: Record<string, string>;
  initialQuantity?: number;
}

export const QuotationCalculator: React.FC<QuotationCalculatorProps> = ({ 
  product, 
  onGenerateQuotation, 
  onAddToCart,
  onSaveDraft,
  initialOptions,
  initialQuantity
}) => {
  const {
    quantity,
    setQuantity,
    selectedOptions,
    handleOptionChange,
    unitPrice,
    totalPrice,
    discountRate,
    estimatedDeliveryDate,
    generateQuotation
  } = useQuotationLogic(product, onGenerateQuotation, initialOptions, initialQuantity);

  const handleAddToCart = () => {
    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      product,
      options: selectedOptions,
      quantity,
      unitPrice,
      totalPrice
    });
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(selectedOptions, quantity);
    }
  };

  const getLayoutPattern = (product: Product) => {
    if (product.category === 'sticker') return 'STICKER';
    if (product.category === 'card-paper' && product.subCategory.includes('엽서')) return 'POSTCARD';
    if (product.id === 'bc-template') return 'DESIGN_TEMPLATE_CARD';
    if (product.id === 'bc-standard' || product.id === 'bc-premium') return 'BUSINESS_CARD';
    if (product.id === 'bc-folded') return 'FOLDED_BUSINESS_CARD';
    if (product.id === 'binding-saddle') return 'SADDLE_BINDING';
    if (product.id === 'binding-wireless') return 'PERFECT_BINDING';
    if (product.id === 'binding-spring') return 'SPRING_BINDING';
    if (product.id === 'binding-twinring') return 'TWINRING_BINDING';
    if (product.id === 'binding-sewn') return 'SEWN_BINDING';
    if (product.id === 'binding-wireless-budget' || product.id === 'binding-spring-budget' || product.id === 'binding-twinring-budget') return 'BUDGET_BINDING';
    if (product.id === 'memo-standard') return 'MEMO_PAD';
    if (product.id === 'note-spring' || product.id === 'note-leather' || product.id === 'note-saddle') return 'NOTE';
    if (product.id === 'poster-standard') return 'POSTER';
    if (product.id === 'drawing-pro' || product.id === 'drawing-student') return 'DRAWING_BOOK';
    if (product.category === 'card-paper') return 'PAPER_GOODS';
    if (product.category === 'binding-booklet' || product.id === 'note-spring') return 'BINDING_GOODS';
    if (product.category === 'poster-promo') return 'LARGE_FORMAT';
    if (product.category === 'package-supply') return 'PACKAGE';
    return 'DEFAULT';
  };

  const pattern = getLayoutPattern(product);

  const [showStickyBar, setShowStickyBar] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setShowStickyBar(offset > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNoteSubPattern = (product: Product) => {
    if (product.id === 'note-spring') return 'NOTE_SPIRAL';
    if (product.id === 'note-leather') return 'NOTE_LEATHER';
    if (product.id === 'note-saddle') return 'NOTE_SADDLE';
    return 'NOTE_SPIRAL';
  };

  const noteSubPattern = pattern === 'NOTE' ? getNoteSubPattern(product) : null;

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
      onGenerate: generateQuotation,
      onAddToCart: handleAddToCart,
      onSaveDraft: handleSaveDraft,
    };

    switch (pattern) {
      case 'STICKER':
        return <StickerCalculator {...calculatorProps} />;
      case 'POSTCARD':
        return <PostcardCalculator {...calculatorProps} />;
      case 'BUSINESS_CARD':
        return <BusinessCardCalculator {...calculatorProps} />;
      case 'DESIGN_TEMPLATE_CARD':
        return <DesignTemplateCardCalculator {...calculatorProps} />;
      case 'MEMO_PAD':
        return <MemoPadCalculator {...calculatorProps} />;
      case 'NOTE':
        return <NoteCalculator {...calculatorProps} subPattern={noteSubPattern} />;
      case 'POSTER':
        return <PosterCalculator {...calculatorProps} pattern={pattern} />;
      case 'DRAWING_BOOK':
        return <DrawingBookCalculator {...calculatorProps} />;
      case 'FOLDED_BUSINESS_CARD':
        return <FoldedBusinessCardCalculator {...calculatorProps} />;
      case 'SADDLE_BINDING':
        return <SaddleBindingCalculator {...calculatorProps} pattern={pattern} />;
      case 'PERFECT_BINDING':
        return <PerfectBindingCalculator {...calculatorProps} pattern={pattern} />;
      case 'SPRING_BINDING':
        return <SpringBindingCalculator {...calculatorProps} pattern={pattern} />;
      case 'TWINRING_BINDING':
        return <TwinRingBindingCalculator {...calculatorProps} pattern={pattern} />;
      case 'SEWN_BINDING':
        return <SewnBindingCalculator {...calculatorProps} pattern={pattern} />;
      case 'BUDGET_BINDING':
        return <BudgetBindingCalculator {...calculatorProps} description={product.description} pattern={pattern} />;
      default:
        return <DefaultCalculator {...calculatorProps} pattern={pattern} />;
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden mb-20">
        <div className="p-8 bg-zinc-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-black tracking-tight">실시간 견적 계산기</h3>
            </div>
            <p className="text-zinc-400 text-sm">원하는 옵션을 선택하면 즉시 예상 금액을 확인하실 수 있습니다.</p>
          </div>
          <ShareQuoteButton options={selectedOptions} quantity={quantity} productId={product.id} />
        </div>

        <div className="p-8">
          {renderCalculator()}
        </div>
      </div>

      {/* 1. Sticky Price Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-zinc-900/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl z-50 border border-white/10 flex items-center justify-between px-8"
          >
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">최종 견적 금액</div>
                <div className="text-2xl font-black text-emerald-400">
                  {totalPrice.toLocaleString()}
                  <span className="text-sm font-normal text-white ml-1">원</span>
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-white/10" />
              <div className="hidden md:block">
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">수량 / 단가</div>
                <div className="text-sm font-medium">
                  {quantity.toLocaleString()}매 / {unitPrice.toLocaleString()}원
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                장바구니
              </button>
              <button 
                onClick={() => generateQuotation()}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20"
              >
                <FileText className="w-4 h-4" />
                견적서 발행
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
