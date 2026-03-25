import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, ArrowRight, Clock, Package, ChevronRight, AlertCircle } from 'lucide-react';
import { getDrafts, deleteDraft, Draft } from '../services/draftService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { PRODUCTS } from '../types';

interface MyDraftsProps {
  onBack: () => void;
  onLoadDraft: (draft: Draft) => void;
}

export const MyDrafts: React.FC<MyDraftsProps> = ({ onBack, onLoadDraft }) => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDrafts();
    }
  }, [user]);

  const loadDrafts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDrafts(user.uid);
      setDrafts(data);
    } catch (error) {
      console.error('Error loading drafts:', error);
      toast.error('저장된 견적을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await deleteDraft(id);
      setDrafts(prev => prev.filter(d => d.id !== id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('삭제 실패');
    }
  };

  if (!user) {
    return (
      <div className="py-32 text-center">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-zinc-300" />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-2">로그인이 필요합니다</h3>
        <p className="text-zinc-500 mb-8">저장된 견적을 확인하려면 로그인을 해주세요.</p>
        <button 
          onClick={onBack}
          className="px-8 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-6 h-6 text-emerald-600" />
            <h1 className="text-4xl font-black tracking-tight">임시저장 견적</h1>
          </div>
          <p className="text-zinc-500 font-medium">저장해두신 제작 옵션을 확인하고 주문을 이어가세요.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-sm hover:bg-zinc-200 transition-all"
        >
          뒤로가기
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 font-bold">불러오는 중...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="py-24 text-center bg-zinc-50 rounded-[40px] border border-zinc-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package size={32} className="text-zinc-200" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 mb-2">저장된 견적이 없습니다</h3>
          <p className="text-zinc-500 mb-8">상품 상세 페이지에서 견적을 임시저장할 수 있습니다.</p>
          <button 
            onClick={onBack}
            className="px-8 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all"
          >
            상품 보러가기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {drafts.map((draft) => {
              const product = PRODUCTS.find(p => p.id === draft.productId);
              return (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white p-6 rounded-[32px] border border-zinc-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-zinc-200/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <img 
                        src={product?.image || 'https://picsum.photos/seed/draft/200/200'} 
                        alt={draft.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          {product?.category || '기타'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-zinc-200" />
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                          <Clock className="w-3 h-3" />
                          {draft.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-zinc-900 mb-2 truncate">{draft.productName}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(draft.options).slice(0, 3).map(([key, value]) => (
                          <span key={key} className="px-3 py-1 bg-zinc-50 rounded-lg text-[10px] font-bold text-zinc-500 border border-zinc-100">
                            {key}: {value}
                          </span>
                        ))}
                        {Object.keys(draft.options).length > 3 && (
                          <span className="text-[10px] font-bold text-zinc-400 flex items-center">
                            외 {Object.keys(draft.options).length - 3}개
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => onLoadDraft(draft)}
                        className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        이어하기
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDelete(draft.id!)}
                        className="p-3 bg-zinc-50 text-zinc-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-zinc-100"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
