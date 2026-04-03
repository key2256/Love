import React, { useState } from 'react';
import { LucideIcon, Info, Share2, Check, Copy, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 3. Visual Tooltips
interface TermTooltipProps {
  term: string;
  description: string;
  imageUrl?: string;
  children: React.ReactNode;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ term, description, imageUrl, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      {children}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        className="ml-1.5 p-0.5 text-zinc-400 hover:text-emerald-500 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-zinc-900 text-white rounded-2xl shadow-2xl z-50 pointer-events-none"
          >
            <div className="text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">{term} 가이드</div>
            <p className="text-[13px] leading-relaxed text-zinc-300">{description}</p>
            {imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                <img src={imageUrl} alt={term} className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 5. Shareable Quote Link
export const ShareQuoteButton: React.FC<{ options: Record<string, string>; quantity: number; productId: string }> = ({
  options,
  quantity,
  productId
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('productId', productId);
    params.set('quantity', quantity.toString());
    Object.entries(options).forEach(([key, value]) => {
      params.set(`opt_${key}`, value);
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all font-medium text-sm"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      {copied ? '링크 복사됨' : '견적 공유'}
    </button>
  );
};

// 4. Stepper UI Components
interface Step {
  id?: string;
  title: string;
  icon?: LucideIcon;
}

export const Stepper: React.FC<{ steps: Step[]; currentStep: number; onStepClick: (index: number) => void }> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  const stepperRef = React.useRef<HTMLDivElement>(null);

  const handleStepClick = (index: number) => {
    onStepClick(index);
    
    // Smooth scroll to the top of the stepper area
    if (stepperRef.current) {
      requestAnimationFrame(() => {
        const navbarHeight = 80;
        const elementPosition = stepperRef.current!.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
  };

  return (
    <div ref={stepperRef} className="flex items-center justify-between mb-8 bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
      {steps.map((step, index) => (
        <button
          key={step.id || index}
          onClick={() => handleStepClick(index)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
            currentStep === index
              ? 'bg-white text-zinc-900 shadow-sm font-bold border border-zinc-200'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          {step.icon ? (
            <step.icon className={`w-4 h-4 ${currentStep === index ? 'text-zinc-900' : 'text-zinc-400'}`} />
          ) : (
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === index ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
            }`}>
              {index + 1}
            </span>
          )}
          <span className="hidden sm:inline text-sm">{step.title}</span>
        </button>
      ))}
    </div>
  );
};

export const StepNavigation: React.FC<{ 
  onNext?: () => void; 
  onPrev?: () => void; 
  isFirst?: boolean; 
  isLast?: boolean;
  nextLabel?: string;
}> = ({ onNext, onPrev, isFirst = false, isLast = false, nextLabel = "다음 단계" }) => {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-100">
      {!isFirst ? (
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-zinc-600 hover:text-zinc-900 font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          이전
        </button>
      ) : (
        <div />
      )}
      
      {!isLast && (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          {nextLabel}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
