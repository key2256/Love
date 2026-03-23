import React from 'react';
import { Product } from '../../../types';

interface NotesSectionProps {
  product: Product;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ product }) => {
  if (!product.notes || product.notes.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
      <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">제작 시 주의사항</h4>
      <ul className="space-y-2">
        {product.notes.map((note, i) => (
          <li key={i} className="text-[11px] text-amber-800/80 flex gap-2">
            <span className="shrink-0">•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
