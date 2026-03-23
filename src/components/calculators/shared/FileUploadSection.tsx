import React from 'react';
import { FileUp } from 'lucide-react';

export const FileUploadSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
        <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">파일 업로드</label>
      </div>
      <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500 transition-all cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors">
          <FileUp className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-900">파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-[10px] text-zinc-400 mt-1">PDF ONLY (최대 50MB)</p>
        </div>
      </div>
    </div>
  );
};
