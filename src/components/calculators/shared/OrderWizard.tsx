import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, LucideIcon, Check } from 'lucide-react';

interface OrderWizardProps {
  sections: {
    id: string;
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    badge?: string;
  }[];
  onComplete?: () => void;
}

export const OrderWizard: React.FC<OrderWizardProps> = ({ 
  sections,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / sections.length) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
              Step {currentStep + 1} of {sections.length}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-emerald-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
          />
        </div>
      </div>

      {/* Step Navigation Icons */}
      <div className="flex justify-between items-center px-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={section.id}>
              <div className="flex flex-col items-center gap-2 relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                      : isCompleted 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter absolute -bottom-6 whitespace-nowrap ${
                  isActive ? 'text-emerald-600' : 'text-zinc-400'
                }`}>
                  {section.title}
                </span>
              </div>
              {index < sections.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${index < currentStep ? 'bg-emerald-200' : 'bg-zinc-100'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="mt-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={sections[currentStep].id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                {React.createElement(sections[currentStep].icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900">{sections[currentStep].title}</h3>
                {sections[currentStep].badge && (
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    {sections[currentStep].badge}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-8">
              {sections[currentStep].children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            currentStep === 0 
              ? 'text-zinc-300 cursor-not-allowed' 
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          이전 단계
        </button>
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          {currentStep === sections.length - 1 ? '최종 확인' : '다음 단계'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
