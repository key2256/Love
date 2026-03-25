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
    <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
      {label}
    </label>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
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
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};
