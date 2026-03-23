import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export interface PostOptionItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
  hidden?: boolean;
}

interface PostProcessingSkeletonProps {
  options: PostOptionItem[];
  expandedOptionId: string | null;
  onOptionClick: (id: string) => void;
  onCloseDetail: () => void;
  children?: React.ReactNode; // This will be the detail panel content
  title?: string;
  subtitle?: string;
}

export const PostProcessingSkeleton: React.FC<PostProcessingSkeletonProps> = ({
  options,
  expandedOptionId,
  onOptionClick,
  onCloseDetail,
  children,
  title = "후가공 선택",
  subtitle = "아이콘을 클릭하여 상세 옵션 선택"
}) => {
  return (
    <div className="space-y-6 pt-4 border-t border-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            {title}
          </label>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {subtitle}
        </span>
      </div>

      <div className="bg-zinc-50/50 rounded-[32px] p-6 border border-zinc-100 space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {options.map(item => {
            const isExpanded = expandedOptionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onOptionClick(item.id)}
                className={`flex flex-col items-center gap-2 group transition-all ${
                  isExpanded ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  isExpanded 
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                    : item.active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-white text-zinc-400 border border-zinc-100 group-hover:border-zinc-300'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                  isExpanded ? 'text-emerald-600' : item.active ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {expandedOptionId && (
            <motion.div
              key={expandedOptionId}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                    {options.find(o => o.id === expandedOptionId)?.name} 상세 설정
                  </h4>
                  <button 
                    onClick={onCloseDetail} 
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600"
                  >
                    닫기
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
