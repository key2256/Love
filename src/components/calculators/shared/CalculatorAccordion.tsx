import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface CalculatorAccordionProps {
  sections: {
    id: string;
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
    badge?: string;
  }[];
  defaultExpanded?: string;
}

export const CalculatorAccordion: React.FC<CalculatorAccordionProps> = ({ 
  sections,
  defaultExpanded 
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpanded || sections[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      // Small delay to allow the animation to start and layout to shift
      requestAnimationFrame(() => {
        const navbarHeight = 80; // Approximate height of fixed navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
  };

  const handleToggle = (id: string) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    
    if (isExpanding) {
      scrollToSection(id);
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isExpanded = expandedId === section.id;
        const Icon = section.icon;

        return (
          <div 
            key={section.id} 
            ref={el => { sectionRefs.current[section.id] = el; }}
            className={`border rounded-3xl transition-all duration-300 ${
              isExpanded 
                ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-500/5' 
                : 'border-zinc-100 bg-white hover:border-zinc-200'
            }`}
          >
            <button
              onClick={() => handleToggle(section.id)}
              className="w-full px-6 py-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isExpanded ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-50 text-zinc-400 border border-zinc-100 group-hover:border-zinc-200'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className={`text-lg font-black tracking-tight transition-colors ${
                    isExpanded ? 'text-zinc-900' : 'text-zinc-900'
                  }`}>
                    {section.title}
                  </h4>
                  {section.description && (
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">
                      {section.description}
                    </p>
                  )}
                  {section.badge && (
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 block">
                      {section.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isExpanded ? 'bg-emerald-50 text-emerald-500 rotate-180' : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
              }`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="space-y-8 pt-6 border-t border-zinc-100">
                      {section.children}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
