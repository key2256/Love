import React from 'react';
import { AlertCircle } from 'lucide-react';

export const WorkPrecautions: React.FC = () => (
  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 space-y-4">
    <div className="flex items-center gap-2 text-amber-600">
      <AlertCircle className="w-4 h-4" />
      <span className="text-xs font-black uppercase tracking-tight">접지 명함 작업 시 주의사항</span>
    </div>
    <ul className="space-y-2">
      {[
        '작업 사이즈는 펼쳤을 때의 전체 사이즈로 작업해 주세요.',
        '오시(접는 선) 위치를 가이드 라인으로 정확히 표시해 주세요.',
        '중요한 텍스트나 로고는 접히는 선에서 최소 3mm 이상 떨어뜨려 주세요.',
        '배경색이 있는 경우 재단선 밖으로 2mm 정도 여분을 주어야 합니다.'
      ].map((text, i) => (
        <li key={i} className="text-[11px] text-amber-800/70 flex gap-2">
          <span className="shrink-0">•</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  </div>
);
