import React from 'react';
import { BookOpen, FileText, Calendar, Flag, Ticket, LucideIcon } from 'lucide-react';

export const PromoProductIcon: React.FC<{ subCategory: string; className?: string }> = ({ subCategory, className = "w-6 h-6" }) => {
  const iconMap: Record<string, LucideIcon> = {
    '리플렛': BookOpen,
    '전단지': FileText,
    '캘린더': Calendar,
    '현수막': Flag,
    '티켓': Ticket,
  };

  const Icon = iconMap[subCategory] || FileText;
  return <Icon className={className} />;
};
