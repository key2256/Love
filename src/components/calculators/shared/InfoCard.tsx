import React from 'react';

interface InfoCardProps {
  title?: string;
  content: string | string[];
  type?: 'info' | 'warning';
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content, type = 'info' }) => {
  const isWarning = type === 'warning';
  const bgColor = isWarning ? 'bg-amber-50' : 'bg-zinc-50';
  const borderColor = isWarning ? 'border-amber-100' : 'border-zinc-100';
  const textColor = isWarning ? 'text-amber-800' : 'text-zinc-600';
  const titleColor = isWarning ? 'text-amber-600' : 'text-zinc-400';

  return (
    <div className={`p-6 rounded-2xl ${bgColor} border ${borderColor}`}>
      {title && (
        <h4 className={`text-[10px] font-black ${titleColor} uppercase tracking-widest mb-3`}>
          {title}
        </h4>
      )}
      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className={`text-[13px] ${textColor} flex gap-2`}>
              <span className="shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-[13px] ${textColor}`}>{content}</p>
      )}
    </div>
  );
};
