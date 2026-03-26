import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TermTooltip } from '../../UXComponents';

interface OptionGroupProps {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  tooltip?: {
    description: string;
    imageUrl?: string;
  };
}

export const OptionGroup: React.FC<OptionGroupProps> = ({ 
  label, 
  icon: Icon, 
  children, 
  className = "",
  badge,
  tooltip
}) => {
  const labelContent = (
    <label className="text-xs font-black text-zinc-900 uppercase tracking-widest">
      {label}
    </label>
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-500 rounded-full" />
          {Icon && <Icon className="w-4 h-4 text-zinc-400" />}
          {tooltip ? (
            <TermTooltip term={label} description={tooltip.description} imageUrl={tooltip.imageUrl}>
              {labelContent}
            </TermTooltip>
          ) : (
            labelContent
          )}
        </div>
        {badge && (
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="pl-3">
        {children}
      </div>
    </div>
  );
};
